'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { EyeScanner } from '@/components/EyeScanner';
import { downloadReport } from '@/lib/reportGenerator';
import { DiagnosticStack, DoublyLinkedList } from '@/lib/dataStructures';
import type { DiagnosticResult, EyeMetrics } from '@/types';

// ── Severity config ───────────────────────────────────────────────────────────
const SEV = {
  URGENTE:     { badge: 'badge-urgente',     dot: '#f87171', label: 'Urgente'     },
  SEGUIMIENTO: { badge: 'badge-seguimiento', dot: '#fbbf24', label: 'Seguimiento' },
  NORMAL:      { badge: 'badge-normal',      dot: '#4ade80', label: 'Normal'      },
} as const;

// ── EAR bar component ─────────────────────────────────────────────────────────
function EarBar({ value, color }: { value: number; color: string }) {
  const pct = Math.min(Math.max(value / 0.4, 0), 1) * 100;
  return (
    <div className="metric-bar-track">
      <div className="metric-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, unit, color, children }: {
  label: string; value: string; unit?: string; color: string; children?: React.ReactNode;
}) {
  return (
    <div className="card p-4 flex flex-col gap-2">
      <span className="text-[10px] text-muted uppercase tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={`num font-bold text-2xl ${color}`}>{value}</span>
        {unit && <span className="text-xs text-muted">{unit}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [diagnostics,   setDiagnostics]   = useState<DiagnosticResult[]>([]);
  const [metrics,       setMetrics]       = useState<EyeMetrics | null>(null);
  const [downloading,   setDownloading]   = useState(false);
  const [sessionId]                       = useState(`KL-${Date.now().toString(36).toUpperCase()}`);

  const pageStack   = useRef(new DiagnosticStack());
  const pageHistory = useRef(new DoublyLinkedList<DiagnosticResult>());

  const onResult = (r: DiagnosticResult) => {
    setDiagnostics((p) => [r, ...p]);
    pageStack.current.push(r);
    pageHistory.current.append(r);
  };

  const onMetrics = (m: EyeMetrics) => setMetrics(m);

  const download = async () => {
    setDownloading(true);
    try { await downloadReport(diagnostics, sessionId); }
    catch { alert('No se pudo generar el reporte.'); }
    finally { setDownloading(false); }
  };

  const m = metrics;
  const face = m?.faceDetected ?? false;
  const fmt  = (n?: number) => (n !== undefined && face ? n.toFixed(3) : '—');
  const bpm  = face ? `${m!.blinkRate.toFixed(0)}` : '—';
  const sym  = face ? `${(m!.symmetryScore * 100).toFixed(0)}` : '—';
  const symColor = !face ? 'text-muted'
    : m!.symmetryScore > 0.85 ? 'text-emerald'
    : m!.symmetryScore > 0.6  ? 'text-amber'
    : 'text-rose';

  return (
    <div className="min-h-screen flex flex-col">

      {/* ═══ HEADER ══════════════════════════════════════════════════════════ */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-30 flex items-center justify-between px-6 py-3
          border-b border-white/[0.05] bg-[#080811]/90 backdrop-blur-md"
      >
        {/* Logo + title */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex-shrink-0">
            <Image src="/logo.png" alt="Logo" fill style={{ objectFit: 'contain' }} priority />
          </div>
          <div>
            <h1 className="text-grad font-extrabold text-base tracking-tight leading-none">
              KAWSAY-LENS
            </h1>
            <p className="text-[10px] text-muted tracking-widest mt-0.5">
              IA PARA LA SALUD OCULAR
            </p>
          </div>
        </div>

        {/* Pills */}
        <div className="hidden sm:flex items-center gap-2">
          {['MediaPipe', 'TypeScript', 'Next.js'].map((t) => (
            <span key={t} className="px-2.5 py-1 text-[10px] text-subtle border border-white/[0.06]
              rounded-full bg-white/[0.03] tracking-wider">
              {t}
            </span>
          ))}
        </div>

        {/* Live status */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs
          transition-all duration-500 ${face
            ? 'border-emerald/25 bg-emerald/5 text-emerald'
            : 'border-white/[0.06] bg-white/[0.02] text-muted'}`}>
          <div className={`status-dot ${face ? 'bg-emerald' : 'bg-muted'}`} />
          {face ? 'Analizando' : 'En espera'}
        </div>
      </motion.header>

      {/* ═══ CONTENT ═════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row">

        {/* ── Left ─────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="flex-1 p-5 lg:p-7 flex flex-col gap-5"
        >
          <EyeScanner onDiagnosticResult={onResult} onMetricsUpdate={onMetrics} />
        </motion.div>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full lg:w-[340px] xl:w-[380px] flex flex-col gap-5 p-5 lg:p-7
            lg:border-l border-white/[0.05] overflow-y-auto lg:max-h-screen"
        >

          {/* ── Metrics ──────────────────────────────────────────────────── */}
          <section>
            <SectionTitle accent="#8b5cf6">Métricas Oculares</SectionTitle>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <StatCard label="EAR Izquierdo" value={fmt(m?.leftEAR)} color="text-cyan">
                {face && <EarBar value={m!.leftEAR} color="#22d3ee" />}
              </StatCard>
              <StatCard label="EAR Derecho" value={fmt(m?.rightEAR)} color="text-cyan">
                {face && <EarBar value={m!.rightEAR} color="#22d3ee" />}
              </StatCard>
              <StatCard label="Parpadeo" value={bpm} unit="/min" color="text-violet">
                {face && <EarBar value={Math.min(m!.blinkRate / 30, 1) * 0.4} color="#8b5cf6" />}
              </StatCard>
              <StatCard label="Simetría" value={sym} unit="%" color={symColor}>
                {face && <EarBar value={m!.symmetryScore * 0.4} color={
                  m!.symmetryScore > 0.85 ? '#4ade80' : m!.symmetryScore > 0.6 ? '#fbbf24' : '#f87171'
                } />}
              </StatCard>
            </div>

            {face && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="mt-2 card p-2.5 flex gap-4 text-[10px] text-muted"
              >
                <span><span className="text-emerald">▪</span> &gt;0.25 normal</span>
                <span><span className="text-amber">▪</span> 0.15–0.25 fatiga</span>
                <span><span className="text-rose">▪</span> &lt;0.15 ptosis</span>
              </motion.div>
            )}
          </section>

          <div className="border-t border-white/[0.05]" />

          {/* ── Detections ───────────────────────────────────────────────── */}
          <section className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between">
              <SectionTitle accent="#22d3ee">Detecciones</SectionTitle>
              <span className="text-[10px] text-muted num">{diagnostics.length} registros</span>
            </div>

            <div className="mt-3 flex-1 overflow-y-auto flex flex-col gap-2 pr-0.5">
              {diagnostics.length === 0 ? (
                <EmptyState />
              ) : (
                <AnimatePresence>
                  {diagnostics.map((d) => {
                    const s = SEV[d.severity];
                    return (
                      <motion.div
                        key={d.id}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        className="card card-hover p-3 group cursor-default"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-medium leading-snug">{d.detection}</p>
                          <span className={`badge ${s.badge} flex-shrink-0`}>{s.label}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted">
                          <span className="num">{(d.confidenceScore * 100).toFixed(1)}%</span>
                          <span className="text-white/10">·</span>
                          <span>{new Date(d.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        {d.leftEAR !== undefined && (
                          <div className="mt-2 pt-2 border-t border-white/[0.04] grid grid-cols-3 gap-1
                            text-[10px] text-muted num opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>L {d.leftEAR.toFixed(3)}</span>
                            <span>R {d.rightEAR?.toFixed(3)}</span>
                            <span>{d.blinkRate?.toFixed(0)}/min</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </section>

          <div className="border-t border-white/[0.05]" />

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <section className="flex flex-col gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={download}
              disabled={diagnostics.length === 0 || downloading}
              className="w-full py-3 rounded-xl text-sm font-semibold tracking-wide
                bg-grad-brand text-white shadow-glow-sm
                hover:shadow-glow-v transition-shadow
                disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {downloading ? 'Generando reporte…' : '↓  Descargar Reporte PDF'}
            </motion.button>

            {diagnostics.length > 0 && (
              <button
                onClick={() => setDiagnostics([])}
                className="w-full py-2 rounded-xl text-xs text-muted hover:text-subtle
                  border border-white/[0.05] hover:border-white/10 transition-colors"
              >
                Limpiar historial
              </button>
            )}

            <p className="text-[10px] text-muted text-center leading-relaxed pt-1">
              <span className="text-amber">⚠</span> Herramienta académica. No reemplaza diagnóstico médico profesional.
            </p>
          </section>

          {/* Session ID */}
          <p className="text-[9px] text-muted/50 text-center font-mono tracking-widest">
            {sessionId}
          </p>
        </motion.aside>
      </div>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="border-t border-white/[0.04] py-3 px-6 text-center
        text-[10px] text-muted/60 tracking-wider">
        KAWSAY-LENS © 2026 · ESTRUCTURAS DE DATOS · UNIVERSIDAD CATÓLICA DE COLOMBIA
      </footer>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────
function SectionTitle({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-0.5 h-4 rounded-full" style={{ background: accent }} />
      <h2 className="text-[11px] font-semibold text-subtle uppercase tracking-widest">{children}</h2>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <div className="w-12 h-12 rounded-full border border-white/[0.06] flex items-center justify-center">
        <span className="text-xl opacity-20">◎</span>
      </div>
      <p className="text-sm text-muted">Sin detecciones aún</p>
      <p className="text-xs text-muted/60">Inicia el escaneo y mira la cámara</p>
    </div>
  );
}
