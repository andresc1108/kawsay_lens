package com.kawsay.model;

/**
 * Reporte de SEGUIMIENTO
 * Para hallazgos que requieren monitoreo y seguimiento
 * (ej: Miopía progresiva, Presión intraocular elevada)
 */
public class FollowUpDiagnosticReport extends DiagnosticReport {

    public FollowUpDiagnosticReport(String reportId, String detection, double confidenceScore, String sessionId) {
        super(reportId, detection, confidenceScore, sessionId);
        this.severity = "SEGUIMIENTO";
    }

    @Override
    public String getReportType() {
        return "FOLLOW_UP";
    }

    @Override
    public int getPriority() {
        return 2; // Prioridad media
    }

    @Override
    public String generateSummary() {
        return String.format(
            "[📋 SEGUIMIENTO] Se ha detectado posible %s con confianza del %.1f%%. " +
            "Se recomienda realizar pruebas visuales adicionales y seguimiento periódico. " +
            "Programe una cita con su optómetra para validación profesional.",
            detection, confidenceScore * 100
        );
    }
}
