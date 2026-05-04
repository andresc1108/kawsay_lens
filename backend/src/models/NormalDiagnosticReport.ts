import { DiagnosticReport, ReportType } from './DiagnosticReport';

export class NormalDiagnosticReport extends DiagnosticReport {
  getType(): ReportType { return 'NORMAL'; }

  getPriority(): number { return 3; }

  getRecommendations(): string[] {
    return [
      'Mantener revisiones periódicas anuales',
      'Buena iluminación al trabajar con pantallas',
      'Hidratación adecuada para la salud ocular',
      `Resultado dentro de parámetros normales (${(this.confidence * 100).toFixed(1)}% confianza)`,
    ];
  }

  getSummary(): string {
    return `[NORMAL] ${this.finding}. Parámetros dentro del rango esperado. Mantener hábitos saludables.`;
  }
}
