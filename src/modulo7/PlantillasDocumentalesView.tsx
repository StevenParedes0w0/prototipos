import { useEffect, useState } from "react";
import { PlantillaDocumental, PlantillaSeccionConfig } from "./types";
import { PLANTILLAS_INICIALES } from "./mockDataAdmin";

interface Props {
  plantillas: PlantillaDocumental[];
  onGuardar: (id: string, config: PlantillaSeccionConfig[]) => void;
  onRestaurar: (id: string) => void;
}

export default function PlantillasDocumentalesView({ plantillas, onGuardar, onRestaurar }: Props) {
  const [selected, setSelected] = useState<PlantillaDocumental | null>(null);
  const [preview, setPreview] = useState<PlantillaDocumental | null>(null);
  const [config, setConfig] = useState<PlantillaSeccionConfig[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (selected) setConfig(structuredClone(selected.configuracion)); }, [selected]);

  const drop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return setDraggedId(null);
    const source = config.find(s => s.id === draggedId);
    const target = config.find(s => s.id === targetId);
    if (!source || !target || source.bloqueada || target.bloqueada) return setDraggedId(null);
    const movableSlots = config.map((s, i) => s.bloqueada ? -1 : i).filter(i => i >= 0);
    const movable = movableSlots.map(i => config[i]);
    const from = movable.findIndex(s => s.id === draggedId);
    const to = movable.findIndex(s => s.id === targetId);
    const nextMovable = [...movable];
    const [item] = nextMovable.splice(from, 1); nextMovable.splice(to, 0, item);
    const next = [...config]; movableSlots.forEach((slot, i) => { next[slot] = nextMovable[i]; });
    setConfig(next); setDraggedId(null);
  };

  const restore = () => {
    if (!selected) return;
    const original = PLANTILLAS_INICIALES.find(p => p.id === selected.id);
    if (original) setConfig(structuredClone(original.configuracion));
    onRestaurar(selected.id); setSaved(false);
  };

  return <div style={{padding:28,maxWidth:1200,margin:"0 auto"}}>
    <h1 style={{fontSize:22,color:"#1e2a3a",margin:"0 0 4px"}}>Plantillas documentales institucionales</h1>
    <p style={{fontSize:13.5,color:"#64748b",margin:"0 0 20px"}}>Configuración DEMO restringida a secciones que permiten orden o visibilidad sin alterar los bloques oficiales.</p>
    <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,overflow:"hidden"}}><table className="data-table"><thead><tr><th>Plantilla</th><th>Documento</th><th>Formato oficial</th><th>Estado</th><th>Actualización</th><th>Acciones</th></tr></thead><tbody>
      {plantillas.map(p=><tr key={p.id}><td><strong>{p.nombre}</strong></td><td>{p.tipoDocumento}</td><td>{p.version}</td><td>{p.estado}</td><td>{p.ultimaActualizacion}</td><td><div style={{display:"flex",gap:6}}><button className="btn btn-secondary btn-sm" onClick={()=>setPreview(p)}>VER</button><button className="btn btn-primary btn-sm" aria-label={`Configurar ${p.nombre}`} onClick={()=>{setSelected(p);setConfig(structuredClone(p.configuracion));setSaved(false);}}>CONFIGURAR</button></div></td></tr>)}
    </tbody></table></div>

    {selected && <div role="dialog" aria-label={`Configurar plantilla ${selected.nombre}`} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,35,60,.65)",display:"grid",placeItems:"center",padding:16}}><div style={{background:"#fff",width:900,maxWidth:"100%",maxHeight:"92vh",borderRadius:12,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 24px",borderBottom:"1px solid #e2e8f0"}}><div style={{fontSize:11,fontWeight:700,color:"#1a4f8a"}}>CONFIGURAR PLANTILLA</div><h2 style={{margin:"2px 0 0",fontSize:18}}>{selected.nombre} · {selected.version}</h2></div>
      <div style={{padding:20,overflowY:"auto",display:"grid",gridTemplateColumns:"1.35fr .65fr",gap:18}}>
        <div data-testid="template-section-list" style={{display:"flex",flexDirection:"column",gap:8}}>{config.map((sec,index)=><div key={sec.id} data-testid={`template-section-${sec.id}`} data-section-id={sec.id} draggable={!sec.bloqueada} onDragStart={()=>!sec.bloqueada&&setDraggedId(sec.id)} onDragOver={e=>{if(!sec.bloqueada)e.preventDefault();}} onDrop={()=>drop(sec.id)} style={{border:`1px solid ${draggedId===sec.id?"#1a4f8a":"#e2e8f0"}`,borderRadius:8,padding:"11px 12px",background:sec.bloqueada?"#f8fafc":"white",display:"grid",gridTemplateColumns:"28px 1fr auto",gap:10,alignItems:"center"}}>
          <span data-testid="template-drag-handle" title={sec.bloqueada?"Sección institucional bloqueada":"Arrastrar para reordenar"} aria-label={sec.bloqueada?`${sec.titulo} bloqueada`:`Mover ${sec.titulo}`} style={{fontSize:18,color:sec.bloqueada?"#94a3b8":"#1a4f8a",cursor:sec.bloqueada?"not-allowed":"grab"}}>{sec.bloqueada?"🔒":"⋮⋮"}</span>
          <div><strong style={{fontSize:13.5}}>{sec.titulo}</strong><div style={{fontSize:11.5,color:"#64748b",marginTop:2}}>{sec.detalle}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:10.5,fontWeight:700,color:sec.bloqueada?"#475569":"#166534"}}>{sec.bloqueada?"INSTITUCIONAL / BLOQUEADA":sec.estado}</div>{!sec.bloqueada&&<label style={{fontSize:11,color:"#475569"}}><input type="checkbox" checked={sec.activa} onChange={e=>setConfig(c=>c.map(x=>x.id===sec.id?{...x,activa:e.target.checked}:x))}/> Activa</label>}</div>
        </div>)}</div>
        <aside style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:8,padding:14,alignSelf:"start",position:"sticky",top:0}}><strong style={{fontSize:13}}>Vista previa de estructura</strong><ol data-testid="template-order-preview" style={{paddingLeft:22,marginBottom:0}}>{config.filter(s=>s.activa).map(s=><li key={s.id} data-section-id={s.id} style={{fontSize:12,color:"#334155",padding:"3px 0"}}>{s.titulo}</li>)}</ol></aside>
      </div>
      {saved&&<div role="status" style={{margin:"0 24px",padding:8,background:"#f0fdf4",color:"#166534",borderRadius:6}}>Configuración DEMO guardada para nuevos documentos.</div>}
      <div style={{padding:"14px 24px",borderTop:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between"}}><button className="btn btn-ghost" onClick={restore}>Restaurar predeterminado</button><div style={{display:"flex",gap:8}}><button className="btn btn-secondary" onClick={()=>setSelected(null)}>Cancelar</button><button className="btn btn-primary" onClick={()=>{onGuardar(selected.id,config);setSaved(true);}}>Guardar configuración</button></div></div>
    </div></div>}

    {preview&&<div role="dialog" aria-label={`Vista de ${preview.nombre}`} style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,35,60,.65)",display:"grid",placeItems:"center"}}><div style={{background:"white",borderRadius:12,padding:24,width:520}}><h2>{preview.nombre}</h2><ol>{preview.configuracion.filter(s=>s.activa).map(s=><li key={s.id}>{s.titulo}</li>)}</ol><button className="btn btn-secondary" onClick={()=>setPreview(null)}>Cerrar</button></div></div>}
  </div>;
}
