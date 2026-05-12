import jsPDF from 'jspdf';
import type { DiagnosticResult } from '@/types';

export interface ReportGenerationOptions {
  fileName?:          string;
  includeDisclaimer?: boolean;
  sessionId?:         string;
}

// ── Palette ───────────────────────────────────────────────────────────────────
const C = {
  bg:        [8,   8,  17] as [number,number,number],
  surface:   [14,  14, 28] as [number,number,number],
  panel:     [19,  19, 40] as [number,number,number],
  violet:    [139, 92, 246] as [number,number,number],
  cyan:      [34, 211, 238] as [number,number,number],
  emerald:   [74, 222, 128] as [number,number,number],
  amber:     [251,191,  36] as [number,number,number],
  rose:      [248,113, 113] as [number,number,number],
  white:     [255,255, 255] as [number,number,number],
  subtle:    [161,161, 170] as [number,number,number],
  muted:     [ 82, 82,  91] as [number,number,number],
  rim:       [ 40, 40,  60] as [number,number,number],
};

function rgb(c: [number,number,number]) { return { r: c[0], g: c[1], b: c[2] }; }

// ── Helpers ───────────────────────────────────────────────────────────────────
function setFill(pdf: jsPDF, c: [number,number,number]) { pdf.setFillColor(c[0], c[1], c[2]); }
function setDraw(pdf: jsPDF, c: [number,number,number]) { pdf.setDrawColor(c[0], c[1], c[2]); }
function setTxt(pdf:  jsPDF, c: [number,number,number]) { pdf.setTextColor(c[0], c[1], c[2]); }

function severityColor(s: DiagnosticResult['severity']): [number,number,number] {
  return s === 'URGENTE' ? C.rose : s === 'SEGUIMIENTO' ? C.amber : C.emerald;
}

function drawGradientBar(pdf: jsPDF, x: number, y: number, w: number, h: number) {
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const r = Math.round(C.violet[0] + (C.cyan[0] - C.violet[0]) * t);
    const g = Math.round(C.violet[1] + (C.cyan[1] - C.violet[1]) * t);
    const b = Math.round(C.violet[2] + (C.cyan[2] - C.violet[2]) * t);
    pdf.setFillColor(r, g, b);
    pdf.rect(x + (w * i) / steps, y, w / steps + 0.5, h, 'F');
  }
}

