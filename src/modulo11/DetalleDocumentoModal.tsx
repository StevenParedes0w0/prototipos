import React, { useState } from "react";
import { DocumentMasterState } from "../documentEngine/types";
import DocumentPdfPageViewer from "../documentEngine/DocumentPdfPageViewer";

interface DetalleDocumentoModalProps {
  documento: DocumentMasterState;
  onClose: () => void;
  onNavigateActividades?: () => void;
  onOpenFirmar?: () => void;
}

export default function DetalleDocumentoModal({
  documento,
  onClose,
  onNavigateActividades,
  onOpenFirmar,
}: DetalleDocumentoModalProps) {
  const [activeTab, setActiveTab] = useState<"documento" | "revision" | "firmas" | "historial" | "actividades">("documento");

  const isPlan = documento.documentType === "PLAN_TRABAJO";
  const artifact = documento.currentArtifact;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 35, 60, 0.75)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "95vw",
          maxWidth: 1280,
          height: "min(94vh, 940px)",
          maxHeight: "94vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
          overflow: "hidden",
          minHeight: 0,
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            flexShrink: 0,
            padding: "14px 22px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f8fafc",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                padding: "3px 8px",
                borderRadius: 4,
                background: isPlan ? "#eff6ff" : "#f3e8ff",
                color: isPlan ? "#1e40af" : "#7e22ce",
                textTransform: "uppercase",
              }}
            >
              {isPlan ? "Plan de Trabajo" : "Informe"}
            </span>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                {documento.nombre}
              </h2>
              <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 1 }}>
                {documento.grupo} · Período: {documento.periodo} · Versión {documento.formalVersion} (Ronda {documento.reviewRound})
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 999,
                background:
                  documento.documentState === "EN EJECUCIÓN" || documento.documentState === "VALIDADO"
                    ? "#dcfce7"
                    : documento.documentState === "EN REVISIÓN"
                    ? "#dbeafe"
                    : documento.documentState === "DEVUELTO"
                    ? "#fee2e2"
                    : "#fef3c7",
                color:
                  documento.documentState === "EN EJECUCIÓN" || documento.documentState === "VALIDADO"
                    ? "#166534"
                    : documento.documentState === "EN REVISIÓN"
                    ? "#1e40af"
                    : documento.documentState === "DEVUELTO"
                    ? "#991b1b"
                    : "#92400e",
              }}
            >
              {documento.documentState}
            </span>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#64748b",
                fontSize: 20,
                padding: "4px 8px",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ flexShrink: 0, display: "flex", borderBottom: "1px solid #e2e8f0", background: "#fff", padding: "0 22px" }}>
          {[
            { id: "documento", label: "Vista Documento Formal (A4)" },
            { id: "revision", label: "Estado del Flujo y Revisión" },
            { id: "firmas", label: "Firmas" },
            { id: "historial", label: "Historial y Auditoría" },
            ...(isPlan ? [{ id: "actividades", label: "Actividades Vinculadas" }] : []),
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "12px 16px",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? "#1a4f8a" : "#64748b",
                borderBottom: activeTab === tab.id ? "2.5px solid #1a4f8a" : "2.5px solid transparent",
                background: "none",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
          {activeTab === "documento" && (
            <div style={{ flex: 1, minHeight: 0, height: "100%", display: "flex", flexDirection: "column" }}>
              <DocumentPdfPageViewer
                artifact={artifact}
                formalVersion={documento.formalVersion}
                reviewRound={documento.reviewRound}
                documentState={documento.documentState}
                observations={documento.observations}
                flowStages={documento.flowStages}
                currentUser={{
                  nombre: "Ing. Andrea Pérez, Mg.",
                  cargo: "Docente elaborador",
                  role: "docente",
                }}
                onOpenFirmar={() => onOpenFirmar?.()}
                onOpenDevolver={() => {}}
                onAddObservacion={() => {}}
                readOnly={true}
              />
            </div>
          )}

          {activeTab === "revision" && (
            <div style={{ padding: "28px", maxWidth: 840, margin: "0 auto", overflowY: "auto", height: "100%" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginBottom: 14 }}>
                Cadena de Aprobación y Revisión Institucional
              </h3>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px", marginBottom: 20 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {documento.flowStages.map((stage, idx) => {
                    const sig = artifact.signatures.find((s) => s.actor === stage.actorName);
                    return (
                      <div key={stage.id} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: sig ? "#16a34a" : "#f1f5f9",
                            color: sig ? "#fff" : "#64748b",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 13,
                            flexShrink: 0,
                          }}
                        >
                          {sig ? "✓" : idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>
                              {stage.stageName} {stage.subLevelName ? `(${stage.subLevelName})` : ""}
                            </div>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                padding: "2px 8px",
                                borderRadius: 4,
                                background: sig ? "#dcfce7" : "#f1f5f9",
                                color: sig ? "#166534" : "#64748b",
                              }}
                            >
                              {sig ? "COMPLETADO" : "PENDIENTE"}
                            </span>
                          </div>
                          <div style={{ fontSize: 12.5, color: "#475569", marginTop: 2 }}>
                            Responsable: <strong>{stage.actorName}</strong> — {stage.actorCargo}
                          </div>
                          {sig && (
                            <div style={{ fontSize: 11.5, color: "#166534", marginTop: 4, background: "#f0fdf4", padding: "4px 8px", borderRadius: 4, display: "inline-block" }}>
                              Firmado electrónicamente el {sig.fecha} a las {sig.hora}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {documento.documentoRelacionadoTitulo && (
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1e40af", textTransform: "uppercase", marginBottom: 4 }}>
                    Documento Principal de Referencia
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a" }}>
                    {documento.documentoRelacionadoTitulo}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "firmas" && (
            <div style={{ padding: "28px", maxWidth: 840, margin: "0 auto", overflowY: "auto", height: "100%" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginBottom: 14 }}>
                Firmas
              </h3>

              {artifact.signatures.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "32px", textAlign: "center", color: "#64748b" }}>
                  Aún no se han registrado firmas electrónicas en este documento.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {artifact.signatures.map((sig, i) => {
                    const stage = documento.flowStages.find((s) => s.actorName === sig.actor || s.actorRole === sig.role);
                    const etapaLabel = stage?.stageName || (sig.role === "docente" ? "Elaboración" : sig.role === "revisor" ? "Revisión técnica" : "Validación final");

                    return (
                      <div key={i} style={{ background: "#fff", borderRadius: 10, border: "1px solid #bbf7d0", padding: "18px 20px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#dcfce7",
                            color: "#166534",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            fontSize: 18,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>
                                {etapaLabel}
                              </div>
                              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#1e2a3a", marginTop: 2 }}>
                                {sig.actor}
                              </div>
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#166534", background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "2px 8px", borderRadius: 4 }}>
                              FIRMADO
                            </span>
                          </div>
                          <div style={{ fontSize: 12.5, color: "#475569", marginTop: 2 }}>
                            {sig.cargo}
                          </div>
                          <div style={{ fontSize: 12, color: "#64748b", marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, background: "#f8fafc", padding: "10px 12px", borderRadius: 6, border: "1px solid #f1f5f9" }}>
                            <div><strong>Fecha y hora:</strong> {sig.fecha} — {sig.hora}</div>
                            <div><strong>Ronda de revisión:</strong> Ronda {documento.reviewRound}</div>
                            <div style={{ gridColumn: "span 2" }}>
                              <strong>Ubicación en documento:</strong> {sig.ubicacion}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ marginTop: 24, fontSize: 12, color: "#64748b", fontStyle: "italic", textAlign: "center" }}>
                Mecanismo de firma sujeto a integración institucional.
              </div>
            </div>
          )}

          {activeTab === "historial" && (
            <div style={{ padding: "28px", maxWidth: 840, margin: "0 auto", overflowY: "auto", height: "100%" }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginBottom: 14 }}>
                Registro Histórico y Trazabilidad del Documento
              </h3>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ borderBottom: "1.5px solid #e2e8f0", color: "#64748b", textAlign: "left" }}>
                      <th style={{ padding: "8px 0" }}>Versión</th>
                      <th style={{ padding: "8px 0" }}>Ronda</th>
                      <th style={{ padding: "8px 0" }}>Evento</th>
                      <th style={{ padding: "8px 0" }}>Actor</th>
                      <th style={{ padding: "8px 0" }}>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                      <td style={{ padding: "10px 0", fontWeight: 700 }}>v{documento.formalVersion}</td>
                      <td style={{ padding: "10px 0" }}>Ronda {documento.reviewRound}</td>
                      <td style={{ padding: "10px 0", color: "#1e2a3a" }}>
                        {documento.documentState === "EN EJECUCIÓN" || documento.documentState === "VALIDADO"
                          ? "Validación final completada"
                          : "Generación de documento formal"}
                      </td>
                      <td style={{ padding: "10px 0", color: "#475569" }}>{artifact.elaborador.nombre}</td>
                      <td style={{ padding: "10px 0", color: "#64748b" }}>{documento.fechaUltimaActualizacion}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "actividades" && isPlan && (
            <div style={{ padding: "28px", maxWidth: 960, margin: "0 auto", overflowY: "auto", height: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                  Actividades Vinculadas al Plan de Trabajo
                </h3>
                {onNavigateActividades && (
                  <button className="btn btn-primary btn-sm" onClick={onNavigateActividades}>
                    Ir a Gestión de Actividades →
                  </button>
                )}
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Actividad</th>
                      <th>Desde</th>
                      <th>Hasta</th>
                      <th>Responsables</th>
                      <th>Medios de Verificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(artifact.matriz || []).map((act) => (
                      <tr key={act.id}>
                        <td style={{ fontWeight: 700, color: "#1a4f8a" }}>{act.id}</td>
                        <td style={{ fontWeight: 600, color: "#1e2a3a" }}>{act.nombre}</td>
                        <td style={{ fontSize: 12, color: "#475569" }}>{act.desde}</td>
                        <td style={{ fontSize: 12, color: "#475569" }}>{act.hasta}</td>
                        <td style={{ fontSize: 12, color: "#475569" }}>{act.responsables.join(", ")}</td>
                        <td style={{ fontSize: 11.5, color: "#64748b" }}>{act.medios.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ padding: "12px 22px", borderTop: "1px solid #e2e8f0", background: "#fff", display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
