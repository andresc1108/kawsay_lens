package com.kawsay.model;

/**
 * Reporte NORMAL
 * Para hallazgos menores o variaciones normales
 * (ej: Pequeñas imperfecciones, cambios normales por edad)
 */
public class NormalDiagnosticReport extends DiagnosticReport {

    public NormalDiagnosticReport(String reportId, String detection, double confidenceScore, String sessionId) {
        super(reportId, detection, confidenceScore, sessionId);
        this.severity = "NORMAL";
    }

    @Override
    public String getReportType() {
        return "NORMAL";
    }

    @Override
    public int getPriority() {
        return 3; // Baja prioridad
    }

    @Override
    public String generateSummary() {
        return String.format(
            "[✅ NORMAL] Se ha detectado posible %s con confianza del %.1f%%. " +
            "Este hallazgo se considera dentro de los parámetros normales. " +
            "Continúe con chequeos visuales regulares según lo recomendado.",
            detection, confidenceScore * 100
        );
    }
}
