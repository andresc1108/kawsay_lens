# 📊 DOCUMENTACIÓN DE ESTRUCTURAS DE DATOS - KAWSAY-LENS

## Resumen Ejecutivo

Kawsay-Lens implementa 4 estructuras de datos fundamentales en Ciencias de la Computación, cada una con un propósito específico en el dominio de análisis visual.

## 1. Queue (Cola) - FrameQueue

### Concepto
Estructura de datos **FIFO** (First In, First Out) donde el primer elemento insertado es el primero en ser removido.

### Implementación
```typescript
export class FrameQueue {
  private queue: FrameData[] = [];
  private maxSize: number;

  enqueue(frame: FrameData): void { }    // Agregar
  dequeue(): FrameData | undefined { }   // Remover y retornar
  peek(): FrameData | undefined { }      // Ver sin remover
  isEmpty(): boolean { }                  // Verificar si está vacía
  size(): number { }                      // Obtener tamaño
}
```

### Caso de Uso en Kawsay-Lens
```
┌─────────────────────────────────────────┐
│  CÁMARA (frames constantemente)         │
└────────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────┐
    │   FrameQueue    │
    │  (max 100)      │
    │  [f1][f2][f3]   │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────┐
    │   IA Processing │
    │  (async)        │
    └─────────────────┘
```

**Razón**: Evita bloqueo del hilo principal. Si la cámara captura frames más rápido de lo que se procesan, la cola los almacena temporalmente.

### Métodos Clave
- `enqueue()`: O(1) - Agregar frame al final
- `dequeue()`: O(1) - Extraer frame del inicio
- `peek()`: O(1) - Inspeccionar primer elemento
- Límite automático: Si alcanza `maxSize`, elimina el frame más antiguo

---

## 2. Stack (Pila) - DiagnosticStack

### Concepto
Estructura de datos **LIFO** (Last In, First Out) donde el último elemento insertado es el primero en ser removido.

### Implementación
```typescript
export class DiagnosticStack {
  private stack: DiagnosticResult[] = [];

  push(diagnosis: DiagnosticResult): void { }     // Agregar
  pop(): DiagnosticResult | undefined { }         // Remover y retornar
  peek(): DiagnosticResult | undefined { }        // Ver sin remover
  isEmpty(): boolean { }                          // Verificar si está vacía
  getAll(): DiagnosticResult[] { }                // Obtener todos
}
```

### Caso de Uso en Kawsay-Lens
```
SECUENCIA DE DIAGNÓSTICOS:
┌──────────────────────────────────────┐
│  Diagnóstico 1: Miopía    [PUSH]    │
│  Diagnóstico 2: Astigmatismo [PUSH] │
│  Diagnóstico 3: Cataracia   [PUSH]  │
│                                      │
│  Botón "↶ Deshacer"      [POP]       │
│  Elimina: Diagnóstico 3              │
│                                      │
│  Resultado final:                    │
│  [Miopía, Astigmatismo]              │
└──────────────────────────────────────┘
```

**Razón**: Permite deshacer operaciones. El usuario puede eliminar el último diagnóstico si fue un falso positivo.

### Métodos Clave
- `push()`: O(1) - Agregar diagnóstico
- `pop()`: O(1) - Remover último diagnóstico
- `peek()`: O(1) - Ver último sin remover
- Perfecto para "undo" en aplicaciones

---

## 3. Lista Doble (Doubly Linked List) - DoublyLinkedList

### Concepto
Lista enlazada donde cada nodo tiene referencias tanto al siguiente como al anterior, permitiendo navegación en ambas direcciones.

### Estructura del Nodo
```typescript
class DoublyLinkedNode<T> {
  data: T;
  next: DoublyLinkedNode<T> | null = null;
  prev: DoublyLinkedNode<T> | null = null;
}
```

### Representación Visual
```
┌────────┐      ┌────────┐      ┌────────┐
│ Diag 1 │─────►│ Diag 2 │─────►│ Diag 3 │
│        │◄─────│        │◄─────│        │
└────────┘      └────────┘      └────────┘
  ▲                                    ▲
  │                                    │
 HEAD                                 TAIL
```

### Implementación
```typescript
export class DoublyLinkedList<T> {
  private head: DoublyLinkedNode<T> | null = null;
  private tail: DoublyLinkedNode<T> | null = null;

  append(data: T): void { }                    // Agregar al final
  prepend(data: T): void { }                   // Agregar al inicio
  insertAt(data: T, index: number): boolean { }  // Insertar en posición
  removeAt(index: number): T | null { }        // Remover en posición
  getAll(): T[] { }                            // Obtener todos
  getAllReverse(): T[] { }                     // Obtener en reversa
}
```

### Caso de Uso en Kawsay-Lens
```
HISTORIAL COMPLETO DE SESIÓN:
┌─────────────────────────────────────────┐
│  Sesión ID: SESSION-2026-04-28-12345    │
│                                         │
│  10:30:15 - Miopía (89%)                │
│  10:30:32 - Astigmatismo (76%)          │
│  10:30:48 - Cataracia (92%)             │
│  10:31:04 - Refractivoidad Normal (65%)│
│                                         │
│  Navegación Bidireccional:              │
│  ← Diag Anterior  |  Siguiente Diag →  │
└─────────────────────────────────────────┘
```

