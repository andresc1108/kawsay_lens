# 🗂️ ÍNDICE DE KAWSAY-LENS

Bienvenido a Kawsay-Lens. Este archivo te guía por toda la estructura del proyecto.

---

## 📍 COMIENZA AQUÍ

1. **[README.md](./README.md)** - Descripción general del proyecto
2. **[INSTALL.md](./INSTALL.md)** - Instrucciones de instalación paso a paso
3. **[PRESENTACION_CASO_ESTUDIO.md](./PRESENTACION_CASO_ESTUDIO.md)** - Presentación académica

---

## 📚 DOCUMENTACIÓN TÉCNICA

### Estructuras de Datos
- **[ESTRUCTURAS_DE_DATOS.md](./ESTRUCTURAS_DE_DATOS.md)**
  - Explicación detallada de cada estructura
  - Casos de uso en Kawsay-Lens
  - Análisis de complejidad
  - Diagramas visuales
  - Comparativas

### Ejemplos de Código
- **[frontend/src/lib/examples.ts](./frontend/src/lib/examples.ts)**
  - Ejemplos prácticos de cada estructura
  - Flujo completo de aplicación
  - Código ejecutable

### Proyecto Completado
- **[PROYECTO_COMPLETADO.md](./PROYECTO_COMPLETADO.md)**
  - Resumen de archivos creados
  - Funcionalidades implementadas
  - Estadísticas del código
  - Próximos pasos opcionales

---

## 🎨 CÓDIGO FRONTEND

### Configuración
```
frontend/
├── package.json              → Dependencias npm
├── tsconfig.json             → Configuración TypeScript
├── next.config.js            → Configuración Next.js
├── tailwind.config.js        → Tema Tailwind
└── postcss.config.js         → Plugins CSS
```

### Código Principal
```
frontend/src/
├── app/
│   ├── page.tsx              → Página principal
│   ├── layout.tsx            → Layout global
│   └── globals.css           → Estilos globales
│
├── components/
│   └── EyeScanner.tsx        → COMPONENTE PRINCIPAL
│                              (✅ Leer primero)
│
├── lib/
│   ├── dataStructures.ts     → Estructuras de datos
│   ├── reportGenerator.ts    → Generación de PDF
│   └── examples.ts           → Ejemplos de código
│
└── types/
    └── index.ts              → Tipos TypeScript
```

### 🔥 ARCHIVOS CLAVE PARA ESTUDIAR

1. **[frontend/src/components/EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)** ⭐⭐⭐
   - Componente principal (600+ líneas)
   - Integra todas las estructuras de datos
   - Lógica de cámara, filtros, diagnósticos
   - Animaciones y UI

2. **[frontend/src/lib/dataStructures.ts](./frontend/src/lib/dataStructures.ts)** ⭐⭐⭐
   - Implementación completa de 4 estructuras
   - Bien documentado con comentarios
   - Generics para reutilización

3. **[frontend/src/lib/reportGenerator.ts](./frontend/src/lib/reportGenerator.ts)** ⭐⭐
   - Generación de PDF con jsPDF
   - Descargo de responsabilidad legal
   - Formateo profesional

---

## ⚙️ CÓDIGO BACKEND

### Configuración
```
backend/
└── pom.xml                  → Configuración Maven
```

### Estructura de Clases
```
backend/src/main/java/com/kawsay/
├── DiagnosticReportDemo.java           → Demo de Factory Pattern
├── DiagnosticReportManager.java        → Singleton Pattern
│
├── model/
│   ├── DiagnosticReport.java           → Clase base abstracta
│   ├── UrgentDiagnosticReport.java     → Reporte URGENTE
│   ├── FollowUpDiagnosticReport.java   → Reporte SEGUIMIENTO
│   └── NormalDiagnosticReport.java     → Reporte NORMAL
│
└── factory/
    └── DiagnosticReportFactory.java    → Factory Pattern
```

### 🔥 ARCHIVOS CLAVE PARA ESTUDIAR

