// Pantalla 06 — Detalle de Grupo Institucional
import React, { useState } from "react";
import { GrupoInstitucional, UsuarioAdmin, RolEnGrupo, FlujoGrupo } from "./types";

interface GrupoDetalleViewProps {
  grupo: GrupoInstitucional;
  usuariosDisponibles: UsuarioAdmin[];
  flujo?: FlujoGrupo;
  onBack: () => void;
  onAgregarIntegrante: (usuarioId: string, grupoId: string, rolEnGrupo: RolEnGrupo) => { success: boolean; error?: string };
  onQuitarIntegrante: (usuarioId: string, grupoId: string) => void;
  onToggleObligatoriedad: (grupoId: string, actividadId: string) => void;
  onNavigateFlujos?: (grupoId: string) => void;
}

export default function GrupoDetalleView({
  grupo,
  usuariosDisponibles,
  flujo,
  onBack,
  onAgregarIntegrante,
  onQuitarIntegrante,
  onToggleObligatoriedad,
  onNavigateFlujos,
}: GrupoDetalleViewProps) {
  const [activeTab, setActiveTab] = useState<"info" | "integrantes" | "actividades" | "flujo">("integrantes");
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(usuariosDisponibles[0]?.id || "");
  const [selectedRolEnGrupo, setSelectedRolEnGrupo] = useState<RolEnGrupo>("Miembro");
  const [errorAgregar, setErrorAgregar] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleAgregarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAgregar(null);
    const res = onAgregarIntegrante(selectedUsuarioId, grupo.id, selectedRolEnGrupo);
    if (!res.success) {
      setErrorAgregar(res.error || "No se pudo agregar el integrante.");
    } else {
      setShowAgregarModal(false);
      setToast("Integrante agregado al grupo exitosamente.");
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleQuitarIntegrante = (usuarioId: string, nombreCompleto: string) => {
    if (window.confirm(`¿Está seguro de remover a ${nombreCompleto} de "${grupo.nombre}"? (El usuario no será eliminado del sistema).`)) {
      onQuitarIntegrante(usuarioId, grupo.id);
      setToast("Integrante removido del grupo.");
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleToggleOblig = (actId: string, actNombre: string, currentOblig: string) => {
    const nextOblig = currentOblig === "OBLIGATORIA" ? "OPCIONAL" : "OBLIGATORIA";
    if (window.confirm(`¿Desea cambiar la actividad "${actNombre}" a ${nextOblig}?`)) {
      onToggleObligatoriedad(grupo.id, actId);
      setToast(`Actividad marcada como ${nextOblig}.`);
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb & Back */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "#1a4f8a",
            fontWeight: 600,
            padding: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver a Grupos Institucionales
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#64748b" }}>
          <span>Grupos</span>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <strong style={{ color: "#1e2a3a" }}>{grupo.nombre}</strong>
        </div>
      </div>

      {/* Header Card */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "22px 24px",
        marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#1a4f8a",
                background: "#eff6ff",
                padding: "3px 8px",
                borderRadius: 4,
                textTransform: "uppercase",
              }}>
                {grupo.tipo}
              </span>
              <span style={{
                fontSize: 11,
                fontWeight: 700,
                color: grupo.estado === "ACTIVO" ? "#166534" : "#991b1b",
                background: grupo.estado === "ACTIVO" ? "#dcfce7" : "#fee2e2",
                padding: "3px 8px",
                borderRadius: 999,
              }}>
                {grupo.estado}
              </span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
              {grupo.nombre}
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              {grupo.descripcion}
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Integrantes</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a" }}>{grupo.miembros.length}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Actividades</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a" }}>{grupo.actividades.length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex",
          gap: 24,
          borderBottom: "1px solid #e2e8f0",
          marginTop: 20,
        }}>
          {[
            { id: "integrantes", label: `Integrantes (${grupo.miembros.length})` },
            { id: "actividades", label: `Actividades (${grupo.actividades.length})` },
            { id: "flujo", label: "Flujo de aprobación" },
            { id: "info", label: "Información general" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: "none",
                border: "none",
                borderBottom: activeTab === tab.id ? "2.5px solid #1a4f8a" : "2.5px solid transparent",
                padding: "8px 4px 12px",
                color: activeTab === tab.id ? "#1a4f8a" : "#64748b",
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: 13.5,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          background: "#dcfce7",
          border: "1px solid #86efac",
          color: "#166534",
          padding: "10px 14px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 16,
        }}>
          {toast}
        </div>
      )}

      {/* Tab: Integrantes */}
      {activeTab === "integrantes" && (
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>
                Docentes integrantes del grupo
              </h3>
              <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
                Docentes facultados para elaborar y ejecutar las actividades de este grupo
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowAgregarModal(true)}
            >
              + AGREGAR INTEGRANTE
            </button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Docente</th>
                <th>Correo institucional</th>
                <th>Rol en el grupo</th>
                <th style={{ textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {grupo.miembros.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
                    No hay docentes asignados a este grupo actualmente.
                  </td>
                </tr>
              ) : (
                grupo.miembros.map((m) => (
                  <tr key={m.usuarioId}>
                    <td style={{ fontWeight: 700, color: "#1e2a3a" }}>
                      {m.nombreCompleto}
                    </td>
                    <td style={{ fontSize: 12.5, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                      {m.correo}
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: m.rolEnGrupo.includes("Coordinador") ? "#1a4f8a" : "#334155",
                        background: m.rolEnGrupo.includes("Coordinador") ? "#eff6ff" : "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {m.rolEnGrupo}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleQuitarIntegrante(m.usuarioId, m.nombreCompleto)}
                        style={{ color: "#dc2626" }}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Actividades */}
      {activeTab === "actividades" && (
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>
              Actividades asociadas y obligatoriedad
            </h3>
            <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
              Esta configuración alimenta el Paso 2 de creación del Plan de Trabajo para este grupo institucional.
            </p>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Actividad</th>
                <th>Categoría</th>
                <th>Obligatoriedad</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {grupo.actividades.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "28px 0", color: "#94a3b8" }}>
                    No hay actividades preconfiguradas para este grupo.
                  </td>
                </tr>
              ) : (
                grupo.actividades.map((act) => {
                  const isOblig = act.obligatoriedad === "OBLIGATORIA";
                  return (
                    <tr key={act.id}>
                      <td style={{ fontWeight: 700, color: "#1e2a3a", maxWidth: 360 }}>
                        {act.nombre}
                      </td>
                      <td>
                        <span style={{ fontSize: 12, color: "#475569", background: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>
                          {act.categoria}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: isOblig ? "#dbeafe" : "#f1f5f9",
                          color: isOblig ? "#1e40af" : "#475569",
                        }}>
                          {act.obligatoriedad}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: "#166534" }}>
                          {act.estado}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleOblig(act.id, act.nombre, act.obligatoriedad)}
                          title="Alternar obligatoriedad de la actividad para este grupo"
                        >
                          Cambiar a {isOblig ? "OPCIONAL" : "OBLIGATORIA"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Flujo de Aprobación */}
      {activeTab === "flujo" && (
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Flujo de aprobación secuencial — {grupo.nombre}
              </h3>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>
                Secuencia de etapas ordenadas. Cada etapa debe completarse antes de habilitar la siguiente.
              </p>
            </div>
            {onNavigateFlujos && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => onNavigateFlujos(grupo.id)}
              >
                CONFIGURAR ETAPAS
              </button>
            )}
          </div>

          {!flujo || flujo.etapas.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>
              No se ha configurado un flujo de aprobación para este grupo.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {flujo.etapas.map((etp) => (
                <div
                  key={etp.id}
                  style={{
                    border: "1.5px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#f8fafc",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      background: "#1a4f8a",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: 14,
                    }}>
                      {etp.numero}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#1e2a3a" }}>
                          {etp.nombre}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#1a4f8a",
                          background: "#dbeafe",
                          padding: "1px 7px",
                          borderRadius: 4,
                        }}>
                          {etp.tipoResponsable}
                        </span>
                        {etp.reglaAprobacion && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#166534",
                            background: "#dcfce7",
                            padding: "1px 7px",
                            borderRadius: 4,
                          }}>
                            {etp.reglaAprobacion}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: 12.5, color: "#64748b", margin: "3px 0 0" }}>
                        {etp.descripcion}
                      </p>
                      {etp.revisoresNombres && etp.revisoresNombres.length > 0 && (
                        <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600, marginTop: 4 }}>
                          {etp.tipoResponsable === "Autoridad" ? "Autoridad: " : "Revisores asignados: "}
                          {etp.revisoresNombres.join(" • ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Información General */}
      {activeTab === "info" && (
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginBottom: 16 }}>
            Datos del Grupo Institucional
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, fontSize: 13 }}>
            <div>
              <span style={{ color: "#94a3b8", display: "block", marginBottom: 4 }}>Nombre del grupo</span>
              <strong style={{ color: "#1e2a3a" }}>{grupo.nombre}</strong>
            </div>
            <div>
              <span style={{ color: "#94a3b8", display: "block", marginBottom: 4 }}>Tipo de entidad</span>
              <strong style={{ color: "#1a4f8a" }}>{grupo.tipo}</strong>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <span style={{ color: "#94a3b8", display: "block", marginBottom: 4 }}>Descripción institucional</span>
              <p style={{ color: "#334155", margin: 0, lineHeight: 1.6 }}>{grupo.descripcion}</p>
            </div>
            <div>
              <span style={{ color: "#94a3b8", display: "block", marginBottom: 4 }}>Estado</span>
              <span style={{
                display: "inline-block",
                padding: "3px 8px",
                borderRadius: 99,
                fontSize: 11.5,
                fontWeight: 700,
                background: "#dcfce7",
                color: "#166534",
              }}>
                {grupo.estado}
              </span>
            </div>
            <div>
              <span style={{ color: "#94a3b8", display: "block", marginBottom: 4 }}>Flujo configurado</span>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: grupo.flujoConfigurado ? "#166534" : "#991b1b" }}>
                {grupo.flujoConfigurado ? "Sí, flujo activo" : "Pendiente de configuración"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Agregar Integrante */}
      {showAgregarModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.75)",
          zIndex: 600,
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
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Agregar integrante a {grupo.nombre}
              </h3>
            </div>

            <form onSubmit={handleAgregarSubmit} style={{ padding: "20px" }}>
              {errorAgregar && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}>
                  {errorAgregar}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Docente</label>
                <select
                  className="form-select"
                  value={selectedUsuarioId}
                  onChange={(e) => setSelectedUsuarioId(e.target.value)}
                  style={{ width: "100%" }}
                  required
                >
                  {usuariosDisponibles.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombreCompleto} ({u.correo})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label required">Rol en el grupo</label>
                <select
                  className="form-select"
                  value={selectedRolEnGrupo}
                  onChange={(e) => setSelectedRolEnGrupo(e.target.value as RolEnGrupo)}
                  style={{ width: "100%" }}
                  required
                >
                  <option value="Miembro">Miembro</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAgregarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Agregar integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
