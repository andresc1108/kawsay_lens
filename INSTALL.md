# 📖 GUÍA DE INSTALACIÓN - KAWSAY-LENS

## Requisitos Previos

- **Node.js** 18+ y npm
- **Java** JDK 17+
- **Maven** 3.8+
- **Git**
- Navegador moderno con soporte WebRTC

## Instalación del Frontend

### 1. Navegar a la carpeta frontend
```bash
cd frontend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de entorno
```bash
cp .env.example .env.local
# Editar si es necesario
```

### 4. Ejecutar en modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:3000**

### 5. Build para producción
```bash
npm run build
npm start
```

## Instalación del Backend

### 1. Navegar a la carpeta backend
```bash
cd backend
```

### 2. Compilar el proyecto
```bash
mvn clean compile
```

### 3. Ejecutar la demostración del Factory Pattern
```bash
mvn exec:java -Dexec.mainClass="com.kawsay.DiagnosticReportDemo"
```

Salida esperada:
```
=== KAWSAY-LENS: FACTORY PATTERN DEMO ===

1. Creando reporte URGENTE:
  ID Reporte: DIAG-1234567890-5678
  Tipo: URGENT
  Severidad: URGENTE
  Hallazgo: Cataracia Avanzada
  Confianza: 92.0%
  Resumen: [⚠️ URGENTE] Se ha detectado posible Cataracia Avanzada...
  ...
```

### 4. Crear JAR ejecutable
```bash
mvn package
java -jar target/kawsay-lens-backend-1.0.0.jar
```

### 5. Ejecutar tests
```bash
mvn test
```

## Uso de la Aplicación

### Inicio de Sesión

1. Abre la interfaz web (http://localhost:3000)
2. Haz clic en "Iniciar Escaneo"
3. Autoriza el acceso a la cámara
4. El análisis comenzará automáticamente

### Filtros de Visión

Usa los botones "← Filtro Anterior" y "Siguiente Filtro →" para cambiar entre:
- 👁️ **Normal**: Visión estándar
- ⚫ **Escala de Grises**: Detección en tonos grises
- 🔆 **Contraste Alto**: Aumento de contraste

La navegación es **circular**, puedes cambiar infinitamente.

### Gestión de Diagnósticos

- 📌 **Diagnósticos**: Se muestran en tiempo real en el panel lateral
- ↶ **Deshacer**: Elimina el último diagnóstico (Pop del Stack)
- 📥 **Descargar Reporte**: Genera un PDF profesional

### Descarga de Reporte

El reporte PDF incluye:
- Información de la sesión
- Listado de todos los hallazgos
- Puntuaciones de confianza
- Recomendaciones
- Descargo de responsabilidad legal

## Estructura del Código

### Frontend - Estructuras de Datos

**src/lib/dataStructures.ts**:
- `FrameQueue`: Cola FIFO para frames
- `DiagnosticStack`: Pila LIFO para diagnósticos
- `DoublyLinkedList`: Lista doble para historial
- `CircularDoublyLinkedList`: Lista circular doble para filtros

### Frontend - Componentes

**src/components/EyeScanner.tsx**:
- Gestión de cámara
- Procesamiento de frames
- Renderizado del canvas con overlay
- Integración de todas las estructuras de datos

**src/app/page.tsx**:
- Página principal
- Panel de resultados
- Descarga de reportes

### Backend - Patrones

**model/DiagnosticReport.java**:
- Clase abstracta base
- Métodos abstractos para cada tipo

**model/UrgentDiagnosticReport.java**:
- Reportes de máxima prioridad
- Recomendaciones urgentes

**model/FollowUpDiagnosticReport.java**:
- Reportes de seguimiento
- Recomendaciones moderadas

**model/NormalDiagnosticReport.java**:
- Reportes normales
- Recomendaciones de mantenimiento

**factory/DiagnosticReportFactory.java**:
- Factory Pattern
- Creación automática de reportes
- Aplicación de recomendaciones

**DiagnosticReportManager.java**:
- Singleton Pattern
- Administrador único de reportes

## Troubleshooting

### Error: "No se puede acceder a la cámara"
- Verifica permisos del navegador
- Recarga la página
- Intenta en otro navegador

### Error: "npm dependencies not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Maven no encontrado
```bash
# Windows: Agrega Maven al PATH
# macOS/Linux: 
brew install maven
# o descarga desde: https://maven.apache.org/download.cgi
```

### La cola de frames se llena rápidamente
- Reduce `maxSize` en `FrameQueue` (línea 12 de dataStructures.ts)
- O mejora el procesamiento en `simulateDiagnosis`

## Performance Tips

1. **Reduce frame rate**: Modifica `requestAnimationFrame` si es necesario
2. **Limpia memoria**: El reporte PDF borra automáticamente diagnósticos
3. **Cache**: El navegador cachea recursos estáticos
4. **Backend**: Aumenta heap si procesas muchos reportes:
   ```bash
   java -Xmx1024m -jar kawsay-lens-backend-1.0.0.jar
   ```

## Documentación Adicional

- [README.md](./README.md) - Descripción general del proyecto
- [Next.js Docs](https://nextjs.org/docs)
- [Java Docs](https://docs.oracle.com/javase/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Contacto y Soporte

Para reportar bugs o sugerencias:
- Crea un issue en el repositorio
- Contacta al equipo de desarrollo

---

**Última actualización**: Abril 2026
