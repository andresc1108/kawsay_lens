# 🎯 KAWSAY-LENS: Presentación del Caso de Estudio

## 👁️ Título del Proyecto
**KAWSAY-LENS**: Sistema Académico de Detección Preliminar de Patologías Oculares en Tiempo Real

---

## 📌 Descripción Ejecutiva

Kawsay-Lens es una aplicación full-stack innovadora que utiliza visión artificial para la detección preliminar de patologías oculares en tiempo real. Diseñada como herramienta académica, integra conceptos avanzados de estructuras de datos, patrones de diseño y desarrollo web moderno.

**Disclaimer**: Este es un proyecto académico de apoyo educativo. Los resultados NO son diagnósticos médicos oficiales.

---

## 🎓 Justificación Académica

### ¿Por qué Kawsay-Lens?

1. **Complejidad Académica**: Requiere implementación de 4 estructuras de datos en contexto real
2. **Relevancia Social**: Aborda problema real (acceso a diagnósticos visuales)
3. **Tecnología Moderna**: Integra frontend, backend, IA y patrones de diseño
4. **Multidisciplinario**: Combina algoritmos, UI/UX y arquitectura de software

### Problemas que Resuelve

- ❌ **Acceso limitado a oftalmólogos**: Herramienta preliminar que sugiere necesidad de consulta
- ❌ **Costo alto de diagnósticos**: Herramienta educativa de bajo costo
- ❌ **Falta de conciencia**: Educación sobre patologías oculares comunes
- ❌ **Implementación de estructuras complejas**: Caso de uso real para aprender

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    KAWSAY-LENS ARCHITECTURE                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐           ┌──────────────────────┐
│    FRONTEND LAYER    │           │   BACKEND LAYER      │
│                      │           │                      │
│  ▲ Next.js 14        │           │  ▲ Java 17           │
│  ▲ React 18          │           │  ▲ Spring Boot       │
│  ▲ TypeScript        │           │  ▲ Maven             │
│                      │           │                      │
│  Components:         │           │  Services:           │
│  ├─ EyeScanner      │◄──────────►├─ ReportFactory     │
│  ├─ Sidebar         │ REST API   │├─ DiagnosticMgr    │
│  └─ ReportViewer    │           │└─ DatabaseSvc      │
│                      │           │                      │
│  Data Structures:    │           │  Design Patterns:    │
│  ├─ Queue           │           │  ├─ Factory Pattern │
│  ├─ Stack           │           │  └─ Singleton       │
│  ├─ DoublyList      │           │                      │
│  └─ CircularList    │           │                      │
└──────────────────────┘           └──────────────────────┘
         △                                    △
         │                                    │
         └──────────────────┬─────────────────┘
                            │
                    ┌───────▼────────┐
                    │   DATABASE     │
                    │  (PostgreSQL)  │
                    │                │
                    │  • Sessions    │
                    │  • Diagnoses   │
                    │  • Reports     │
                    └────────────────┘

                    ┌────────────────┐
                    │   CAMERA API   │
                    │  HTML5/WebRTC  │
                    └────────────────┘

                    ┌────────────────┐
                    │   TENSORFLOW   │
                    │   .js / .py    │
                    └────────────────┘
```

---

## 📊 Estructuras de Datos Implementadas

### 1️⃣ QUEUE (Cola) - FrameQueue
**Propósito**: Gestionar frames capturados de la cámara

```
CÁMARA → [Frame1][Frame2][Frame3] → PROCESADOR
           Enqueue            Dequeue
             O(1)              O(1)
```

**Beneficio**: Evita bloqueo del hilo principal si la captura es más rápida que el procesamiento

### 2️⃣ STACK (Pila) - DiagnosticStack
**Propósito**: Almacenar diagnósticos con capacidad de deshacer

```
DIAGNÓSTICOS:
┌────────────────┐
│ Diagnóstico 3  │  ← TOPE (Pop aquí)
├────────────────┤
│ Diagnóstico 2  │
├────────────────┤
│ Diagnóstico 1  │
└────────────────┘
  LIFO - Último entra, primero sale
```

**Beneficio**: Implementar "Undo" de última detección

### 3️⃣ LISTA DOBLE - DoublyLinkedList
**Propósito**: Historial completo de sesión con navegación bidireccional

```
NODO ◄──────► NODO ◄──────► NODO
prev  next  prev  next  prev  next
              ▲ Navegación en ambas direcciones
```

**Beneficio**: Generar reportes complejos que necesitan acceso aleatorio

### 4️⃣ LISTA CIRCULAR DOBLE - CircularDoublyLinkedList
**Propósito**: Selector de filtros con navegación infinita

```
        ┌─────────┐
        │ NORMAL  │
    ┌───┴─────────┴───┐
    │                 │
