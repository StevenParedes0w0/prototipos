import React, { useState } from "react";
import { ItemEvidenciaRevisor } from "./types";
import ModalObservarEvidencia from "./ModalObservarEvidencia";
import ModalValidarEvidencia from "./ModalValidarEvidencia";
import ModalTrazabilidadCompleta from "./ModalTrazabilidadCompleta";
import { EvidenciaPdfContent, descargarEvidencia } from "../modulo5/evidencePdf";
import { getActivityResponsibleDisplayLabel } from "../documentEngine/responsibleDisplay";
interface RevisarEvidenciaViewProps {
 item: ItemEvidenciaRevisor; currentUserName?: string; readOnly?: boolean; onBack: () => void;
 onValidar: (actividadId: string, medioId: string) => void;
 onObservar: (actividadId: string, medioId: string, texto: string) => void;
}
export default function RevisarEvidenciaView({ item, currentUserName, readOnly = false, onBack, onValidar, onObservar }: RevisarEvidenciaViewProps) {
 const [modal, setModal] = useState<"validar"|"observar"|"traza"|null>(null);
 const decidido = item.estado === "VALIDADA" || item.estado === "OBSERVADA";
 return <div style={{height:"100%",display:"flex",flexDirection:"column"}}>
  <header style={{padding:20,background:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,flexWrap:"wrap"}}><div><button className="btn btn-ghost" onClick={onBack}>← Volver a evidencias</button><h2 style={{margin:"8px 0"}}>Revisión de evidencia: {item.medioNombre}</h2><div style={{fontSize:13,color:"#64748b"}}>{item.actividadNombre} · {item.planNombre} · v{item.version}.0</div></div><button className="btn btn-secondary" onClick={()=>descargarEvidencia(item.actividad,item.medio)}>Descargar {item.medio.archivoVigente?.url ? "PDF" : "ficha DEMO"}</button></header>
  <div style={{display:"flex",flex:1,minHeight:0,flexWrap:"wrap"}}><div style={{flex:"1 1 560px",minHeight:560}}><EvidenciaPdfContent actividad={item.actividad} medio={item.medio}/></div>
   <aside style={{flex:"0 1 330px",padding:20,background:"#fff",overflowY:"auto"}}><h3>{item.estado}</h3><p>Revisor: {currentUserName ?? "Actor asignado"}</p><p>Responsables: {getActivityResponsibleDisplayLabel(item.actividad)}</p><p>Fecha límite de carga: {item.fechaLimite}</p><p>Cargado por: {item.medio.archivoVigente?.cargadoPor}</p>
    {item.observacionActual && <div style={{padding:12,background:"#fffbeb",color:"#92400e"}}><strong>Observación</strong><p>{item.observacionActual}</p></div>}
    {decidido && <p role="status">Decisión registrada. Una nueva versión dentro del plazo requerirá otra validación.</p>}
    {readOnly && <p role="status">Consulta de solo lectura.</p>}
    {!readOnly && !decidido && <div style={{display:"grid",gap:10,marginTop:20}}><button className="btn btn-primary" onClick={()=>setModal("validar")}>Validar evidencia</button><button className="btn btn-secondary" onClick={()=>setModal("observar")}>Observar evidencia</button></div>}
    <button className="btn btn-secondary" style={{marginTop:16}} onClick={()=>setModal("traza")}>Ver historial y versiones</button><p style={{fontSize:12,color:"#64748b"}}>Validación DEMO sin firma electrónica.</p>
   </aside>
  </div>
  {modal === "validar" && <ModalValidarEvidencia item={item} onClose={()=>setModal(null)} onConfirmar={()=>{onValidar(item.actividadId,item.medioId);setModal(null);}}/>}
  {modal === "observar" && <ModalObservarEvidencia item={item} onClose={()=>setModal(null)} onConfirmar={(texto)=>{onObservar(item.actividadId,item.medioId,texto);setModal(null);}}/>}
  {modal === "traza" && <ModalTrazabilidadCompleta actividad={item.actividad} medio={item.medio} onClose={()=>setModal(null)}/>}
 </div>;
}
