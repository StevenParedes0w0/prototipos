import React, { useState, useRef } from "react";
import { DocumentArtifact, DocumentObservation, FlowStageNode } from "./types";
import logoUta from "../img/Logo UTA-Azul.png";

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
  const isPlan = artifact.documentType === "PLAN_TRABAJO";
  const totalPages = artifact.pageCount || (artifact as any).pages?.length || 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const containerRef = useRef<HTMLDivElement>(null);

  // Observations state for adding/editing
  const [showAddObsDrawer, setShowAddObsDrawer] = useState(false);
  const [obsTipo, setObsTipo] = useState<"general" | "seccion">("seccion");
  const [obsSeccion, setObsSeccion] = useState("");
  const [obsTexto, setObsTexto] = useState("");
  const [editingObsId, setEditingObsId] = useState<number | null>(null);
  const [editingObsText, setEditingObsText] = useState("");

  // Checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    isPlan
      ? {
          "Información general": true,
          "Justificación y objetivo": true,
          "Matriz de actividades": false,
          "Anexos y medios": false,
          "Firmas de responsabilidad": false,
        }
      : {
          "Información general": true,
          "Antecedentes": true,
          "Desarrollo de actividades": false,
          "Conclusiones y oportunidades de mejora": false,
          "Registro de contactos, si aplica": false,
          "Anexos": false,
          "Firmas de responsabilidad": false,
        }
  );

  const activeObservations = observations.filter((o) => o.estado === "activa");
  const hasActiveObservations = activeObservations.length > 0;

  const isDocente = currentUser.role === "docente";
  const isValidador =
    currentUser.role === "validador" ||
    currentUser.cargo.includes("Coordinadora") ||
    currentUser.cargo.includes("Autoridad");
  const isRevisor = currentUser.role === "revisor" && !isValidador;

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

  // Dynamic orientation per page: Page 4 of Plan is Landscape
  const isLandscape = isPlan && currentPage === 4;

  const handleCreateObs = () => {
    if (!obsTexto.trim()) return;
    const sec = obsTipo === "seccion" ? (obsSeccion || `Página ${currentPage}`) : "General";
    onAddObservacion(currentPage, obsTexto.trim(), sec, obsTipo);
    setObsTexto("");
    setObsSeccion("");
    setShowAddObsDrawer(false);
  };

  const handleFit = () => {
    if (!containerRef.current) {
      setZoom(80);
      return;
    }
    const availH = containerRef.current.clientHeight - 48;
    const targetH = isLandscape ? 680 : 960;
    const availW = containerRef.current.clientWidth - 48;
    const targetW = isLandscape ? 1040 : 780;
    const scaleH = availH / targetH;
    const scaleW = availW / targetW;
    const optimalScale = Math.min(scaleH, scaleW);
    const fitZoom = Math.min(100, Math.max(50, Math.round(optimalScale * 100)));
    setZoom(fitZoom);
  };

  // ─── Componentes Institucionales DOCX ──────────────────────────────────────────

  const renderHeader = () => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #475569",
        marginBottom: isLandscape ? 14 : 20,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <tbody>
        <tr>
          <td
            rowSpan={5}
            style={{
              width: isLandscape ? "18%" : "22%",
              border: "1px solid #475569",
              textAlign: "center",
              verticalAlign: "middle",
              padding: "6px 8px",
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <img
                src={logoUta}
                alt="Universidad Técnica de Ambato"
                style={{ maxHeight: 52, maxWidth: "100%", objectFit: "contain", marginBottom: 4 }}
              />
              <div
                style={{
                  fontSize: 7.5,
                  fontWeight: 800,
                  color: "#1a4f8a",
                  lineHeight: 1.25,
                  textTransform: "uppercase",
                  letterSpacing: 0.3,
                  textAlign: "center",
                }}
              >
                SISTEMA DE GESTIÓN<br />DE LA CALIDAD
              </div>
            </div>
          </td>
          <td
            colSpan={2}
            style={{
              border: "1px solid #475569",
              textAlign: "center",
              padding: "6px 8px",
              fontWeight: 800,
              fontSize: 11,
              color: "#0f172a",
              letterSpacing: 0.3,
            }}
          >
            UNIVERSIDAD TÉCNICA DE AMBATO
          </td>
        </tr>
        <tr>
          <td
            colSpan={2}
            style={{
              border: "1px solid #475569",
              textAlign: "center",
              padding: "5px 8px",
              background: "#f1f5f9",
              fontWeight: 800,
              fontSize: 9.5,
              color: "#1e293b",
              textTransform: "uppercase",
            }}
          >
            {artifact.documentType === "INFORME"
              ? `INFORME DE: ${artifact.titulo || artifact.grupo}`
              : `PLAN DE TRABAJO: ${artifact.grupo}`}
          </td>
        </tr>
        <tr>
          <td
            style={{
              width: "36%",
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 7.5,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Unidad académica / administrativa:
          </td>
          <td
            style={{
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 8,
              color: "#0f172a",
            }}
          >
            {artifact.unidadAcademica}
          </td>
        </tr>
        <tr>
          <td
            style={{
              width: "36%",
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 7.5,
              fontWeight: 700,
              color: "#1e293b",
            }}
          >
            Carrera:
          </td>
          <td
            style={{
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 8,
              color: "#0f172a",
            }}
          >
            {artifact.carrera || "Ingeniería de Software"}
          </td>
        </tr>
        <tr>
          <td
            style={{
              width: "36%",
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 7.5,
              fontWeight: 700,
              color: "#1e293b",
              background: "#f1f5f9",
            }}
          >
            Fecha de elaboración:
          </td>
          <td
            style={{
              border: "1px solid #475569",
              padding: "4px 8px",
              fontSize: 8,
              color: "#0f172a",
            }}
          >
            {artifact.generatedAt.split(" ")[0]}
          </td>
        </tr>
      </tbody>
    </table>
  );

  const renderFooter = () => (
    <div
      style={{
        borderTop: "1px solid #cbd5e1",
        paddingTop: 8,
        marginTop: 24,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 8,
        color: "#475569",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      <div style={{ flex: 1, textAlign: "left" }}>
        Documento de uso interno controlado por la Universidad Técnica de Ambato
      </div>
      <div style={{ flex: 1, textAlign: "center", fontWeight: 600 }}>
        Formato Nº: {artifact.codigoFormatoOficial || (artifact.documentType === "INFORME" ? "UTA-SGC-A-2-1-P7-T2" : "UTA-SGC-A-2-1-P7-T1")}
      </div>
      <div style={{ flex: 1, textAlign: "right", fontWeight: 700 }}>
        {currentPage}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: "#f8fafc", overflow: "hidden" }}>
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
      <div style={{ flex: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 340px", height: "100%", overflow: "hidden" }}>
        
        {/* LEFT COLUMN (70%): Page-by-page PDF Viewer */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, borderRight: "1px solid #e2e8f0", background: "#525659", overflow: "hidden" }}>
          
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
            {/* Page Navigation Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹ Anterior
              </button>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#e2e8f0", minWidth: 85, textAlign: "center" }}>
                Página {currentPage} de {totalPages}
                {isLandscape && (
                  <span style={{ marginLeft: 6, fontSize: 10, background: "#0ea5e9", color: "#fff", padding: "1px 5px", borderRadius: 3 }}>
                    Horiz
                  </span>
                )}
              </span>
              <button
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Siguiente ›
              </button>
            </div>

            {/* Direct page buttons Center */}
            <div style={{ display: "flex", gap: 4 }}>
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
                onClick={() => setZoom((z) => Math.max(50, z - 10))}
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", padding: "2px 8px" }}
                title="Reducir zoom"
              >
                −
              </button>
              <button
                onClick={() => setZoom(100)}
                className="btn btn-ghost btn-xs"
                style={{ fontSize: 12, color: "#e2e8f0", minWidth: 44, textAlign: "center", padding: "2px 4px" }}
                title="Restablecer al 100%"
              >
                {zoom}%
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(140, z + 10))}
                className="btn btn-ghost btn-xs"
                style={{ color: "#fff", padding: "2px 8px" }}
                title="Aumentar zoom"
              >
                +
              </button>
              <button
                className="btn btn-ghost btn-xs"
                onClick={handleFit}
                style={{ color: "#38bdf8", fontSize: 11, border: "1px solid rgba(56,189,248,0.3)" }}
                title="Ajustar documento a la pantalla visible"
              >
                Ajustar
              </button>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setZoom(100)}
                style={{ color: "#e2e8f0", fontSize: 11 }}
                title="Zoom al 100%"
              >
                100%
              </button>
            </div>
          </div>

          {/* PDF Page Canvas Scrollable Viewport */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflow: "auto",
              padding: "24px 16px",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              WebkitOverflowScrolling: "touch",
              overscrollBehavior: "contain",
            }}
          >
            <div
              style={{
                width: `${zoom}%`,
                maxWidth: isLandscape ? Math.round(1040 * (zoom / 100)) : Math.round(780 * (zoom / 100)),
                minHeight: isLandscape ? 680 : 960,
                background: "#fff",
                borderRadius: 2,
                boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
                padding: isLandscape ? "32px 38px" : "40px 48px",
                fontFamily: "Helvetica, Arial, sans-serif",
                color: "#1e293b",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
                margin: "0 auto",
                transition: "max-width 0.2s ease, min-height 0.2s ease",
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
                    fontSize: isLandscape ? 76 : 64,
                    fontWeight: 800,
                    color: "rgba(200, 50, 50, 0.04)",
                    letterSpacing: 8,
                    userSelect: "none",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    zIndex: 0,
                  }}
                >
                  {documentState === "EN REVISIÓN" ? "EN REVISIÓN" : "BORRADOR"}
                </div>
              )}

              {/* Page Content Switch */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
                {/* Institutional Reconstructed Header (Repeated on all pages) */}
                {renderHeader()}

                {/* ─────────────────────────────────────────────────────────────
                    PLAN DE TRABAJO (T1) — 5 PÁGINAS ALTA FIDELIDAD DOCX
                   ───────────────────────────────────────────────────────────── */}
                {isPlan ? (
                  <>
                    {/* PÁGINA 1: PORTADA */}
                    {currentPage === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 640, justifyContent: "space-between" }}>
                        <div style={{ textAlign: "center", marginTop: 44, marginBottom: 44 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 36,
                              fontWeight: 800,
                              color: "#0f172a",
                              lineHeight: 1.15,
                              letterSpacing: -0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            UNIVERSIDAD TÉCNICA<br />DE AMBATO
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 34,
                            width: "100%",
                            maxWidth: 620,
                            margin: "0 auto 40px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>UNIDAD ACADÉMICA / ADMINISTRATIVA: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 700, color: "#334155" }}>{artifact.unidadAcademica}</span>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>PLAN DE TRABAJO DE: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>{artifact.grupo}</span>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>PERÍODO: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 700, color: "#334155" }}>{artifact.periodo}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PÁGINA 2: ÍNDICE DE CONTENIDO E ÍNDICE DE TABLAS */}
                    {currentPage === 2 && (
                      <div style={{ flex: 1, padding: "8px 0" }}>
                        <div
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#323E4F",
                            textTransform: "uppercase",
                            marginBottom: 16,
                          }}
                        >
                          Índice de Contenido
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 10.5, color: "#1e293b", fontFamily: "Helvetica, Arial, sans-serif" }}>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>1. JUSTIFICACIÓN</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>2. OBJETIVO</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>3. MATRIZ DE ACTIVIDADES</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 4</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>4. ANEXOS</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 5</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>FIRMAS DE RESPONSABILIDAD</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 5</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "baseline" }}>
                            <span style={{ fontWeight: 700 }}>CONTROL DE HISTORIAL DE CAMBIOS</span>
                            <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                            <span>Pág. 5</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 56, marginBottom: 16 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#323E4F",
                              textTransform: "uppercase",
                              marginBottom: 16,
                            }}
                          >
                            Índice de Tablas
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 10.5, color: "#1e293b", fontFamily: "Helvetica, Arial, sans-serif" }}>
                            <div style={{ display: "flex", alignItems: "baseline" }}>
                              <span>Tabla 1.- Matriz de actividades</span>
                              <span style={{ flex: 1, borderBottom: "1px dotted #94a3b8", margin: "0 8px" }} />
                              <span>Pág. 4</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* PÁGINA 3: 1. JUSTIFICACIÓN Y 2. OBJETIVO */}
                    {currentPage === 3 && (
                      <div style={{ flex: 1, padding: "8px 0" }}>
                        <div style={{ marginBottom: 36 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#323E4F",
                              textTransform: "uppercase",
                              marginBottom: 10,
                            }}
                          >
                            1. JUSTIFICACIÓN
                          </div>
                          <p
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 10.5,
                              color: "#1e293b",
                              lineHeight: 1.75,
                              textAlign: "justify",
                              margin: 0,
                            }}
                          >
                            {artifact.justificacion}
                          </p>
                        </div>

                        <div style={{ marginBottom: 36 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#323E4F",
                              textTransform: "uppercase",
                              marginBottom: 10,
                            }}
                          >
                            2. OBJETIVO
                          </div>
                          <p
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 10.5,
                              color: "#1e293b",
                              lineHeight: 1.75,
                              textAlign: "justify",
                              margin: 0,
                            }}
                          >
                            {artifact.objetivo}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* PÁGINA 4 (o intermedias): 3. MATRIZ DE ACTIVIDADES (LANDSCAPE) */}
                    {currentPage >= 4 && currentPage < totalPages && (
                      <div style={{ flex: 1, padding: "4px 0" }}>
                        <div
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#323E4F",
                            textTransform: "uppercase",
                            marginBottom: 4,
                          }}
                        >
                          3. MATRIZ DE ACTIVIDADES
                        </div>
                        <div
                          style={{
                            fontFamily: "Helvetica, Arial, sans-serif",
                            fontSize: 9,
                            color: "#475569",
                            fontStyle: "italic",
                            marginBottom: 8,
                          }}
                        >
                          Tabla 1.- Matriz de actividades
                        </div>

                        <table
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: "1px solid #475569",
                            fontSize: 8.5,
                            fontFamily: "Helvetica, Arial, sans-serif",
                          }}
                        >
                          <thead>
                            <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                              <th
                                rowSpan={2}
                                style={{
                                  border: "1px solid #475569",
                                  padding: "6px 8px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  width: "25%",
                                }}
                              >
                                Actividades
                              </th>
                              <th
                                colSpan={2}
                                style={{
                                  border: "1px solid #475569",
                                  padding: "4px 8px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  width: "17%",
                                }}
                              >
                                Cronograma
                              </th>
                              <th
                                rowSpan={2}
                                style={{
                                  border: "1px solid #475569",
                                  padding: "6px 8px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  width: "18%",
                                }}
                              >
                                Responsable
                              </th>
                              <th
                                rowSpan={2}
                                style={{
                                  border: "1px solid #475569",
                                  padding: "6px 8px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  width: "20%",
                                }}
                              >
                                <div>Recursos</div>
                                <div style={{ fontSize: 7, fontWeight: 500, color: "#475569" }}>(humano, tecnológico, económico, material)</div>
                              </th>
                              <th
                                rowSpan={2}
                                style={{
                                  border: "1px solid #475569",
                                  padding: "6px 8px",
                                  textAlign: "center",
                                  fontWeight: 700,
                                  width: "20%",
                                }}
                              >
                                Medios de verificación
                              </th>
                            </tr>
                            <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                              <th style={{ border: "1px solid #475569", padding: "3px 6px", textAlign: "center", fontWeight: 700, fontSize: 8 }}>
                                Desde
                              </th>
                              <th style={{ border: "1px solid #475569", padding: "3px 6px", textAlign: "center", fontWeight: 700, fontSize: 8 }}>
                                Hasta
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(artifact.matriz || []).map((act, i) => (
                              <tr key={act.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px 8px", color: "#0f172a", fontWeight: 600, lineHeight: 1.3 }}>
                                  {act.nombre}
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px", textAlign: "center", color: "#334155", fontSize: 8 }}>
                                  {act.desde || "—"}
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px", textAlign: "center", color: "#334155", fontSize: 8 }}>
                                  {act.hasta || "—"}
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px 8px", color: "#334155" }}>
                                  {act.responsables?.join(", ") || "Docente Responsable"}
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px 8px", color: "#334155", fontSize: 8 }}>
                                  {act.recursos && act.recursos.length > 0 ? (
                                    act.recursos.map((r, ri) => (
                                      <div key={ri}>• {r}</div>
                                    ))
                                  ) : (
                                    <>
                                      <div>• Humano: Docente</div>
                                      <div>• Tecnológico: Plataforma</div>
                                      <div>• Material: Ofimático</div>
                                    </>
                                  )}
                                </td>
                                <td style={{ border: "1px solid #cbd5e1", padding: "6px 8px", color: "#334155", fontSize: 8 }}>
                                  {act.medios?.join(", ") || "Cronograma oficial firmado"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div style={{ fontSize: 8, color: "#475569", fontStyle: "italic", marginTop: 6 }}>
                          Fuente: Elaborado por: {artifact.generatedBy || "Docente Responsable"}
                        </div>

                        {artifact.grupo.includes("Datos Personales") && (
                          <div style={{ fontSize: 7.5, color: "#64748b", fontStyle: "italic", marginTop: 10, lineHeight: 1.4 }}>
                            Nota: Conforme a la Ley Orgánica de Protección de Datos Personales, la información y registros generados en el presente plan serán tratados con estricta confidencialidad y para los fines institucionales autorizados.
                          </div>
                        )}
                      </div>
                    )}

                    {/* PÁGINA 5 (o final): 4. ANEXOS, FIRMAS DE RESPONSABILIDAD, CONTROL DE HISTORIAL */}
                    {currentPage === totalPages && (
                      <div style={{ flex: 1, padding: "4px 0" }}>
                        {/* 4. ANEXOS */}
                        <div style={{ marginBottom: 20 }}>
                          <div style={{ marginBottom: 12 }}>
                            <div
                              style={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontSize: 14,
                                fontWeight: 800,
                                color: "#323E4F",
                                textTransform: "uppercase",
                                marginBottom: 4,
                              }}
                            >
                              4. ANEXOS
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>(en caso de ser necesario)</div>
                          </div>
                          {artifact.tieneAnexos === "si" && artifact.anexos && artifact.anexos.length > 0 ? (
                            artifact.anexos.map((anexo, idx) => (
                              <div key={anexo.id} style={{ fontSize: 9.5, color: "#334155", padding: "3px 0", borderBottom: "1px dashed #e2e8f0" }}>
                                <b>Anexo {LETRAS[idx] || idx + 1}:</b> {anexo.nombre} ({anexo.archivo} - {anexo.tamano})
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 9.5, color: "#64748b", fontStyle: "italic" }}>
                              No aplica.
                            </div>
                          )}
                        </div>

                        {/* FIRMAS DE RESPONSABILIDAD */}
                        <div style={{ marginBottom: 20 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#323E4F",
                              textTransform: "uppercase",
                              marginBottom: 8,
                            }}
                          >
                            FIRMAS DE RESPONSABILIDAD
                          </div>
                          
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8.5 }}>
                            <thead>
                              <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>
                                  ACCIONES
                                </th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "28%", fontWeight: 700 }}>
                                  NOMBRE
                                </th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>
                                  CARGO
                                </th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>
                                  FIRMA
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {flowStages.map((stage, idx) => {
                                const sig = artifact.signatures.find((s) => s.actor === stage.actorName || s.actorId === stage.actorId);
                                const isCurrentActorCell = (currentUser.nombre === stage.actorName || (stage.actorId && stage.actorId === (currentUser as any).id)) && !sig;

                                let accionTitulo = "Elaborado por:";
                                let accionSub = "(Delegado técnico de la unidad académica o administrativa)";
                                if (stage.actionLabel === "APROBADO_POR") {
                                  accionTitulo = "Aprobado por:";
                                  accionSub = "(órgano colegiado correspondiente según la procedencia del plan)";
                                } else if (stage.actionLabel === "VALIDADO_POR" || stage.actorRole === "validador" || stage.stageName.includes("Validación")) {
                                  accionTitulo = "Validado por:";
                                  accionSub = "(Líder de la unidad académica o administrativa según la procedencia del plan)";
                                } else if (stage.actionLabel === "REVISADO_POR" || stage.actorRole === "revisor" || stage.stageName.includes("Revisión")) {
                                  accionTitulo = "Revisado por:";
                                  accionSub = "(jefe inmediato superior según la procedencia del plan)";
                                }

                                return (
                                  <tr
                                    key={stage.id}
                                    style={{
                                      background: isCurrentActorCell ? "#eff6ff" : idx % 2 === 0 ? "#fff" : "#fafafa",
                                      border: isCurrentActorCell ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                                    }}
                                  >
                                    <td style={{ border: "1px solid #cbd5e1", padding: "14px 8px", verticalAlign: "middle" }}>
                                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{accionTitulo}</div>
                                      <div style={{ fontSize: 7, color: "#64748b", marginTop: 2, lineHeight: 1.2 }}>{accionSub}</div>
                                    </td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "14px 8px", verticalAlign: "middle", fontWeight: 700, color: "#0f172a" }}>
                                      {stage.actorName}
                                    </td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "14px 8px", verticalAlign: "middle", color: "#475569", fontSize: 8 }}>
                                      {stage.actorCargo}
                                    </td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "14px 8px", verticalAlign: "middle" }}>
                                      {sig ? (
                                        <div style={{ padding: "6px 0" }}>
                                          <div style={{ fontSize: 14, fontFamily: "cursive", color: "#0f172a", opacity: 0.85, lineHeight: 1 }}>
                                            {sig.actor}
                                          </div>
                                        </div>
                                      ) : isCurrentActorCell ? (
                                        <div
                                          style={{
                                            background: "#dbeafe",
                                            border: "1px dashed #2563eb",
                                            borderRadius: 4,
                                            padding: "6px 8px",
                                            textAlign: "center",
                                          }}
                                        >
                                          <span style={{ fontSize: 7.5, fontWeight: 800, color: "#1e40af" }}>
                                            [ Su firma aquí ]
                                          </span>
                                        </div>
                                      ) : (
                                        <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 8 }}>
                                          Pendiente de firma
                                        </span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* CONTROL DE HISTORIAL DE CAMBIOS */}
                        <div>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#323E4F",
                              textTransform: "uppercase",
                              marginBottom: 8,
                            }}
                          >
                            CONTROL DE HISTORIAL DE CAMBIOS
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8 }}>
                            <thead>
                              <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "15%", fontWeight: 700 }}>
                                  Versión
                                </th>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "65%", fontWeight: 700 }}>
                                  Descripción del Cambio
                                </th>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "20%", fontWeight: 700 }}>
                                  Fecha de Actualización
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {artifact.historialCambios && artifact.historialCambios.length > 0 ? (
                                artifact.historialCambios.map((h, i) => (
                                  <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px", fontWeight: 700 }}>v{h.version}</td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px" }}>{h.descripcion}</td>
                                    <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px", color: "#64748b" }}>{h.fecha}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px", fontWeight: 700 }}>v{formalVersion}</td>
                                  <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px" }}>Emisión inicial de Plan de Trabajo</td>
                                  <td style={{ border: "1px solid #cbd5e1", padding: "5px 6px", color: "#64748b" }}>
                                    {artifact.generatedAt.split(" ")[0]}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* ─────────────────────────────────────────────────────────────
                      INFORME (T2) — FORMATO INSTITUCIONAL SOBRIO
                     ───────────────────────────────────────────────────────────── */
                  <>
                    {currentPage === 1 && (
                      <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 640, justifyContent: "space-between" }}>
                        <div style={{ textAlign: "center", marginTop: 44, marginBottom: 44 }}>
                          <div
                            style={{
                              fontFamily: "Helvetica, Arial, sans-serif",
                              fontSize: 36,
                              fontWeight: 800,
                              color: "#0f172a",
                              lineHeight: 1.15,
                              letterSpacing: -0.5,
                              textTransform: "uppercase",
                            }}
                          >
                            UNIVERSIDAD TÉCNICA<br />DE AMBATO
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 34,
                            width: "100%",
                            maxWidth: 620,
                            margin: "0 auto 40px",
                            textAlign: "center",
                          }}
                        >
                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>UNIDAD ACADÉMICA / ADMINISTRATIVA: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 700, color: "#334155" }}>{artifact.unidadAcademica}</span>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>INFORME DE: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>{(artifact.titulo || "").replace(/^INFORME DE:\s*/i, "")}</span>
                          </div>

                          <div style={{ marginTop: 8 }}>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 800, color: "#1e293b", textTransform: "uppercase" }}>PERÍODO: </span>
                            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 18, fontWeight: 700, color: "#334155" }}>{artifact.periodo}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentPage === 2 && (
                      <div style={{ flex: 1, padding: "8px 0" }}>
                        <div style={{ marginBottom: 24, textAlign: "center" }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                            ÍNDICE DE CONTENIDOS
                          </div>
                        </div>
                        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10.5, color: "#1e293b", lineHeight: 2, margin: "0 auto", width: "80%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>1. ANTECEDENTES <span style={{ color: "#94a3b8" }}>...................................................................</span></span>
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>2. DESARROLLO DE ACTIVIDADES <span style={{ color: "#94a3b8" }}>...........................................</span></span>
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>3. CONCLUSIONES <span style={{ color: "#94a3b8" }}>....................................................................</span></span>
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>4. OPORTUNIDADES DE MEJORA <span style={{ color: "#94a3b8" }}>.............................................</span></span>
                            <span>Pág. 3</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>5. REGISTRO DE CONTACTOS Y GESTIONES DE LA DELEGACIÓN <span style={{ color: "#94a3b8" }}>....</span></span>
                            <span>Pág. 4</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>6. ANEXOS <span style={{ color: "#94a3b8" }}>..............................................................................</span></span>
                            <span>Pág. 4</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>FIRMAS DE RESPONSABILIDAD <span style={{ color: "#94a3b8" }}>................................................</span></span>
                            <span>Pág. 4</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>CONTROL DE HISTORIAL DE CAMBIOS <span style={{ color: "#94a3b8" }}>......................................</span></span>
                            <span>Pág. 5</span>
                          </div>
                        </div>

                        <div style={{ marginTop: 40, marginBottom: 24, textAlign: "center" }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, fontWeight: 800, color: "#0f172a", textTransform: "uppercase" }}>
                            ÍNDICE DE TABLAS
                          </div>
                        </div>
                        <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10.5, color: "#1e293b", lineHeight: 2, margin: "0 auto", width: "80%" }}>
                          <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span>Tabla 1.- Resultados de la matriz de actividades <span style={{ color: "#94a3b8" }}>......................</span></span>
                            <span>Pág. 3</span>
                          </div>
                          {artifact.informeData?.aplicaRegistroContactos && artifact.informeData.contactosDelegacion && artifact.informeData.contactosDelegacion.length > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span>Tabla 2.- Registro de contactos y gestiones de la delegación <span style={{ color: "#94a3b8" }}>..</span></span>
                              <span>Pág. 4</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {currentPage === 3 && (
                      <div style={{ flex: 1, padding: "8px 0" }}>
                        <div style={{ marginBottom: 22 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 10 }}>
                            1. ANTECEDENTES
                          </div>
                          <p style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 10.5, color: "#1e293b", lineHeight: 1.75, textAlign: "justify", margin: 0 }}>
                            {artifact.informeData?.antecedentes || artifact.informeData?.introduccion || "En cumplimiento a la planificación académica institucional del período académico."}
                          </p>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 8 }}>
                            2. DESARROLLO DE ACTIVIDADES
                          </div>
                          {artifact.informeData?.informeOrigen === "DERIVADO_PLAN" && (
                            <div style={{ fontSize: 9.5, color: "#475569", fontStyle: "italic", marginBottom: 6 }}>
                              NOTA: Cuando el informe tenga por objeto la ejecución de un Plan de Trabajo... Nota 1: la tabla 1 se debe utilizar en caso de que el informe derive del plan de trabajo.
                            </div>
                          )}
                          
                          {artifact.informeData?.actividadesInforme && artifact.informeData.actividadesInforme.length > 0 ? (
                            <div>
                              <div style={{ fontSize: 9, color: "#475569", fontStyle: "italic", marginBottom: 6 }}>
                                Tabla 1.- Resultados de la matriz de actividades
                              </div>
                              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 9, marginBottom: 16 }}>
                                <thead>
                                  <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                    <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "center", width: "34%", fontWeight: 700 }}>Actividades</th>
                                    <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "center", width: "30%", fontWeight: 700 }}>Medios de verificación</th>
                                    <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "center", width: "16%", fontWeight: 700 }}>Porcentaje de ejecución</th>
                                    <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "center", width: "20%", fontWeight: 700 }}>Observaciones</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {artifact.informeData.actividadesInforme.map((a) => (
                                    <tr key={a.id}>
                                      <td style={{ border: "1px solid #475569", padding: "6px 8px", color: "#0f172a" }}>
                                        {a.actividad}
                                      </td>
                                      <td style={{ border: "1px solid #475569", padding: "6px 8px", color: "#0f172a" }}>
                                        {a.mediosVerificacion}
                                      </td>
                                      <td style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "center", color: "#0f172a" }}>
                                        {a.porcentajeEjecucion}%
                                      </td>
                                      <td style={{ border: "1px solid #475569", padding: "6px 8px", color: "#0f172a" }}>
                                        {a.observaciones || "—"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p style={{ fontSize: 10.5, color: "#1e293b", lineHeight: 1.75, textAlign: "justify" }}>
                              {artifact.informeData?.desarrolloTextoLibre || artifact.informeData?.desarrollo || "Se ejecutaron las actividades institucionales previstas."}
                            </p>
                          )}
                        </div>

                        <div style={{ marginBottom: 18 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 6 }}>
                            3. CONCLUSIONES
                          </div>
                          <p style={{ fontSize: 10.5, color: "#1e293b", lineHeight: 1.75, textAlign: "justify", margin: 0 }}>
                            {artifact.informeData?.conclusiones || artifact.informeData?.resultados || "Se cumplieron los compromisos institucionales establecidos."}
                          </p>
                        </div>

                        <div style={{ marginBottom: 18 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 6 }}>
                            4. OPORTUNIDADES DE MEJORA
                          </div>
                          <p style={{ fontSize: 10.5, color: "#1e293b", lineHeight: 1.75, textAlign: "justify", margin: 0 }}>
                            {artifact.informeData?.oportunidadesMejora || artifact.informeData?.observaciones || "Se recomienda dar continuidad a los procesos de seguimiento."}
                          </p>
                        </div>
                      </div>
                    )}

                    {currentPage === 4 && (
                      <div style={{ flex: 1, padding: "4px 0" }}>
                        <div style={{ marginBottom: 18 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 4 }}>
                            5. REGISTRO DE CONTACTOS Y GESTIONES DE LA DELEGACIÓN
                          </div>
                          <div style={{ fontSize: 9.5, color: "#475569", marginBottom: 6 }}>
                            Complete únicamente para delegaciones, visitas técnicas o comisiones...
                          </div>
                          {artifact.informeData?.aplicaRegistroContactos && artifact.informeData.contactosDelegacion && artifact.informeData.contactosDelegacion.length > 0 ? (
                            <>
                              <div style={{ fontSize: 8.5, color: "#475569", fontStyle: "italic", marginBottom: 6 }}>
                                Tabla 2.- Registro de contactos y gestiones de la delegación
                              </div>
                              <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8, marginBottom: 14 }}>
                                <thead>
                                  <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "18%", fontWeight: 700 }}>Nombre delegación</th>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "15%", fontWeight: 700 }}>Ciudad/País</th>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "18%", fontWeight: 700 }}>Contacto</th>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "15%", fontWeight: 700 }}>Datos</th>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "16%", fontWeight: 700 }}>Propósito</th>
                                    <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "18%", fontWeight: 700 }}>Acuerdos</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {artifact.informeData.contactosDelegacion.map((c, ci) => (
                                    <tr key={c.id}>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>{c.nombreDelegacion}</td>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>{c.ciudadPaisInstitucion}</td>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>
                                        <div><strong>{c.institucion || c.entidadPersonaContacto}</strong></div>
                                        <div>{c.nombreCargo}</div>
                                      </td>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>{c.datosContacto}</td>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>{c.temaTratado || c.temaProposito}</td>
                                      <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#0f172a" }}>{c.compromisoResponsablePlazo || c.acuerdoSeguimiento}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </>
                          ) : (
                            <div style={{ fontSize: 9.5, color: "#64748b", fontStyle: "italic" }}>
                              No aplica.
                            </div>
                          )}
                        </div>

                        <div style={{ marginBottom: 18 }}>
                          <div style={{ marginBottom: 12 }}>
                            <div
                              style={{
                                fontFamily: "Helvetica, Arial, sans-serif",
                                fontSize: 13.5,
                                fontWeight: 800,
                                color: "#323E4F",
                                textTransform: "uppercase",
                                marginBottom: 4,
                              }}
                            >
                              6. ANEXOS
                            </div>
                            <div style={{ fontSize: 11, color: "#64748b", fontStyle: "italic" }}>(en caso de ser necesario)</div>
                          </div>
                          {artifact.tieneAnexos === "si" && artifact.anexos && artifact.anexos.length > 0 ? (
                            artifact.anexos.map((anexo, idx) => (
                              <div key={anexo.id} style={{ fontSize: 9.5, color: "#334155", padding: "3px 0", borderBottom: "1px dashed #e2e8f0" }}>
                                <b>Anexo {LETRAS[idx] || idx + 1}:</b> {anexo.nombre} ({anexo.archivo} - {anexo.tamano})
                              </div>
                            ))
                          ) : (
                            <div style={{ fontSize: 9.5, color: "#64748b", fontStyle: "italic" }}>
                              No aplica.
                            </div>
                          )}
                        </div>

                        {/* FIRMAS DE RESPONSABILIDAD (Página 4: Elaborado y Revisado) */}
                        <div style={{ marginBottom: 18 }}>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 6 }}>
                            FIRMAS DE RESPONSABILIDAD
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8.5 }}>
                            <thead>
                              <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>ACCIONES</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "28%", fontWeight: 700 }}>NOMBRE</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>CARGO</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>FIRMA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {flowStages.slice(0, 2).map((stage, idx) => {
                                const sig = artifact.signatures.find((s) => s.actor === stage.actorName || s.actorId === stage.actorId);
                                const isCurrentActorCell = (currentUser.nombre === stage.actorName || (stage.actorId && stage.actorId === (currentUser as any).id)) && !sig;

                                let accionTitulo = "Elaborado por:";
                                let accionSub = "(Delegado técnico de la unidad académica o administrativa)";
                                if (stage.actionLabel === "REVISADO_POR" || stage.actorRole === "revisor" || stage.stageName.includes("Revisión")) {
                                  accionTitulo = "Revisado por:";
                                  accionSub = "(jefe inmediato superior según la procedencia del plan)";
                                }

                                return (
                                  <tr
                                    key={stage.id}
                                    style={{
                                      background: isCurrentActorCell ? "#eff6ff" : "#fff",
                                      border: isCurrentActorCell ? "2px solid #3b82f6" : "1px solid #475569",
                                    }}
                                  >
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle" }}>
                                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{accionTitulo}</div>
                                      <div style={{ fontSize: 7, color: "#64748b", marginTop: 2, lineHeight: 1.2 }}>{accionSub}</div>
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle", fontWeight: 700, color: "#0f172a" }}>
                                      {stage.actorName}
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle", color: "#475569", fontSize: 8 }}>
                                      {stage.actorCargo}
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle" }}>
                                      {sig ? (
                                        <div style={{ padding: "6px 0" }}>
                                          <div style={{ fontSize: 14, fontFamily: "cursive", color: "#0f172a", opacity: 0.85, lineHeight: 1 }}>
                                            {sig.actor}
                                          </div>
                                        </div>
                                      ) : isCurrentActorCell ? (
                                        <div style={{ background: "#dbeafe", border: "1px dashed #2563eb", borderRadius: 4, padding: "6px 8px", textAlign: "center" }}>
                                          <span style={{ fontSize: 7.5, fontWeight: 800, color: "#1e40af" }}>[ Su firma aquí ]</span>
                                        </div>
                                      ) : (
                                        <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 8 }}>Pendiente de firma</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {currentPage === 5 && (
                      <div style={{ flex: 1, padding: "4px 0" }}>
                        {/* FIRMAS DE RESPONSABILIDAD (Página 5: Validado/Aprobado) */}
                        <div style={{ marginBottom: 24 }}>
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8.5 }}>
                            <thead>
                              <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>ACCIONES</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "28%", fontWeight: 700 }}>NOMBRE</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>CARGO</th>
                                <th style={{ border: "1px solid #475569", padding: "6px 8px", textAlign: "left", width: "24%", fontWeight: 700 }}>FIRMA</th>
                              </tr>
                            </thead>
                            <tbody>
                              {flowStages.slice(2).map((stage, idx) => {
                                const sig = artifact.signatures.find((s) => s.actor === stage.actorName || s.actorId === stage.actorId);
                                const isCurrentActorCell = (currentUser.nombre === stage.actorName || (stage.actorId && stage.actorId === (currentUser as any).id)) && !sig;

                                let accionTitulo = "Validado por:";
                                let accionSub = "(Líder de la unidad académica o administrativa según la procedencia del plan)";
                                if (stage.actionLabel === "APROBADO_POR") {
                                  accionTitulo = "Aprobado por:";
                                  accionSub = "(órgano colegiado correspondiente según la procedencia del plan)";
                                }

                                return (
                                  <tr
                                    key={stage.id}
                                    style={{
                                      background: isCurrentActorCell ? "#eff6ff" : "#fff",
                                      border: isCurrentActorCell ? "2px solid #3b82f6" : "1px solid #475569",
                                    }}
                                  >
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle" }}>
                                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{accionTitulo}</div>
                                      <div style={{ fontSize: 7, color: "#64748b", marginTop: 2, lineHeight: 1.2 }}>{accionSub}</div>
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle", fontWeight: 700, color: "#0f172a" }}>
                                      {stage.actorName}
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle", color: "#475569", fontSize: 8 }}>
                                      {stage.actorCargo}
                                    </td>
                                    <td style={{ border: "1px solid #475569", padding: "32px 8px", verticalAlign: "middle" }}>
                                      {sig ? (
                                        <div style={{ padding: "6px 0" }}>
                                          <div style={{ fontSize: 14, fontFamily: "cursive", color: "#0f172a", opacity: 0.85, lineHeight: 1 }}>
                                            {sig.actor}
                                          </div>
                                        </div>
                                      ) : isCurrentActorCell ? (
                                        <div style={{ background: "#dbeafe", border: "1px dashed #2563eb", borderRadius: 4, padding: "6px 8px", textAlign: "center" }}>
                                          <span style={{ fontSize: 7.5, fontWeight: 800, color: "#1e40af" }}>[ Su firma aquí ]</span>
                                        </div>
                                      ) : (
                                        <span style={{ color: "#94a3b8", fontStyle: "italic", fontSize: 8 }}>Pendiente de firma</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* HISTORIAL */}
                        <div>
                          <div style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 13.5, fontWeight: 800, color: "#323E4F", textTransform: "uppercase", marginBottom: 6 }}>
                            CONTROL DE HISTORIAL DE CAMBIOS
                          </div>
                          <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #475569", fontSize: 8 }}>
                            <thead>
                              <tr style={{ background: "#f1f5f9", color: "#0f172a" }}>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "15%", fontWeight: 700 }}>Versión</th>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "65%", fontWeight: 700 }}>Descripción del Cambio</th>
                                <th style={{ border: "1px solid #475569", padding: "5px 6px", textAlign: "left", width: "20%", fontWeight: 700 }}>Fecha de Actualización</th>
                              </tr>
                            </thead>
                            <tbody>
                              {artifact.historialCambios && artifact.historialCambios.length > 0 ? (
                                artifact.historialCambios.map((h, i) => (
                                  <tr key={i} style={{ background: "#fff" }}>
                                    <td style={{ border: "1px solid #475569", padding: "5px 6px", fontWeight: 700 }}>v{h.version}</td>
                                    <td style={{ border: "1px solid #475569", padding: "5px 6px" }}>{h.descripcion}</td>
                                    <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#64748b" }}>{h.fecha}</td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td style={{ border: "1px solid #475569", padding: "5px 6px", fontWeight: 700 }}>v{formalVersion}</td>
                                  <td style={{ border: "1px solid #475569", padding: "5px 6px" }}>Elaboración inicial de Informe institucional</td>
                                  <td style={{ border: "1px solid #475569", padding: "5px 6px", color: "#64748b" }}>{artifact.generatedAt.split(" ")[0]}</td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Bottom Page Institutional Footer */}
              {renderFooter()}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (30%): Details, Flow, Observations, Actions */}
        <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0, background: "#fff", overflowY: "auto" }}>
          
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
              ) : isDocente && !isAlreadySignedByMe && documentState !== "EN REVISIÓN" && documentState !== "EN CORRECCIÓN" ? (
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
