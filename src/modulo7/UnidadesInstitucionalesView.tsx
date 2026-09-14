import { useState } from "react";
import { TipoUnidadInstitucional, UnidadInstitucional } from "./types";

interface Props {
  unidades: UnidadInstitucional[];
  onGuardar: (data: { id?: string; nombre: string; tipo: TipoUnidadInstitucional; carreras: string[] }) => { success: boolean; error?: string };
  onToggleEstado: (id: string) => void;
}

export default function UnidadesInstitucionalesView({ unidades, onGuardar, onToggleEstado }: Props) {
  const [editing, setEditing] = useState<UnidadInstitucional | null>(null);
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState<TipoUnidadInstitucional>("ACADEMIC");
  const [carreras, setCarreras] = useState("");
  const [error, setError] = useState("");

  const show = (unit?: UnidadInstitucional) => {
    setEditing(unit || null); setNombre(unit?.nombre || ""); setTipo(unit?.tipo || "ACADEMIC");
    setCarreras(unit?.carreras.map(c => c.nombre).join("\n") || ""); setError(""); setOpen(true);
  };
  const save = () => {
    const result = onGuardar({ id: editing?.id, nombre, tipo, carreras: carreras.split("\n").map(v => v.trim()).filter(Boolean) });
    if (!result.success) return setError(result.error || "Revise los datos.");
    setOpen(false);
  };

  return <div style={{ padding: 28, maxWidth: 1180, margin: "0 auto" }} data-testid="institutional-units-admin">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 18 }}>
      <div><h1 style={{ fontSize: 22, margin: "0 0 4px", color: "#1e2a3a" }}>Unidades académicas y administrativas</h1><p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>Catálogo DEMO compartido por los documentos T1 y T2.</p></div>
      <button className="btn btn-primary" onClick={() => show()}>NUEVA UNIDAD</button>
    </div>
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 10, overflow: "hidden" }}>
      <table className="data-table"><thead><tr><th>Unidad</th><th>Tipo</th><th>Carreras asociadas</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
        {unidades.map(unit => <tr key={unit.id} data-unit-id={unit.id}><td><strong>{unit.nombre}</strong></td><td>{unit.tipo === "ACADEMIC" ? "Académica" : "Administrativa"}</td><td>{unit.tipo === "ACADEMIC" ? unit.carreras.map(c => c.nombre).join(", ") : "No aplica"}</td><td>{unit.estado}</td><td><div style={{display:"flex",gap:6}}><button className="btn btn-secondary btn-xs" aria-label={`Editar ${unit.nombre}`} onClick={() => show(unit)}>EDITAR</button><button className="btn btn-ghost btn-xs" aria-label={`${unit.estado === "ACTIVO" ? "Desactivar" : "Activar"} ${unit.nombre}`} onClick={() => onToggleEstado(unit.id)}>{unit.estado === "ACTIVO" ? "DESACTIVAR" : "ACTIVAR"}</button></div></td></tr>)}
      </tbody></table>
    </div>
    {open && <div role="dialog" aria-label="Unidad institucional" style={{position:"fixed",inset:0,zIndex:500,background:"rgba(15,35,60,.6)",display:"grid",placeItems:"center",padding:16}}><div style={{background:"white",width:560,maxWidth:"100%",borderRadius:12,padding:24}}>
      <h2 style={{marginTop:0}}>{editing ? "Editar unidad" : "Crear unidad"}</h2>
      <label className="form-label required">Tipo de unidad</label><select className="form-select" data-testid="institutional-unit-type" value={tipo} onChange={e=>setTipo(e.target.value as TipoUnidadInstitucional)}><option value="ACADEMIC">Académica</option><option value="ADMINISTRATIVE">Administrativa</option></select>
      <label className="form-label required" style={{marginTop:14}}>Nombre</label><input className="form-input" aria-label="Nombre de la unidad" value={nombre} onChange={e=>setNombre(e.target.value)} />
      {tipo === "ACADEMIC" && <><label className="form-label required" style={{marginTop:14}}>Carreras asociadas</label><textarea className="form-textarea" aria-label="Carreras asociadas" value={carreras} onChange={e=>setCarreras(e.target.value)} placeholder="Una carrera por línea" /><div className="form-hint">Ingrese una carrera por línea.</div></>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <div style={{display:"flex",justifyContent:"flex-end",gap:8,marginTop:18}}><button className="btn btn-secondary" onClick={()=>setOpen(false)}>Cancelar</button><button className="btn btn-primary" onClick={save}>Guardar unidad</button></div>
    </div></div>}
  </div>;
}
