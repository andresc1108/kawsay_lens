# KAWSAY-LENS

**Sistema Académico de Análisis Ocular en Tiempo Real con IA**

Kawsay-Lens es una aplicación full-stack desarrollada como proyecto académico para la materia **"Estructuras de Datos"** en la Universidad Cooperativa de Colombia (2026).

> **Descargo de responsabilidad**: herramienta académica de apoyo. Los resultados NO son diagnósticos médicos oficiales. Consulta siempre a un especialista.

---

## Descripción

La aplicación captura video en tiempo real desde la cámara web, procesa el rostro con **MediaPipe Face Landmarker** y calcula métricas oculares reales (EAR, tasa de parpadeo, simetría) para detectar condiciones como ptosis, asimetría, fatiga ocular y ojo seco. Todos los resultados se pueden exportar a un reporte PDF con diseño profesional.

---

## Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Estilos | Tailwind CSS, Framer Motion, CSS personalizado |
| IA / Visión | MediaPipe Face Landmarker (`@mediapipe/tasks-vision`) |
| Autenticación | Firebase Auth |
| Reportes | jsPDF |
| Backend | Java 17 + Maven |
| Patrones | Factory Pattern, Singleton Pattern |

---

## Estructura del Proyecto

```
kawsay_lens/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── auth/
│       │   │   ├── login/           # Inicio de sesión
│       │   │   ├── register/        # Registro de cuenta
│       │   │   └── forgot-password/ # Recuperación de contraseña
│       │   └── dashboard/           # Panel principal (protegido)
│       ├── components/
│       │   ├── EyeScanner.tsx       # Motor de análisis ocular (MediaPipe)
│       │   ├── scanner/
│       │   │   ├── ScanWizard.tsx   # Flujo de 3 pasos: posición → análisis → resultado
│       │   │   └── DiagnosisResult.tsx
│       │   ├── dashboard/
│       │   │   ├── Header.tsx
│       │   │   └── SessionHistory.tsx
│       │   ├── auth/
│       │   │   └── AuthGuard.tsx    # Protección de rutas
│       │   └── ui/                  # Button, Input, Icons
│       ├── lib/
│       │   ├── dataStructures.ts    # Queue, Stack, Lista Doble, Lista Circular Doble
│       │   ├── reportGenerator.ts   # Reporte PDF (diseño oscuro)
│       │   └── firebase.ts          # Configuración Firebase
│       ├── contexts/
│       │   └── AuthContext.tsx
│       ├── hooks/
│       │   └── useAuth.ts
│       └── types/
│           └── index.ts
│
└── backend/
    └── src/main/java/com/kawsay/
        ├── model/                   # DiagnosticReport (abstracta) + 3 subclases
        ├── factory/                 # DiagnosticReportFactory
        ├── DiagnosticReportManager.java  # Singleton
        └── DiagnosticReportDemo.java
```

---

## Inicio Rápido

### Requisitos previos

- Node.js 18+
- Java 17+ y Maven 3.8+
- Cuenta en [Firebase](https://firebase.google.com/) con Authentication habilitado

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # Completa con tus claves de Firebase
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). El sitio redirige a `/auth/login` si no hay sesión activa.

### Backend (demostración de patrones)

```bash
cd backend
mvn clean compile
mvn exec:java -Dexec.mainClass="com.kawsay.DiagnosticReportDemo"
```

---

## Flujo de Uso

1. Regístrate o inicia sesión con tu cuenta Firebase
2. En el dashboard, haz clic en **"Iniciar análisis"**
3. **Paso 1 – Posición**: centra tu rostro en el encuadre hasta que aparezca "Rostro detectado"
4. **Paso 2 – Análisis**: el sistema captura métricas durante **8 segundos**
5. **Paso 3 – Resultado**: revisa el diagnóstico y descarga el reporte PDF
6. El historial de sesión acumula todos los análisis realizados

---

## Estructuras de Datos Implementadas

| Estructura | Clase | Uso en la app |
|------------|-------|--------------|
| **Queue (Cola FIFO)** | `FrameQueue` | Buffer de frames de cámara (hasta 50) |
| **Stack (Pila LIFO)** | `DiagnosticStack` | Historial de diagnósticos con undo |
| **Lista Doblemente Enlazada** | `DoublyLinkedList` | Historial de sesión navegable en ambas direcciones |
| **Lista Circular Doble** | `CircularDoublyLinkedList` | Navegación infinita de filtros de visión |

Todas implementadas desde cero en `frontend/src/lib/dataStructures.ts` con TypeScript genérico.

---

## Métricas Oculares (MediaPipe)

| Métrica | Descripción | Umbral de alerta |
|---------|-------------|-----------------|
| **EAR** (Eye Aspect Ratio) | Apertura del ojo | < 0.14 → posible ptosis |
| **Simetría** | Diferencia EAR izq./der. | > 0.06 → asimetría |
| **Promedio EAR** | Fatiga general | 0.14 – 0.22 → fatiga ocular |
| **Tasa de parpadeo** | Parpadeos por minuto | < 10 → posible ojo seco |

---

## Patrones de Diseño (Backend Java)

### Factory Pattern

```java
DiagnosticReport reporte = DiagnosticReportFactory.createReport(
    "Ptosis Ocular", 0.92, ReportSeverity.URGENTE, sessionId
);
// Retorna UrgentDiagnosticReport, FollowUpDiagnosticReport o NormalDiagnosticReport
```

### Singleton Pattern

```java
DiagnosticReportManager manager = DiagnosticReportManager.getInstance();
manager.createAndRegisterReport(...);
```

---

## Variables de Entorno (Firebase)

Copia `frontend/.env.local.example` como `frontend/.env.local` y rellena:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## Requisitos Académicos Cumplidos

- Queue, Stack, Lista Doble, Lista Circular Doble — implementadas y usadas en flujo real
- Factory Pattern + Singleton Pattern — backend Java
- IA real con MediaPipe Face Landmarker (no simulada)
- Autenticación con Firebase Auth
- Frontend en TypeScript con Next.js 14 App Router
- Reporte PDF con diseño profesional
- Interfaz responsive con animaciones

---

## Fechas de Entrega

- **Grupo 1**: 21 de mayo de 2026
- **Grupo 2**: 28 de mayo de 2026

---

**Kawsay** (Quechua) · "Salud" — Universidad Cooperativa de Colombia · Estructuras de Datos 2026
