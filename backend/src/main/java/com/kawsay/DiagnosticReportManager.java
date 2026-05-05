package com.kawsay;

import com.kawsay.factory.DiagnosticReportFactory;
import com.kawsay.model.DiagnosticReport;

/**
 * Singleton Pattern - DiagnosticReportManager
 * Gestiona una instancia única del administrador de reportes diagnósticos
 * Garantiza que solo exista una instancia en toda la aplicación
 */
public class DiagnosticReportManager {
    private static DiagnosticReportManager instance;
    private int reportCount = 0;
    private static final Object lock = new Object();

    /**
     * Constructor privado - evita instanciación directa
     */
    private DiagnosticReportManager() {
        this.reportCount = 0;
    }

    /**
     * Obtener instancia única del manager (Thread-safe)
     */
    public static DiagnosticReportManager getInstance() {
        if (instance == null) {
            synchronized (lock) {
                if (instance == null) {
                    instance = new DiagnosticReportManager();
                }
            }
        }
        return instance;
    }

    /**
     * Crear y registrar un nuevo reporte
     */
    public DiagnosticReport createAndRegisterReport(
        String detection,
        double confidenceScore,
        DiagnosticReportFactory.ReportSeverity severity,
        String sessionId
    ) {
        DiagnosticReport report = DiagnosticReportFactory.createReport(
            detection,
            confidenceScore,
            severity,
            sessionId
        );
        reportCount++;
        System.out.println("Reporte #" + reportCount + " registrado: " + report.getReportId());
        return report;
    }

    /**
     * Obtener cantidad total de reportes procesados
     */
    public int getTotalReportsProcessed() {
        return reportCount;
    }

    /**
     * Resetear el contador
     */
    public void reset() {
        reportCount = 0;
    }
}
