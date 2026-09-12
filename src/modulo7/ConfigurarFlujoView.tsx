// Pantalla 11 — Configurar Flujo de Aprobación
import React, { useState } from "react";
import { FlujoGrupo, EtapaFlujo, UsuarioAdmin } from "./types";

interface ConfigurarFlujoViewProps {
  flujo: FlujoGrupo;
  usuariosDisponibles: UsuarioAdmin[];
  onBack: () => void;
  onGuardarFlujo: (grupoId: string, etapas: EtapaFlujo[]) => void;
}

export default function ConfigurarFlujoView({
  flujo,
  usuariosDisponibles,
  onBack,
  onGuardarFlujo,
}: ConfigurarFlujoViewProps) {
  const [etapas, setEtapas] = useState<EtapaFlujo[]>(flujo.etapas);
  const [etapaEnEdicion, setEtapaEnEdicion] = useState<EtapaFlujo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form states modal edición
  const [actionMode, setActionMode] = useState<"SIGN_AND_APPROVE" | "APPROVE_ONLY">("SIGN_AND_APPROVE");
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoResponsable, setTipoResponsable] = useState<EtapaFlujo["tipoResponsable"]>("Revisores");
  const [revisoresSeleccionados, setRevisoresSeleccionados] = useState<string[]>([]);
  const [reglaAprobacion, setReglaAprobacion] = useState<"TODOS DEBEN APROBAR" | "AL MENOS UNO">("TODOS DEBEN APROBAR");
  const [errorModal, setErrorModal] = useState<string | null>(null);

  const openEditar = (etp: EtapaFlujo) => {
    setEtapaEnEdicion(etp);
    setNombre(etp.nombre);
    setActionMode(etp.actionMode || "SIGN_AND_APPROVE");
    setDescripcion(etp.descripcion);
    setTipoResponsable(etp.tipoResponsable);
    setRevisoresSeleccionados(etp.revisoresIds || []);
    setReglaAprobacion(etp.reglaAprobacion || "TODOS DEBEN APROBAR");
    setErrorModal(null);
  };

  const handleGuardarEtapa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setErrorModal("El nombre de la etapa es obligatorio.");
      return;
    }

    // Validación 5: No configurar una etapa de revisión sin al menos un revisor
    if (actionMode === "SIGN_AND_APPROVE" && tipoResponsable !== "Elaborador" && revisoresSeleccionados.length === 0) {
      setErrorModal("Una etapa con firma debe tener al menos una persona asignada.");
      return;
    }

    const revisoresNombres = tipoResponsable === "Autoridad"
      ? ["Autoridad correspondiente"]
      : revisoresSeleccionados.map(
          id => usuariosDisponibles.find(u => u.id === id)?.nombreCompleto || id
        );

    setEtapas(prev => prev.map(item => {
      if (item.id !== etapaEnEdicion?.id) return item;
      return {
        ...item,
        actionMode,
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        tipoResponsable,
        revisoresIds: actionMode === "APPROVE_ONLY" ? [] : revisoresSeleccionados,
        revisoresNombres,
        reglaAprobacion: tipoResponsable === "Revisores" ? reglaAprobacion : undefined,
      };
    }));

    setEtapaEnEdicion(null);
    setToast("Etapa actualizada correctamente.");
    setTimeout(() => setToast(null), 3500);
  };

  const handleMoverArriba = (index: number) => {
    if (index === 0) return;
    const nuevas = [...etapas];
    const temp = nuevas[index - 1];
    nuevas[index - 1] = nuevas[index];
    nuevas[index] = temp;
    // Renumerar
    const renumbered = nuevas.map((e, idx) => ({ ...e, numero: idx + 1 }));
    setEtapas(renumbered);
  };

  const handleMoverAbajo = (index: number) => {
    if (index === etapas.length - 1) return;
    const nuevas = [...etapas];
    const temp = nuevas[index + 1];
    nuevas[index + 1] = nuevas[index];
    nuevas[index] = temp;
    // Renumerar
    const renumbered = nuevas.map((e, idx) => ({ ...e, numero: idx + 1 }));
    setEtapas(renumbered);
  };

  const handleGuardarCambiosGlobales = () => {
    onGuardarFlujo(flujo.grupoId, etapas);
    setToast("Flujo secuencial guardado exitosamente.");
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Back button */}
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
          Volver a Flujos de Aprobación
        </button>

        <div style={{ fontSize: 12.5, color: "#64748b" }}>
          <span>Flujos</span> / <strong style={{ color: "#1e2a3a" }}>{flujo.grupoNombre}</strong>
        </div>
      </div>

      {/* Header */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "22px 24px",
        marginBottom: 20,
        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", marginBottom: 4 }}>
              Configuración de flujo de aprobación
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
              {flujo.grupoNombre}
            </h1>
            <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
              Defina las etapas ordenadas cronológicamente y los revisores institucionales asignados.
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleGuardarCambiosGlobales}
          >
            GUARDAR CONFIGURACIÓN DEL FLUJO
          </button>
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

      {/* Reglas obligatorias informativas */}
      <div style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "14px 18px",
        marginBottom: 20,
        fontSize: 12.5,
        color: "#475569",
        lineHeight: 1.6,
      }}>
        <strong style={{ color: "#1e2a3a" }}>Reglas operativas del flujo de aprobación:</strong>
        <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
          <li><strong>Secuencialidad estricta:</strong> El documento solo es visible para una etapa cuando le corresponde su turno.</li>
          <li><strong>Bloqueo de etapas posteriores:</strong> Una etapa no puede actuar antes de que la etapa anterior haya aprobado favorablemente.</li>
          <li><strong>Devolución al elaborador:</strong> Si un revisor devuelve el documento, regresa íntegramente al elaborador para su corrección.</li>
          <li><strong>Reinicio de aprobaciones:</strong> Al reenviar un plan corregido, TODOS los revisores de la etapa deberán aprobar nuevamente desde cero.</li>
        </ul>
      </div>

      {/* Lista Secuencial de Etapas */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {etapas.map((etp, index) => (
          <div
            key={etp.id}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1.5px solid #e2e8f0",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#1a4f8a",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                fontWeight: 800,
                flexShrink: 0,
              }}>
                {etp.numero}
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a" }}>
                    ETAPA {etp.numero}: {etp.nombre}
                  </span>
                  <span style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#1a4f8a",
                    background: "#eff6ff",
                    padding: "2px 8px",
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
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}>
                      {etp.reglaAprobacion}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: 12.5, color: "#64748b", margin: "0 0 6px" }}>
                  {etp.descripcion}
                </p>

                {etp.revisoresNombres && etp.revisoresNombres.length > 0 && (
                  <div style={{ fontSize: 12.5, color: "#1e40af", fontWeight: 600 }}>
                    {etp.tipoResponsable === "Autoridad" ? "Autoridad: " : "Revisores designados: "}
                    <strong>{etp.revisoresNombres.join(" • ")}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* Controles de etapa */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openEditar(etp)}
              >
                EDITAR ETAPA
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleMoverArriba(index)}
                disabled={index === 0}
                title="Mover etapa hacia arriba"
                style={{ opacity: index === 0 ? 0.3 : 1 }}
              >
                ▲
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleMoverAbajo(index)}
                disabled={index === etapas.length - 1}
                title="Mover etapa hacia abajo"
                style={{ opacity: index === etapas.length - 1 ? 0.3 : 1 }}
              >
                ▼
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Editar Etapa */}
      {etapaEnEdicion && (
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
            width: 520,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Editar Etapa {etapaEnEdicion.numero}: {etapaEnEdicion.nombre}
              </h2>
            </div>

            <form onSubmit={handleGuardarEtapa} style={{ padding: "20px 24px" }}>
              {errorModal && (
                <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", color: "#991b1b", padding: "10px", borderRadius: 6, fontSize: 12.5, marginBottom: 14 }}>
                  {errorModal}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre de la etapa</label>
                <input
                  type="text"
                  className="form-input"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Tipo de responsable</label>
                <select
                  className="form-select"
                  value={tipoResponsable}
                  onChange={(e) => setTipoResponsable(e.target.value as any)}
                  style={{ width: "100%" }}
                >
                  <option value="Elaborador">Elaborador</option>
                  <option value="Revisores">Revisores</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Autoridad">Autoridad</option>
                </select>
              </div>

              {/* Si es etapa de autoridad */}
              <label className="form-label">Acción de la etapa<select className="form-select" value={actionMode} onChange={e => setActionMode(e.target.value as "SIGN_AND_APPROVE" | "APPROVE_ONLY")} disabled={tipoResponsable === "Elaborador"}><option value="SIGN_AND_APPROVE">Revisión / aprobación con firma</option><option value="APPROVE_ONLY">Aprobación / registro sin firma individual</option></select></label>
              {tipoResponsable === "Autoridad" && (
                <div style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 14,
                  fontSize: 12.5,
                  color: "#1e40af",
                }}>
                  <strong>Validación final:</strong> Asignada a la <em>Autoridad correspondiente</em> configurada para este grupo institucional. El Administrador no participa automáticamente como validador.
                </div>
              )}

              {/* Si es etapa de revisión, permitir elegir revisores y regla */}
              {actionMode === "SIGN_AND_APPROVE" && tipoResponsable !== "Elaborador" && (
                <>
                  <div style={{ marginBottom: 14 }}>
                    <label className="form-label required">Revisores asignados (seleccione uno o varios)</label>
                    <div style={{
                      border: "1px solid #cbd5e1",
                      borderRadius: 8,
                      padding: "10px",
                      maxHeight: 140,
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}>
                      {usuariosDisponibles.map((u) => {
                        const checked = revisoresSeleccionados.includes(u.id);
                        return (
                          <label key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                if (checked) {
                                  setRevisoresSeleccionados(prev => prev.filter(x => x !== u.id));
                                } else {
                                  setRevisoresSeleccionados(prev => [...prev, u.id]);
                                }
                              }}
                            />
                            <span>{u.nombreCompleto} ({u.rol})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label className="form-label required">Regla de aprobación</label>
                    <select
                      className="form-select"
                      value={reglaAprobacion}
                      onChange={(e) => setReglaAprobacion(e.target.value as any)}
                      style={{ width: "100%" }}
                    >
                      <option value="TODOS DEBEN APROBAR">TODOS DEBEN APROBAR (Estricta)</option>
                      <option value="AL MENOS UNO">AL MENOS UNO</option>
                    </select>
                    <span style={{ fontSize: 11.5, color: "#64748b", marginTop: 4, display: "block" }}>
                      Con la regla "TODOS DEBEN APROBAR", cada revisor asignado debe emitir su validación favorable para avanzar a la siguiente etapa.
                    </span>
                  </div>
                </>
              )}

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEtapaEnEdicion(null)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar etapa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
