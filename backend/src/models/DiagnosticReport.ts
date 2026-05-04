export type ReportSeverity = 'URGENTE' | 'SEGUIMIENTO' | 'NORMAL';
export type ReportType     = 'URGENT'  | 'FOLLOW_UP'   | 'NORMAL';

export interface ReportData {
  id:             string;
  sessionId:      string;
  finding:        string;
  confidence:     number;
  severity:       ReportSeverity;
  createdAt:      Date;
  recommendations: string[];
  type:           ReportType;
  priority:       number;
}

// ── Abstract base class (TypeScript equivalent of Java abstract class) ─────────
export abstract class DiagnosticReport {
  readonly id:          string;
  readonly sessionId:   string;
  readonly finding:     string;
  readonly confidence:  number;
  readonly severity:    ReportSeverity;
  readonly createdAt:   Date;

  constructor(
    id:        string,
    sessionId: string,
    finding:   string,
    confidence: number,
    severity:  ReportSeverity
  ) {
    this.id         = id;
    this.sessionId  = sessionId;
    this.finding    = finding;
    this.confidence = confidence;
    this.severity   = severity;
    this.createdAt  = new Date();
  }

  abstract getType():            ReportType;
  abstract getPriority():        number;
  abstract getRecommendations(): string[];
  abstract getSummary():         string;

  toJSON(): ReportData {
    return {
      id:              this.id,
      sessionId:       this.sessionId,
      finding:         this.finding,
      confidence:      this.confidence,
      severity:        this.severity,
      createdAt:       this.createdAt,
      recommendations: this.getRecommendations(),
      type:            this.getType(),
      priority:        this.getPriority(),
    };
  }
}
