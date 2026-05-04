import { v4 as uuidv4 } from 'uuid';
import { DiagnosticReport, ReportSeverity } from '../models/DiagnosticReport';
import { UrgentDiagnosticReport }    from '../models/UrgentDiagnosticReport';
import { FollowUpDiagnosticReport }  from '../models/FollowUpDiagnosticReport';
import { NormalDiagnosticReport }    from '../models/NormalDiagnosticReport';

// ── Factory Pattern ────────────────────────────────────────────────────────────
// Encapsulates the creation logic of the three report types.
// The client only calls createReport() and receives the correct subclass.
export class DiagnosticReportFactory {
  static createReport(
    finding:    string,
    confidence: number,
    severity:   ReportSeverity,
    sessionId:  string
  ): DiagnosticReport {
    const id = `DIAG-${uuidv4().split('-')[0].toUpperCase()}`;

    switch (severity) {
      case 'URGENTE':
        return new UrgentDiagnosticReport(id, sessionId, finding, confidence, severity);
      case 'SEGUIMIENTO':
        return new FollowUpDiagnosticReport(id, sessionId, finding, confidence, severity);
      case 'NORMAL':
      default:
        return new NormalDiagnosticReport(id, sessionId, finding, confidence, severity);
    }
  }
}
