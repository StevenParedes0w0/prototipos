// Pantalla 08 — Catálogo de Actividades Institucionales
import React, { useState, useMemo } from "react";
import { ActividadCatalogo } from "./types";

interface ActividadesInstitucionalesViewProps {
  actividades: ActividadCatalogo[];
  onAgregarActividad: (data: {
    nombre: string;
    descripcion: string;
    categoria: "POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra";
  }) => { success: boolean; error?: string };
}

export default function ActividadesInstitucionalesView({
  actividades,
  onAgregarActividad,
}: ActividadesInstitucionalesViewProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todos");
  const [showModal, setShowModal] = useState(false);

  // Form
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<"POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra">("POA");
  const [error, setError] = useState<string | null>(null);

  const filtradas = useMemo(() => {
    return actividades.filter((a) => {
      if (filtroCategoria !== "Todos" && a.categoria !== filtroCategoria) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          a.nombre.toLowerCase().includes(q) ||
          a.descripcion.toLowerCase().includes(q) ||
          a.categoria.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [actividades, filtroCategoria, busqueda]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = onAgregarActividad({
      nombre,
      descripcion,
      categoria,
    });
    if (!res.success) {
      setError(res.error || "No se pudo guardar la actividad.");
    } else {
      setShowModal(false);
      setNombre("");
      setDescripcion("");
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Actividades institucionales</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Actividades institucionales
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Catálogo institucional base para la selección de actividades POA, Planes de Mejora y Acciones de Mejora.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + NUEVA ACTIVIDAD INSTITUCIONAL
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
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Categoría:</span>
          <select
            className="form-select"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            <option>POA</option>
            <option>Plan de Mejoras</option>
            <option>Acción de Mejora</option>
            <option>Otra</option>
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
              <th>Actividad institucional</th>
              <th>Categoría</th>
              <th>Grupos asociados</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron actividades institucionales con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filtradas.map((act) => (
                <tr key={act.id}>
                  <td style={{ maxWidth: 380 }}>
                    <strong style={{ color: "#1e2a3a", fontSize: 13.5, display: "block" }}>
                      {act.nombre}
                    </strong>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {act.descripcion}
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
                      {act.categoria}
                    </span>
                  </td>
                  <td>
                    {act.gruposAsociadosNombres.length === 0 ? (
                      <span style={{ color: "#94a3b8", fontSize: 12 }}>Sin asociar</span>
                    ) : (
                      <span style={{ fontSize: 12.5, color: "#334155", fontWeight: 500 }}>
                        {act.gruposAsociadosNombres.join(", ")}
                      </span>
                    )}
                  </td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 8px",
                      borderRadius: 99,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: "#dcfce7",
                      color: "#166534",
                    }}>
                      {act.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button className="btn btn-secondary btn-sm">
                      VER
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Actividad */}
      {showModal && (
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
                Nueva actividad institucional
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
              {error && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre de la actividad</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Revisión y actualización de sílabos por carrera"
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Categoría institucional</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as any)}
                  style={{ width: "100%" }}
                  required
                >
                  <option value="POA">POA</option>
                  <option value="Plan de Mejoras">Plan de Mejoras</option>
                  <option value="Acción de Mejora">Acción de Mejora</option>
                  <option value="Otra">Otra</option>
                </select>
                <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                  Las actividades institucionales base suelen pertenecer a POA o Planes de Mejora.
                </span>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Finalidad y alcance de la actividad..."
                  rows={3}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar en catálogo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
