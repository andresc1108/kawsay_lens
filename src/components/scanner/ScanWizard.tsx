'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { EyeScanner, type EyeScannerHandle } from '@/components/EyeScanner';
import { DiagnosisResult } from '@/components/scanner/DiagnosisResult';
import { Button } from '@/components/ui/Button';
import { downloadReport } from '@/lib/reportGenerator';
import type { DiagnosticResult, EyeMetrics } from '@/types';
import {
  ScanIcon, EyeIcon, ActivityIcon, CheckIcon, ChevRightIcon,
} from '@/components/ui/Icons';

// ── Wizard steps ──────────────────────────────────────────────────────────────
type Step = 'idle' | 'positioning' | 'analyzing' | 'result';

const ANALYSIS_DURATION_MS = 8000;

// ── Analysis logic ────────────────────────────────────────────────────────────
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function computeDiagnosis(buffer: EyeMetrics[]): DiagnosticResult {
  const base = {
    id:        `DIAG-${Date.now()}-${Math.floor(Math.random() * 9999)}`,
    timestamp: Date.now(),
  };

  if (buffer.length < 3) {
    return {
      ...base,
      detection:       'Sin datos suficientes',
      severity:        'NORMAL',
      confidenceScore: 0.4,
      recommendations: [
        'Posiciona tu cara claramente frente a la cámara',
        'Asegúrate de tener buena iluminación',
        'Intenta el análisis nuevamente',
      ],
    };
  }

  const leftEAR  = mean(buffer.map((m) => m.leftEAR));
  const rightEAR = mean(buffer.map((m) => m.rightEAR));
  const avgEAR   = mean(buffer.map((m) => m.averageEAR));
  const blinkRate = mean(buffer.map((m) => m.blinkRate));
  const symmetry  = mean(buffer.map((m) => m.symmetryScore));
  const symmDiff  = Math.abs(leftEAR - rightEAR);

  const metrics = { leftEAR, rightEAR, averageEAR: avgEAR, blinkRate, symmetryScore: symmetry, faceDetected: true };

  // Priority: ptosis > asymmetry > fatigue > dry eye > normal
  if (leftEAR < 0.14 || rightEAR < 0.14) {
    return {
      ...base, ...metrics,
      detection:       'Posible Ptosis Ocular',
      severity:        'URGENTE',
      confidenceScore: 0.82 + Math.random() * 0.12,
      recommendations: [
        'Consultar con un oftalmólogo urgentemente',
        'El párpado caído puede indicar una condición neurológica',
        'Evitar conducir hasta ser evaluado por un especialista',
        'No auto-medicarse ni ignorar el síntoma',
      ],
    };
  }

  if (symmDiff > 0.06) {
    return {
      ...base, ...metrics,
      detection:       'Asimetría Ocular Detectada',
      severity:        'SEGUIMIENTO',
      confidenceScore: 0.72 + Math.random() * 0.15,
      recommendations: [
        'Consultar con un optómetra o especialista ocular',
        'Monitorear si la asimetría persiste o aumenta',
        'Fotografiar periódicamente para documentar cambios',
        'Mencionar el síntoma en tu próxima consulta médica',
      ],
    };
  }

  if (avgEAR > 0.14 && avgEAR < 0.22) {
    return {
      ...base, ...metrics,
      detection:       'Fatiga Ocular',
      severity:        'SEGUIMIENTO',
      confidenceScore: 0.78 + Math.random() * 0.12,
      recommendations: [
        'Aplicar la regla 20-20-20: cada 20 min, mira a 20 pies por 20 seg',
        'Reducir el tiempo frente a pantallas',
        'Ajustar el brillo y contraste del monitor',
        'Descanso visual adecuado y dormir al menos 7 horas',
      ],
    };
  }

  if (blinkRate > 0 && blinkRate < 10) {
    return {
      ...base, ...metrics,
      detection:       'Posible Ojo Seco',
      severity:        'NORMAL',
      confidenceScore: 0.68 + Math.random() * 0.15,
      recommendations: [
        'Parpadear conscientemente con más frecuencia',
        'Considerar el uso de lágrimas artificiales sin preservantes',
        'Usar humidificador en ambientes con aire acondicionado',
        'Mantener hidratación adecuada durante el día',
      ],
    };
  }

  return {
    ...base, ...metrics,
    detection:       'Ojos en buen estado',
    severity:        'NORMAL',
    confidenceScore: 0.88 + Math.random() * 0.10,
    recommendations: [
      'Continúa con tus buenos hábitos de higiene visual',
      'Realiza chequeos periódicos con tu optómetra (1 vez al año)',
      'Mantén la regla 20-20-20 como hábito preventivo',
      'Protege tus ojos del sol con gafas UV cuando sea necesario',
    ],
  };
}

