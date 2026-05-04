// 📚 EJEMPLOS DE USO - ESTRUCTURAS DE DATOS
// Este archivo muestra cómo usar cada estructura en Kawsay-Lens

import {
  FrameQueue,
  DiagnosticStack,
  DoublyLinkedList,
  CircularDoublyLinkedList,
} from './dataStructures';
import type { FrameData, DiagnosticResult, VisionFilter } from '@/types';

// ============================================
// 1. QUEUE (Cola) - FrameQueue
// ============================================

export function exampleQueue() {
  console.log('=== QUEUE EXAMPLE ===');

  const frameQueue = new FrameQueue(100); // Máximo 100 frames

  // Simular captura de frames de cámara
  for (let i = 0; i < 5; i++) {
    const frame: FrameData = {
      imageData: new ImageData(1280, 720), // Simulated
      timestamp: Date.now() + i * 100,
      frameNumber: i,
    };

    frameQueue.enqueue(frame); // Agregar al final (O(1))
    console.log(`✅ Frame ${i} encolado. Queue size: ${frameQueue.size()}`);
  }

  // Procesar frames
  while (!frameQueue.isEmpty()) {
    const frame = frameQueue.dequeue(); // Remover del inicio (O(1))
    console.log(`🎬 Procesando Frame #${frame?.frameNumber}`);
  }

  console.log(`📊 Queue final vacía: ${frameQueue.isEmpty()}\n`);
}

// ============================================
// 2. STACK (Pila) - DiagnosticStack
// ============================================

export function exampleStack() {
  console.log('=== STACK EXAMPLE ===');

  const diagnosticStack = new DiagnosticStack();

  // Diagnósticos detectados en orden
  const diagnoses: DiagnosticResult[] = [
    {
      id: 'DIAG-001',
      timestamp: Date.now(),
      confidenceScore: 0.85,
      detection: 'Miopía',
      severity: 'SEGUIMIENTO' as const,
      recommendations: ['Consultar optómetra'],
    },
    {
      id: 'DIAG-002',
      timestamp: Date.now() + 1000,
      confidenceScore: 0.92,
      detection: 'Catarata',
      severity: 'URGENTE' as const,
      recommendations: ['Consultar oftalmólogo inmediatamente'],
    },
    {
      id: 'DIAG-003',
      timestamp: Date.now() + 2000,
      confidenceScore: 0.65,
      detection: 'Variación normal',
      severity: 'NORMAL' as const,
      recommendations: ['Seguimiento periódico'],
    },
  ];

  // Push diagnósticos
  diagnoses.forEach((diag) => {
    diagnosticStack.push(diag);
    console.log(`🏥 Diagnóstico detectado: ${diag.detection} (${diag.severity})`);
  });

  // Ver último sin remover
  const last = diagnosticStack.peek();
  console.log(`\n👀 Último diagnóstico (peek): ${last?.detection}\n`);

  // Usuario hace "undo" - elimina último diagnóstico
  const removed = diagnosticStack.pop();
  console.log(`↶ Deshacer: Se eliminó "${removed?.detection}"`);

  // Obtener todos los diagnósticos restantes
  const remaining = diagnosticStack.getAll();
  console.log(`\n📋 Diagnósticos en stack: ${remaining.length}`);
  remaining.forEach((d) => console.log(`  - ${d.detection}`));

  console.log(`📊 Stack size: ${diagnosticStack.size()}\n`);
}

// ============================================
// 3. DOUBLY LINKED LIST - Historial Completo
// ============================================