**Razón**: Permite generar reportes con acceso rápido al historial completo. Necesita navegación en ambas direcciones para presentación flexible.

### Complejidad
- `append()`: O(1) - Agregar al final (mantiene tail)
- `getAll()`: O(n) - Obtener todos
- `getAllReverse()`: O(n) - Recorrer al revés
- `insertAt()`: O(n) - Navegar hasta posición

---

## 4. Lista Circular Doble (Circular Doubly Linked List) - CircularDoublyLinkedList

### Concepto
Lista doble donde el último nodo apunta al primero y el primer nodo apunta al último, creando una estructura cíclica infinita.

### Estructura Visual
```
        ┌────────┐
        │ Filtro │
        │ Normal │
    ┌───┤        ├───┐
    │   └────────┘   │
    │                │
    ▼                ▲
┌────────┐      ┌────────┐
│ Filtro │      │ Filtro │
│Grises  │◄────►│Contraste│
└────────┘      └────────┘
    ▲                ▼
    │                │
    └───┬────────────┴───┐
        │   (circular)   │
        └────────────────┘
```

### Implementación
```typescript
export class CircularDoublyLinkedList<T> {
  private head: CircularDoublyLinkedNode<T> | null = null;
  private current: CircularDoublyLinkedNode<T> | null = null;

  append(data: T): void { }          // Agregar elemento
  getNext(): T | null { }            // Siguiente (circular)
  getPrev(): T | null { }            // Anterior (circular)
  getCurrent(): T | null { }         // Elemento actual
  getAll(): T[] { }                  // Obtener todos
}
```

### Caso de Uso en Kawsay-Lens
```
SELECTOR DE FILTROS (Navegación Infinita):

Usuario presiona "Siguiente Filtro →":
┌──────────────────────────────────────┐
│  Filtro Actual: Normal               │
│     ▼ Siguiente                      │
│  Filtro Actual: Escala de Grises     │
│     ▼ Siguiente                      │
│  Filtro Actual: Contraste Alto       │
│     ▼ Siguiente                      │
│  Filtro Actual: Normal (circular!)   │
│     ▼ Siguiente                      │
│  ... (repite infinitamente)          │
└──────────────────────────────────────┘

Usuario presiona "Filtro Anterior ←":
Normal ◄─ Escala Grises ◄─ Contraste Alto ◄─ Normal
```

**Razón**: El usuario debe poder navegar filtros infinitamente mientras el escaneo está activo, sin preocuparse por llegar al final de la lista.

### Complejidad
- `append()`: O(1) - Agregar elemento
- `getNext()`: O(1) - Mover al siguiente
- `getPrev()`: O(1) - Mover al anterior
- Navegación infinita garantizada

---

## Comparativa de Estructuras

| Estructura | Tipo | Insert | Delete | Search | Caso Uso |
|-----------|------|--------|--------|--------|----------|
| Queue | FIFO | O(1) | O(1) | O(n) | Frames de cámara |
| Stack | LIFO | O(1) | O(1) | O(n) | Undo/Redo |
| DoublyLinkedList | Bidireccional | O(n) | O(n) | O(n) | Historial completo |
| CircularDoubleLinkedList | Cíclica | O(1) | O(1) | O(n) | Navegación infinita |

---

## Análisis de Complejidad

### EyeScanner - Flujo Completo
```
1. Captura Frame (cámara)
   └─ enqueue() a FrameQueue: O(1)

2. Procesa Frame
   └─ dequeue() de FrameQueue: O(1)
   └─ Aplica filtro: O(w*h) donde w=ancho, h=alto

3. Genera Diagnóstico
   └─ push() a DiagnosticStack: O(1)
   └─ append() a DoublyLinkedList: O(1)

4. Cambia Filtro
   └─ getNext() de CircularDoubleLinkedList: O(1)

5. Genera Reporte
   └─ getAll() de DoublyLinkedList: O(n) donde n=diagnósticos
```

**Total por frame**: O(1) + O(w*h) + O(1) + O(1) + O(1) = **O(w*h)**

---

## Requisitos Académicos Cumplidos

✅ **Queue (Cola)**: Gestión asíncrona de frames
✅ **Stack (Pila)**: Historial con undo
✅ **Lista Doble**: Historial bidireccional
✅ **Lista Circular Doble**: Navegación infinita
✅ Implementación en **TypeScript** (frontend)
✅ Implementación en **Java** (backend - Factory)
✅ Casos de uso **reales** en la aplicación

---

## Referencias Teóricas

- **CLRS** (Introduction to Algorithms) - Capítulos 10-13
- **Data Structures** - Narasimha Kamangar
- **Big O Notation**: https://en.wikipedia.org/wiki/Big_O_notation

---

**Documento elaborado**: Abril 2026
**Última revisión**: Abril 28, 2026