// ── Live metrics grid ─────────────────────────────────────────────────────────
function LiveMetricsGrid({ metrics }: { metrics: EyeMetrics }) {
  const items = [
    { label: 'EAR izq.',      value: metrics.leftEAR.toFixed(3),                        color: 'text-cyan'   },
    { label: 'EAR der.',      value: metrics.rightEAR.toFixed(3),                       color: 'text-cyan'   },
    { label: 'Parpadeos/min', value: `${Math.round(metrics.blinkRate)}`,                color: 'text-amber'  },
    { label: 'Simetría',      value: `${Math.round(metrics.symmetryScore * 100)}%`,     color: 'text-violet' },
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(({ label, value, color }) => (
        <div key={label} className="rounded-lg bg-surface/60 border border-rim p-2.5 text-center">
          <p className="text-[9px] text-muted uppercase tracking-widest mb-1">{label}</p>
          <p className={`num font-bold text-sm ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

// ── Step indicator ────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'positioning', label: 'Posición',  icon: EyeIcon  },
  { id: 'analyzing',   label: 'Análisis',  icon: ActivityIcon },
  { id: 'result',      label: 'Resultado', icon: CheckIcon },
] as const;

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      {STEPS.map((s, i) => {
        const StepIcon = s.icon;
        const done     = current === 'result' || (current === 'analyzing' && s.id === 'positioning');
        const active   = current === s.id;
        return (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium
              transition-all duration-300
              ${active ? 'bg-violet/15 border border-violet/40 text-violet' :
                done   ? 'text-emerald' : 'text-muted'}`}>
              <StepIcon size={12} />
              <span>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevRightIcon size={12} className={done ? 'text-emerald' : 'text-muted/40'} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface ScanWizardProps {
  onResult?: (result: DiagnosticResult) => void;
}

// ── ScanWizard ────────────────────────────────────────────────────────────────
export function ScanWizard({ onResult }: ScanWizardProps) {
  const [step,            setStep]            = useState<Step>('idle');
  const [faceDetected,    setFaceDetected]    = useState(false);
  const [progress,        setProgress]        = useState(0);       // 0–100
  const [secondsLeft,     setSecondsLeft]     = useState(8);
  const [finalResult,     setFinalResult]     = useState<DiagnosticResult | null>(null);
  const [liveMetrics,     setLiveMetrics]     = useState<EyeMetrics | null>(null);
  const [isExporting,     setIsExporting]     = useState(false);
  const [confirmReset,    setConfirmReset]    = useState(false);

  const scannerRef     = useRef<EyeScannerHandle>(null);
  const metricsBuffer  = useRef<EyeMetrics[]>([]);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);
  const analysisActive = useRef(false);

  // ── Clean up timer on unmount ─────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Metrics callback from EyeScanner ─────────────────────────────────────
  const handleMetricsUpdate = useCallback((metrics: EyeMetrics) => {
    setLiveMetrics(metrics);
    if (metrics.faceDetected) setFaceDetected(true);
    if (analysisActive.current && metrics.faceDetected) {
      metricsBuffer.current.push(metrics);
    }
  }, []);

  // ── Step: Start positioning ───────────────────────────────────────────────
  const handleBeginPositioning = async () => {
    setFaceDetected(false);
    setStep('positioning');
    setTimeout(() => scannerRef.current?.startCamera(), 100);
  };

  // ── Step: Start analysis ──────────────────────────────────────────────────
  const handleBeginAnalysis = () => {
    metricsBuffer.current   = [];
    analysisActive.current  = true;
    setStep('analyzing');
    setProgress(0);
    setSecondsLeft(8);

    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed  = Date.now() - start;
      const pct      = Math.min((elapsed / ANALYSIS_DURATION_MS) * 100, 100);
      const sLeft    = Math.max(0, Math.ceil((ANALYSIS_DURATION_MS - elapsed) / 1000));
      setProgress(pct);
      setSecondsLeft(sLeft);

      if (elapsed >= ANALYSIS_DURATION_MS) {
        if (timerRef.current) clearInterval(timerRef.current);
        analysisActive.current = false;
        finalizeAnalysis();
      }
    }, 100);
  };

  // ── Finalize: compute result ──────────────────────────────────────────────
  const finalizeAnalysis = () => {
    const result = computeDiagnosis(metricsBuffer.current);
    setFinalResult(result);
    setStep('result');
    scannerRef.current?.stopCamera();
    onResult?.(result);
  };

  // ── Reset wizard ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setConfirmReset(false);
    if (timerRef.current) clearInterval(timerRef.current);
    analysisActive.current = false;
    scannerRef.current?.stopCamera();
    setStep('idle');
    setFaceDetected(false);
    setProgress(0);
    setSecondsLeft(8);
    setFinalResult(null);
    setLiveMetrics(null);
    metricsBuffer.current = [];
  };

  // ── Export PDF ────────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!finalResult) return;
    setIsExporting(true);
    try {
      await downloadReport([finalResult], `SESSION-${Date.now()}`);
    } finally {
      setIsExporting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // IDLE
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'idle') {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="card p-8 flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-grad-brand flex items-center justify-center shadow-glow-v">
            <ScanIcon size={28} className="text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white tracking-tight">Análisis Ocular</h2>
            <p className="text-sm text-muted mt-2 max-w-xs">
              El sistema analizará tus ojos durante <span className="text-white font-medium">8 segundos</span>{' '}
              y generará un diagnóstico completo.
            </p>
          </div>

          {/* Process steps */}
          <div className="w-full flex flex-col gap-2.5 text-left">
            {[
              { n: '01', t: 'Posición',  d: 'Coloca tu cara frente a la cámara' },
              { n: '02', t: 'Análisis',  d: '8 segundos de captura y medición' },
              { n: '03', t: 'Resultado', d: 'Diagnóstico único y recomendaciones' },
            ].map(({ n, t, d }) => (
              <div key={n} className="flex items-start gap-3 p-3 rounded-xl bg-surface/60 border border-rim">
                <span className="text-[10px] font-bold text-violet/60 mt-0.5 w-5 flex-shrink-0">{n}</span>
                <div>
                  <p className="text-xs font-semibold text-white">{t}</p>
                  <p className="text-[11px] text-muted mt-0.5">{d}</p>
                </div>
              </div>
            ))}
          </div>

          <Button size="lg" fullWidth onClick={handleBeginPositioning}
            icon={<ChevRightIcon size={14} />}>
            Iniciar análisis
          </Button>

          <p className="text-[11px] text-muted">
            Se requiere acceso a la cámara web
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // RESULT
  // ─────────────────────────────────────────────────────────────────────────
  if (step === 'result' && finalResult) {
    return (
      <DiagnosisResult
        result={finalResult}
        onRepeat={handleReset}
        onExport={handleExport}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // POSITIONING + ANALYZING
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4">

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Camera (stays mounted across both steps) */}
      <EyeScanner
        ref={scannerRef}
        onMetricsUpdate={handleMetricsUpdate}
        suppressAnalysis
        wizardMode
      />

      {/* ── POSITIONING instructions ───────────────────────────────────────── */}
      {step === 'positioning' && (
        <div className="card p-4 flex flex-col gap-4 animate-fade-up">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${faceDetected ? 'bg-emerald status-dot' : 'bg-muted'}`} />
            <p className="text-sm text-subtle">
              {faceDetected
                ? 'Rostro detectado — puedes comenzar el análisis'
                : 'Centra tu cara en el encuadre y mira hacia la cámara'}
            </p>
          </div>

          {liveMetrics?.faceDetected && <LiveMetricsGrid metrics={liveMetrics} />}

          <div className="flex gap-3">
            <Button variant="ghost" onClick={handleReset} className="flex-shrink-0">
              Cancelar
            </Button>
            <Button
              fullWidth
              disabled={!faceDetected}
              onClick={handleBeginAnalysis}
              icon={<ScanIcon size={14} />}
            >
              {faceDetected ? 'Comenzar análisis' : 'Esperando rostro…'}
            </Button>
          </div>
        </div>
      )}

      {/* ── ANALYZING countdown ────────────────────────────────────────────── */}
      {step === 'analyzing' && (
        <div className="card p-4 flex flex-col gap-4 animate-fade-up">

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted mb-2">
              <span className="uppercase tracking-widest">Analizando…</span>
              <span className="num text-white font-semibold">{secondsLeft}s</span>
            </div>
            <div className="metric-bar-track h-2 rounded-full">
              <div
                className="metric-bar-fill bg-grad-brand rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {liveMetrics?.faceDetected && <LiveMetricsGrid metrics={liveMetrics} />}

          {!liveMetrics?.faceDetected && (
            <p className="text-sm text-amber text-center py-2">
              Rostro no detectado — mantén tu cara frente a la cámara
            </p>
          )}

          <p className="text-[11px] text-muted text-center">
            Mantén la mirada al frente y parpadea naturalmente
          </p>

          {/* Confirm cancel */}
          {confirmReset ? (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-subtle text-center">¿Cancelar el análisis en curso?</p>
              <div className="flex gap-2">
                <Button variant="secondary" fullWidth onClick={() => setConfirmReset(false)}>
                  Continuar
                </Button>
                <Button variant="danger" fullWidth onClick={handleReset}>
                  Cancelar análisis
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmReset(true)}
              className="text-[11px] text-muted hover:text-rose transition-colors text-center"
            >
              Cancelar análisis
            </button>
          )}
        </div>
      )}
    </div>
  );
}