// ── Main generator ────────────────────────────────────────────────────────────
export async function generateSessionReport(
  findings: DiagnosticResult[],
  options:  ReportGenerationOptions = {}
): Promise<void> {
  const {
    fileName          = 'Reporte_Kawsay_Lens.pdf',
    includeDisclaimer = true,
    sessionId         = `SESSION-${Date.now()}`,
  } = options;

  const pdf        = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W          = pdf.internal.pageSize.getWidth();
  const H          = pdf.internal.pageSize.getHeight();
  const ML         = 16;
  const MR         = W - ML;
  const CW         = W - ML * 2;

  let y = 0;

  const newPage = () => {
    pdf.addPage();
    setFill(pdf, C.bg);
    pdf.rect(0, 0, W, H, 'F');
    y = 16;
    drawDotGrid(pdf);
    drawFooter(pdf, W, H, ML);
  };

  const checkPage = (needed: number) => {
    if (y + needed > H - 18) newPage();
  };

  // ── Cover page ──────────────────────────────────────────────────────────────
  setFill(pdf, C.bg);
  pdf.rect(0, 0, W, H, 'F');
  drawDotGrid(pdf);

  // Gradient bar at top
  drawGradientBar(pdf, 0, 0, W, 6);

  // Hero block
  setFill(pdf, C.panel);
  pdf.roundedRect(ML, 18, CW, 48, 3, 3, 'F');
  setDraw(pdf, C.violet);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(ML, 18, CW, 48, 3, 3, 'S');

  // Violet accent stripe left
  setFill(pdf, C.violet);
  pdf.roundedRect(ML, 18, 3, 48, 2, 2, 'F');

  // Title
  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(22);
  setTxt(pdf, C.white);
  pdf.text('KAWSAY-LENS', ML + 9, 35);

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  setTxt(pdf, C.subtle);
  pdf.text('Reporte de Análisis Ocular con Inteligencia Artificial', ML + 9, 42);

  pdf.setFontSize(8);
  setTxt(pdf, C.muted);
  pdf.text('Sistema académico · Estructuras de Datos · Universidad Católica de Colombia', ML + 9, 48);

  // Meta row
  const dateStr = new Date().toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' });
  const timeStr = new Date().toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
  setTxt(pdf, C.subtle);
  pdf.setFontSize(8);
  pdf.text(`Fecha: ${dateStr}   |   Hora: ${timeStr}   |   ID: ${sessionId}`, ML + 9, 56);

  // Summary stats
  y = 76;
  const stats = [
    { label: 'Hallazgos',    value: String(findings.length)                                          },
    { label: 'Urgentes',     value: String(findings.filter(f => f.severity === 'URGENTE').length)    },
    { label: 'Seguimiento',  value: String(findings.filter(f => f.severity === 'SEGUIMIENTO').length)},
    { label: 'Normales',     value: String(findings.filter(f => f.severity === 'NORMAL').length)     },
  ];
  const sw = CW / stats.length;
  stats.forEach((s, i) => {
    const sx = ML + sw * i;
    setFill(pdf, C.surface);
    pdf.roundedRect(sx, y, sw - 2, 20, 2, 2, 'F');
    setDraw(pdf, C.rim);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(sx, y, sw - 2, 20, 2, 2, 'S');

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(16);
    setTxt(pdf, C.white);
    pdf.text(s.value, sx + (sw - 2) / 2, y + 10, { align: 'center' });

    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(7);
    setTxt(pdf, C.muted);
    pdf.text(s.label.toUpperCase(), sx + (sw - 2) / 2, y + 16, { align: 'center' });
  });

  y = 106;

  drawFooter(pdf, W, H, ML);

  // ── Findings pages ──────────────────────────────────────────────────────────
  if (findings.length === 0) {
    newPage();
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(11);
    setTxt(pdf, C.subtle);
    pdf.text('No se registraron hallazgos en esta sesión.', W / 2, y + 20, { align: 'center' });
  } else {
    newPage();

    // Section header
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(8);
    setTxt(pdf, C.violet);
    pdf.text('HALLAZGOS DETECTADOS', ML, y);
    drawGradientBar(pdf, ML, y + 2, CW, 1);
    y += 8;

    findings.forEach((f, idx) => {
      const sColor = severityColor(f.severity);
      const cardH  = f.recommendations.length > 3 ? 52 : 46;
      checkPage(cardH + 4);

      // Card bg
      setFill(pdf, C.surface);
      pdf.roundedRect(ML, y, CW, cardH, 2.5, 2.5, 'F');

      // Severity accent bar
      setFill(pdf, sColor);
      pdf.roundedRect(ML, y, 3, cardH, 2, 2, 'F');

      // Border
      setDraw(pdf, C.rim);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(ML, y, CW, cardH, 2.5, 2.5, 'S');

      // Severity badge
      setFill(pdf, sColor);
      pdf.roundedRect(MR - 30, y + 4, 28, 7, 2, 2, 'F');
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(7);
      setTxt(pdf, C.bg);
      pdf.text(f.severity, MR - 16, y + 9, { align: 'center' });

      // Index + detection name
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(11);
      setTxt(pdf, C.white);
      pdf.text(`${String(idx + 1).padStart(2,'0')} · ${f.detection}`, ML + 7, y + 11);

      // Meta row
      const fTime   = new Date(f.timestamp).toLocaleTimeString('es-CO', { hour:'2-digit', minute:'2-digit' });
      const fConf   = (f.confidenceScore * 100).toFixed(1) + '%';
      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(7.5);
      setTxt(pdf, C.muted);
      pdf.text(`${fTime}  ·  Confianza: ${fConf}`, ML + 7, y + 17);

      // Metrics row (if available)
      if (f.leftEAR !== undefined) {
        const mPairs = [
          `EAR izq. ${f.leftEAR.toFixed(3)}`,
          `EAR der. ${f.rightEAR!.toFixed(3)}`,
          `Parpadeos ${Math.round(f.blinkRate ?? 0)}/min`,
          `Simetría ${Math.round((f.symmetryScore ?? 0) * 100)}%`,
        ];
        setTxt(pdf, C.cyan);
        pdf.setFontSize(7);
        pdf.text(mPairs.join('   '), ML + 7, y + 23);
        // Horizontal rule
        setDraw(pdf, C.rim);
        pdf.setLineWidth(0.2);
        pdf.line(ML + 7, y + 25.5, MR - 6, y + 25.5);
        y += 7;
      } else {
        setDraw(pdf, C.rim);
        pdf.setLineWidth(0.2);
        pdf.line(ML + 7, y + 21, MR - 6, y + 21);
      }

      // Recommendations
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(7.5);
      setTxt(pdf, C.subtle);
      pdf.text('Recomendaciones:', ML + 7, y + 27);

      f.recommendations.slice(0, 4).forEach((rec, ri) => {
        pdf.setFont('Helvetica', 'normal');
        pdf.setFontSize(7);
        setTxt(pdf, C.subtle);
        const lines = pdf.splitTextToSize(`• ${rec}`, CW - 16);
        pdf.text(lines[0], ML + 9, y + 31 + ri * 4.5);
      });

      y += cardH + 4;
    });
  }

  // ── Disclaimer page ─────────────────────────────────────────────────────────
  if (includeDisclaimer) {
    newPage();

    // Amber accent bar
    setFill(pdf, C.amber);
    pdf.rect(ML, y, 3, 8, 'F');

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(9);
    setTxt(pdf, C.amber);
    pdf.text('AVISO LEGAL Y DESCARGO DE RESPONSABILIDAD', ML + 7, y + 6);
    y += 14;

    setFill(pdf, C.panel);
    pdf.roundedRect(ML, y, CW, 92, 3, 3, 'F');
    setDraw(pdf, C.amber);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(ML, y, CW, 92, 3, 3, 'S');
    y += 8;

    const disclaimerLines = [
      'Este software es una herramienta académica desarrollada para el curso de Estructuras de Datos',
      'en la Universidad Católica de Colombia. Los resultados NO constituyen un diagnóstico médico',
      'oficial y DEBEN ser validados por un optómetra o especialista en oftalmología certificado.',
      '',
      'LOS DESARROLLADORES NO ASUMEN RESPONSABILIDAD POR:',
      '  · Uso inadecuado de esta herramienta fuera del contexto educativo',
      '  · Diagnósticos incorrectos, falsos positivos o falsos negativos',
      '  · Decisiones médicas basadas únicamente en estos resultados',
      '  · Daños o lesiones resultantes del uso de esta aplicación',
      '',
      'LIMITACIONES TÉCNICAS:',
      '  · El análisis se basa en métricas visuales (EAR, tasa de parpadeo, simetría)',
      '  · La precisión depende de la calidad de la cámara e iluminación del entorno',
      '  · No detecta condiciones que requieran exámenes clínicos especializados',
      '',
      'RECOMENDACIÓN: Para diagnósticos médicos, consulte siempre a profesionales',
      'cualificados en oftalmología o medicina ocular.',
    ];

    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(7.5);
    disclaimerLines.forEach((line) => {
      if (line.startsWith('LOS DESARROLLADORES') || line.startsWith('LIMITACIONES') || line.startsWith('RECOMENDACIÓN')) {
        pdf.setFont('Helvetica', 'bold');
        setTxt(pdf, C.amber);
      } else {
        pdf.setFont('Helvetica', 'normal');
        setTxt(pdf, C.subtle);
      }
      pdf.text(line, ML + 5, y);
      y += line === '' ? 3 : 5.5;
    });
  }

  pdf.save(fileName);
}

