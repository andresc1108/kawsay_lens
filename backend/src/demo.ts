import { DiagnosticReportFactory } from './factory/DiagnosticReportFactory';
import { DiagnosticReportManager } from './services/DiagnosticReportManager';

console.log('\n═══════════════════════════════════════════');
console.log('  KAWSAY-LENS BACKEND — TypeScript Demo');
console.log('  Factory Pattern + Singleton Pattern');
console.log('═══════════════════════════════════════════\n');

const SESSION = 'SESSION-DEMO-2026';
const manager = DiagnosticReportManager.getInstance();

// ── Factory Pattern demo ───────────────────────────────────────────────────────
const cases = [
  { finding: 'Posible Ptosis Ocular',   confidence: 0.87, severity: 'URGENTE'     as const },
  { finding: 'Fatiga Ocular Detectada', confidence: 0.76, severity: 'SEGUIMIENTO' as const },
  { finding: 'Posible Ojo Seco',        confidence: 0.70, severity: 'NORMAL'      as const },
  { finding: 'Asimetría Ocular',        confidence: 0.82, severity: 'SEGUIMIENTO' as const },
];

console.log('── Factory Pattern (createReport) ──\n');
for (const c of cases) {
  const report = DiagnosticReportFactory.createReport(c.finding, c.confidence, c.severity, SESSION);
  console.log(`  Tipo   : ${report.getType()}`);
  console.log(`  ID     : ${report.id}`);
  console.log(`  Summary: ${report.getSummary()}`);
  console.log(`  Recs   : ${report.getRecommendations().slice(0, 2).join(' | ')}`);
  console.log('  ─────────────────────────────────────');
}

// ── Singleton Pattern demo ────────────────────────────────────────────────────
console.log('\n── Singleton Pattern (DiagnosticReportManager) ──\n');

for (const c of cases) {
  manager.createAndRegister(c.finding, c.confidence, c.severity, SESSION);
}

const stats = manager.getStats();
console.log(`  Total reportes   : ${stats.total}`);
console.log(`  Urgentes         : ${stats.urgent}`);
console.log(`  Seguimiento      : ${stats.followUp}`);
console.log(`  Normales         : ${stats.normal}`);
console.log(`  Instancia única  : ${DiagnosticReportManager.getInstance() === manager ? 'SÍ ✓' : 'NO ✗'}`);

console.log('\n═══════════════════════════════════════════\n');
