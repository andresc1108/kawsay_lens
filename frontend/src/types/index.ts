export interface DiagnosticResult {
  id: string;
  timestamp: number;
  confidenceScore: number;
  detection: string;
  severity: 'URGENTE' | 'SEGUIMIENTO' | 'NORMAL';
  recommendations: string[];
  leftEAR?: number;
  rightEAR?: number;
  blinkRate?: number;
  symmetryScore?: number;
}

export interface SessionHistory {
  sessionId: string;
  startTime: number;
  endTime?: number;
  findings: DiagnosticResult[];
  totalFramesProcessed: number;
}

export interface VisionFilter {
  name: 'NORMAL' | 'ESCALA_GRISES' | 'CONTRASTE_ALTO';
  description: string;
  cssFilter: string;
  icon: string;
}

export interface FrameData {
  imageData: ImageData;
  timestamp: number;
  frameNumber: number;
}

export interface EyeMetrics {
  leftEAR: number;
  rightEAR: number;
  averageEAR: number;
  blinkRate: number;
  symmetryScore: number;
  faceDetected: boolean;
}
