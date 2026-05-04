import { DiagnosticReport, ReportData, ReportSeverity } from '../models/DiagnosticReport';
import { DiagnosticReportFactory } from '../factory/DiagnosticReportFactory';

// ── Singleton Pattern ──────────────────────────────────────────────────────────
// Ensures a single manager instance across the entire application.
// Thread-safety is inherent in Node.js single-threaded model.
export class DiagnosticReportManager {
  private static instance: DiagnosticReportManager | null = null;

  private reports: Map<string, DiagnosticReport> = new Map();
  private totalCreated = 0;

  // Private constructor prevents external instantiation
  private constructor() {}

  static getInstance(): DiagnosticReportManager {
    if (!DiagnosticReportManager.instance) {
      DiagnosticReportManager.instance = new DiagnosticReportManager();
    }
    return DiagnosticReportManager.instance;
  }

  createAndRegister(
    finding:    string,
    confidence: number,
    severity:   ReportSeverity,
    sessionId:  string
  ): DiagnosticReport {
    const report = DiagnosticReportFactory.createReport(finding, confidence, severity, sessionId);
    this.reports.set(report.id, report);
    this.totalCreated++;
    return report;
  }

  getById(id: string): DiagnosticReport | undefined {
    return this.reports.get(id);
  }

  getAll(): ReportData[] {
    return Array.from(this.reports.values())
      .map((r) => r.toJSON())
      .sort((a, b) => a.priority - b.priority);
  }

  getBySession(sessionId: string): ReportData[] {
    return this.getAll().filter((r) => r.sessionId === sessionId);
  }

  deleteById(id: string): boolean {
    return this.reports.delete(id);
  }

  getTotalCreated(): number {
    return this.totalCreated;
  }

  getStats() {
    const all = this.getAll();
    return {
      total:       all.length,
      urgent:      all.filter((r) => r.severity === 'URGENTE').length,
      followUp:    all.filter((r) => r.severity === 'SEGUIMIENTO').length,
      normal:      all.filter((r) => r.severity === 'NORMAL').length,
      totalCreatedAllTime: this.totalCreated,
    };
  }
}