1. **[backend/src/main/java/com/kawsay/factory/DiagnosticReportFactory.java](./backend/src/main/java/com/kawsay/factory/DiagnosticReportFactory.java)** ⭐⭐⭐
   - Implementación del Factory Pattern
   - Enums de severidad
   - Creación automática de reportes
   - Recomendaciones contextuales

2. **[backend/src/main/java/com/kawsay/model/DiagnosticReport.java](./backend/src/main/java/com/kawsay/model/DiagnosticReport.java)** ⭐⭐
   - Clase abstracta base
   - Estructura de todos los reportes

3. **[backend/src/main/java/com/kawsay/DiagnosticReportManager.java](./backend/src/main/java/com/kawsay/DiagnosticReportManager.java)** ⭐⭐
   - Patrón Singleton
   - Thread-safe con synchronized
   - Instancia única

---

## 🚀 GUÍA RÁPIDA

### Instalación Rápida (5 minutos)

```bash
# Frontend
cd frontend && npm install && npm run dev
# Abre: http://localhost:3000

# Backend (otra terminal)
cd backend && mvn exec:java -Dexec.mainClass="com.kawsay.DiagnosticReportDemo"
```

### Primeros Pasos
1. Lee [README.md](./README.md)
2. Lee [INSTALL.md](./INSTALL.md)
3. Ejecuta el proyecto
4. Lee [ESTRUCTURAS_DE_DATOS.md](./ESTRUCTURAS_DE_DATOS.md)
5. Estudia [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)

---

## 📊 ESTADÍSTICAS

| Métrica | Valor |
|---------|-------|
| Archivos creados | 30+ |
| Líneas de código (TypeScript) | ~1,500 |
| Líneas de código (Java) | ~500 |
| Líneas de documentación | ~1,500 |
| Estructuras de datos | 4 |
| Patrones de diseño | 2 |
| Componentes React | 1 principal + auxiliares |
| Clases Java | 7 |
| Archivos de configuración | 7 |

---

## 🎯 MAPA CONCEPTUAL

```
KAWSAY-LENS
│
├─ 📚 ESTRUCTURAS DE DATOS
│   ├─ Queue (FrameQueue)            → Gestión de frames
│   ├─ Stack (DiagnosticStack)       → Historial con undo
│   ├─ DoublyLinkedList              → Historial completo
│   └─ CircularDoublyLinkedList      → Filtros infinitos
│
├─ 🎨 FRONTEND
│   ├─ EyeScanner.tsx               → Componente principal
│   ├─ Page.tsx                      → Interfaz + resultados
│   └─ ReportGenerator.ts            → PDF
│
├─ ⚙️ BACKEND
│   ├─ Factory Pattern               → Reportes automáticos
│   ├─ Singleton Pattern             → Manager único
│   └─ 3 Tipos de Reportes           → Urgente/Seguimiento/Normal
│
├─ 🤖 IA/ML
│   ├─ TensorFlow.js                 → Procesamiento
│   └─ Canvas                        → Captura de frames
│
└─ 📄 DOCUMENTACIÓN
    ├─ README.md                     → General
    ├─ INSTALL.md                    → Instalación
    ├─ ESTRUCTURAS_DE_DATOS.md       → Técnico
    ├─ PRESENTACION_CASO_ESTUDIO.md  → Académica
    ├─ PROYECTO_COMPLETADO.md        → Resumen
    └─ ÍNDICE.md                     → Este archivo
```

---

## 🔍 BÚSQUEDA POR TEMA

### Si quieres aprender sobre...

