'use client';

import React, { useState } from 'react';
import { ScanWizard } from '@/components/scanner/ScanWizard';
import { SessionHistory } from '@/components/dashboard/SessionHistory';
import type { DiagnosticResult } from '@/types';

export default function DashboardPage() {
  const [sessionResults, setSessionResults] = useState<DiagnosticResult[]>([]);

  const handleResult = (result: DiagnosticResult) => {
    setSessionResults((prev) => [...prev, result]);
  };

  const handleClearHistory = () => {
    setSessionResults([]);
  };

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">

        {/* Page title */}
        <div className="text-center">
          <h1 className="text-grad font-extrabold text-2xl tracking-tight">
            Análisis Ocular
          </h1>
          <p className="text-sm text-muted mt-1">
            Detección asistida por IA · MediaPipe Face Landmarker
          </p>
        </div>

        {/* Scan wizard */}
        <ScanWizard onResult={handleResult} />

        {/* Session history */}
        <SessionHistory results={sessionResults} onClear={handleClearHistory} />
      </div>
    </div>
  );
}
