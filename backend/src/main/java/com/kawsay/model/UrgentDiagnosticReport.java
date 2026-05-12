package com.kawsay.model;

/**
 * Reporte de URGENTE
 * Para hallazgos que requieren atención inmediata
 * (ej: Cataracia, Glaucoma, Desprendimiento de retina)
 */
public class UrgentDiagnosticReport extends DiagnosticReport {

    public UrgentDiagnosticReport(String reportId, String detection, double confidenceScore, String sessionId) {
        super(reportId, detection, confidenceScore, sessionId);
        this.severity = "URGENTE";
    }

    @Override
    public String getReportType() {
        return "URGENT";
    }

    @Override
    public int getPriority() {
        return 1; // Máxima prioridad
    }

    @Override
    public String generateSummary() {
        return String.format(
            "[⚠️ URGENTE] Se ha detectado posible %s con confianza del %.1f%%. " +
            "Se recomienda consultar INMEDIATAMENTE con un oftalmólogo. " +
            "Este es un hallazgo de alta prioridad que requiere validación médica urgente.",
            detection, confidenceScore * 100
        );
    }
}