export function exampleDoublyLinkedList() {
  console.log('=== DOUBLY LINKED LIST EXAMPLE ===');

  const sessionHistory = new DoublyLinkedList<DiagnosticResult>();

  // Agregar diagnósticos al historial
  const findings = [
    {
      id: 'DIAG-001',
      timestamp: 1000,
      confidenceScore: 0.88,
      detection: 'Miopía',
      severity: 'SEGUIMIENTO' as const,
      recommendations: [],
    },
    {
      id: 'DIAG-002',
      timestamp: 2000,
      confidenceScore: 0.76,
      detection: 'Astigmatismo',
      severity: 'SEGUIMIENTO' as const,
      recommendations: [],
    },
    {
      id: 'DIAG-003',
      timestamp: 3000,
      confidenceScore: 0.92,
      detection: 'Catarata',
      severity: 'URGENTE' as const,
      recommendations: [],
    },
  ];

  findings.forEach((finding) => {
    sessionHistory.append(finding);
  });

  console.log(`✅ Se agregaron ${sessionHistory.size()} diagnósticos\n`);

  // Obtener todos (forward)
  console.log('📖 Historial (orden cronológico):');
  const forward = sessionHistory.getAll();
  forward.forEach((f, i) => console.log(`  ${i + 1}. ${f.detection} (${f.severity})`));

  // Obtener en reversa
  console.log('\n📖 Historial (inverso):');
  const reverse = sessionHistory.getAllReverse();
  reverse.forEach((f, i) => console.log(`  ${i + 1}. ${f.detection} (${f.severity})`));

  // Insertar en posición
  const newDiagnosis: DiagnosticResult = {
    id: 'DIAG-004',
    timestamp: 2500,
    confidenceScore: 0.81,
    detection: 'Presbicia',
    severity: 'NORMAL',
    recommendations: [],
  };

  sessionHistory.insertAt(newDiagnosis, 2); // Insertar entre posición 2
  console.log(`\n✨ Se insertó nuevo diagnóstico en posición 2`);

  // Ver resultado final
  console.log('\n📖 Historial final:');
  sessionHistory.getAll().forEach((f, i) => console.log(`  ${i + 1}. ${f.detection}`));

  console.log(`\n📊 Tamaño final: ${sessionHistory.size()}\n`);
}

// ============================================
// 4. CIRCULAR DOUBLY LINKED LIST - Filtros
// ============================================

export function exampleCircularDoublyLinkedList() {
  console.log('=== CIRCULAR DOUBLY LINKED LIST EXAMPLE ===');

  const filterList = new CircularDoublyLinkedList<VisionFilter>();

  // Definir filtros
  const filters: VisionFilter[] = [
    { name: 'NORMAL',         description: 'Visión Normal',    cssFilter: 'none',             icon: '◉' },
    { name: 'ESCALA_GRISES',  description: 'Escala de Grises', cssFilter: 'grayscale(100%)',   icon: '◐' },
    { name: 'CONTRASTE_ALTO', description: 'Contraste Alto',   cssFilter: 'contrast(160%)',   icon: '◑' },
  ];

  // Agregar filtros
  filters.forEach((filter) => {
    filterList.append(filter);
  });

  console.log(`✅ Se agregaron ${filterList.size()} filtros\n`);

  // Obtener filtro actual
  let current = filterList.getCurrent();
  console.log(`🔵 Filtro actual: ${current?.description}`);

  // Navegar siguientes (circular)
  console.log('\n▶️ Navegando hacia adelante (circular):');
  for (let i = 0; i < 5; i++) {
    const next = filterList.getNext();
    console.log(`  ${i + 1}. ${next?.description}`);
  }

  // Navegar hacia atrás
  console.log('\n◀️ Navegando hacia atrás (circular):');
  for (let i = 0; i < 3; i++) {
    const prev = filterList.getPrev();
    console.log(`  ${i + 1}. ${prev?.description}`);
  }

  // Obtener todos
  console.log('\n📋 Todos los filtros disponibles:');
  filterList.getAll().forEach((f, i) => console.log(`  ${i + 1}. ${f.description}`));

  console.log(`\n✨ La navegación es infinita y circular!\n`);
}

// ============================================
// 5. EJEMPLO COMPLETO - Flujo de Kawsay-Lens
// ============================================

