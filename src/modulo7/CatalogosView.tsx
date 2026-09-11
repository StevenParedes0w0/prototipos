// Pantalla 09 — Catálogos: Recursos y Medios de Verificación
import React, { useState } from "react";
import { RecursoCatalogo, MedioVerificacionCatalogo } from "./types";
import { Eye, Pencil, Trash2 } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";

interface CatalogosViewProps {
  recursos: RecursoCatalogo[];
  medios: MedioVerificacionCatalogo[];
  onAgregarRecurso: (nombre: string, descripcion: string) => { success: boolean; error?: string };
  onToggleEstadoRecurso: (id: string) => void;
  onAgregarMedio: (nombre: string, descripcion: string) => { success: boolean; error?: string };
  onToggleEstadoMedio: (id: string) => void;
}

export default function CatalogosView({
  recursos,
  medios,
  onAgregarRecurso,
  onToggleEstadoRecurso,
  onAgregarMedio,
  onToggleEstadoMedio,
}: CatalogosViewProps) {
  const [tab, setTab] = useState<"recursos" | "medios">("recursos");
  const [busqueda, setBusqueda] = useState("");

  // Modales
  const [showModalRecurso, setShowModalRecurso] = useState(false);
  const [showModalMedio, setShowModalMedio] = useState(false);

  // Form states
  const [nombreItem, setNombreItem] = useState("");
  const [descItem, setDescItem] = useState("");
  const [errorItem, setErrorItem] = useState<string | null>(null);

  const handleCrearRecurso = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorItem(null);
    const res = onAgregarRecurso(nombreItem, descItem);
    if (!res.success) {
      setErrorItem(res.error || "No se pudo guardar el recurso.");
    } else {
      setShowModalRecurso(false);
      setNombreItem("");
      setDescItem("");
    }
  };

  const handleCrearMedio = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorItem(null);
    const res = onAgregarMedio(nombreItem, descItem);
    if (!res.success) {
      setErrorItem(res.error || "No se pudo guardar el medio de verificación.");
    } else {
      setShowModalMedio(false);
      setNombreItem("");
      setDescItem("");
    }
  };

  const handleEliminarBloqueado = (nombre: string) => {
    alert(`Operación denegada por integridad institucional:\n\nNo se permite eliminar físicamente "${nombre}" debido a que forma parte del registro histórico de Planes de Trabajo ya aprobados o ejecutados. En su lugar, puede DESACTIVARLO para impedir su uso en futuros planes.`);
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Catálogos</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Catálogos institucionales
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Configuración de recursos de apoyo y medios de verificación requeridos en actividades.
          </p>
        </div>

        <div>
          {tab === "recursos" ? (
            <button
              className="btn btn-primary"
              onClick={() => {
                setErrorItem(null);
                setNombreItem("");
                setDescItem("");
                setShowModalRecurso(true);
              }}
            >
              + NUEVO RECURSO
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => {
                setErrorItem(null);
                setNombreItem("");
                setDescItem("");
                setShowModalMedio(true);
              }}
            >
              + NUEVO MEDIO DE VERIFICACIÓN
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 20,
        borderBottom: "1px solid #e2e8f0",
        marginBottom: 20,
      }}>
        <button
          onClick={() => { setTab("recursos"); setBusqueda(""); }}
          style={{
            background: "none",
            border: "none",
            borderBottom: tab === "recursos" ? "2.5px solid #1a4f8a" : "2.5px solid transparent",
            padding: "8px 4px 12px",
            color: tab === "recursos" ? "#1a4f8a" : "#64748b",
            fontWeight: tab === "recursos" ? 700 : 500,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Recursos de trabajo ({recursos.length})
        </button>
        <button
          onClick={() => { setTab("medios"); setBusqueda(""); }}
          style={{
            background: "none",
            border: "none",
            borderBottom: tab === "medios" ? "2.5px solid #1a4f8a" : "2.5px solid transparent",
            padding: "8px 4px 12px",
            color: tab === "medios" ? "#1a4f8a" : "#64748b",
            fontWeight: tab === "medios" ? 700 : 500,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Medios de verificación ({medios.length})
        </button>
      </div>

      {/* Nota institucional informativa */}
      {tab === "medios" && (
        <div style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 8,
          padding: "12px 16px",
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 13,
          color: "#1e40af",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <span>
            <strong>Regla institucional vigente:</strong> Cada medio de verificación seleccionado por el docente en su actividad exige exactamente <strong>1 archivo PDF</strong> para su cumplimiento y validación.
          </span>
        </div>
      )}

      {/* Tabla Recursos */}
      {tab === "recursos" && (
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
                <th>Recurso de trabajo</th>
                <th>Descripción</th>
                <th>Uso histórico</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recursos.map((r) => {
                const isActivo = r.estado === "ACTIVO";
                return (
                  <tr key={r.id}>
                    <td>
                      <strong style={{ color: "#1e2a3a", fontSize: 13.5 }}>{r.nombre}</strong>
                    </td>
                    <td style={{ fontSize: 12.5, color: "#64748b" }}>
                      {r.descripcion}
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: r.enUsoHistorico ? "#0891b2" : "#94a3b8", fontWeight: 500 }}>
                        {r.enUsoHistorico ? "En planes registrados" : "Sin uso"}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: 99,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: isActivo ? "#dcfce7" : "#f1f5f9",
                        color: isActivo ? "#166534" : "#64748b",
                      }}>
                        {r.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onToggleEstadoRecurso(r.id)}
                          style={{ color: isActivo ? "#dc2626" : "#16a34a" }}
                        >
                          {isActivo ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEliminarBloqueado(r.nombre)}
                          style={{ color: "#94a3b8" }}
                          title="Eliminar del catálogo"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tabla Medios */}
      {tab === "medios" && (
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
                <th>Medio de verificación</th>
                <th>Descripción</th>
                <th>Formato exigido</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medios.map((m) => {
                const isActivo = m.estado === "ACTIVO";
                return (
                  <tr key={m.id}>
                    <td>
                      <strong style={{ color: "#1e2a3a", fontSize: 13.5 }}>{m.nombre}</strong>
                    </td>
                    <td style={{ fontSize: 12.5, color: "#64748b" }}>
                      {m.descripcion}
                    </td>
                    <td>
                      <span style={{
                        fontSize: 11.5,
                        fontWeight: 700,
                        color: "#1e40af",
                        background: "#dbeafe",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {m.formatoRequerido}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "3px 8px",
                        borderRadius: 99,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: isActivo ? "#dcfce7" : "#f1f5f9",
                        color: isActivo ? "#166534" : "#64748b",
                      }}>
                        {m.estado}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: 6 }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onToggleEstadoMedio(m.id)}
                          style={{ color: isActivo ? "#dc2626" : "#16a34a" }}
                        >
                          {isActivo ? "Desactivar" : "Activar"}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleEliminarBloqueado(m.nombre)}
                          style={{ color: "#94a3b8" }}
                          title="Eliminar del catálogo"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Nuevo Recurso */}
      {showModalRecurso && (
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
            width: 480,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Nuevo recurso al catálogo
              </h2>
            </div>
            <form onSubmit={handleCrearRecurso} style={{ padding: "20px 24px" }}>
              {errorItem && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
                  {errorItem}
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre del recurso</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombreItem}
                  onChange={(e) => setNombreItem(e.target.value)}
                  placeholder="Ej. Servidor de pruebas para desarrollo"
                  required
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={descItem}
                  onChange={(e) => setDescItem(e.target.value)}
                  placeholder="Especificaciones o ubicación del recurso..."
                  rows={3}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModalRecurso(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuevo Medio */}
      {showModalMedio && (
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
            width: 480,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Nuevo medio de verificación
              </h2>
            </div>
            <form onSubmit={handleCrearMedio} style={{ padding: "20px 24px" }}>
              {errorItem && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
                  {errorItem}
                </div>
              )}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre del medio</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombreItem}
                  onChange={(e) => setNombreItem(e.target.value)}
                  placeholder="Ej. Constancia de publicación científica"
                  required
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">Formato exigido</label>
                <input
                  type="text"
                  className="form-input"
                  value="1 archivo PDF (regla fija del sistema)"
                  disabled
                  style={{ background: "#f8fafc", color: "#64748b" }}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={descItem}
                  onChange={(e) => setDescItem(e.target.value)}
                  placeholder="Características del documento requerido..."
                  rows={3}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModalMedio(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar medio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
