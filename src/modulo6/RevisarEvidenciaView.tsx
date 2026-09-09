import React, { useState } from "react";
import { ItemEvidenciaRevisor } from "./types";
import ModalObservarEvidencia from "./ModalObservarEvidencia";
import ModalValidarEvidencia from "./ModalValidarEvidencia";
import ModalTrazabilidadCompleta from "./ModalTrazabilidadCompleta";

interface RevisarEvidenciaViewProps {
  item: ItemEvidenciaRevisor;
  onBack: () => void;
  onValidar: (actividadId: string, medioId: string) => void;
  onObservar: (actividadId: string, medioId: string, texto: string) => void;
}

export default function RevisarEvidenciaView({
  item,
  onBack,
  onValidar,
  onObservar,
}: RevisarEvidenciaViewProps) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = 3;
  const [zoom, setZoom] = useState(100);

  // Modals
  const [showObservarModal, setShowObservarModal] = useState(false);
  const [showValidarModal, setShowValidarModal] = useState(false);
  const [showTrazabilidadModal, setShowTrazabilidadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleDescargar = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `Universidad Técnica de Ambato - FISEI\nEvidencia Oficial: ${item.medioNombre}\nActividad: ${item.actividadNombre}\nArchivo: ${item.archivoNombre}\nDocente: ${item.docente}\nFecha de Carga: ${item.fechaCarga}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = item.archivoNombre;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast("Descarga iniciada.");
  };

  const estadoBadgeStyle: Record<string, { bg: string; color: string }> = {
    "VALIDADA":                { bg: "#dcfce7", color: "#166534" },
    "OBSERVADA":               { bg: "#fee2e2", color: "#991b1b" },
    "PENDIENTE DE VALIDACIÓN": { bg: "#fef3c7", color: "#92400e" },
    "CARGADA":                 { bg: "#dbeafe", color: "#1e40af" },
    "PLAZO VENCIDO":           { bg: "#fee2e2", color: "#991b1b" },
  };

  const currentBadge = estadoBadgeStyle[item.estado] || estadoBadgeStyle["PENDIENTE DE VALIDACIÓN"];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f0f4f8" }}>
      {/* Toast Notification */}
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
          zIndex: 800,
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

      {/* Top Header Bar */}
      <header style={{
        height: 62,
        background: "#0f2f56",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        flexShrink: 0,
        borderBottom: "1px solid rgba(255,255,255,0.12)",
      }}>
        {/* Left: Back & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={onBack}
            className="btn btn-ghost btn-sm"
            style={{ color: "#8ab8d8", display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Volver a la bandeja
          </button>
          <div style={{ height: 20, width: 1, background: "rgba(255,255,255,0.2)" }} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>
                Revisar evidencia: {item.medioNombre.toUpperCase()}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700,
                background: currentBadge.bg, color: currentBadge.color,
                padding: "2px 8px", borderRadius: 99,
              }}>
                {item.estado}
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: "#8ab8d8" }}>
              Actividad: {item.actividadNombre} • Docente: <strong style={{ color: "#fff" }}>{item.docente}</strong>
            </div>
          </div>
        </div>

        {/* Right: Version & Quick Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "right", fontSize: 11.5, color: "#8ab8d8" }}>
            <div>Versión: <strong style={{ color: "#fff" }}>v{item.version}.0 (Vigente)</strong></div>
            <div>Cargado: {item.fechaCarga}</div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleDescargar}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Descargar PDF
          </button>
        </div>
      </header>

      {/* Main Layout: 70% Visor PDF + 30% Panel Lateral */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ─── 70% Left: PDF Viewer ───────────────────────────────────────── */}
        <div style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          background: "#334155",
          borderRight: "1px solid #e2e8f0",
        }}>
          {/* Viewer Toolbar */}
          <div style={{
            height: 44,
            background: "#1e293b",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 18px",
            color: "#fff",
            fontSize: 12,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                background: "#dc2626", color: "#fff", fontWeight: 800,
                fontSize: 10, padding: "2px 6px", borderRadius: 3,
              }}>
                PDF
              </span>
              <span style={{ color: "#cbd5e1", fontWeight: 600 }}>
                {item.archivoNombre}
              </span>
              <span style={{ color: "#94a3b8" }}>({item.archivoTamano})</span>
            </div>

            {/* Pagination & Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 5 }}>
                <button
                  onClick={() => setPagina(p => Math.max(1, p - 1))}
                  disabled={pagina <= 1}
                  style={{ background: "none", border: "none", color: pagina <= 1 ? "#64748b" : "#fff", cursor: pagina <= 1 ? "not-allowed" : "pointer" }}
                >
                  ◀
                </button>
                <span>{pagina} / {totalPaginas}</span>
                <button
                  onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
                  disabled={pagina >= totalPaginas}
                  style={{ background: "none", border: "none", color: pagina >= totalPaginas ? "#64748b" : "#fff", cursor: pagina >= totalPaginas ? "not-allowed" : "pointer" }}
                >
                  ▶
                </button>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 5 }}>
                <button
                  onClick={() => setZoom(z => Math.max(50, z - 15))}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 13 }}
                  title="Reducir zoom"
                >
                  −
                </button>
                <span style={{ minWidth: 38, textAlign: "center" }}>{zoom}%</span>
                <button
                  onClick={() => setZoom(z => Math.min(150, z + 15))}
                  style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 13 }}
                  title="Aumentar zoom"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(100)}
                  style={{ background: "none", border: "none", color: "#8ab8d8", cursor: "pointer", fontSize: 11, marginLeft: 4 }}
                  title="Ajustar tamaño real"
                >
                  Ajustar
                </button>
              </div>
            </div>
          </div>

          {/* PDF Page Viewport */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 16px",
            display: "flex",
            justifyContent: "center",
          }}>
            <div style={{
              width: 720 * (zoom / 100),
              minHeight: 960 * (zoom / 100),
              background: "#fff",
              borderRadius: 2,
              boxShadow: "0 10px 35px rgba(0,0,0,0.45)",
              padding: `${44 * (zoom / 100)}px ${52 * (zoom / 100)}px`,
              fontSize: `${13 * (zoom / 100)}px`,
              lineHeight: 1.6,
              color: "#1e293b",
              transition: "width 0.15s ease",
              fontFamily: "'Times New Roman', Times, serif",
            }}>
              {/* Official Header */}
              <div style={{
                borderBottom: "2px solid #1a4f8a",
                paddingBottom: 14,
                marginBottom: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1a4f8a", letterSpacing: "0.04em" }}>
                    UNIVERSIDAD TÉCNICA DE AMBATO
                  </div>
                  <div style={{ fontSize: "11.5px", color: "#475569", fontWeight: "bold" }}>
                    FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL
                  </div>
                  <div style={{ fontSize: "10.5px", color: "#64748b" }}>
                    {item.planNombre} • Período: {item.actividad.periodo}
                  </div>
                </div>
                <div style={{
                  border: "1.5px solid #1a4f8a",
                  borderRadius: 4,
                  padding: "4px 8px",
                  textAlign: "right",
                  fontSize: "9.5px",
                  color: "#1a4f8a",
                }}>
                  <div>DOCUMENTO OFICIAL</div>
                  <div style={{ fontWeight: "bold" }}>MEDIO: {item.medioNombre.toUpperCase()}</div>
                  <div>VERSIÓN {item.version}.0 — {item.estado}</div>
                </div>
              </div>

              {/* Document Body */}
              <div style={{ textAlign: "center", margin: "20px 0 16px" }}>
                <h2 style={{ fontSize: "15px", fontWeight: "bold", textTransform: "uppercase", margin: 0, color: "#0f172a" }}>
                  EVIDENCIA DE ACTIVIDAD: {item.actividadNombre}
                </h2>
                <div style={{ fontSize: "11.5px", color: "#64748b", marginTop: 3 }}>
                  Código de Registro Institucional: FISEI-REV-2026-{item.actividadId.toUpperCase()}-{item.medioId.toUpperCase()}
                </div>
              </div>

              {/* Metadata Table in PDF */}
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px 14px", borderRadius: 4, marginBottom: 18, fontSize: "11.5px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "26%", fontWeight: "bold", color: "#334155", padding: "3px 0" }}>Actividad:</td>
                      <td style={{ color: "#0f172a" }}>{item.actividadNombre}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "3px 0" }}>Grupo Asignado:</td>
                      <td style={{ color: "#0f172a" }}>{item.grupo}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "3px 0" }}>Docente responsable:</td>
                      <td style={{ color: "#0f172a" }}>{item.responsables.join(", ")}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "3px 0" }}>Período de Ejecución:</td>
                      <td style={{ color: "#0f172a" }}>Del {item.desde} al {item.hasta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: "12.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 3 }}>
                1. DESCRIPCIÓN Y MEDIO DE VERIFICACIÓN
              </h3>
              <p style={{ textAlign: "justify", textIndent: "20px", marginBottom: 12 }}>
                En cumplimiento de las disposiciones académicas e institucionales vigentes, se remite el presente medio de verificación
                correspondiente a la actividad planificada. El documento adjunto acredita fehacientemente las gestiones realizadas
                por el equipo docente responsable durante el período académico en curso.
              </p>

              <h3 style={{ fontSize: "12.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 3 }}>
                2. VERIFICACIÓN Y REGISTRO DE CUMPLIMIENTO
              </h3>
              <p style={{ textAlign: "justify", textIndent: "20px", marginBottom: 12 }}>
                El archivo registrado <strong>{item.archivoNombre}</strong> (tamaño {item.archivoTamano}) fue cargado a través de la plataforma institucional
                el día <strong>{item.fechaCarga}</strong> por el docente <strong>{item.docente}</strong>, satisfaciendo el requerimiento ordinario
                de presentación de evidencias para su posterior validación por parte de la comisión de revisión designada.
              </p>

              <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px dashed #cbd5e1", display: "flex", justifyContent: "space-between" }}>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ height: 40 }} />
                  <div style={{ borderTop: "1px solid #0f172a", paddingTop: 4, fontWeight: "bold", fontSize: "11px" }}>
                    {item.docente}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>DOCENTE RESPONSABLE</div>
                </div>
                <div style={{ textAlign: "center", width: "45%" }}>
                  <div style={{ height: 40 }} />
                  <div style={{ borderTop: "1px solid #0f172a", paddingTop: 4, fontWeight: "bold", fontSize: "11px" }}>
                    {item.revisadoPor || "Ing. Carlos López, Mg."}
                  </div>
                  <div style={{ fontSize: "10px", color: "#64748b" }}>REVISOR INSTITUCIONAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 30% Right: Panel Lateral de Revisión ───────────────────────── */}
        <div style={{
          width: "30%",
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
          <div style={{ padding: "20px", flex: 1 }}>
            {/* Header section */}
            <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a4f8a", marginBottom: 4 }}>
                Panel de Evaluación
              </div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Información de la actividad
              </h2>
            </div>

            {/* Readonly activity details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Plan de Trabajo</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", marginTop: 2 }}>{item.planNombre}</div>
                <div style={{ fontSize: 11.5, color: "#64748b" }}>{item.grupo}</div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Responsables</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", marginTop: 2 }}>
                  {item.responsables.join(", ")}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Recursos asignados</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                  {item.recursos.map((r, i) => (
                    <span key={i} style={{ background: "#f1f5f9", color: "#334155", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Desde</div>
                  <div style={{ fontSize: 12.5, color: "#334155", fontWeight: 600, marginTop: 2 }}>{item.desde}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Hasta</div>
                  <div style={{ fontSize: 12.5, color: "#334155", fontWeight: 600, marginTop: 2 }}>{item.hasta}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Plazo límite de carga</div>
                <div style={{ fontSize: 12.5, color: "#b45309", fontWeight: 700, marginTop: 2 }}>
                  {item.fechaLimite}
                </div>
              </div>
            </div>

            {/* Current Evaluation Status */}
            <div style={{
              background: currentBadge.bg,
              border: `1px solid ${item.estado === "VALIDADA" ? "#bbf7d0" : item.estado === "OBSERVADA" ? "#fecaca" : "#fde68a"}`,
              borderRadius: 8,
              padding: "12px 14px",
              marginBottom: 20,
            }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: currentBadge.color, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 3 }}>
                Estado actual: {item.estado}
              </div>
              {item.revisadoPor && item.fechaRevision && (
                <div style={{ fontSize: 11.5, color: currentBadge.color, opacity: 0.9 }}>
                  Evaluado por <strong>{item.revisadoPor}</strong> el {item.fechaRevision}
                </div>
              )}
              {item.observacionActual && (
                <div style={{ fontSize: 12, color: "#991b1b", marginTop: 6, fontStyle: "italic", borderTop: "1px dashed rgba(220,38,38,0.2)", paddingTop: 6 }}>
                  “{item.observacionActual}”
                </div>
              )}
            </div>

            {/* Version History Section */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#1e2a3a" }}>
                  Historial de la evidencia
                </span>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowTrazabilidadModal(true)}
                  style={{ color: "#1a4f8a", fontWeight: 600 }}
                >
                  VER TRAZABILIDAD
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {item.medio.historialVersiones.map((v) => (
                  <div
                    key={v.version}
                    style={{
                      background: v.vigente ? "#f8fafc" : "#fff",
                      border: `1px solid ${v.vigente ? "#cbd5e1" : "#e2e8f0"}`,
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: "#1e2a3a" }}>
                        v{v.version}.0 — {v.vigente ? "VIGENTE" : "SUSTITUIDA"}
                      </span>
                      <span style={{
                        fontSize: 10.5, fontWeight: 700,
                        color: v.estadoRevision === "VALIDADA" ? "#166534" : v.estadoRevision === "OBSERVADA" ? "#991b1b" : "#92400e"
                      }}>
                        {v.estadoRevision || "CARGADA"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                      {v.fechaCarga} • {v.cargadoPor}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Decision Buttons */}
          <div style={{
            padding: "16px 20px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
            flexShrink: 0,
          }}>
            <button
              className="btn btn-sm"
              onClick={() => setShowValidarModal(true)}
              style={{
                width: "100%",
                justifyContent: "center",
                background: "#166534",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                padding: "10px 14px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
              </svg>
              VALIDAR EVIDENCIA
            </button>

            <button
              className="btn btn-sm"
              onClick={() => setShowObservarModal(true)}
              style={{
                width: "100%",
                justifyContent: "center",
                background: "#fef3c7",
                color: "#92400e",
                fontWeight: 700,
                border: "1.5px solid #fde68a",
                padding: "10px 14px",
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              OBSERVAR EVIDENCIA
            </button>
          </div>
        </div>
      </div>

      {/* Observar Modal */}
      {showObservarModal && (
        <ModalObservarEvidencia
          item={item}
          onClose={() => setShowObservarModal(false)}
          onConfirmar={(texto) => {
            onObservar(item.actividadId, item.medioId, texto);
            setShowObservarModal(false);
            showToast("Evidencia observada correctamente.");
          }}
        />
      )}

      {/* Validar Modal */}
      {showValidarModal && (
        <ModalValidarEvidencia
          item={item}
          onClose={() => setShowValidarModal(false)}
          onConfirmar={() => {
            onValidar(item.actividadId, item.medioId);
            setShowValidarModal(false);
            showToast("Evidencia validada correctamente.");
          }}
        />
      )}

      {/* Trazabilidad Modal */}
      {showTrazabilidadModal && (
        <ModalTrazabilidadCompleta
          medio={item.medio}
          actividad={item.actividad}
          onClose={() => setShowTrazabilidadModal(false)}
        />
      )}
    </div>
  );
}