// ── Decorative dot grid overlay ───────────────────────────────────────────────
function drawDotGrid(pdf: jsPDF) {
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  pdf.setFillColor(255, 255, 255);
  const gap = 8;
  for (let x = gap; x < W; x += gap) {
    for (let y = gap; y < H; y += gap) {
      pdf.circle(x, y, 0.15, 'F');
    }
  }
}

// ── Footer ────────────────────────────────────────────────────────────────────
function drawFooter(pdf: jsPDF, W: number, H: number, ML: number) {
  setFill(pdf, C.panel);
  pdf.rect(0, H - 10, W, 10, 'F');
  drawGradientBar(pdf, 0, H - 10, W, 1);
  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(6.5);
  setTxt(pdf, C.muted);
  pdf.text(
    'Kawsay-Lens · Sistema de Análisis Ocular con IA · Herramienta académica — no diagnóstico médico',
    W / 2, H - 4, { align: 'center' }
  );
}

// ── Public download helper ────────────────────────────────────────────────────
export async function downloadReport(
  findings:  DiagnosticResult[],
  sessionId?: string
): Promise<void> {
  await generateSessionReport(findings, {
    fileName:  `Reporte_Kawsay_Lens_${Date.now()}.pdf`,
    sessionId: sessionId ?? `SESSION-${Date.now()}`,
    includeDisclaimer: true,
  });
}
