import React from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";
import { EvidenciaPdfContent, descargarEvidencia } from "./evidencePdf";
interface VisorPdfModalProps { actividad: ActividadEjecucion; medio: MedioVerificacion; onClose: () => void; onOpenReemplazar?: () => void; }
export default function VisorPdfModal({ actividad, medio, onClose, onOpenReemplazar }: VisorPdfModalProps) {
  return <div role="dialog" aria-modal="true" aria-label="Visor de evidencia" style={{ position: "fixed", inset: 0, zIndex: 650, display: "flex", flexDirection: "column", background: "#f0f4f8" }}>
    <header style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#0f2f56", color: "white" }}>
      <div><strong>{medio.nombre} — v{medio.historialVersiones.find(v => v.vigente)?.version ?? 1}.0</strong><div style={{fontSize:12}}>{medio.archivoVigente?.nombre} · {actividad.nombre}</div></div>
      <div style={{ display: "flex", gap: 10 }}><button className="btn btn-secondary" onClick={() => descargarEvidencia(actividad,medio)}>Descargar {medio.archivoVigente?.url ? "PDF" : "ficha DEMO"}</button>{onOpenReemplazar && <button className="btn btn-secondary" onClick={onOpenReemplazar}>Reemplazar evidencia</button>}<button className="btn btn-secondary" title="Cerrar visor" aria-label="Cerrar visor" onClick={onClose}>✕</button></div>
    </header><div style={{flex:1,minHeight:0}}><EvidenciaPdfContent actividad={actividad} medio={medio}/></div>
  </div>;
}
