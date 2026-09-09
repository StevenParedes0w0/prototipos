// Pantalla 04 — Detalle / Edición de Usuario
import React, { useState } from "react";
import { UsuarioAdmin, GrupoInstitucional, RolEnGrupo } from "./types";

interface UsuarioDetalleModalProps {
  usuario: UsuarioAdmin;
  gruposDisponibles: GrupoInstitucional[];
  onClose: () => void;
  onAsignarGrupo: (usuarioId: string, grupoId: string, rolEnGrupo: RolEnGrupo) => { success: boolean; error?: string };
  onQuitarGrupo: (usuarioId: string, grupoId: string) => void;
}

export default function UsuarioDetalleModal({
  usuario,
  gruposDisponibles,
  onClose,
  onAsignarGrupo,
  onQuitarGrupo,
}: UsuarioDetalleModalProps) {
  const [showAsignarModal, setShowAsignarModal] = useState(false);
  const [selectedGrupoId, setSelectedGrupoId] = useState(gruposDisponibles[0]?.id || "");
  const [selectedRolEnGrupo, setSelectedRolEnGrupo] = useState<RolEnGrupo>("Miembro");
  const [errorAsignacion, setErrorAsignacion] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleAsignar = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAsignacion(null);
    const res = onAsignarGrupo(usuario.id, selectedGrupoId, selectedRolEnGrupo);
    if (!res.success) {
      setErrorAsignacion(res.error || "No se pudo asignar el usuario.");
    } else {
      setShowAsignarModal(false);
      setToast("Usuario asignado al grupo correctamente.");
      setTimeout(() => setToast(null), 3500);
    }
  };

  const handleQuitar = (grupoId: string, grupoNombre: string) => {
    if (window.confirm(`¿Está seguro de remover a ${usuario.nombreCompleto} del grupo "${grupoNombre}"?`)) {
      onQuitarGrupo(usuario.id, grupoId);
      setToast("Asignación removida correctamente.");
      setTimeout(() => setToast(null), 3500);
    }
  };

  return (
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
        width: 640,
        maxWidth: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: "0 0 2px" }}>
              Detalle del Usuario
            </h2>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: 0 }}>
              Información general y asignación a grupos institucionales
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 4 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 20 }}>
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
            }}>
              {toast}
            </div>
          )}

          {/* Información General */}
          <div style={{
            background: "#f8fafc",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#1a4f8a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 700,
              }}>
                {usuario.nombres[0]}{usuario.apellidos[0]}
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a" }}>
                  {usuario.nombreCompleto}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                  {usuario.correo}
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: 999,
                  fontSize: 11.5,
                  fontWeight: 700,
                  background: usuario.estado === "ACTIVO" ? "#dcfce7" : "#fee2e2",
                  color: usuario.estado === "ACTIVO" ? "#166534" : "#991b1b",
                }}>
                  {usuario.estado}
                </span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12.5 }}>
              <div>
                <span style={{ color: "#94a3b8", display: "block" }}>Rol del sistema</span>
                <strong style={{ color: "#1a4f8a" }}>{usuario.rol}</strong>
              </div>
              <div>
                <span style={{ color: "#94a3b8", display: "block" }}>Último acceso</span>
                <strong style={{ color: "#334155" }}>{usuario.ultimoAcceso}</strong>
              </div>
            </div>
          </div>

          {/* Sección Grupos Institucionales */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e2a3a", margin: "0 0 2px" }}>
                  Grupos institucionales asignados
                </h3>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  Comisiones o unidades donde el docente participa y su rol interno
                </p>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowAsignarModal(true)}
              >
                + ASIGNAR A GRUPO
              </button>
            </div>

            {usuario.grupos.length === 0 ? (
              <div style={{
                background: "#f8fafc",
                borderRadius: 8,
                border: "1px dashed #cbd5e1",
                padding: "24px",
                textAlign: "center",
                color: "#94a3b8",
                fontSize: 13,
              }}>
                El usuario no tiene grupos institucionales asignados actualmente.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {usuario.grupos.map((grp) => (
                  <div
                    key={grp.grupoId}
                    style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 8,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>
                        {grp.grupoNombre}
                      </div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                        Rol en el grupo: <strong style={{ color: grp.rolEnGrupo.includes("Coordinador") ? "#1a4f8a" : "#475569" }}>{grp.rolEnGrupo}</strong>
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleQuitar(grp.grupoId, grp.grupoNombre)}
                      style={{ color: "#dc2626" }}
                      title="Quitar asignación del grupo"
                    >
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid #e2e8f0",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "flex-end",
        }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>

      {/* Sub-modal Asignar a Grupo */}
      {showAsignarModal && (
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
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Asignar usuario a grupo institucional
              </h3>
            </div>

            <form onSubmit={handleAsignar} style={{ padding: "20px" }}>
              {errorAsignacion && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}>
                  {errorAsignacion}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Grupo institucional</label>
                <select
                  className="form-select"
                  value={selectedGrupoId}
                  onChange={(e) => setSelectedGrupoId(e.target.value)}
                  style={{ width: "100%" }}
                  required
                >
                  {gruposDisponibles.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre} ({g.tipo})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label required">Rol dentro del grupo</label>
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
                <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                  El rol dentro del grupo determina las facultades de coordinación interna del Plan de Trabajo.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAsignarModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirmar asignación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
