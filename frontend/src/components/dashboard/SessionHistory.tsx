'use client';

import React from 'react';
import type { DiagnosticResult } from '@/types';
import { ActivityIcon, TrashIcon } from '@/components/ui/Icons';

interface SessionHistoryProps {
  results: DiagnosticResult[];
  onClear: () => void;
}

export function SessionHistory({ results, onClear }: SessionHistoryProps) {
  if (results.length === 0) return null;

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ActivityIcon size={13} className="text-violet" />
          <span className="text-[10px] uppercase tracking-widest text-muted">
            Historial de sesión
          </span>
          <span className="text-[10px] bg-violet/15 border border-violet/25 text-violet
            px-1.5 py-0.5 rounded-full num">
            {results.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] text-muted hover:text-rose
            transition-colors"
        >
          <TrashIcon size={11} />
          Limpiar
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {[...results].reverse().map((r) => {
          const time = new Date(r.timestamp).toLocaleTimeString('es-CO', {
            hour: '2-digit', minute: '2-digit',
          });
          return (
            <div key={r.id}
              className="card p-3.5 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{r.detection}</p>
                <p className="text-[11px] text-muted mt-0.5 num">{time}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs num text-subtle">
                  {Math.round(r.confidenceScore * 100)}%
                </span>
                <span className={`badge ${
                  r.severity === 'URGENTE'     ? 'badge-urgente'     :
                  r.severity === 'SEGUIMIENTO' ? 'badge-seguimiento' : 'badge-normal'
                }`}>
                  {r.severity}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
