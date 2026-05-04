import { DiagnosticReport, ReportType } from './DiagnosticReport';

export class UrgentDiagnosticReport extends DiagnosticReport {
  getType(): ReportType { return 'URGENT'; }

  getPriority(): number { return 1; }

  getRecommendations(): string[] {
    return [
      'Consultar con un oftalmólogo lo antes posible',
      'Evitar conducir o actividades de riesgo visual',
      'Documentar síntomas para la consulta médica',
      `Confianza del análisis: ${(this.confidence * 100).toFixed(1)}%`,
    ];
  }

  getSummary(): string {
    return `[⚠ URGENTE] Posible ${this.finding} detectado con ${(this.confidence * 100).toFixed(1)}% de confianza. Se requiere atención médica prioritaria.`;
  }
}
