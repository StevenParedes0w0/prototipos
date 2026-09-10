# REPORTE DE MICROCORRECCIÓN FINAL DE FIDELIDAD DOCUMENTAL — FORMATOS SGC T1 Y T2

**Proyecto:** Sistema de Gestión Documental y Rúbricas FISEI - UTA  
**Fecha:** Septiembre 2026  
**Formatos Oficiales:** `UTA-SGC-A-2-1-P7-T1` y `UTA-SGC-A-2-1-P7-T2`

---

## 1. T1 — MATRIZ DE ACTIVIDADES (`UTA-SGC-A-2-1-P7-T1`)

Se ajustó la previsualización del Plan de Trabajo para reflejar con exactitud la nomenclatura del formato:
- **Encabezado Principal de Fechas:** Se reemplazó `"FECHAS"` por el término exacto **`CRONOGRAMA`**.
- **Subcolumnas:** Se mantuvieron visualmente diferenciadas las subcolumnas **`Desde`** y **`Hasta`**.
- **Recursos:** Se especificó en la cabecera el alcance conceptual del formato: `RECURSOS (humano, tecnológico, económico, material)`.
- **Estructura Final de la Tabla 1:**
  `ACTIVIDADES` | `CRONOGRAMA (Desde / Hasta)` | `RESPONSABLE` | `RECURSOS` | `MEDIOS DE VERIFICACIÓN`

---

## 2. T2 — REGISTRO DE CONTACTOS Y GESTIONES DE LA DELEGACIÓN (`UTA-SGC-A-2-1-P7-T2`)

Se reestructuró la `Tabla 2.- Registro de contactos y gestiones de la delegación` en **6 columnas independientes** sin fusionar campos:
1. **Nombre o propósito de la delegación**
2. **Ciudad, país o institución**
3. **Entidad y persona de contacto** (Institución, Nombre y cargo)
4. **Datos de contacto** (Correo electrónico y/o Nro. telefónico en su propia columna)
5. **Tema o propósito** (Tema tratado)
6. **Acuerdo y seguimiento** (Compromiso, responsable y plazo)

---

## 3. MENSAJE SOBRE INTEGRACIÓN DE FIRMA

- **Remoción del A4:** Se eliminó del cuerpo y pie del documento A4 cualquier nota o leyenda como `* Mecanismo de firma sujeto a integración institucional.`.
- **Ubicación Exclusiva:** Dicha indicación se preserva únicamente en la interfaz interactiva (`ModalFirmaDocumental` y tooltips de ayuda), manteniendo la hoja A4 100% limpia y fiel al formato impreso suministrado.

---

## 4. RESULTADO DE VERIFICACIÓN TÉCNICA

### 4.1. TypeScript
```bash
npx tsc --noEmit
```
**Resultado:** `Exit code 0` (0 errores).

### 4.2. Build de Producción
```bash
npm run build
```
**Resultado:** `Exit code 0` (Compilación exitosa con Vite en 230ms).
```
✓ 81 modules transformed.
dist/index.html                     0.91 kB
dist/assets/index-CxqwTUjB.css     36.15 kB
dist/assets/index-CLO75toW.js   1,060.48 kB
✓ built in 230ms
```