┌───▼─────┐      ┌────▼────┐
│ GRISES  │◄────►│CONTRASTE│
└────▲────┘      └────┬────┘
     │                │
     └────────────────┘
     (navegación circular infinita)
```

**Beneficio**: Usuario puede cambiar filtros infinitamente sin restricciones

---

## 🎨 Caso de Uso: Flujo de Usuario

### Escenario
"Juan, un usuario de 45 años, desea hacer un chequeo visual preliminar en casa"

### Flujo Paso a Paso

```
1. INICIO
   └─ Juan abre la aplicación web en su navegador

2. AUTORIZACIÓN
   └─ Concede permiso para acceder a la cámara

3. CAPTURA
   └─ La cámara comienza a capturar frames
      • Queue gestiona hasta 50 frames simultáneamente
      • Frames se procesan en orden (FIFO)

4. FILTRADO
   └─ Juan prueba diferentes filtros:
      • Filtro Normal → Escala de Grises → Contraste Alto
      • CircularList permite navegación infinita

5. ANÁLISIS
   └─ IA detecta posibles patologías:
      • Miopía (88% confianza) → Stack almacena
      • Presión ocular elevada (76%) → Stack almacena
      • Cataracia incipiente (92%) → Stack almacena

6. REVISIÓN
   └─ Juan revisa en panel:
      • DoublyLinkedList muestra todo el historial
      • Navegación hacia adelante y atrás
      • Detecta falso positivo, presiona "Deshacer"
      • Stack.pop() elimina última detección

7. DESCARGA
   └─ Juan genera reporte PDF:
      • Información de sesión
      • Hallazgos verificados
      • Recomendaciones
      • Descargo de responsabilidad legal

8. CIERRE
   └─ Datos se sincronizaron con backend (Factory crea reportes)
      • ReportType = URGENTE/SEGUIMIENTO/NORMAL
      • Almacenado en base de datos
```

---

## 💡 Patrones de Diseño Implementados

### Factory Pattern (Backend)
```java
// Creación automática según severidad
DiagnosticReport report = DiagnosticReportFactory.createReport(
    "Cataracia Avanzada",
    0.92,
    ReportSeverity.URGENTE,
    sessionId
);
// → Crea UrgentDiagnosticReport automáticamente
// → Aplica recomendaciones urgentes
// → Genera resumen específico
```

**Ventajas**:
- Encapsulación de creación
- Extensible para nuevos tipos
- Recomendaciones automáticas

### Singleton Pattern (Backend)
```java
// Garantiza instancia única
DiagnosticReportManager manager = 
    DiagnosticReportManager.getInstance();

