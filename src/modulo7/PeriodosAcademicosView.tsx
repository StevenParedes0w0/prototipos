// Pantalla 07 — Períodos Académicos
import React, { useState } from "react";
import { PeriodoAcademico } from "./types";
import { Eye, Pencil, CheckCircle2 } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";

interface PeriodosAcademicosViewProps {
  periodos: PeriodoAcademico[];
  onCrearPeriodo: (data: {
    nombre: string;
    desde: string;
    hasta: string;
    ventanaElaboracionDesde: string;
    ventanaElaboracionHasta: string;
    ventanaRevisionDesde: string;
    ventanaRevisionHasta: string;
  }) => { success: boolean; error?: string };
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

export default function PeriodosAcademicosView({
  periodos,
  onCrearPeriodo,
}: PeriodosAcademicosViewProps) {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [elabDesde, setElabDesde] = useState("");
  const [elabHasta, setElabHasta] = useState("");
  const [revDesde, setRevDesde] = useState("");
  const [revHasta, setRevHasta] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal Ver/Editar
  const [periodoVer, setPeriodoVer] = useState<PeriodoAcademico | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = onCrearPeriodo({
      nombre,
      desde,
      hasta,
      ventanaElaboracionDesde: elabDesde,
      ventanaElaboracionHasta: elabHasta,
      ventanaRevisionDesde: revDesde,
      ventanaRevisionHasta: revHasta,
    });
    if (!res.success) {
      setError(res.error || "Error al crear el período.");
    } else {
      setShowModal(false);
      setNombre("");
      setDesde("");
      setHasta("");
      setElabDesde("");
      setElabHasta("");
      setRevDesde("");
      setRevHasta("");
    }
  };

  const estadoBadge: Record<string, { bg: string; color: string }> = {
    ACTIVO:   { bg: "#dcfce7", color: "#166534" },
    CERRADO:  { bg: "#f1f5f9", color: "#475569" },
    BORRADOR: { bg: "#fef3c7", color: "#92400e" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Períodos académicos</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Períodos académicos
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Configuración de calendarios académicos, ventanas de elaboración de planes y períodos de revisión.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + NUEVO PERÍODO
        </button>
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
              <th>Período académico</th>
              <th>Fecha Desde</th>
              <th>Fecha Hasta</th>
              <th>Ventana de elaboración</th>
              <th>Ventana de revisión</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {periodos.map((p) => {
              const badge = estadoBadge[p.estado] || estadoBadge.BORRADOR;
              return (
                <tr key={p.id}>
                  <td>
                    <strong style={{ color: "#1e2a3a", fontSize: 13.5 }}>{p.nombre}</strong>
                  </td>
                  <td style={{ fontSize: 12.5, color: "#475569" }}>
                    {formatFechaVisual(p.desde)}
                  </td>
                  <td style={{ fontSize: 12.5, color: "#475569" }}>
                    {formatFechaVisual(p.hasta)}
                  </td>
                  <td style={{ fontSize: 12, color: "#1e40af" }}>
                    {formatFechaVisual(p.ventanaElaboracionDesde)} al {formatFechaVisual(p.ventanaElaboracionHasta)}
                  </td>
                  <td style={{ fontSize: 12, color: "#0891b2" }}>
                    {formatFechaVisual(p.ventanaRevisionDesde)} al {formatFechaVisual(p.ventanaRevisionHasta)}
                  </td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 9px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: badge.bg,
                      color: badge.color,
                    }}>
                      {p.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setPeriodoVer(p)}
                      >
                        VER
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setPeriodoVer(p)}
                      >
                        EDITAR
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Nuevo Período */}
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
            width: 540,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Configurar nuevo período académico
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
                <label className="form-label required">Nombre del período</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Enero – Junio 2027"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="form-label required">Fecha de inicio (Desde)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="form-label required">Fecha de finalización (Hasta)</label>
                  <input
                    type="date"
                    className="form-input"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                marginBottom: 14,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a4f8a", marginBottom: 8 }}>
                  Ventana de elaboración de Planes de Trabajo
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Habilitar desde</label>
                    <input
                      type="date"
                      className="form-input"
                      value={elabDesde}
                      onChange={(e) => setElabDesde(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Límite elaboración</label>
                    <input
                      type="date"
                      className="form-input"
                      value={elabHasta}
                      onChange={(e) => setElabHasta(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{
                background: "#f8fafc",
                borderRadius: 8,
                padding: "12px 14px",
                border: "1px solid #e2e8f0",
                marginBottom: 20,
              }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0891b2", marginBottom: 8 }}>
                  Ventana de revisión institucional
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Revisión desde</label>
                    <input
                      type="date"
                      className="form-input"
                      value={revDesde}
                      onChange={(e) => setRevDesde(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11.5, color: "#64748b", display: "block" }}>Límite revisión</label>
                    <input
                      type="date"
                      className="form-input"
                      value={revHasta}
                      onChange={(e) => setRevHasta(e.target.value)}
                    />
                  </div>
                </div>
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
                  Guardar período
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ver Período */}
      {periodoVer && (
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
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                {periodoVer.nombre}
              </h2>
              <span style={{
                padding: "3px 9px",
                borderRadius: 999,
                fontSize: 11.5,
                fontWeight: 700,
                background: estadoBadge[periodoVer.estado]?.bg,
                color: estadoBadge[periodoVer.estado]?.color,
              }}>
                {periodoVer.estado}
              </span>
            </div>

            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <span style={{ color: "#94a3b8", fontSize: 12, display: "block" }}>Duración académica del ciclo</span>
                <strong style={{ color: "#1e2a3a", fontSize: 14 }}>{formatFechaVisual(periodoVer.desde)} al {formatFechaVisual(periodoVer.hasta)}</strong>
              </div>

              <div style={{ background: "#eff6ff", padding: "12px", borderRadius: 8, border: "1px solid #bfdbfe" }}>
                <span style={{ color: "#1e40af", fontSize: 12, fontWeight: 700, display: "block", marginBottom: 2 }}>
                  Ventana de elaboración para docentes
                </span>
                <div style={{ fontSize: 13, color: "#1e3a8a" }}>
                  {formatFechaVisual(periodoVer.ventanaElaboracionDesde)} al {formatFechaVisual(periodoVer.ventanaElaboracionHasta)}
                </div>
              </div>

              <div style={{ background: "#ecfeff", padding: "12px", borderRadius: 8, border: "1px solid #a5f3fc" }}>
                <span style={{ color: "#0891b2", fontSize: 12, fontWeight: 700, display: "block", marginBottom: 2 }}>
                  Ventana de revisión para revisores institucionales
                </span>
                <div style={{ fontSize: 13, color: "#164e63" }}>
                  {formatFechaVisual(periodoVer.ventanaRevisionDesde)} al {formatFechaVisual(periodoVer.ventanaRevisionHasta)}
                </div>
              </div>
            </div>

            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setPeriodoVer(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
