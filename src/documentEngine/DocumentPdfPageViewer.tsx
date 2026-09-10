import React, { useState } from "react";
import { DocumentArtifact, DocumentObservation, DocumentSignature, FlowStageNode } from "./types";

interface DocumentPdfPageViewerProps {
  artifact: DocumentArtifact;
  formalVersion: string;
  reviewRound: number;
  documentState: string;
  observations: DocumentObservation[];
  flowStages: FlowStageNode[];
  currentUser: {
    nombre: string;
    cargo: string;
    role: "docente" | "revisor" | "validador" | "admin";
  };
  onOpenFirmar: () => void;
  onOpenDevolver: () => void;
  onAddObservacion: (pagina: number, texto: string, seccion: string, tipo: "general" | "seccion") => void;
  onEditObservacion?: (id: number, texto: string) => void;
  onDeleteObservacion?: (id: number) => void;
  readOnly?: boolean;
}

export default function DocumentPdfPageViewer({
  artifact,
  formalVersion,
  reviewRound,
  documentState,
  observations,
  flowStages,
  currentUser,
  onOpenFirmar,
  onOpenDevolver,
  onAddObservacion,
  onEditObservacion,
  onDeleteObservacion,
  readOnly = false,
}: DocumentPdfPageViewerProps) {
  const totalPages = artifact.pageCount || 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  // Observations state for adding/editing
  const [showAddObsDrawer, setShowAddObsDrawer] = useState(false);
  const [obsTipo, setObsTipo] = useState<"general" | "seccion">("seccion");
  const [obsSeccion, setObsSeccion] = useState("");
  const [obsTexto, setObsTexto] = useState("");
  const [editingObsId, setEditingObsId] = useState<number | null>(null);
  const [editingObsText, setEditingObsText] = useState("");

  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    "Información general": true,
    "Justificación y objetivo": true,
    "Matriz de actividades": false,
    "Anexos y medios": false,
    "Firmas de responsabilidad": false,
  });

  const activeObservations = observations.filter((o) => o.estado === "activa");
  const hasActiveObservations = activeObservations.length > 0;

  const isDocente = currentUser.role === "docente";
  const isValidador = currentUser.role === "validador" || currentUser.cargo.includes("Coordinadora") || currentUser.cargo.includes("Autoridad");
  const isRevisor = currentUser.role === "revisor" && !isValidador;
  const isAdmin = currentUser.role === "admin";

  const isAlreadySignedByMe = artifact.signatures.some(
    (s) => s.actor === currentUser.nombre || ((currentUser as any).id && s.actorId === (currentUser as any).id)
  );
  const isDocumentValidated = documentState === "VALIDADO" || documentState === "EN EJECUCIÓN";
  const finalSignature = artifact.signatures.find((s) => s.role === "validador");
  const isFinalValidatorUser = Boolean(
    finalSignature &&
    (((currentUser as any).id && (currentUser as any).id === finalSignature.actorId) ||
      currentUser.nombre === finalSignature.actor)
  );

  const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


  const handleCreateObs = () => {
    if (!obsTexto.trim()) return;
    const sec = obsTipo === "seccion" ? (obsSeccion || `Página ${currentPage}`) : "General";
    onAddObservacion(currentPage, obsTexto.trim(), sec, obsTipo);
    setObsTexto("");
    setObsSeccion("");
    setShowAddObsDrawer(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>
      {/* Drawer Agregar Observación */}
      {showAddObsDrawer && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.35)", zIndex: 300 }}
            onClick={() => setShowAddObsDrawer(false)}
          />
          <div
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              bottom: 0,
              width: 440,
              background: "#fff",
              zIndex: 301,
              boxShadow: "-8px 0 32px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans', sans-serif" }}>
                Nueva Observación — Página {currentPage}
              </h2>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                Ronda {reviewRound} · Versión formal {formalVersion}
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label required" style={{ fontSize: 12.5 }}>Tipo de observación</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[
                    { val: "seccion" as const, label: `Página actual (${currentPage})` },
                    { val: "general" as const, label: "General del documento" },
                  ].map((opt) => (
                    <label
                      key={opt.val}
                      style={{
                        flex: 1,
                        cursor: "pointer",
                        borderRadius: 8,
                        padding: "10px 12px",
                        border: `1.5px solid ${obsTipo === opt.val ? "#1a4f8a" : "#e2e8f0"}`,
                        background: obsTipo === opt.val ? "#eff6ff" : "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <input
                        type="radio"
                        name="obsTipoViewer"
                        value={opt.val}
                        checked={obsTipo === opt.val}
                        onChange={() => setObsTipo(opt.val)}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1e2a3a" }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {obsTipo === "seccion" && (
                <div>
                  <label className="form-label" style={{ fontSize: 12.5 }}>Sección específica (opcional)</label>
                  <input
                    className="form-input"
                    placeholder="Ej. Matriz de actividades, Justificación..."
                    value={obsSeccion}
                    onChange={(e) => setObsSeccion(e.target.value)}
                    style={{ fontSize: 13 }}
                  />
                </div>
              )}

              <div>
                <label className="form-label required" style={{ fontSize: 12.5 }}>Texto de la observación</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: 120, fontSize: 13 }}
                  placeholder="Detalle la inconsistencia o corrección que debe realizar el elaborador..."
                  value={obsTexto}
                  onChange={(e) => setObsTexto(e.target.value)}
                />
              </div>

              <div className="alert alert-warning" style={{ fontSize: 12 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Al registrar observaciones activas, la acción de <b>APROBAR Y FIRMAR</b> quedará bloqueada hasta que sean resueltas o se efectúe la devolución.
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowAddObsDrawer(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleCreateObs} disabled={!obsTexto.trim()}>
                REGISTRAR OBSERVACIÓN
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main 70/30 Layout */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 340px", height: "100%", overflow: "hidden" }}>
        
        {/* LEFT COLUMN (70%): Page-by-page PDF Viewer */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", borderRight: "1px solid #e2e8f0", background: "#525659" }}>
          
          {/* Top PDF Toolbar */}
          <div
            style={{
              background: "#1e293b",
              color: "#fff",
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {/* Page Navigation */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹ Anterior
              </button>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0" }}>
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente ›
              </button>

              {/* Direct page buttons */}
              <div style={{ display: "flex", gap: 4, marginLeft: 10 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 4,
                      border: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: "pointer",
                      background: currentPage === num ? "#1a4f8a" : "rgba(255,255,255,0.15)",
                      color: "#fff",
                      transition: "all 0.15s ease",
                    }}
                    title={`Ir a página ${num}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Document Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#cbd5e1",
                  fontSize: 11.5,
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontWeight: 600,
                }}
              >
                Versión formal {formalVersion} · Ronda {reviewRound}
              </span>
            </div>

            {/* Zoom Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <button
                onClick={() => setZoom((z) => Math.max(60, z - 10))}
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", padding: "2px 8px" }}
              >
                −
              </button>
              <span style={{ fontSize: 12, color: "#e2e8f0", minWidth: 40, textAlign: "center" }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", padding: "2px 8px" }}
              >
                +
              </button>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setZoom(100)}
                style={{ color: "#fff", fontSize: 11 }}
              >
                Ajustar
              </button>
            </div>
          </div>

          {/* PDF Page Canvas */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: `${Math.min(100, zoom)}%`,
                maxWidth: 780,
                minHeight: 960,
                background: "#fff",
                borderRadius: 3,
                boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                padding: "44px 50px",
                fontFamily: "'Times New Roman', serif",
                color: "#1e293b",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Watermark if not validated */}
              {!isDocumentValidated && (
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%) rotate(-35deg)",
                    fontSize: 68,
                    fontWeight: 800,
                    color: "rgba(200, 50, 50, 0.05)",
                    letterSpacing: 8,
                    userSelect: "none",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {documentState === "EN REVISIÓN" ? "EN REVISIÓN" : "BORRADOR"}
                </div>
              )}

              {/* Page Content Switch */}
              <div>
                {/* Institutional Header (Shown on Page 1) */}
                {currentPage === 1 && (
                  <div style={{ borderBottom: "2.5px solid #1a4f8a", paddingBottom: 14, marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                      <div
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 6,
                          background: "#f0f4f8",
                          border: "1.5px solid #cbd5e1",
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#1a4f8a",
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        UTA<br />FISEI
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 11, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5 }}>
                          Universidad Técnica de Ambato
                        </div>
                        <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                          Facultad de Ingeniería en Sistemas, Electrónica e Industrial
                        </div>
                        <div style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a", marginTop: 8, textTransform: "uppercase" }}>
                          {artifact.documentType === "INFORME"
                            ? `Informe: ${artifact.titulo || artifact.grupo}`
                            : `Plan de Trabajo: ${artifact.grupo}`}
                        </div>
                        {artifact.documentType === "INFORME" && artifact.informeData?.documentoRelacionado && (
                          <div style={{ marginTop: 4, display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 4, padding: "2px 6px", fontSize: 8.5, color: "#1e40af" }}>
                            <span style={{ fontWeight: 700 }}>Documento de Referencia:</span> {artifact.informeData.documentoRelacionado}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", marginTop: 12, borderTop: "1px solid #e2e8f0", paddingTop: 8, fontSize: 8.5 }}>
                      <div>
                        <span style={{ color: "#64748b", textTransform: "uppercase" }}>Unidad:</span>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{artifact.unidadAcademica}</div>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", textTransform: "uppercase" }}>Período:</span>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{artifact.periodo}</div>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", textTransform: "uppercase" }}>Fecha Generación:</span>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{artifact.generatedAt}</div>
                      </div>
                      <div>
                        <span style={{ color: "#64748b", textTransform: "uppercase" }}>Versión / Ronda:</span>
                        <div style={{ fontWeight: 700, color: "#1a4f8a" }}>v{formalVersion} (R{reviewRound})</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Header for Pages 2, 3, 4 */}
                {currentPage > 1 && (
                  <div style={{ borderBottom: "1px solid #cbd5e1", paddingBottom: 6, marginBottom: 18, display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#64748b" }}>
                    <span>
                      {artifact.documentType === "INFORME"
                        ? `Universidad Técnica de Ambato — FISEI · Informe (${artifact.grupo})`
                        : `Universidad Técnica de Ambato — FISEI · Plan de Trabajo (${artifact.grupo})`}
                    </span>
                    <span>Versión formal {formalVersion} — Ronda {reviewRound}</span>
                  </div>
                )}

                {/* PAGE 1 CONTENT */}
                {currentPage === 1 && (
                  <div>
                    {artifact.documentType === "INFORME" ? (
                      <div>
                        <div style={{ marginBottom: 22 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                            1. Introducción / Descripción
                          </div>
                          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                            {artifact.informeData?.introduccion || "No se ha registrado introducción."}
                          </p>
                        </div>

                        <div style={{ marginBottom: 22 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                            2. Desarrollo de Actividades / Gestión
                          </div>
                          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                            {artifact.informeData?.desarrollo || "No se ha registrado desarrollo de actividades."}
                          </p>
                        </div>

                        <div style={{ marginTop: 24, padding: "12px 14px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", marginBottom: 3 }}>
                            Información del Informe Institucional
                          </div>
                          <div style={{ fontSize: 9.5, color: "#475569", lineHeight: 1.5 }}>
                            Elaborado por {artifact.elaborador.nombre} ({artifact.elaborador.cargo}) para la unidad {artifact.grupo}.
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ marginBottom: 22 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                            1. Justificación
                          </div>
                          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                            {artifact.justificacion}
                          </p>
                        </div>

                        <div style={{ marginBottom: 22 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                            2. Objetivo
                          </div>
                          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                            {artifact.objetivo}
                          </p>
                        </div>

                        <div style={{ marginTop: 30, padding: "14px 16px", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0" }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", marginBottom: 4 }}>
                            Resumen Ejecutivo del Documento
                          </div>
                          <div style={{ fontSize: 9.5, color: "#475569", lineHeight: 1.6 }}>
                            El presente plan comprende {artifact.matriz?.length || 0} actividades programadas y articuladas con el sistema institucional de seguimiento y carga de evidencias.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MIDDLE PAGES: Matriz de Actividades o Resultados e Informe Data */}
                {currentPage > 1 && currentPage < totalPages && (() => {
                  if (artifact.documentType === "INFORME") {
                    return (
                      <div>
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                            3. Resultados Registrados
                          </div>
                          <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.75, textAlign: "justify" }}>
                            {artifact.informeData?.resultados || "Sin resultados registrados para esta versión."}
                          </p>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span>4. Observaciones y Recomendaciones</span>
                            <span style={{ fontSize: 8.5, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "1px 6px", borderRadius: 3 }}>
                              ESTRUCTURA PRELIMINAR DEMO
                            </span>
                          </div>
                          <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 6, border: "1px dashed #cbd5e1" }}>
                            <p style={{ fontSize: 10.5, color: "#334155", lineHeight: 1.65, margin: 0 }}>
                              {artifact.informeData?.observaciones || "No se han emitido observaciones complementarias."}
                            </p>
                          </div>
                        </div>

                        <div style={{ marginTop: 24 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10 }}>
                            5. Anexos Institucionales
                          </div>
                          {artifact.tieneAnexos === "si" && artifact.anexos.length > 0 ? (
                            artifact.anexos.map((anexo, idx) => (
                              <div key={anexo.id} style={{ fontSize: 10, color: "#334155", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                                <b>Anexo {LETRAS[idx] || idx + 1}:</b> {anexo.nombre} ({anexo.archivo} - {anexo.tamano})
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>
                              No se adjuntan anexos adicionales para este informe.
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }

                  const matriz = artifact.matriz || [];
                  const middleTotal = totalPages - 2;
                  const middleIndex = currentPage - 2; // 0-indexed among middle pages
                  const itemsPerPage = Math.max(2, Math.ceil(matriz.length / middleTotal));
                  const startIdx = middleIndex * itemsPerPage;
                  const pageItems = matriz.slice(startIdx, startIdx + itemsPerPage);
                  const isLastMiddlePage = middleIndex === middleTotal - 1;

                  return (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 12 }}>
                        3. Matriz de Actividades (Página {currentPage} — Actividades {startIdx + 1} a {Math.min(matriz.length, startIdx + pageItems.length)})
                      </div>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, marginBottom: isLastMiddlePage ? 20 : 0 }}>
                        <thead>
                          <tr style={{ background: "#1a4f8a", color: "#fff" }}>
                            <th style={{ padding: "6px 8px", textAlign: "left", width: "35%" }}>Actividad</th>
                            <th style={{ padding: "6px 8px", textAlign: "left", width: "12%" }}>Desde</th>
                            <th style={{ padding: "6px 8px", textAlign: "left", width: "12%" }}>Hasta</th>
                            <th style={{ padding: "6px 8px", textAlign: "left", width: "21%" }}>Responsables</th>
                            <th style={{ padding: "6px 8px", textAlign: "left", width: "20%" }}>Medios de Verificación</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pageItems.map((act, i) => (
                            <tr key={act.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                              <td style={{ padding: "7px 8px", borderBottom: "1px solid #e2e8f0", color: "#0f172a", fontWeight: 600, lineHeight: 1.4 }}>
                                {act.id}. {act.nombre}
                              </td>
                              <td style={{ padding: "7px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569", whiteSpace: "nowrap" }}>
                                {act.desde || "—"}
                              </td>
                              <td style={{ padding: "7px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569", whiteSpace: "nowrap" }}>
                                {act.hasta || "—"}
                              </td>
                              <td style={{ padding: "7px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569" }}>
                                {act.responsables.join(", ") || "—"}
                              </td>
                              <td style={{ padding: "7px 8px", borderBottom: "1px solid #e2e8f0", color: "#475569", fontSize: 8.5 }}>
                                {act.medios.join(", ") || "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {isLastMiddlePage && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10 }}>
                            4. Anexos Institucionales
                          </div>
                          {artifact.tieneAnexos === "si" && artifact.anexos.length > 0 ? (
                            artifact.anexos.map((anexo, idx) => (
                              <div key={anexo.id} style={{ fontSize: 10, color: "#334155", padding: "6px 0", borderBottom: "1px dashed #e2e8f0" }}>
                                <b>Anexo {LETRAS[idx] || idx + 1}:</b> {anexo.nombre} ({anexo.archivo} - {anexo.tamano})
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 10, color: "#64748b", fontStyle: "italic" }}>
                              No se adjuntan anexos adicionales para esta versión del Plan.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* LAST PAGE CONTENT: Firmas de Responsabilidad & Historial */}
                {currentPage === totalPages && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 12 }}>
                      {artifact.documentType === "INFORME" ? "6. Firmas de Responsabilidad" : "5. Firmas de Responsabilidad"}
                    </div>
                    
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, marginBottom: 24 }}>
                      <thead>
                        <tr style={{ background: "#1a4f8a", color: "#fff" }}>
                          <th style={{ padding: "6px 8px", textAlign: "left", width: "24%" }}>Acción</th>
                          <th style={{ padding: "6px 8px", textAlign: "left", width: "30%" }}>Nombre y Cargo</th>
                          <th style={{ padding: "6px 8px", textAlign: "left", width: "46%" }}>Firma Electrónica</th>
                        </tr>
                      </thead>
                      <tbody>
                        {flowStages.map((stage, idx) => {
                          const sig = artifact.signatures.find((s) => s.actor === stage.actorName || s.actorId === stage.actorId);
                          const isCurrentActorCell = (currentUser.nombre === stage.actorName || (stage.actorId && stage.actorId === (currentUser as any).id)) && !sig;

                          return (
                            <tr
                              key={stage.id}
                              style={{
                                background: isCurrentActorCell ? "#eff6ff" : idx % 2 === 0 ? "#fff" : "#f8fafc",
                                border: isCurrentActorCell ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                              }}
                            >
                              <td style={{ padding: "8px 8px", color: "#1a4f8a", fontWeight: 700, verticalAlign: "middle" }}>
                                {stage.actorRole === "docente" || stage.stageName.includes("Elaboración")
                                  ? "Elaborado por:"
                                  : stage.actorRole === "validador" || stage.stageName.includes("Validación")
                                  ? "Validado por:"
                                  : "Revisado por:"}
                              </td>
                              <td style={{ padding: "8px 8px", verticalAlign: "middle" }}>
                                <div style={{ fontWeight: 700, color: "#0f172a" }}>{stage.actorName}</div>
                                <div style={{ fontSize: 8, color: "#64748b" }}>{stage.actorCargo}</div>
                              </td>
                              <td style={{ padding: "8px 8px", verticalAlign: "middle" }}>
                                {sig ? (
                                  <div
                                    style={{
                                      background: "#f0fdf4",
                                      border: "1px solid #bbf7d0",
                                      borderRadius: 4,
                                      padding: "4px 8px",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 6,
                                    }}
                                  >
                                    <div
                                      style={{
                                        width: 18,
                                        height: 18,
                                        borderRadius: "50%",
                                        background: "#16a34a",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 10,
                                        fontWeight: 800,
                                        flexShrink: 0,
                                      }}
                                    >
                                      ✓
                                    </div>
                                    <div style={{ fontSize: 8, color: "#166534", lineHeight: 1.3 }}>
                                      <span style={{ fontWeight: 700 }}>FIRMADO ELECTRÓNICAMENTE</span>
                                      <br />
                                      {sig.actor} · {sig.fecha} {sig.hora}
                                    </div>
                                  </div>
                                ) : isCurrentActorCell ? (
                                  /* Visual highlight according to Item C & G */
                                  <div
                                    style={{
                                      background: "#dbeafe",
                                      border: "1.5px dashed #2563eb",
                                      borderRadius: 4,
                                      padding: "6px 8px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: 9,
                                        fontWeight: 800,
                                        color: "#1e40af",
                                        letterSpacing: 0.5,
                                      }}
                                    >
                                      [ SU FIRMA AQUÍ ]
                                    </span>
                                    <div style={{ fontSize: 7.5, color: "#3b82f6", marginTop: 1 }}>
                                      (Resaltado de interfaz — haga clic en Firmar para estampar)
                                    </div>
                                  </div>
                                ) : (
                                  <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 8.5 }}>
                                    Pendiente de firma
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div style={{ fontSize: 12, fontWeight: 800, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 8 }}>
                      {artifact.documentType === "INFORME" ? "7. Control de Historial de Cambios" : "6. Control de Historial de Cambios"}
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                      <thead>
                        <tr style={{ background: "#1a4f8a", color: "#fff" }}>
                          <th style={{ padding: "5px 7px", textAlign: "left", width: "15%" }}>Versión</th>
                          <th style={{ padding: "5px 7px", textAlign: "left", width: "65%" }}>Descripción del Cambio</th>
                          <th style={{ padding: "5px 7px", textAlign: "left", width: "20%" }}>Fecha</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "5px 7px", borderBottom: "1px solid #e2e8f0", fontWeight: 700 }}>1.0</td>
                          <td style={{ padding: "5px 7px", borderBottom: "1px solid #e2e8f0" }}>
                            {artifact.documentType === "INFORME"
                              ? `Elaboración inicial del Informe (Ronda ${reviewRound})`
                              : `Elaboración inicial del Plan de Trabajo (Ronda ${reviewRound})`}
                          </td>
                          <td style={{ padding: "5px 7px", borderBottom: "1px solid #e2e8f0", color: "#64748b" }}>
                            {artifact.generatedAt.split(" ")[0]}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Bottom Page Footer */}
              <div
                style={{
                  borderTop: "1px solid #cbd5e1",
                  paddingTop: 8,
                  marginTop: 24,
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 8.5,
                  color: "#64748b",
                }}
              >
                <span>Sistema de Gestión de Planes de Trabajo — FISEI UTA</span>
                <span>Página {currentPage} de {totalPages}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (30%): Details, Flow, Observations, Actions */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff", overflowY: "auto" }}>
          
          {/* Document Header Card */}
          <div style={{ padding: "16px 18px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#1a4f8a",
                  background: "#eff6ff",
                  padding: "2px 6px",
                  borderRadius: 4,
                }}
              >
                {artifact.grupo}
              </span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: isDocumentValidated
                    ? "#dcfce7"
                    : documentState === "EN REVISIÓN"
                    ? "#dbeafe"
                    : documentState === "DEVUELTO"
                    ? "#fee2e2"
                    : "#fef3c7",
                  color: isDocumentValidated
                    ? "#166534"
                    : documentState === "EN REVISIÓN"
                    ? "#1e40af"
                    : documentState === "DEVUELTO"
                    ? "#991b1b"
                    : "#92400e",
                }}
              >
                {documentState}
              </span>
            </div>

            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
              {artifact.documentType === "INFORME" ? "Informe" : "Plan de Trabajo"} v{formalVersion}
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 10, fontSize: 11.5 }}>
              <div>
                <span style={{ color: "#64748b" }}>Ronda: </span>
                <span style={{ fontWeight: 700, color: "#1e2a3a" }}>Ronda {reviewRound}</span>
              </div>
              <div>
                <span style={{ color: "#64748b" }}>Firmas: </span>
                <span style={{ fontWeight: 700, color: "#166534" }}>{artifact.signatures.length} de 3</span>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <span style={{ color: "#64748b" }}>Actor en sesión: </span>
                <span style={{ fontWeight: 600, color: "#1a4f8a" }}>{currentUser.nombre} ({currentUser.cargo})</span>
              </div>
            </div>
          </div>

          {/* Sequential Approval Chain */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Cadena de Aprobación Institucional
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {flowStages.map((stage, i) => {
                const sig = artifact.signatures.find((s) => s.actor === stage.actorName);
                const isCurrentActive = stage.estado === "EN_CURSO" || (!sig && i === 0 && documentState === "BORRADOR");

                return (
                  <div key={stage.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: sig ? "#16a34a" : isCurrentActive ? "#1a4f8a" : "#f1f5f9",
                        color: sig || isCurrentActive ? "#fff" : "#94a3b8",
                        border: isCurrentActive ? "2px solid #93c5fd" : "1px solid #cbd5e1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      {sig ? "✓" : i + 1}
                    </div>
                    <div style={{ flex: 1, fontSize: 12 }}>
                      <div style={{ fontWeight: 700, color: "#1e2a3a" }}>{stage.stageName}</div>
                      <div style={{ fontSize: 11, color: "#475569" }}>{stage.actorName}</div>
                      <div style={{ fontSize: 10.5, color: sig ? "#16a34a" : isCurrentActive ? "#2563eb" : "#94a3b8", fontWeight: 600 }}>
                        {sig ? `Firmado (${sig.fecha} ${sig.hora})` : stage.estado === "DEVUELTO" ? "Devuelto" : "Pendiente"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checklist de Revisión */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.4 }}>
              Aspectos a Verificar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {Object.keys(checklist).map((item) => (
                <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 12 }}>
                  <input
                    type="checkbox"
                    checked={checklist[item]}
                    onChange={(e) => setChecklist((prev) => ({ ...prev, [item]: e.target.checked }))}
                    style={{ accentColor: "#1a4f8a", width: 14, height: 14 }}
                  />
                  <span style={{ color: checklist[item] ? "#1e2a3a" : "#64748b" }}>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Observations Box */}
          <div style={{ padding: "14px 18px", borderBottom: "1px solid #e2e8f0", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1e2a3a", textTransform: "uppercase", letterSpacing: 0.4 }}>
                Observaciones ({activeObservations.length})
              </div>
              {!readOnly && (
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => setShowAddObsDrawer(true)}
                  style={{ color: "#1a4f8a", fontWeight: 700 }}
                >
                  + Agregar en pág. {currentPage}
                </button>
              )}
            </div>

            {observations.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", background: "#f8fafc", borderRadius: 6, border: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8" }}>
                Sin observaciones registradas en esta versión.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
                {observations.map((obs) => (
                  <div
                    key={obs.id}
                    style={{
                      padding: "10px 12px",
                      borderRadius: 6,
                      background: obs.estado === "activa" ? "#fef2f2" : "#f8fafc",
                      border: `1px solid ${obs.estado === "activa" ? "#fecaca" : "#e2e8f0"}`,
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "1px 6px",
                          borderRadius: 4,
                          background: obs.estado === "activa" ? "#dc2626" : "#cbd5e1",
                          color: "#fff",
                          textTransform: "uppercase",
                        }}
                      >
                        Pág. {obs.pagina} {obs.seccion ? `· ${obs.seccion}` : ""}
                      </span>
                      <span style={{ fontSize: 10.5, color: "#64748b" }}>Ronda {obs.ronda}</span>
                    </div>

                    {editingObsId === obs.id ? (
                      <div style={{ marginTop: 4 }}>
                        <textarea
                          className="form-textarea"
                          style={{ minHeight: 60, fontSize: 12 }}
                          value={editingObsText}
                          onChange={(e) => setEditingObsText(e.target.value)}
                        />
                        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => {
                              onEditObservacion?.(obs.id, editingObsText);
                              setEditingObsId(null);
                            }}
                          >
                            Guardar
                          </button>
                          <button className="btn btn-ghost btn-xs" onClick={() => setEditingObsId(null)}>
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ color: "#334155", lineHeight: 1.4, margin: "4px 0" }}>"{obs.texto}"</div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10.5, color: "#64748b" }}>
                          <span>{obs.revisor}</span>
                          {obs.estado === "activa" && !readOnly && (
                            <div style={{ display: "flex", gap: 4 }}>
                              <button
                                onClick={() => {
                                  setEditingObsId(obs.id);
                                  setEditingObsText(obs.texto);
                                }}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: "1px 4px" }}
                                title="Editar"
                              >
                                ✎
                              </button>
                              <button
                                onClick={() => onDeleteObservacion?.(obs.id)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: "1px 4px" }}
                                title="Eliminar"
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Decisions Bar */}
          <div style={{ padding: "16px 18px", background: "#f8fafc", borderTop: "1px solid #e2e8f0" }}>
            {/* Warning block if active observations exist */}
            {hasActiveObservations && (
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 6,
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  fontSize: 12,
                  fontWeight: 600,
                  marginBottom: 10,
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                No es posible aprobar mientras existan observaciones activas.
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* If Validated: Download final button ONLY when currentUser is the identity that executed final validation */}
              {isDocumentValidated ? (
                isFinalValidatorUser ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => alert("Descarga del documento final validado y firmado generado institucionalmente.")}
                    style={{ background: "#166534", border: "none", justifyContent: "center", padding: "10px" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    DESCARGAR DOCUMENTO FINAL
                  </button>
                ) : (
                  <div style={{ textAlign: "center", padding: "10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, color: "#166534", fontSize: 12, fontWeight: 700 }}>
                    ✓ DOCUMENTO FINAL VALIDADO
                    <div style={{ fontSize: 11, fontWeight: 500, color: "#15803d", marginTop: 2 }}>
                      (Visualización formal habilitada. Descarga reservada al validador final.)
                    </div>
                  </div>
                )
              ) : isValidador ? (
                /* Final Validator Actions */
                <>
                  <button
                    className="btn btn-primary"
                    disabled={hasActiveObservations || isAlreadySignedByMe}
                    onClick={onOpenFirmar}
                    style={{ justifyContent: "center" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    VALIDAR Y FIRMAR
                  </button>
                  <button
                    onClick={onOpenDevolver}
                    style={{
                      justifyContent: "center",
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1.5px solid #d97706",
                      background: "#fffbeb",
                      color: "#92400e",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 14 4 9 9 4" />
                      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                    </svg>
                    DEVOLVER
                  </button>
                </>
              ) : isRevisor ? (
                /* Intermediate Reviewer Actions */
                <>
                  <button
                    className="btn btn-primary"
                    disabled={hasActiveObservations || isAlreadySignedByMe}
                    onClick={onOpenFirmar}
                    style={{ justifyContent: "center" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    APROBAR Y FIRMAR
                  </button>
                  <button
                    onClick={onOpenDevolver}
                    style={{
                      justifyContent: "center",
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1.5px solid #d97706",
                      background: "#fffbeb",
                      color: "#92400e",
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="9 14 4 9 9 4" />
                      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                    </svg>
                    DEVOLVER
                  </button>
                </>
              ) : isDocente ? (
                /* Docente Preview Actions */
                <button className="btn btn-primary" onClick={onOpenFirmar} style={{ justifyContent: "center" }}>
                  FIRMAR Y CONTINUAR →
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
