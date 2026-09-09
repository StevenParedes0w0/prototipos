// Pantalla 05 — Grupos Institucionales
import React, { useState, useMemo } from "react";
import { GrupoInstitucional, TipoGrupoInstitucional } from "./types";

interface GruposInstitucionalesViewProps {
  grupos: GrupoInstitucional[];
  onSelectGrupo: (grupoId: string) => void;
  onCrearGrupo: (data: {
    nombre: string;
    tipo: TipoGrupoInstitucional;
    descripcion: string;
  }) => { success: boolean; error?: string };
}

export default function GruposInstitucionalesView({
  grupos,
  onSelectGrupo,
  onCrearGrupo,
}: GruposInstitucionalesViewProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [showNuevoModal, setShowNuevoModal] = useState(false);

  // Form nuevo grupo
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoTipo, setNuevoTipo] = useState<TipoGrupoInstitucional>("Comisión");
  const [nuevaDescripcion, setNuevaDescripcion] = useState("");
  const [errorNuevo, setErrorNuevo] = useState<string | null>(null);

  const gruposFiltrados = useMemo(() => {
    return grupos.filter((g) => {
      if (filtroTipo !== "Todos" && g.tipo !== filtroTipo) return false;
      if (filtroEstado !== "Todos" && g.estado !== filtroEstado) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          g.nombre.toLowerCase().includes(q) ||
          g.descripcion.toLowerCase().includes(q) ||
          g.tipo.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [grupos, filtroTipo, filtroEstado, busqueda]);

  const handleCrearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNuevo(null);
    const res = onCrearGrupo({
      nombre: nuevoNombre,
      tipo: nuevoTipo,
      descripcion: nuevaDescripcion,
    });
    if (!res.success) {
      setErrorNuevo(res.error || "No se pudo crear el grupo.");
    } else {
      setShowNuevoModal(false);
      setNuevoNombre("");
      setNuevaDescripcion("");
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Grupos institucionales</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Grupos institucionales
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Entidades operativas de la facultad: Comisiones, Unidades de Titulación, Clubes y Coordinaciones.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowNuevoModal(true)}
        >
          + NUEVO GRUPO
        </button>
      </div>

      {/* Filtros */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        padding: "14px 18px",
        marginBottom: 16,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 13, padding: "6px 12px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Tipo de entidad:</span>
          <select
            className="form-select"
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            <option>Comisión</option>
            <option>Unidad</option>
            <option>Club</option>
            <option>Coordinación</option>
            <option>Otro</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Estado:</span>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            <option>ACTIVO</option>
            <option>INACTIVO</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Grupo institucional</th>
              <th>Tipo</th>
              <th>Miembros</th>
              <th>Actividades configuradas</th>
              <th>Flujo de aprobación</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {gruposFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron grupos institucionales registrados con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              gruposFiltrados.map((g) => (
                <tr key={g.id}>
                  <td>
                    <div
                      onClick={() => onSelectGrupo(g.id)}
                      style={{ fontWeight: 700, color: "#1a4f8a", cursor: "pointer", fontSize: 13.5 }}
                    >
                      {g.nombre}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#64748b", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {g.descripcion}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#1a4f8a",
                      background: "#eff6ff",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}>
                      {g.tipo}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>
                      {g.miembros.length} docentes
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: "#475569" }}>
                      {g.actividades.length} actividades
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 9px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: g.flujoConfigurado ? "#dcfce7" : "#fef3c7",
                      color: g.flujoConfigurado ? "#166534" : "#92400e",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: g.flujoConfigurado ? "#22c55e" : "#f59e0b" }} />
                      {g.flujoConfigurado ? "CONFIGURADO" : "PENDIENTE"}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: g.estado === "ACTIVO" ? "#166534" : "#991b1b",
                    }}>
                      {g.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onSelectGrupo(g.id)}
                    >
                      VER DETALLE
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Grupo */}
      {showNuevoModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            width: 500,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Nuevo grupo institucional
              </h2>
            </div>

            <form onSubmit={handleCrearSubmit} style={{ padding: "20px 24px" }}>
              {errorNuevo && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}>
                  {errorNuevo}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre de la entidad</label>
                <input
                  type="text"
                  className="form-input"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  placeholder="Ej. Comisión de Investigación y Posgrado"
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Tipo de grupo</label>
                <select
                  className="form-select"
                  value={nuevoTipo}
                  onChange={(e) => setNuevoTipo(e.target.value as TipoGrupoInstitucional)}
                  style={{ width: "100%" }}
                  required
                >
                  <option value="Comisión">Comisión</option>
                  <option value="Unidad">Unidad</option>
                  <option value="Club">Club</option>
                  <option value="Coordinación">Coordinación</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Descripción institucional</label>
                <textarea
                  className="form-input"
                  value={nuevaDescripcion}
                  onChange={(e) => setNuevaDescripcion(e.target.value)}
                  placeholder="Objetivo y competencias del grupo institucional..."
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowNuevoModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
