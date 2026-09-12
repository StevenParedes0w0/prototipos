import React from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";

export const MAX_EVIDENCIA_MB = 10;
const pdfText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7e]/g, " ").replace(/[\\()]/g, "\\$&");
export function evidenciaPdfUrl(actividad: ActividadEjecucion, medio: MedioVerificacion): string {
  if (medio.archivoVigente?.url) return medio.archivoVigente.url;
  const lineas = ["EVIDENCIA - FICHA DEMO", "Representacion de metadatos. No es el PDF original del usuario.", "El archivo seleccionado se conserva durante la sesion de demostracion.", "", `Plan: ${actividad.planNombre}`, `Actividad: ${actividad.nombre}`, `Medio: ${medio.nombre}`, `Archivo: ${medio.archivoVigente?.nombre ?? "Sin archivo"}`, `Version de evidencia: ${medio.historialVersiones.find(v => v.vigente)?.version ?? 1}.0`, `Cargado por: ${medio.archivoVigente?.cargadoPor ?? "DEMO"}`, `Fecha: ${medio.archivoVigente?.fechaCarga ?? "DEMO"}`];
  const stream = `BT /F1 10 Tf 44 790 Td 16 TL ${lineas.map(l => `(${pdfText(l)}) Tj T*`).join("\n")} ET`;
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", "<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>", "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`];
  let pdf = "%PDF-1.4\n"; const offsets: number[] = [0];
  objects.forEach((o, i) => { offsets.push(pdf.length); pdf += `${i+1} 0 obj\n${o}\nendobj\n`; });
  const start = pdf.length; pdf += `xref\n0 ${objects.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(o => `${String(o).padStart(10,"0")} 00000 n \n`).join("")}trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return `data:application/pdf;base64,${btoa(pdf)}`;
}
export function descargarEvidencia(actividad: ActividadEjecucion, medio: MedioVerificacion) {
  const a = document.createElement("a"); a.href = evidenciaPdfUrl(actividad, medio);
  a.download = medio.archivoVigente?.url ? medio.archivoVigente.nombre : `ficha_demo_${medio.archivoVigente?.nombre ?? "evidencia.pdf"}`;
  a.click();
}
export function EvidenciaPdfContent({ actividad, medio }: { actividad: ActividadEjecucion; medio: MedioVerificacion }) {
  return <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 480 }}>
    {!medio.archivoVigente?.url && <div role="status" style={{ padding: 12, background: "#fffbeb", color: "#92400e", fontSize: 13 }}>Ficha DEMO de metadatos. El PDF original de una carga local está disponible durante la sesión; después de recargar se conservan sus metadatos e historial.</div>}
    <iframe title={`PDF de evidencia: ${medio.nombre}`} src={evidenciaPdfUrl(actividad, medio)} style={{ border: 0, width: "100%", flex: 1, minHeight: 450 }} />
  </div>;
}
