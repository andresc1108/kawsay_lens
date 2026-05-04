# 🔍 KAWSAY-LENS

**Sistema Académico de Análisis Visual en Tiempo Real con Estructuras de Datos**

## 📋 Descripción

Kawsay-Lens es una aplicación full-stack desarrollada como proyecto académico para la materia **"Estructuras de Datos"**. La aplicación integra:

- **Frontend**: Interfaz moderna con React/Next.js 14+ y captura en tiempo real de cámara web
- **Backend**: Microservicio en Java con patrones de diseño (Singleton, Factory)
- **Estructuras de Datos**: Implementación completa de Queue, Stack, Lista Doble y Lista Circular Doble
- **IA**: Procesamiento de frames con TensorFlow.js para detección preliminar de patologías oculares

> ⚠️ **DESCARGO DE RESPONSABILIDAD**: Este software es una herramienta académica de apoyo. Los resultados NO son diagnósticos médicos oficiales. Para diagnósticos reales, consulte siempre a un especialista.

## 🎯 Objetivos Académicos

✅ Implementar todas las estructuras de datos vistas en clase:
- **Queue (Cola)**: Gestión de frames capturados
- **Stack (Pila)**: Historial de diagnósticos (con undo)
- **Lista Doble**: Historial completo de sesión
- **Lista Circular Doble**: Navegación infinita de filtros

✅ Aplicar patrones de diseño:
- **Factory Pattern**: Creación de diferentes tipos de reportes
- **Singleton Pattern**: Administrador de reportes único

✅ Integrar IA con TensorFlow.js

✅ Crear interfaz visual moderna con Tailwind CSS y Framer Motion

## 🏗️ Estructura del Proyecto

```
kawsay_lens/
├── frontend/                    # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Página principal
│   │   │   ├── layout.tsx      # Layout global
│   │   │   └── globals.css     # Estilos globales
│   │   ├── components/
│   │   │   └── EyeScanner.tsx  # Componente principal
│   │   ├── lib/
│   │   │   ├── dataStructures.ts   # Queue, Stack, Lists
│   │   │   └── reportGenerator.ts  # Generación de PDF
│   │   └── types/
│   │       └── index.ts        # Tipos TypeScript
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
└── backend/                     # Java Backend
    ├── src/main/java/com/kawsay/
    │   ├── model/
    │   │   ├── DiagnosticReport.java          # Clase base
    │   │   ├── UrgentDiagnosticReport.java    # Reporte Urgente
    │   │   ├── FollowUpDiagnosticReport.java  # Reporte Seguimiento
    │   │   └── NormalDiagnosticReport.java    # Reporte Normal
    │   ├── factory/
    │   │   └── DiagnosticReportFactory.java   # Factory Pattern
    │   ├── DiagnosticReportManager.java       # Singleton Pattern
    │   └── DiagnosticReportDemo.java          # Demostración
    └── pom.xml                 # Configuración Maven
```

## 🚀 Inicio Rápido

### Frontend

```bash
cd frontend
npm install
npm run dev
# Abre http://localhost:3000
```

### Backend

```bash
cd backend
# Compilar
mvn clean compile

# Ejecutar demostración
mvn exec:java -Dexec.mainClass="com.kawsay.DiagnosticReportDemo"

# Crear JAR
mvn package
```

## 📱 Características Principales

### EyeScanner Component
- ✅ Acceso a cámara en tiempo real
- ✅ Canvas con overlay de escaneo animado
- ✅ Procesamiento asíncrono de frames (Queue)
- ✅ 3 filtros visuales navegables (Lista Circular Doble)
- ✅ Diagnósticos con undo (Stack)
- ✅ Historial completo de sesión (Lista Doble)

### Reporte PDF
- ✅ Generación profesional con jsPDF
- ✅ Listado de hallazgos
- ✅ Descargo de responsabilidad legal
- ✅ Información de sesión

### Backend Robusto
- ✅ Factory Pattern para 3 tipos de reportes
- ✅ Singleton para administrador único
- ✅ Validaciones y recomendaciones automáticas

## 📊 Estructuras de Datos Implementadas

### 1. **FrameQueue** - Queue (Cola)
```typescript
const frameQueue = new FrameQueue(100);
frameQueue.enqueue(frameData);
const frame = frameQueue.dequeue();
```

### 2. **DiagnosticStack** - Stack (Pila)
```typescript
const stack = new DiagnosticStack();
stack.push(diagnosis);
const last = stack.pop(); // Undo último diagnóstico
```

### 3. **DoublyLinkedList** - Lista Doble
```typescript
const history = new DoublyLinkedList<DiagnosticResult>();
history.append(finding);
const allFindings = history.getAll();
```

### 4. **CircularDoublyLinkedList** - Lista Circular Doble
```typescript
const filters = new CircularDoublyLinkedList<VisionFilter>();
filters.append(filterNormal);
filters.append(filterGrayscale);
const nextFilter = filters.getNext(); // Navegación infinita
```

## 🔧 Patrones de Diseño

### Factory Pattern (Java)
```java
DiagnosticReport report = DiagnosticReportFactory.createReport(
    "Cataracia",
    0.92,
    ReportSeverity.URGENTE,
    sessionId
);
```

Tipos generados:
- `UrgentDiagnosticReport` - Para hallazgos críticos
- `FollowUpDiagnosticReport` - Para seguimiento
- `NormalDiagnosticReport` - Para variaciones normales

### Singleton Pattern (Java)
```java
DiagnosticReportManager manager = DiagnosticReportManager.getInstance();
manager.createAndRegisterReport(...);
```

## 🎨 Stack Tecnológico

| Capa | Tecnologías |
|------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Estilos** | Tailwind CSS, CSS Animations |
| **IA** | TensorFlow.js (Framework listo) |
| **Backend** | Java 17, Spring Boot (Opcional), Maven |
| **Reportes** | jsPDF |
| **Cámara** | HTML5 WebRTC API |

## 📝 Requisitos Académicos Cumplidos

- ✅ **Arquitectura Completa**: Frontend + Backend + IA
- ✅ **TypeScript Exclusivo**: Código 100% tipado en el frontend
- ✅ **Estructuras de Datos**: Queue, Stack, Lists (todas implementadas)
- ✅ **Patrones de Diseño**: Factory, Singleton
- ✅ **Caso de Estudio Real**: Detección de patologías oculares
- ✅ **Presentación PDF**: Sistema de reportes completo
- ✅ **Interfaz Moderna**: UI responsive con animaciones fluidas

## 🧪 Testing

### Frontend
```bash
npm test
```

### Backend
```bash
mvn test
```

## 📄 Licencia

Uso académico exclusivamente. Proyecto educativo UCC - Semestre 2026.

## 👥 Equipo de Desarrollo

Grupo máximo de 3 estudiantes (según requisitos)

## 📅 Entrega

- **Grupo 1**: 21 de mayo de 2026
- **Grupo 2**: 28 de mayo de 2026

---

**Kawsay** (Quechua): "Salud" | **Lens**: Lente
