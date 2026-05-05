package com.kawsay;

import com.kawsay.factory.DiagnosticReportFactory;
import com.kawsay.factory.DiagnosticReportFactory.ReportSeverity;
import com.kawsay.model.DiagnosticReport;

/**
 * Clase de demostración del Factory Pattern
 * Ejemplo de uso del Factory para crear diferentes tipos de reportes
 */
public class DiagnosticReportDemo {

    public static void main(String[] args) {
        System.out.println("=== KAWSAY-LENS: FACTORY PATTERN DEMO ===\n");

        String sessionId = "SESSION-" + System.currentTimeMillis();

        // Ejemplo 1: Crear un reporte URGENTE
        System.out.println("1. Creando reporte URGENTE:");
        DiagnosticReport urgentReport = DiagnosticReportFactory.createReport(
            "Cataracia Avanzada",
            0.92,
            ReportSeverity.URGENTE,
            sessionId
        );
        printReportDetails(urgentReport);
        System.out.println();

        // Ejemplo 2: Crear un reporte de SEGUIMIENTO
        System.out.println("2. Creando reporte de SEGUIMIENTO:");
        DiagnosticReport followUpReport = DiagnosticReportFactory.createReport(
            "Miopía Progresiva",
            0.78,
            ReportSeverity.SEGUIMIENTO,
            sessionId
        );
        printReportDetails(followUpReport);
        System.out.println();

        // Ejemplo 3: Crear un reporte NORMAL
        System.out.println("3. Creando reporte NORMAL:");
        DiagnosticReport normalReport = DiagnosticReportFactory.createReport(
            "Variación de Refracción Normal",
            0.65,
            ReportSeverity.NORMAL,
            sessionId
        );
        printReportDetails(normalReport);
        System.out.println();

        // Ejemplo 4: Factory automático basado en confianza
        System.out.println("4. Factory automático (basa severidad en confianza):");
        DiagnosticReport autoReport = DiagnosticReportFactory.createReportFromConfidence(
            "Posible Glaucoma",
            0.88,
            sessionId
        );
        printReportDetails(autoReport);
        System.out.println();

        // Comparar prioridades
        System.out.println("=== COMPARACIÓN DE PRIORIDADES ===");
        System.out.println("Urgente - Prioridad: " + urgentReport.getPriority());
        System.out.println("Seguimiento - Prioridad: " + followUpReport.getPriority());
        System.out.println("Normal - Prioridad: " + normalReport.getPriority());
    }

    private static void printReportDetails(DiagnosticReport report) {
        System.out.println("  ID Reporte: " + report.getReportId());
        System.out.println("  Tipo: " + report.getReportType());
        System.out.println("  Severidad: " + report.getSeverity());
        System.out.println("  Hallazgo: " + report.getDetection());
        System.out.println("  Confianza: " + String.format("%.1f%%", report.getConfidenceScore() * 100));
        System.out.println("  Resumen: " + report.generateSummary());
        System.out.println("  Recomendaciones:");
        for (String rec : report.getRecommendations()) {
            System.out.println("    - " + rec);
        }
    }
}
