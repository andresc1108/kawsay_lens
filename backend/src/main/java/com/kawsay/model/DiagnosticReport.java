package com.kawsay.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Clase base para representar un reporte diagnóstico
 * Contiene información fundamental de un diagnóstico ocular
 */
public abstract class DiagnosticReport {
    protected String reportId;
    protected LocalDateTime timestamp;
    protected String detection;
    protected double confidenceScore;
    protected String severity;
    protected List<String> recommendations;
    protected String sessionId;

    public DiagnosticReport(String reportId, String detection, double confidenceScore, String sessionId) {
        this.reportId = reportId;
        this.detection = detection;
        this.confidenceScore = confidenceScore;
        this.timestamp = LocalDateTime.now();
        this.recommendations = new ArrayList<>();
        this.sessionId = sessionId;
    }

    /**
     * Obtener el tipo de reporte
     */
    public abstract String getReportType();

    /**
     * Obtener prioridad (para ordenar reportes)
     */
    public abstract int getPriority();

    /**
     * Generar resumen del reporte
     */
    public abstract String generateSummary();

    /**
     * Obtener acciones recomendadas
     */
    public void addRecommendation(String recommendation) {
        this.recommendations.add(recommendation);
    }

    // Getters y Setters
    public String getReportId() {
        return reportId;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getDetection() {
        return detection;
    }

    public double getConfidenceScore() {
        return confidenceScore;
    }

    public String getSeverity() {
        return severity;
    }

    public List<String> getRecommendations() {
        return new ArrayList<>(recommendations);
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    @Override
    public String toString() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return String.format(
            "DiagnosticReport{reportId='%s', type='%s', timestamp=%s, detection='%s', " +
            "confidenceScore=%.2f%%, severity='%s', recommendations=%d}",
            reportId, getReportType(), timestamp.format(formatter), detection,
            confidenceScore * 100, severity, recommendations.size()
        );
    }
}
