import { DiagnosticReport, ReportType } from './DiagnosticReport';

export class FollowUpDiagnosticReport extends DiagnosticReport {
  getType(): ReportType { return 'FOLLOW_UP'; }

  getPriority(): number { return 2; }

  getRecommendations(): string[] {
    return [
      'Programar cita de seguimiento con oftalmólogo',
      'Monitorear síntomas durante los próximos días',
      'Aplicar la regla 20-20-20 para descanso visual',
      `Análisis generado con ${(this.confidence * 100).toFixed(1)}% de confianza`,
    ];
  }

  getSummary(): string {
    return `[SEGUIMIENTO] ${this.finding} detectado. Se recomienda consulta de seguimiento con especialista.`;
  }
}