**Queues**
- Concepto: [ESTRUCTURAS_DE_DATOS.md#1-queue](./ESTRUCTURAS_DE_DATOS.md#1-queue-cola---framequeue)
- Implementación: [dataStructures.ts](./frontend/src/lib/dataStructures.ts)
- Uso: [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx#frameQueueRef)

**Stacks**
- Concepto: [ESTRUCTURAS_DE_DATOS.md#2-stack](./ESTRUCTURAS_DE_DATOS.md#2-stack-pila---diagnosticstack)
- Implementación: [dataStructures.ts](./frontend/src/lib/dataStructures.ts)
- Uso: Deshacer diagnóstico en [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)

**Listas Dobles**
- Concepto: [ESTRUCTURAS_DE_DATOS.md#3-lista-doble](./ESTRUCTURAS_DE_DATOS.md#3-lista-doble-doubly-linked-list---doublylinkedlist)
- Implementación: [dataStructures.ts](./frontend/src/lib/dataStructures.ts)
- Uso: Historial de sesión en [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)

**Listas Circulares**
- Concepto: [ESTRUCTURAS_DE_DATOS.md#4-lista-circular-doble](./ESTRUCTURAS_DE_DATOS.md#4-lista-circular-doble-circular-doubly-linked-list---circularDoublelinkedlist)
- Implementación: [dataStructures.ts](./frontend/src/lib/dataStructures.ts)
- Uso: Selector de filtros en [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)

**Factory Pattern**
- Concepto: [PRESENTACION_CASO_ESTUDIO.md#factory-pattern](./PRESENTACION_CASO_ESTUDIO.md#factory-pattern-backend)
- Implementación: [DiagnosticReportFactory.java](./backend/src/main/java/com/kawsay/factory/DiagnosticReportFactory.java)
- Demo: [DiagnosticReportDemo.java](./backend/src/main/java/com/kawsay/DiagnosticReportDemo.java)

**Singleton Pattern**
- Concepto: [PRESENTACION_CASO_ESTUDIO.md#singleton-pattern](./PRESENTACION_CASO_ESTUDIO.md#singleton-pattern-backend)
- Implementación: [DiagnosticReportManager.java](./backend/src/main/java/com/kawsay/DiagnosticReportManager.java)

**React/Next.js**
- Componente principal: [EyeScanner.tsx](./frontend/src/components/EyeScanner.tsx)
- Página: [page.tsx](./frontend/src/app/page.tsx)

**PDF Reports**
- Implementación: [reportGenerator.ts](./frontend/src/lib/reportGenerator.ts)
- Uso: Botón en [page.tsx](./frontend/src/app/page.tsx)

---

## ✅ CHECKLIST DE REQUISITOS

- ✅ **Máximo 3 estudiantes**: Documentado en README
- ✅ **Caso real**: Detección de patologías oculares
- ✅ **IA implementada**: TensorFlow.js integrado
- ✅ **Queue**: FrameQueue implementada
- ✅ **Stack**: DiagnosticStack implementada
- ✅ **Lista Doble**: DoublyLinkedList implementada
- ✅ **Lista Circular Doble**: CircularDoublyLinkedList implementada
- ✅ **Investigación adicional**: Factory + Singleton
- ✅ **Frontend**: Next.js 14 con App Router
- ✅ **TypeScript**: 100% tipado
- ✅ **Presentación**: Documento PRESENTACION_CASO_ESTUDIO.md
- ✅ **Arquitectura**: Frontend + Backend + Diagrama

---

## 🆘 SOPORTE

### Errores Comunes

**"npm: comando no encontrado"**
→ Instala Node.js desde https://nodejs.org/

**"mvn: comando no encontrado"**
→ Instala Maven desde https://maven.apache.org/

**"No se puede acceder a la cámara"**
→ Revisa permisos del navegador, usa HTTPS en producción

**"Module not found"**
→ Ejecuta `npm install` en la carpeta frontend

---

## 📞 CONTACTO

Para dudas o sugerencias:
- Lee la documentación correspondiente
- Revisa ejemplos en [examples.ts](./frontend/src/lib/examples.ts)
- Consulta [ESTRUCTURAS_DE_DATOS.md](./ESTRUCTURAS_DE_DATOS.md)

---

## 🎓 REFERENCIAS

- [MDN Web Docs](https://developer.mozilla.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Java Docs](https://docs.oracle.com/en/java/)
- [Algorithm Design Manual](https://www3.cs.stonybrook.edu/~algorith/)

---

**Última actualización**: 28 de Abril de 2026
**Versión**: 1.0.0
**Estado**: ✅ COMPLETADO

¡Bienvenido a Kawsay-Lens! Esperamos que disfrutes explorando este proyecto. 🚀
