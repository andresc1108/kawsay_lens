/**
 * Utilidad para generar reportes en PDF
 * Usa jsPDF para crear documento profesional
 */

import jsPDF from 'jspdf';
import type { DiagnosticResult } from '@/types';

export interface ReportGenerationOptions {
  fileName?: string;
  includeDisclaimer?: boolean;
  sessionId?: string;
  duration?: number;
}

const KAWSAY_LENS_DISCLAIMER = `
DESCARGO DE RESPONSABILIDAD

Este software es una herramienta académica de apoyo para educación en Estructuras de Datos y 
Visión Artificial. Los resultados NO son un diagnóstico médico oficial y deben ser validados por 
un optómetra o especialista certificado.

Los desarrolladores no asumen responsabilidad legal por:
- Uso indebido de esta herramienta
- Diagnósticos incorrectos o falsos positivos/negativos
- Decisiones médicas tomadas basadas únicamente en estos resultados
- Daños o lesiones resultantes del uso de esta aplicación

USO RESPONSABLE:
Esta herramienta es únicamente para fines educativos y de demostración tecnológica. 
No reemplaza la evaluación profesional de un especialista en oftalmología.

Para diagnósticos médicos, consulte siempre a profesionales cualificados.
`;

/**
 * Generar reporte PDF de la sesión
 */
export async function generateSessionReport(
  findings: DiagnosticResult[],
  options: ReportGenerationOptions = {}
): Promise<void> {
  const {
    fileName = 'Reporte_Kawsay_Lens.pdf',
    includeDisclaimer = true,
    sessionId = `SESSION-${Date.now()}`,
    duration = 0,
  } = options;

  // Crear documento
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colores
  const primaryColor = [0, 102, 204] as [number, number, number];
  const secondaryColor = [0, 212, 132] as [number, number, number];
  const dangerColor = [255, 71, 87] as [number, number, number];
  const textColor = [26, 26, 46] as [number, number, number];
  const lightColor = [200, 200, 200] as [number, number, number];

  let yPosition = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // ===== HEADER =====
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 40, 'F');

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255);
  pdf.text('KAWSAY-LENS', margin, 20);
  pdf.setFontSize(10);
  pdf.text('Reporte de Sesión de Análisis Visual', margin, 28);

  yPosition = 50;

  // ===== SESSION INFO =====
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.5);
  pdf.rect(margin, yPosition, contentWidth, 25);

  pdf.setFont('Helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(...primaryColor);
  pdf.text('INFORMACIÓN DE LA SESIÓN', margin + 3, yPosition + 6);

  pdf.setFont('Helvetica', 'normal');
  pdf.setFontSize(9);
  pdf.setTextColor(...textColor);

  const sessionDate = new Date().toLocaleDateString('es-ES');
  const sessionTime = new Date().toLocaleTimeString('es-ES');

  pdf.text(`Fecha: ${sessionDate} | Hora: ${sessionTime}`, margin + 3, yPosition + 12);
  pdf.text(
    `ID Sesión: ${sessionId} | Duración: ${duration} segundos`,
    margin + 3,
    yPosition + 17
  );
  pdf.text(`Total de Hallazgos: ${findings.length}`, margin + 3, yPosition + 22);

  yPosition += 35;

  // ===== FINDINGS SECTION =====
  if (findings.length > 0) {
    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(...primaryColor);
    pdf.text('HALLAZGOS DETECTADOS', margin, yPosition);

    yPosition += 10;

    findings.forEach((finding, index) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        pdf.addPage();
        yPosition = 20;
      }

      // Finding box
      pdf.setDrawColor(...secondaryColor);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, yPosition, contentWidth, 35);

      // Severity badge
      const severityColors = {
        URGENTE: dangerColor,
        SEGUIMIENTO: [255, 193, 7] as [number, number, number],
        NORMAL: secondaryColor,
      };

      const severityBgColor = severityColors[finding.severity];
      pdf.setFillColor(...severityBgColor);
      pdf.rect(pageWidth - margin - 30, yPosition + 2, 25, 7, 'F');

      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(finding.severity, pageWidth - margin - 28, yPosition + 5.5);

      // Finding details
      pdf.setFont('Helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.setTextColor(...textColor);
      pdf.text(`${index + 1}. ${finding.detection}`, margin + 3, yPosition + 8);

      pdf.setFont('Helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(...lightColor);

      const time = new Date(finding.timestamp).toLocaleTimeString('es-ES');
      const confidence = (finding.confidenceScore * 100).toFixed(1);

      pdf.text(`Hora: ${time}`, margin + 5, yPosition + 13);
      pdf.text(`Confianza: ${confidence}%`, margin + 5, yPosition + 17);

      // Recommendations
      if (finding.recommendations.length > 0) {
        pdf.setFont('Helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(...primaryColor);
        pdf.text('Recomendaciones:', margin + 5, yPosition + 21);

        finding.recommendations.forEach((rec, recIndex) => {
          pdf.setFont('Helvetica', 'normal');
          pdf.setFontSize(7);
          pdf.setTextColor(...textColor);
          pdf.text(`• ${rec}`, margin + 7, yPosition + 24 + recIndex * 3);
        });
      }

      yPosition += 40;
    });
  } else {
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(...lightColor);
    pdf.text('No se detectaron hallazgos en esta sesión.', margin, yPosition);
    yPosition += 15;
  }

  // ===== NEW PAGE FOR DISCLAIMER =====
  if (includeDisclaimer) {
    pdf.addPage();
    yPosition = 20;

    // Disclaimer header
    pdf.setFillColor(...dangerColor);
    pdf.rect(0, 0, pageWidth, 15, 'F');

    pdf.setFont('Helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(255, 255, 255);
    pdf.text('⚠️ DESCARGO DE RESPONSABILIDAD', margin, 10);

    yPosition = 25;

    // Disclaimer content
    pdf.setFont('Helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...textColor);

    const disclaimerText = pdf.splitTextToSize(KAWSAY_LENS_DISCLAIMER, contentWidth);
    pdf.text(disclaimerText, margin, yPosition);

    // Footer
    yPosition = pageHeight - 20;
    pdf.setDrawColor(...lightColor);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);

    pdf.setFont('Helvetica', 'italic');
    pdf.setFontSize(7);
    pdf.setTextColor(...lightColor);
    pdf.text(
      'Este reporte fue generado automáticamente por Kawsay-Lens. Para uso educativo únicamente.',
      pageWidth / 2,
      yPosition + 5,
      { align: 'center' }
    );
  }

  // ===== SAVE PDF =====
  pdf.save(fileName);
}

/**
 * Generar y descargar reporte
 */
export async function downloadReport(
  findings: DiagnosticResult[],
  sessionId?: string
): Promise<void> {
  try {
    const duration = findings.length > 0
      ? Math.floor((findings[findings.length - 1].timestamp - findings[0].timestamp) / 1000)
      : 0;

    await generateSessionReport(findings, {
      fileName: `Reporte_Kawsay_Lens_${new Date().getTime()}.pdf`,
      includeDisclaimer: true,
      sessionId: sessionId || `SESSION-${Date.now()}`,
      duration,
    });
  } catch (error) {
    console.error('Error generando reporte:', error);
    throw new Error('No se pudo generar el reporte PDF');
  }
}