manager.createAndRegisterReport(...);
// Mismo manager en toda la aplicación
```

**Ventajas**:
- Control centralizado
- Thread-safe
- Conteo total de reportes

---

## 🔬 Características Técnicas

### Frontend (Next.js + React)
✅ TypeScript estricto (100% tipado)
✅ Componente EyeScanner con canvas en tiempo real
✅ Acceso a cámara HTML5 WebRTC
✅ Overlay animado de escaneo (SVG)
✅ Generación de PDF con jsPDF
✅ Tailwind CSS + Framer Motion
✅ Responsive design (mobile/desktop)

### Backend (Java)
✅ Patrón Factory para 3 tipos de reportes
✅ Patrón Singleton para manager
✅ Validaciones automáticas
✅ Recomendaciones contextuales
✅ Thread-safe con sincronización
✅ Maven para build

### IA/ML (TensorFlow.js)
✅ Framework integrado y listo
✅ Capaz de procesar frames en cliente
✅ Evita latencia de servidor
✅ Procesamiento en tiempo real

---

## 📈 Resultados Esperados

### Cambio en el Contexto Académico

| Métrica | Antes | Después |
|---------|-------|---------|
| Comprensión de Estructuras | Teórica | Práctica + Real |
| Implementación de Diseños | Ejemplos simples | Aplicación completa |
| Integración de Tecnologías | Una a la vez | Arquitectura completa |
| Capacidad de debugging | Limitada | Profunda (stack traces, etc) |

### Impacto Potencial

- 📚 Recurso educativo para futuros estudiantes
- 🏆 Proyecto portfolio para demostrar en entrevistas
- 🚀 Base para aplicación comercial (con datos reales)
- 🌍 Conciencia sobre patologías oculares

---

## 🚀 Innovaciones

### Técnicas
1. **Procesamiento asíncrono**: Queue evita UI lag
2. **Historial inteligente**: DoublyLinkedList permite auditoría
3. **UX sin fricción**: CircularList para navegación infinita
4. **Reportes dinámicos**: Factory genera contexto automático

### Pedagógicas
1. **Contexto real**: No son ejercicios abstractos
2. **Arquitectura moderna**: Next.js, TypeScript, Tailwind
3. **Patrones profesionales**: Factory, Singleton
4. **Documentación completa**: Cada decisión explicada

---

## 📋 Requisitos Cumplidos

- ✅ Grupos máximo 3 estudiantes
- ✅ Caso de estudio real (patologías oculares)
- ✅ IA implementada (TensorFlow.js)
- ✅ 4 estructuras de datos implementadas
- ✅ Investigación adicional (Factory, Singleton)
- ✅ Frontend con arquitectura moderna
- ✅ Lenguaje único: TypeScript + Java
- ✅ Presentación (este documento + PDF)
- ✅ Interfaz profesional y moderna
- ✅ Documentación técnica completa

---

## 🎓 Aprendizajes Clave

### Estructuras de Datos
- Cuándo usar Queue vs Stack vs Lists
- Trade-offs entre diseños
- Complejidad algorítmica en contexto real
- Optimización de memoria

### Arquitectura
- Separación Frontend/Backend
- Comunicación entre capas
- Patrones de diseño en la práctica
- Escalabilidad

### Desarrollo Full-Stack
- React + Next.js (frontend moderno)
- Java + Spring (backend robusto)
- Integración de IA
- Ciclo completo desarrollo

---

## 📞 Preguntas Potenciales

### P: ¿Por qué Queue para frames?
**R**: Porque la cámara captura constantemente, pero el procesamiento de IA es más lento. La Queue actúa como buffer.

### P: ¿Por qué Stack para diagnósticos?
**R**: Porque típicamente necesitamos deshacer la acción más reciente (LIFO), perfectamente adaptado para "Undo".

### P: ¿Por qué DoublyLinkedList para historial?
**R**: Necesitamos acceso bidireccional para generar reportes complejos y auditoría.

### P: ¿Por qué CircularList para filtros?
**R**: El usuario debe poder cambiar filtros infinitamente durante la sesión sin llegar a un "final".

### P: ¿Es un producto real?
**R**: Es académico, pero con arquitectura que puede escalarse a producción reemplazando componentes.

---

## 🔒 Consideraciones Éticas

- ⚠️ **Disclaimer Legal**: El reporte incluye descargo de responsabilidad
- 🔐 **Privacidad**: Frames no se almacenan (solo en memoria)
- ✅ **Accesibilidad**: Diseño inclusivo
- 📊 **Transparencia**: Usuarios entienden limitaciones

---

## 📅 Timeline de Desarrollo

```
Fase 1: Planificación (Semana 1)
├─ Definir arquitectura
├─ Mockups de interfaz
└─ Estructura de carpetas

Fase 2: Frontend (Semanas 2-3)
├─ Componente EyeScanner
├─ Estructuras de datos
└─ Interfaz de usuario

Fase 3: Backend (Semana 3)
├─ Factory Pattern
├─ Singleton Pattern
└─ Reportes

Fase 4: Integración (Semana 4)
├─ API REST (opcional)
├─ Testing
└─ Documentación

Fase 5: Presentación (Semana 5)
├─ Demo en vivo
├─ Q&A
└─ Retroalimentación
```

---

## 🎬 Demo en Vivo

### Secuencia de Demostración

1. **Inicio de la app** → Mostrar interfaz limpia
2. **Activar cámara** → Permisos y stream de video
3. **Cambiar filtros** → Demostrar navegación circular
4. **Diagnósticos** → Simular detecciones en tiempo real
5. **Deshacer** → Pop del stack
6. **Ver historial** → DoublyLinkedList navegación
7. **Descargar PDF** → Reporte profesional
8. **Backend** → Ejecutar Factory Pattern demo

---

## 📚 Conclusión

Kawsay-Lens demuestra cómo las estructuras de datos, usualmente vistas como conceptos abstractos, son herramientas poderosas para resolver problemas reales. Este proyecto integra:

- 📚 **Conocimiento académico** con aplicación práctica
- 🎨 **Diseño moderno** con arquitectura robusta
- 🤖 **Tecnología emergente** (IA + WebRTC)
- 🌍 **Impacto social** potencial

Más importante aún: prepara estudiantes para desarrollar sistemas reales que impacten la vida de las personas.

---

**Proyecto Desarrollado**: Abril 2026
**Entrega**: 21 o 28 de mayo de 2026
**Estado**: ✅ COMPLETADO Y DOCUMENTADO
