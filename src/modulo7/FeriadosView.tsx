// Pantalla 12 — Feriados y Días Restringidos
import React, { useState } from "react";
import { FeriadoItem } from "./types";

interface FeriadosViewProps {
  feriados: FeriadoItem[];
  onAgregarFeriado: (data: {
    fecha: string;
    descripcion: string;
    tipo: "Feriado nacional" | "Feriado local" | "Receso institucional";
  }) => { success: boolean; error?: string };
  onToggleEstadoFeriado: (id: string) => void;
}

function formatFechaVisual(fechaIso: string): string {
  if (!fechaIso) return "";
  const parts = fechaIso.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}/${m}/${y}`;
  }
  return fechaIso;
}

export default function FeriadosView({
  feriados,
  onAgregarFeriado,
  onToggleEstadoFeriado,
}: FeriadosViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState<"Feriado nacional" | "Feriado local" | "Receso institucional">("Feriado nacional");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = onAgregarFeriado({ fecha, descripcion, tipo });
    if (!res.success) {
      setError(res.error || "No se pudo registrar el feriado.");
    } else {
      setShowModal(false);
      setFecha("");
      setDescripcion("");
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Feriados y días restringidos</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Feriados y días restringidos
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Calendario oficial de días inhábiles para la validación de fechas de actividades docentes.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + NUEVO FERIADO
        </button>
      </div>

      {/* Caja de Regla Funcional Obligatoria */}
      <div style={{
        background: "#eff6ff",
        border: "1.5px solid #bfdbfe",
        borderRadius: 10,
        padding: "16px 20px",
        marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#dbeafe",
            color: "#1e40af",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1e3a8a", marginBottom: 4 }}>
              Regla de validación de feriados en actividades:
            </div>
            <p style={{ fontSize: 13, color: "#1e40af", margin: "0 0 8px", lineHeight: 1.55 }}>
              Los feriados registrados <strong>únicamente restringen</strong> que una actividad <strong>inicie (Desde)</strong> o <strong>finalice (Hasta)</strong> en dicho día inhábil. Un feriado situado <em>entre</em> ambas fechas no invalida el rango de ejecución.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: 12 }}>
              <div style={{ background: "#dcfce7", padding: "8px 12px", borderRadius: 6, color: "#166534" }}>
                ✓ <strong>Rango PERMITIDO:</strong> Desde 08/10/2026 hasta 12/10/2026 (aunque el 09/10/2026 sea feriado intermedio).
              </div>
              <div style={{ background: "#fee2e2", padding: "8px 12px", borderRadius: 6, color: "#991b1b" }}>
                ✕ <strong>Rango NO PERMITIDO:</strong> Desde 09/10/2026 (inicio en feriado) o Hasta 09/10/2026 (fin en feriado).
              </div>
            </div>
          </div>
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
              <th>Fecha del feriado</th>
              <th>Descripción</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {feriados.map((f) => {
              const isActivo = f.estado === "ACTIVO";
              return (
                <tr key={f.id}>
                  <td>
                    <strong style={{ color: "#1e2a3a", fontSize: 13.5, fontFamily: "'JetBrains Mono', monospace" }}>
                      {formatFechaVisual(f.fecha)}
                    </strong>
                  </td>
                  <td>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#334155" }}>
                      {f.descripcion}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: f.tipo.includes("nacional") ? "#0891b2" : "#7c3aed",
                      background: "#f1f5f9",
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}>
                      {f.tipo}
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
                      {f.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => onToggleEstadoFeriado(f.id)}
                      style={{ color: isActivo ? "#dc2626" : "#16a34a" }}
                    >
                      {isActivo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Feriado */}
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
            width: 480,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Nuevo feriado o día restringido
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: "20px 24px" }}>
              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Fecha</label>
                <input
                  type="date"
                  className="form-input"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Descripción del feriado</label>
                <input
                  type="text"
                  className="form-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej. Fundación de Ambato"
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label required">Tipo</label>
                <select
                  className="form-select"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as any)}
                  style={{ width: "100%" }}
                >
                  <option value="Feriado nacional">Feriado nacional</option>
                  <option value="Feriado local">Feriado local</option>
                  <option value="Receso institucional">Receso institucional</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar feriado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
