import express, { Request, Response } from 'express';
import cors from 'cors';
import { DiagnosticReportManager } from './services/DiagnosticReportManager';
import { ReportSeverity } from './models/DiagnosticReport';

const app  = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

const manager = DiagnosticReportManager.getInstance();

// ── Routes ────────────────────────────────────────────────────────────────────

// GET /api/health
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'kawsay-lens-backend', version: '2.0.0' });
});

// POST /api/reports  → create report (Factory + Singleton)
app.post('/api/reports', (req: Request, res: Response) => {
  const { finding, confidence, severity, sessionId } = req.body as {
    finding:    string;
    confidence: number;
    severity:   ReportSeverity;
    sessionId:  string;
  };

  if (!finding || confidence == null || !severity || !sessionId) {
    return res.status(400).json({ error: 'Faltan campos requeridos: finding, confidence, severity, sessionId' });
  }

  const validSeverities: ReportSeverity[] = ['URGENTE', 'SEGUIMIENTO', 'NORMAL'];
  if (!validSeverities.includes(severity)) {
    return res.status(400).json({ error: `Severidad inválida. Use: ${validSeverities.join(', ')}` });
  }

  const report = manager.createAndRegister(finding, confidence, severity, sessionId);
  return res.status(201).json(report.toJSON());
});

// GET /api/reports  → list all reports
app.get('/api/reports', (_req: Request, res: Response) => {
  res.json(manager.getAll());
});

// GET /api/reports/stats  → stats
app.get('/api/reports/stats', (_req: Request, res: Response) => {
  res.json(manager.getStats());
});

// GET /api/reports/session/:sessionId
app.get('/api/reports/session/:sessionId', (req: Request, res: Response) => {
  res.json(manager.getBySession(req.params.sessionId));
});

// GET /api/reports/:id
app.get('/api/reports/:id', (req: Request, res: Response) => {
  const report = manager.getById(req.params.id);
  if (!report) return res.status(404).json({ error: 'Reporte no encontrado' });
  return res.json(report.toJSON());
});

// DELETE /api/reports/:id
app.delete('/api/reports/:id', (req: Request, res: Response) => {
  const deleted = manager.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Reporte no encontrado' });
  return res.json({ message: 'Reporte eliminado correctamente' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🔵 Kawsay-Lens Backend v2.0 (TypeScript)`);
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 API disponible en http://localhost:${PORT}/api\n`);
});

export default app;
