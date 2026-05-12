'use client';

import React from 'react';
import type { DiagnosticResult } from '@/types';
import {
  ActivityIcon, ShieldIcon, InfoIcon, CheckIcon,
  AlertIcon, RefreshIcon, DownloadIcon,
} from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';

interface DiagnosisResultProps {
  result: DiagnosticResult;
  onRepeat: () => void;
  onExport: () => void;
}

const SEVERITY_CONFIG = {
  URGENTE:     { label: 'Urgente',     cls: 'badge-urgente',     icon: AlertIcon,  border: 'border-rose/30',   glow: 'rgba(248,113,113,0.12)' },
  SEGUIMIENTO: { label: 'Seguimiento', cls: 'badge-seguimiento', icon: InfoIcon,   border: 'border-amber/30',  glow: 'rgba(251,191,36,0.08)'  },
  NORMAL:      { label: 'Normal',      cls: 'badge-normal',      icon: CheckIcon,  border: 'border-emerald/30',glow: 'rgba(74,222,128,0.08)'  },
};

function MetricRow({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-rim last:border-0">
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs font-semibold num ${color}`}>{value}</span>
    </div>
  );
}

export function DiagnosisResult({ result, onRepeat, onExport }: DiagnosisResultProps) {
  const cfg = SEVERITY_CONFIG[result.severity];
  const SeverityIcon = cfg.icon;
  const confidence   = Math.round(result.confidenceScore * 100);

  const time = new Date(result.timestamp).toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      className="w-full max-w-lg mx-auto rounded-2xl border p-6 flex flex-col gap-5 animate-fade-up"
      style={{
        background:   `radial-gradient(ellipse at top, ${cfg.glow} 0%, transparent 60%), rgba(13,13,28,0.85)`,
        borderColor:  cfg.border.replace('border-', '').replace('/30', ''),
        borderWidth:  1,
        borderStyle:  'solid',
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface border border-rim">
            <SeverityIcon size={18} className={
              result.severity === 'URGENTE' ? 'text-rose' :
              result.severity === 'SEGUIMIENTO' ? 'text-amber' : 'text-emerald'
            } />
          </div>
          <div>
            <h2 className="font-bold text-white text-base leading-tight">{result.detection}</h2>
            <p className="text-[11px] text-muted mt-0.5">Análisis completado · {time}</p>
          </div>
        </div>
        <span className={`badge ${cfg.cls} flex-shrink-0 mt-1`}>{cfg.label}</span>
      </div>

      {/* Confidence */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] text-muted mb-1.5">
            <span className="uppercase tracking-widest">Confianza del análisis</span>
            <span className="num text-subtle">{confidence}%</span>
          </div>
          <div className="metric-bar-track">
            <div
              className="metric-bar-fill bg-grad-brand"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>
      </div>

      {/* Eye metrics */}
      {(result.leftEAR !== undefined || result.blinkRate !== undefined) && (
        <div className="rounded-xl bg-surface/60 border border-rim p-4">
          <div className="flex items-center gap-2 mb-3">
            <ActivityIcon size={13} className="text-violet" />
            <span className="text-[10px] uppercase tracking-widest text-muted">Métricas oculares</span>
          </div>
          <div className="flex flex-col">
            {result.leftEAR  !== undefined && (
              <MetricRow label="EAR ojo izquierdo" value={result.leftEAR.toFixed(3)} color="text-cyan" />
            )}
            {result.rightEAR !== undefined && (
              <MetricRow label="EAR ojo derecho"   value={result.rightEAR.toFixed(3)} color="text-cyan" />
            )}
            {result.blinkRate !== undefined && (
              <MetricRow label="Parpadeos / min" value={`${Math.round(result.blinkRate)}`} color="text-amber" />
            )}
            {result.symmetryScore !== undefined && (
              <MetricRow
                label="Simetría ocular"
                value={`${Math.round(result.symmetryScore * 100)}%`}
                color={result.symmetryScore > 0.8 ? 'text-emerald' : 'text-amber'}
              />
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldIcon size={13} className="text-cyan" />
          <span className="text-[10px] uppercase tracking-widest text-muted">Recomendaciones</span>
        </div>
        <ul className="flex flex-col gap-2">
          {result.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-subtle">
              <div className="w-1 h-1 rounded-full bg-violet mt-2 flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Disclaimer */}
      <div className="p-3 rounded-xl bg-amber/5 border border-amber/15 text-[11px] text-muted leading-relaxed">
        <span className="text-amber font-semibold">Aviso: </span>
        Este análisis es una herramienta educativa. No sustituye la evaluación de un profesional
        en oftalmología.
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-1">
        <Button
          variant="secondary"
          icon={<RefreshIcon size={13} />}
          fullWidth
          onClick={onRepeat}
        >
          Nuevo análisis
        </Button>
        <Button
          icon={<DownloadIcon size={13} />}
          fullWidth
          onClick={onExport}
        >
          Exportar PDF
        </Button>
      </div>
    </div>
  );
}