export function exampleCompleteFlow() {
  console.log('=== FLUJO COMPLETO DE KAWSAY-LENS ===\n');

  // 1. Inicializar estructuras
  const frameQueue = new FrameQueue(50);
  const diagnosticStack = new DiagnosticStack();
  const sessionHistory = new DoublyLinkedList<DiagnosticResult>();
  const filterList = new CircularDoublyLinkedList<VisionFilter>();

  console.log('🎬 FASE 1: CONFIGURACIÓN');
  console.log('├─ Queue de frames: ✅ Inicializada');
  console.log('├─ Stack de diagnósticos: ✅ Inicializada');
  console.log('├─ Historial de sesión: ✅ Inicializada');
  console.log('└─ Selector de filtros: ✅ Inicializada\n');

  // 2. Simular captura de frames
  console.log('🎬 FASE 2: CAPTURA DE FRAMES');
  for (let i = 0; i < 3; i++) {
    const frame: FrameData = {
      imageData: new ImageData(1280, 720),
      timestamp: Date.now() + i * 100,
      frameNumber: i,
    };
    frameQueue.enqueue(frame);
    console.log(`├─ Frame ${i} encolado`);
  }
  console.log(`└─ Total en cola: ${frameQueue.size()}\n`);

  // 3. Procesar frames y generar diagnósticos
  console.log('🎬 FASE 3: PROCESAMIENTO Y DIAGNÓSTICOS');
  const mockDiagnosis: DiagnosticResult = {
    id: 'DIAG-001',
    timestamp: Date.now(),
    confidenceScore: 0.88,
    detection: 'Miopía Progresiva',
    severity: 'SEGUIMIENTO',
    recommendations: ['Consultar optómetra', 'Realizar prueba visual'],
  };

  diagnosticStack.push(mockDiagnosis);
  sessionHistory.append(mockDiagnosis);
  console.log('├─ Diagnóstico detectado: Miopía Progresiva');
  console.log('├─ Guardado en Stack: ✅');
  console.log('└─ Guardado en Historial: ✅\n');

  // 4. Navegar filtros
  console.log('🎬 FASE 4: NAVEGACIÓN DE FILTROS');
  const filter1 = filterList.getCurrent();
  console.log(`├─ Filtro actual: ${filter1?.description}`);
  const filter2 = filterList.getNext();
  console.log(`├─ Filtro siguiente: ${filter2?.description}`);
  const filter3 = filterList.getNext();
  console.log(`└─ Filtro siguiente: ${filter3?.description}\n`);

  // 5. Deshacer diagnóstico
  console.log('🎬 FASE 5: DESHACER DIAGNÓSTICO');
  const removed = diagnosticStack.pop();
  console.log(`├─ Diagnóstico removido: ${removed?.detection}`);
  console.log(`├─ Stack size: ${diagnosticStack.size()}`);
  console.log(`└─ Historial size: ${sessionHistory.size()}\n`);

  // 6. Generar reporte
  console.log('🎬 FASE 6: GENERAR REPORTE');
  const allHistory = sessionHistory.getAll();
  console.log(`├─ Diagnósticos en sesión: ${allHistory.length}`);
  console.log(`├─ Timestamp sesión: ${new Date().toLocaleString()}`);
  console.log(`└─ Estado: ✅ Listo para descargar PDF\n`);

  console.log('✅ FLUJO COMPLETADO\n');
}

// ============================================
// EJECUTAR EJEMPLOS
// ============================================

if (typeof window !== 'undefined' && (window as any).location.pathname === '/examples') {
  console.log('🚀 EJECUTANDO EJEMPLOS DE ESTRUCTURAS DE DATOS\n');
  exampleQueue();
  exampleStack();
  exampleDoublyLinkedList();
  exampleCircularDoublyLinkedList();
  exampleCompleteFlow();
  console.log('✅ TODOS LOS EJEMPLOS COMPLETADOS');
}
