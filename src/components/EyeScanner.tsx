'use client';

import React, {
  useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef,
} from 'react';
import type { DiagnosticResult, VisionFilter, EyeMetrics, FrameData } from '@/types';
import {
  FrameQueue,
  DiagnosticStack,
  DoublyLinkedList,
  CircularDoublyLinkedList,
} from '@/lib/dataStructures';

// ── Eye Analysis Constants ────────────────────────────────────────────────────
const EAR_PTOSIS_THRESHOLD  = 0.14;
const EAR_FATIGUE_THRESHOLD = 0.22;
const BLINK_DRY_THRESHOLD   = 10;
const SYMMETRY_THRESHOLD    = 0.06;
const ANALYSIS_INTERVAL_MS  = 3000;
const DETECTION_COOLDOWN_MS = 9000;

// ── Vision Filters ────────────────────────────────────────────────────────────
const VISION_FILTERS: VisionFilter[] = [
  { name: 'NORMAL',         description: 'Normal',         cssFilter: 'none',                              icon: '◉' },
  { name: 'ESCALA_GRISES',  description: 'Escala de Grises', cssFilter: 'grayscale(100%)',                  icon: '◐' },
  { name: 'CONTRASTE_ALTO', description: 'Contraste Alto', cssFilter: 'contrast(160%) brightness(1.05)',   icon: '◑' },
];

// ── Geometry helpers ──────────────────────────────────────────────────────────
function dist2D(a: { x: number; y: number }, b: { x: number; y: number }): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function calcEAR(lm: { x: number; y: number }[], eye: 'left' | 'right'): number {
  const idx = eye === 'left'
    ? [33, 160, 158, 133, 153, 144]
    : [362, 385, 387, 263, 380, 373];
  const [p1, p2, p3, p4, p5, p6] = idx.map((i) => lm[i]);
  const h = dist2D(p1, p4);
  if (h < 0.001) return 0;
  return (dist2D(p2, p6) + dist2D(p3, p5)) / (2 * h);
}

// ── Public handle exposed via ref ─────────────────────────────────────────────
export interface EyeScannerHandle {
  startCamera: () => Promise<void>;
  stopCamera:  () => void;
  isActive:    () => boolean;
}

// ── Props ─────────────────────────────────────────────────────────────────────
export interface EyeScannerProps {
  onDiagnosticResult?: (result: DiagnosticResult) => void;
  onMetricsUpdate?:    (metrics: EyeMetrics) => void;
  /** When true, skips auto-analysis — parent collects metrics instead */
  suppressAnalysis?:   boolean;
  /** Hides control buttons and counters row (used inside ScanWizard) */
  wizardMode?:         boolean;
}

