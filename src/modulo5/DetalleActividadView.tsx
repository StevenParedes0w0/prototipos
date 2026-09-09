import React, { useState } from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";
import { DOCENTE_ACTUAL } from "./useActividadesState";
import ModalCargaEvidencia from "./ModalCargaEvidencia";
import ModalReemplazarEvidencia from "./ModalReemplazarEvidencia";
import VisorPdfModal from "./VisorPdfModal";
import ModalAuditoria from "./ModalAuditoria";
import ModalVerObservacionDocente from "../modulo6/ModalVerObservacionDocente";

interface DetalleActividadViewProps {
  actividad: ActividadEjecucion;
  onBack: () => void;
  onCargarEvidencia: (actividadId: string, medioId: string, archivo: { nombre: string; tamano: string }) => void;
  onReemplazarEvidencia: (actividadId: string, medioId: string, archivo: { nombre: string; tamano: string }, motivo?: string) => void;
  initialModalDirecto?: { tipo: "observacion" | "visor"; medioId: string } | null;
}

export default function DetalleActividadView({
  actividad,
  onBack,
  onCargarEvidencia,
  onReemplazarEvidencia,
  initialModalDirecto,
}: DetalleActividadViewProps) {
  const [medioParaCargar, setMedioParaCargar] = useState<MedioVerificacion | null>(null);
  const [medioParaReemplazar, setMedioParaReemplazar] = useState<MedioVerificacion | null>(null);
  const [medioParaVer, setMedioParaVer] = useState<MedioVerificacion | null>(() => {
    if (initialModalDirecto?.tipo === "visor") {
      return (
        actividad.medios.find(m => m.id === initialModalDirecto.medioId) ||
        actividad.medios.find(m => m.estado === "VALIDADA") ||
        actividad.medios[0] ||
        null
      );
    }
    return null;
  });
  const [medioParaAuditoria, setMedioParaAuditoria] = useState<MedioVerificacion | null>(null);
  const [medioParaObservacion, setMedioParaObservacion] = useState<MedioVerificacion | null>(() => {
    if (initialModalDirecto?.tipo === "observacion") {
      return (
        actividad.medios.find(m => m.id === initialModalDirecto.medioId) ||
        actividad.medios.find(m => m.estado === "OBSERVADA") ||
        actividad.medios[0] ||
        null
      );
    }
    return null;
  });

  React.useEffect(() => {
    if (initialModalDirecto?.tipo === "observacion") {
      const target =
        actividad.medios.find(m => m.id === initialModalDirecto.medioId) ||
        actividad.medios.find(m => m.estado === "OBSERVADA") ||
        actividad.medios[0] ||
        null;
      setMedioParaObservacion(target);
    } else if (initialModalDirecto?.tipo === "visor") {
      const target =
        actividad.medios.find(m => m.id === initialModalDirecto.medioId) ||
        actividad.medios.find(m => m.estado === "VALIDADA") ||
        actividad.medios[0] ||
        null;
      setMedioParaVer(target);
    }
  }, [initialModalDirecto, actividad]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const isVencida = actividad.estado === "VENCIDA";
  const esResponsable = actividad.responsables.includes(DOCENTE_ACTUAL);
  const todasCargadas = actividad.medios.length > 0 && actividad.medios.every(m => m.estado === "CARGADA");
  const cargadasCount = actividad.medios.filter(m => m.estado === "CARGADA").length;
  const totalMedios = actividad.medios.length;
  const porcentajeMedios = totalMedios > 0 ? Math.round((cargadasCount / totalMedios) * 100) : 0;

  const handleCargaSubmit = (archivo: { nombre: string; tamano: string }) => {
    if (!medioParaCargar) return;
    if (!esResponsable) {
      showToast("Operación denegada: usted no es responsable de esta actividad.");
      return;
    }
    onCargarEvidencia(actividad.id, medioParaCargar.id, archivo);
    setMedioParaCargar(null);
    showToast("Evidencia cargada correctamente.");
  };

  const handleReemplazarSubmit = (archivo: { nombre: string; tamano: string }, motivo?: string) => {
    if (!medioParaReemplazar) return;
    if (!esResponsable) {
      showToast("Operación denegada: usted no es responsable de esta actividad.");
      return;
    }
    onReemplazarEvidencia(actividad.id, medioParaReemplazar.id, archivo, motivo);
    setMedioParaReemplazar(null);
    if (medioParaVer) setMedioParaVer(null);
    showToast("Evidencia reemplazada correctamente.");
  };

  const badgeEstadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "EN CURSO":              { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "EVIDENCIAS COMPLETAS": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE":            { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "VENCIDA":              { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };

  const estadoBadge = badgeEstadoStyle[actividad.estado] || badgeEstadoStyle["PENDIENTE"];

  return (
    <div style={{ padding: "28px", maxWidth: 1120, margin: "0 auto" }}>
      {/* Toast notification */}
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          background: "#0f2f56",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 500,
          fontSize: 13.5,
          fontWeight: 600,
          border: "1px solid rgba(255,255,255,0.15)",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Back button & Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13.5,
            color: "#1a4f8a",
            fontWeight: 600,
            padding: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Volver a Mis Actividades
        </button>

        <div style={{ fontSize: 12.5, color: "#64748b" }}>
          <span>Mis Actividades</span> / <strong style={{ color: "#1e2a3a" }}>Detalle</strong>
        </div>
      </div>

      {/* Activity Header Card */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 20,
      }}>
        {/* Badges & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 4,
            background: "#eff6ff",
            color: "#1d4ed8",
            border: "1px solid #bfdbfe",
          }}>
            {actividad.categoria}
          </span>
          <span style={{
            fontSize: 11,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 4,
            background: actividad.tipo === "obligatoria" ? "#fef3c7" : "#f1f5f9",
            color: actividad.tipo === "obligatoria" ? "#92400e" : "#475569",
            border: `1px solid ${actividad.tipo === "obligatoria" ? "#fde68a" : "#e2e8f0"}`,
            textTransform: "uppercase",
          }}>
            {actividad.tipo}
          </span>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 9px",
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 700,
            background: estadoBadge.bg,
            color: estadoBadge.color,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: estadoBadge.dot }} />
            {actividad.estado}
          </span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 16 }}>
          {actividad.nombre}
        </h1>

        {/* Metadata Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          padding: "16px",
          background: "#f8fafc",
          borderRadius: 8,
          border: "1px solid #e2e8f0",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Plan de Trabajo</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", marginTop: 2 }}>{actividad.planNombre}</div>
            <div style={{ fontSize: 11.5, color: "#64748b" }}>{actividad.grupo}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Período Académico</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", marginTop: 2 }}>{actividad.periodo}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Rango de Ejecución</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", marginTop: 2 }}>
              Desde: {actividad.desde} — Hasta: {actividad.hasta}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Plazo para evidencias</div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: isVencida ? "#991b1b" : "#b45309",
              marginTop: 2,
            }}>
              {actividad.fechaLimiteExacta}
            </div>
          </div>
        </div>
      </div>

      {/* Screen 07 — Actividad Vencida Banner */}
      {isVencida && (
        <div style={{
          background: "#fee2e2",
          border: "1.5px solid #fecaca",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#991b1b", marginBottom: 3, letterSpacing: "0.02em" }}>
              ⚠ PLAZO VENCIDO
            </div>
            <p style={{ fontSize: 13, color: "#7f1d1d", margin: "0 0 6px", lineHeight: 1.45 }}>
              El plazo ordinario para cargar o reemplazar evidencias finalizó el {actividad.hasta} a las 23:59.
            </p>
            <p style={{ fontSize: 12.5, color: "#991b1b", margin: 0, fontStyle: "italic", lineHeight: 1.45 }}>
              “El plazo ordinario para cargar o reemplazar evidencias ha finalizado. Cualquier habilitación extraordinaria estará sujeta al procedimiento institucional que se establezca.”
            </p>
          </div>
        </div>
      )}

      {/* Solo Lectura — No es responsable Banner */}
      {!esResponsable && (
        <div style={{
          background: "#f8fafc",
          border: "1.5px solid #cbd5e1",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: 2 }}>
              Solo lectura — usted no es responsable de esta actividad.
            </div>
            <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.45 }}>
              Responsable único configurado: <strong>{actividad.responsables.join(", ")}</strong>. Solo los docentes responsables pueden cargar o reemplazar evidencias.
            </p>
          </div>
        </div>
      )}

      {/* Screen 06 — Actividad con Evidencias Completas Banner */}
      {todasCargadas && !isVencida && (
        <div style={{
          background: "#f0fdf4",
          border: "1.5px solid #bbf7d0",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
            <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
          </svg>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#166534", marginBottom: 2 }}>
              ✓ Evidencias completas
            </div>
            <div style={{ fontSize: 13, color: "#15803d" }}>
              Se han cargado todos los medios de verificación requeridos para esta actividad.
            </div>
            <div style={{ fontSize: 11.5, color: "#166534", marginTop: 4, opacity: 0.85 }}>
              Nota: La validación formal institucional por parte de la comisión revisora se llevará a cabo en el módulo correspondiente.
            </div>
          </div>
        </div>
      )}

      {/* Grid: Responsables & Recursos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* Responsables */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ color: "#1a4f8a" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>Responsables</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {actividad.responsables.map((resp, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background: "#e8f0fa",
                  color: "#1a4f8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {resp.replace("Ing. ", "").replace("Dr. ", "").replace("MSc. ", "").slice(0, 2).toUpperCase()}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{resp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recursos */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ color: "#1a4f8a" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>Recursos</h3>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {actividad.recursos.map((rec, i) => (
              <span key={i} style={{
                fontSize: 12.5,
                background: "#f1f5f9",
                color: "#334155",
                padding: "4px 10px",
                borderRadius: 6,
                border: "1px solid #e2e8f0",
              }}>
                {rec}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Section: Medios de Verificación / Evidencias requeridas */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: "0 0 4px" }}>
              Evidencias requeridas
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              Cada medio de verificación requiere exactamente 1 archivo PDF.
            </p>
          </div>

          {/* Evidence Progress summary */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: todasCargadas ? "#166534" : "#1a4f8a", marginBottom: 4 }}>
              {cargadasCount} de {totalMedios} evidencias cargadas
            </div>
            <div style={{ width: 180, height: 7, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%",
                width: `${porcentajeMedios}%`,
                background: todasCargadas ? "#16a34a" : "#1a4f8a",
                borderRadius: 99,
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
        </div>

        {/* List of Medios */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {actividad.medios.map((medio) => {
            const isCargada = medio.estado === "CARGADA" && medio.archivoVigente;

            if (isCargada) {
              {/* Screen 04 — Evidencia Cargada */}
              return (
                <div
                  key={medio.id}
                  style={{
                    background: "#f0fdf4",
                    border: "1.5px solid #bbf7d0",
                    borderRadius: 10,
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#dcfce7",
                      color: "#166534",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>
                          {medio.nombre.toUpperCase()}
                        </span>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#166534",
                          background: "#dcfce7",
                          padding: "1px 8px",
                          borderRadius: 99,
                        }}>
                          ✓ CARGADO
                        </span>
                        {/* Estado de validación Módulo 6 */}
                        {(medio.estadoValidacion === "VALIDADA" || medio.estado === "VALIDADA") && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#166534",
                            background: "#bbf7d0",
                            padding: "1px 8px",
                            borderRadius: 99,
                            border: "1px solid #86efac",
                          }}>
                            ✓ VALIDADA
                          </span>
                        )}
                        {(medio.estadoValidacion === "OBSERVADA" || medio.estado === "OBSERVADA") && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#991b1b",
                            background: "#fee2e2",
                            padding: "1px 8px",
                            borderRadius: 99,
                            border: "1px solid #fca5a5",
                          }}>
                            ⚠ OBSERVADA
                          </span>
                        )}
                        {(medio.estadoValidacion === "PENDIENTE DE VALIDACIÓN" || (!medio.estadoValidacion && medio.estado === "CARGADA")) && (
                          <span style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#92400e",
                            background: "#fef3c7",
                            padding: "1px 8px",
                            borderRadius: 99,
                            border: "1px solid #fde68a",
                          }}>
                            ⏳ PENDIENTE DE VALIDACIÓN
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e40af", marginBottom: 2 }}>
                        {medio.archivoVigente?.nombre}
                      </div>

                      <div style={{ fontSize: 11.5, color: "#64748b" }}>
                        Cargado: <strong>{medio.archivoVigente?.fechaCarga}</strong> • Por: {medio.archivoVigente?.cargadoPor}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setMedioParaVer(medio)}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                      </svg>
                      VER
                    </button>

                    {(medio.estadoValidacion === "OBSERVADA" || medio.estado === "OBSERVADA") && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setMedioParaObservacion(medio)}
                        style={{
                          background: "#fffbeb",
                          color: "#b45309",
                          border: "1px solid #fde68a",
                          fontWeight: 700,
                        }}
                      >
                        VER OBSERVACIÓN
                      </button>
                    )}

                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const element = document.createElement("a");
                        const file = new Blob([`Descarga institucional de ${medio.archivoVigente?.nombre}`], { type: "text/plain" });
                        element.href = URL.createObjectURL(file);
                        element.download = medio.archivoVigente?.nombre || "evidencia.pdf";
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      DESCARGAR
                    </button>

                    {!isVencida && esResponsable && (
                      <button
                        className="btn btn-sm"
                        onClick={() => setMedioParaReemplazar(medio)}
                        style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a" }}
                      >
                        REEMPLAZAR
                      </button>
                    )}

                    <button
                      className="btn btn-ghost btn-xs"
                      onClick={() => setMedioParaAuditoria(medio)}
                      title="Ver trazabilidad y auditoría"
                      style={{ color: "#64748b" }}
                    >
                      Auditoría ({medio.historialVersiones.length})
                    </button>
                  </div>
                </div>
              );
            }

            {/* Pendiente / Vencida card */}
            return (
              <div
                key={medio.id}
                style={{
                  background: isVencida ? "#fef2f2" : "#f8fafc",
                  border: `1.5px dashed ${isVencida ? "#fca5a5" : "#cbd5e1"}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 16,
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>
                      {medio.nombre.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: isVencida ? "#991b1b" : "#92400e",
                      background: isVencida ? "#fee2e2" : "#fef3c7",
                      padding: "1px 8px",
                      borderRadius: 99,
                    }}>
                      {isVencida ? "PLAZO VENCIDO" : "PENDIENTE DE CARGA"}
                    </span>
                  </div>

                  <p style={{ fontSize: 12.5, color: isVencida ? "#991b1b" : "#64748b", margin: 0 }}>
                    {isVencida
                      ? `Plazo finalizado el ${actividad.fechaLimiteExacta}. Carga deshabilitada por normativa.`
                      : `Debe cargar un archivo PDF antes del ${actividad.fechaLimiteExacta}.`}
                  </p>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {esResponsable && (
                    <button
                      className="btn btn-primary btn-sm"
                      disabled={isVencida}
                      onClick={() => setMedioParaCargar(medio)}
                      style={{
                        opacity: isVencida ? 0.45 : 1,
                        cursor: isVencida ? "not-allowed" : "pointer",
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      CARGAR EVIDENCIA
                    </button>
                  )}

                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => setMedioParaAuditoria(medio)}
                    title="Ver trazabilidad y auditoría"
                    style={{ color: "#64748b" }}
                  >
                    Auditoría
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {medioParaCargar && (
        <ModalCargaEvidencia
          actividad={actividad}
          medio={medioParaCargar}
          onClose={() => setMedioParaCargar(null)}
          onCargar={handleCargaSubmit}
        />
      )}

      {medioParaReemplazar && (
        <ModalReemplazarEvidencia
          actividad={actividad}
          medio={medioParaReemplazar}
          onClose={() => setMedioParaReemplazar(null)}
          onReemplazar={handleReemplazarSubmit}
        />
      )}

      {medioParaVer && (
        <VisorPdfModal
          actividad={actividad}
          medio={medioParaVer}
          onClose={() => setMedioParaVer(null)}
          onOpenReemplazar={() => {
            const m = medioParaVer;
            setMedioParaVer(null);
            setMedioParaReemplazar(m);
          }}
        />
      )}

      {medioParaAuditoria && (
        <ModalAuditoria
          actividad={actividad}
          medio={medioParaAuditoria}
          onClose={() => setMedioParaAuditoria(null)}
        />
      )}

      {medioParaObservacion && (
        <ModalVerObservacionDocente
          medio={medioParaObservacion}
          actividad={actividad}
          puedeReemplazar={!isVencida && esResponsable}
          onClose={() => setMedioParaObservacion(null)}
          onReemplazar={() => {
            const m = medioParaObservacion;
            setMedioParaObservacion(null);
            setMedioParaReemplazar(m);
          }}
        />
      )}
    </div>
  );
}
