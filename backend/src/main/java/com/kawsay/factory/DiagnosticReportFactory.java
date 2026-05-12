package com.kawsay.factory;

import com.kawsay.model.DiagnosticReport;
import com.kawsay.model.UrgentDiagnosticReport;
import com.kawsay.model.FollowUpDiagnosticReport;
import com.kawsay.model.NormalDiagnosticReport;

/**
 * Factory Pattern para crear diferentes tipos de reportes diagnósticos
 * Siguiendo el patrón Factory Method
 *
 * El Factory se encarga de:
 * 1. Determinar el tipo de reporte basado en la severidad
 * 2. Crear la instancia apropiada del reporte
 * 3. Aplicar recomendaciones predeterminadas
 */
public class DiagnosticReportFactory {

    /**
     * Enum para los tipos de severidad
     */
    public enum ReportSeverity {
        URGENTE("URGENTE", 1),
        SEGUIMIENTO("SEGUIMIENTO", 2),
        NORMAL("NORMAL", 3);

        private final String displayName;
        private final int priority;

        ReportSeverity(String displayName, int priority) {
            this.displayName = displayName;
            this.priority = priority;
        }

        public String getDisplayName() {
            return displayName;
        }

        public int getPriority() {
            return priority;
        }
    }

    /**
     * Crear un reporte diagnóstico basado en la severidad
     *
     * @param detection Descripción del hallazgo
     * @param confidenceScore Puntuación de confianza (0-1)
     * @param severity Nivel de severidad
     * @param sessionId ID de la sesión
     * @return DiagnosticReport del tipo apropiado
     */
    public static DiagnosticReport createReport(
        String detection,
        double confidenceScore,
        ReportSeverity severity,
        String sessionId
    ) {
        String reportId = generateReportId();

        DiagnosticReport report = switch (severity) {
            case URGENTE -> new UrgentDiagnosticReport(reportId, detection, confidenceScore, sessionId);
            case SEGUIMIENTO -> new FollowUpDiagnosticReport(reportId, detection, confidenceScore, sessionId);
            case NORMAL -> new NormalDiagnosticReport(reportId, detection, confidenceScore, sessionId);
        };

        // Aplicar recomendaciones predeterminadas según tipo
        applyDefaultRecommendations(report, severity);

        return report;
    }

    /**
     * Crear un reporte basado en puntuación de confianza
     * Automáticamente determina la severidad
     *
     * @param detection Descripción del hallazgo
     * @param confidenceScore Puntuación de confianza (0-1)
     * @param sessionId ID de la sesión
     * @return DiagnosticReport del tipo apropiado según confianza
     */
    public static DiagnosticReport createReportFromConfidence(
        String detection,
        double confidenceScore,
        String sessionId
    ) {
        ReportSeverity severity;

        if (confidenceScore >= 0.85) {
            severity = ReportSeverity.URGENTE;
        } else if (confidenceScore >= 0.70) {
            severity = ReportSeverity.SEGUIMIENTO;
        } else {
            severity = ReportSeverity.NORMAL;
        }

        return createReport(detection, confidenceScore, severity, sessionId);
    }

    /**
     * Aplicar recomendaciones predeterminadas según tipo de reporte
     */
    private static void applyDefaultRecommendations(DiagnosticReport report, ReportSeverity severity) {
        switch (severity) {
            case URGENTE:
                report.addRecommendation("Contactar inmediatamente a un oftalmólogo especialista");
                report.addRecommendation("No ignorar este hallazgo");
                report.addRecommendation("Buscar atención médica profesional urgente");
                report.addRecommendation("Realizar pruebas diagnósticas confirmatorias");
                break;

            case SEGUIMIENTO:
                report.addRecommendation("Programar cita con optómetra");
                report.addRecommendation("Realizar pruebas visuales completas");
                report.addRecommendation("Mantener seguimiento periódico");
                report.addRecommendation("Documentar cambios en la visión");
                break;

            case NORMAL:
                report.addRecommendation("Continuar con chequeos regulares");
                report.addRecommendation("Mantener hábitos visuales saludables");
                report.addRecommendation("Proteger los ojos de luz UV");
                break;
        }
    }

    /**
     * Generar ID único para el reporte
     */
    private static String generateReportId() {
        return "DIAG-" + System.currentTimeMillis() + "-" + 
               (int)(Math.random() * 10000);
    }

    /**
     * Método auxiliar para crear reporte desde String de severidad
     */
    public static DiagnosticReport createReportFromString(
        String detection,
        double confidenceScore,
        String severityStr,
        String sessionId
    ) {
        ReportSeverity severity = ReportSeverity.valueOf(severityStr.toUpperCase());
        return createReport(detection, confidenceScore, severity, sessionId);
    }
}