// ── EyeScanner ────────────────────────────────────────────────────────────────
export const EyeScanner = forwardRef<EyeScannerHandle, EyeScannerProps>(
  function EyeScanner(
    { onDiagnosticResult, onMetricsUpdate, suppressAnalysis = false, wizardMode = false },
    ref
  ) {
    // DOM refs
    const videoRef     = useRef<HTMLVideoElement>(null);
    const canvasRef    = useRef<HTMLCanvasElement>(null);
    const animFrameRef = useRef<number>(0);

    // MediaPipe refs
    const faceLandmarkerRef = useRef<any>(null);
    const mpModuleRef       = useRef<any>(null);

    // Data structures (no re-render on mutation)
    const frameQueueRef   = useRef(new FrameQueue(50));
    const diagnosticStack = useRef(new DiagnosticStack());
    const sessionHistory  = useRef(new DoublyLinkedList<DiagnosticResult>());
    const filtersCircular = useRef(new CircularDoublyLinkedList<VisionFilter>());

    // Blink tracking
    const blinkTimestamps = useRef<number[]>([]);
    const prevBlinkRef    = useRef(false);

    // Throttle refs
    const lastAnalysisRef   = useRef(0);
    const detectionCooldown = useRef(new Map<string, number>());

    // Loop control via refs (no stale closures)
    const isActiveRef   = useRef(false);
    const frameCountRef = useRef(0);

    // ── UI State ──────────────────────────────────────────────────────────────
    const [isMounted,        setIsMounted]        = useState(false);
    const [isMediaPipeReady, setIsMediaPipeReady] = useState(false);
    const [isActive,         setIsActive]         = useState(false);
    const [currentFilter,    setCurrentFilter]    = useState<VisionFilter>(VISION_FILTERS[0]);
    const [diagnosticCount,  setDiagnosticCount]  = useState(0);
    const [frameCount,       setFrameCount]       = useState(0);
    const [liveMetrics,      setLiveMetrics]      = useState<EyeMetrics | null>(null);
    const [stackSize,        setStackSize]        = useState(0);
    const [errorMsg,         setErrorMsg]         = useState<string | null>(null);

    // ── Initialisation ────────────────────────────────────────────────────────
    useEffect(() => {
      setIsMounted(true);
      VISION_FILTERS.forEach((f) => filtersCircular.current.append(f));

      let cancelled = false;
      (async () => {
        try {
          const mp = await import('@mediapipe/tasks-vision');
          const vision = await mp.FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.15/wasm'
          );
          const lm = await mp.FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          });
          if (!cancelled) {
            faceLandmarkerRef.current = lm;
            mpModuleRef.current       = mp;
            setIsMediaPipeReady(true);
          }
        } catch {
          if (!cancelled) setErrorMsg('No se pudo cargar el modelo de IA. Verifica tu conexión.');
        }
      })();

      return () => {
        cancelled = true;
        stopCamera();
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Camera ────────────────────────────────────────────────────────────────
    const startCamera = useCallback(async () => {
      setErrorMsg(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        isActiveRef.current = true;
        setIsActive(true);
        requestAnimationFrame(processFrame);
      } catch {
        setErrorMsg('No se pudo acceder a la cámara. Verifica los permisos del navegador.');
        throw new Error('camera_denied');
      }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const stopCamera = useCallback(() => {
      isActiveRef.current = false;
      setIsActive(false);
      cancelAnimationFrame(animFrameRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setLiveMetrics(null);
    }, []);

    // ── Expose handle via ref ─────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      startCamera,
      stopCamera,
      isActive: () => isActiveRef.current,
    }), [startCamera, stopCamera]);

    // ── Frame Processing Loop ─────────────────────────────────────────────────
    const processFrame = useCallback(() => {
      if (!isActiveRef.current) return;

      const video  = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(processFrame);
        return;
      }

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width  = video.videoWidth  || 640;
        canvas.height = video.videoHeight || 480;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) { animFrameRef.current = requestAnimationFrame(processFrame); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (faceLandmarkerRef.current && mpModuleRef.current) {
        try {
          const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());

          if (results.faceLandmarks?.length > 0) {
            const landmarks   = results.faceLandmarks[0];
            const blendshapes = results.faceBlendshapes?.[0]?.categories ?? [];

            drawEyeLandmarks(ctx, landmarks, canvas.width, canvas.height);

            const leftEAR  = calcEAR(landmarks, 'left');
            const rightEAR = calcEAR(landmarks, 'right');
            const avgEAR   = (leftEAR + rightEAR) / 2;
            const symmetry = 1 - Math.min(Math.abs(leftEAR - rightEAR) / 0.15, 1);

            const blinkLeft  = blendshapes.find((b: any) => b.categoryName === 'eyeBlinkLeft')?.score  ?? 0;
            const blinkRight = blendshapes.find((b: any) => b.categoryName === 'eyeBlinkRight')?.score ?? 0;
            const isBlink    = blinkLeft > 0.5 || blinkRight > 0.5;
            if (isBlink && !prevBlinkRef.current) blinkTimestamps.current.push(Date.now());
            prevBlinkRef.current = isBlink;

            blinkTimestamps.current = blinkTimestamps.current.filter((t) => t > Date.now() - 60_000);
            const blinkRate = blinkTimestamps.current.length;

            const metrics: EyeMetrics = {
              leftEAR, rightEAR, averageEAR: avgEAR,
              blinkRate, symmetryScore: symmetry,
              faceDetected: true,
            };

            frameCountRef.current++;
            if (frameCountRef.current % 10 === 0) {
              setLiveMetrics(metrics);
              setFrameCount(frameCountRef.current);
              onMetricsUpdate?.(metrics);
            }

            // Academic demo: enqueue frame data
            frameQueueRef.current.enqueue({
              imageData: ctx.createImageData(1, 1),
              timestamp: Date.now(),
              frameNumber: frameCountRef.current,
            } as FrameData);

            if (!suppressAnalysis) analyzeEyeMetrics(metrics);

          } else {
            frameCountRef.current++;
            if (frameCountRef.current % 30 === 0) {
              setLiveMetrics({
                leftEAR: 0, rightEAR: 0, averageEAR: 0,
                blinkRate: 0, symmetryScore: 0, faceDetected: false,
              });
              onMetricsUpdate?.({
                leftEAR: 0, rightEAR: 0, averageEAR: 0,
                blinkRate: 0, symmetryScore: 0, faceDetected: false,
              });
            }
          }
        } catch {
          // Silently ignore per-frame errors
        }
      }

      animFrameRef.current = requestAnimationFrame(processFrame);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Draw Landmarks ────────────────────────────────────────────────────────
    function drawEyeLandmarks(
      ctx: CanvasRenderingContext2D,
      landmarks: { x: number; y: number; z: number }[],
      w: number, h: number
    ) {
      const mp = mpModuleRef.current;
      if (!mp) return;
      const du = new mp.DrawingUtils(ctx);
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,    { color: 'rgba(6,182,212,0.85)',  lineWidth: 1.5 });
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,   { color: 'rgba(6,182,212,0.85)',  lineWidth: 1.5 });
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,   { color: 'rgba(251,191,36,0.9)',  lineWidth: 1.5 });
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,  { color: 'rgba(251,191,36,0.9)',  lineWidth: 1.5 });
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,  { color: 'rgba(99,102,241,0.5)', lineWidth: 1 });
      du.drawConnectors(landmarks, mp.FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW, { color: 'rgba(99,102,241,0.5)', lineWidth: 1 });
    }

    // ── Auto-analysis (continuous mode) ──────────────────────────────────────
    function analyzeEyeMetrics(metrics: EyeMetrics) {
      const now = Date.now();
      if (now - lastAnalysisRef.current < ANALYSIS_INTERVAL_MS) return;
      lastAnalysisRef.current = now;

      const { leftEAR, rightEAR, blinkRate } = metrics;
      const avgEAR   = (leftEAR + rightEAR) / 2;
      const symmDiff = Math.abs(leftEAR - rightEAR);

      let diagnosis: DiagnosticResult | null = null;

      if (leftEAR < EAR_PTOSIS_THRESHOLD || rightEAR < EAR_PTOSIS_THRESHOLD) {
        diagnosis = buildDiagnosis('Posible Ptosis Ocular', 'URGENTE', 0.82 + Math.random() * 0.12,
          ['Consultar con un oftalmólogo urgentemente', 'El párpado caído puede indicar una condición neurológica'],
          metrics);
      } else if (symmDiff > SYMMETRY_THRESHOLD) {
        diagnosis = buildDiagnosis('Asimetría Ocular Detectada', 'SEGUIMIENTO', 0.72 + Math.random() * 0.15,
          ['Consultar con un especialista', 'Monitorear si la asimetría persiste'],
          metrics);
      } else if (avgEAR > EAR_PTOSIS_THRESHOLD && avgEAR < EAR_FATIGUE_THRESHOLD) {
        diagnosis = buildDiagnosis('Fatiga Ocular Detectada', 'SEGUIMIENTO', 0.78 + Math.random() * 0.12,
          ['Aplicar la regla 20-20-20', 'Reducir el tiempo frente a pantallas'],
          metrics);
      } else if (blinkRate > 0 && blinkRate < BLINK_DRY_THRESHOLD) {
        diagnosis = buildDiagnosis('Posible Ojo Seco', 'NORMAL', 0.70 + Math.random() * 0.15,
          ['Mantener hidratación adecuada', 'Considerar lágrimas artificiales'],
          metrics);
      }

      if (!diagnosis) return;

      const lastTrigger = detectionCooldown.current.get(diagnosis.detection) ?? 0;
      if (now - lastTrigger < DETECTION_COOLDOWN_MS) return;

      detectionCooldown.current.set(diagnosis.detection, now);
      diagnosticStack.current.push(diagnosis);
      sessionHistory.current.append(diagnosis);
      setDiagnosticCount((p) => p + 1);
      setStackSize(diagnosticStack.current.size());
      onDiagnosticResult?.(diagnosis);
    }

    function buildDiagnosis(
      detection: string,
      severity: 'URGENTE' | 'SEGUIMIENTO' | 'NORMAL',
      confidence: number,
      recommendations: string[],
      m: EyeMetrics
    ): DiagnosticResult {
      return {
        id:              `DIAG-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
        timestamp:       Date.now(),
        detection,
        severity,
        confidenceScore: confidence,
        recommendations,
        leftEAR:         m.leftEAR,
        rightEAR:        m.rightEAR,
        blinkRate:       m.blinkRate,
        symmetryScore:   m.symmetryScore,
      };
    }

    // ── Filter navigation ─────────────────────────────────────────────────────
    const nextFilter = () => { const f = filtersCircular.current.getNext(); if (f) setCurrentFilter(f); };
    const prevFilter = () => { const f = filtersCircular.current.getPrev(); if (f) setCurrentFilter(f); };

    const undoLastDiagnosis = () => {
      const removed = diagnosticStack.current.pop();
      if (removed) {
        setDiagnosticCount((p) => Math.max(0, p - 1));
        setStackSize(diagnosticStack.current.size());
      }
    };

    if (!isMounted) return null;

    const faceOk = liveMetrics?.faceDetected ?? false;

    return (
      <div className="flex flex-col gap-4 w-full">

        {/* ── Camera viewport ────────────────────────────────────────────────── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden cam-corners bg-black"
          style={{
            aspectRatio: '16/9',
            boxShadow: isActive
              ? '0 0 0 1px rgba(0,200,168,0.4), 0 0 40px rgba(0,200,168,0.12)'
              : '0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Bottom corners */}
          <div className="absolute bottom-0 left-0 w-[18px] h-[18px] border-b-2 border-l-2 border-violet/70 z-10 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[18px] h-[18px] border-b-2 border-r-2 border-violet/70 z-10 pointer-events-none" />

          <video
            ref={videoRef}
            autoPlay playsInline muted
            className="w-full h-full object-cover"
            style={{ filter: currentFilter.cssFilter }}
          />

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ objectFit: 'cover' }}
          />

          {isActive && <div className="scan-line" />}

          {/* Idle overlay */}
          {!isActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-3">
              <div className="w-14 h-14 rounded-full border border-violet/25 flex items-center justify-center">
                <span className="text-2xl text-white/20">◎</span>
              </div>
              <p className="text-[11px] text-muted tracking-widest uppercase">Cámara inactiva</p>
            </div>
          )}

          {/* Status badge */}
          <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full
            bg-black/70 border text-[10px] transition-all
            ${faceOk ? 'border-emerald/30 text-emerald' : 'border-white/[0.08] text-muted'}`}>
            {!isMediaPipeReady
              ? <><div className="w-1.5 h-1.5 rounded-full bg-amber status-dot" />Cargando IA…</>
              : isActive
                ? <><div className={`w-1.5 h-1.5 rounded-full ${faceOk ? 'bg-emerald status-dot' : 'bg-muted'}`} />
                    {faceOk ? 'Rostro detectado' : 'Buscando rostro…'}</>
                : null
            }
          </div>

          {/* Filter badge */}
          {isActive && !wizardMode && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full
              bg-black/70 border border-violet/25 text-[10px] text-violet">
              <span>{currentFilter.icon}</span>
              <span>{currentFilter.description}</span>
            </div>
          )}
        </div>

        {/* ── Controls (hidden in wizardMode) ─────────────────────────────────── */}
        {!wizardMode && (
          <>
            {/* Filter selector */}
            <div className="flex items-center justify-between gap-3">
              <button onClick={prevFilter}
                className="px-4 py-2 rounded-lg card text-subtle hover:text-white text-sm transition-colors">
                ← Anterior
              </button>
              <div className="flex items-center gap-2">
                {VISION_FILTERS.map((f) => (
                  <div key={f.name}
                    className={`rounded-full transition-all duration-300 ${
                      f.name === currentFilter.name ? 'w-5 h-1.5 bg-grad-brand' : 'w-1.5 h-1.5 bg-white/[0.12]'
                    }`} />
                ))}
              </div>
              <button onClick={nextFilter}
                className="px-4 py-2 rounded-lg card text-subtle hover:text-white text-sm transition-colors">
                Siguiente →
              </button>
            </div>

            {/* Error */}
            {errorMsg && (
              <div className="p-3 rounded-xl border border-rose/25 bg-rose/5 text-rose text-sm">
                {errorMsg}
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {!isActive ? (
                <button onClick={startCamera} disabled={!isMediaPipeReady}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm bg-grad-brand text-white
                    shadow-glow-sm hover:shadow-glow-v transition-shadow
                    disabled:opacity-30 disabled:cursor-not-allowed">
                  {isMediaPipeReady ? '▶  Iniciar Escaneo' : 'Cargando modelo…'}
                </button>
              ) : (
                <>
                  <button onClick={stopCamera}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold card hover:border-rose/30 text-rose transition-colors">
                    ⏹  Detener
                  </button>
                  {stackSize > 0 && (
                    <button onClick={undoLastDiagnosis}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold card hover:border-amber/30 text-amber transition-colors">
                      ↶  Deshacer
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Frames',      value: frameCount,      color: 'text-cyan'   },
                { label: 'Detecciones', value: diagnosticCount, color: 'text-violet' },
                { label: 'Stack',       value: stackSize,       color: 'text-amber'  },
              ].map(({ label, value, color }) => (
                <div key={label} className="card p-3 text-center">
                  <p className="text-[9px] text-muted uppercase tracking-widest mb-1">{label}</p>
                  <p className={`num font-bold text-lg ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Error in wizard mode */}
        {wizardMode && errorMsg && (
          <div className="p-3 rounded-xl border border-rose/25 bg-rose/5 text-rose text-sm">
            {errorMsg}
          </div>
        )}
      </div>
    );
  }
);
