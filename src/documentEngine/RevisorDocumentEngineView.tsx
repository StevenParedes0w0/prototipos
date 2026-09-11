import React, { useState } from "react";
import { useDocumentEngine } from "./useDocumentEngine";
import DocumentPdfPageViewer from "./DocumentPdfPageViewer";
import ModalFirmaDocumental from "./ModalFirmaDocumental";
import ModalDevolverDocumental from "./ModalDevolverDocumental";

interface RevisorDocumentEngineViewProps {
  onBackToDocente?: () => void;
  initialSub?: "bandeja" | "revision" | "aprobado" | "devuelto";
  onAuditLog?: (tipoEvento: string, objeto: string, accion: string, descripcion: string, usuario: string, rol: string) => void;
  docEngine?: ReturnType<typeof useDocumentEngine>;
  userRole?: "docente" | "revisor" | "admin";
}

export default function RevisorDocumentEngineView({
  onBackToDocente,
  initialSub = "bandeja",
  onAuditLog,
  docEngine: propDocEngine,
  userRole,
}: RevisorDocumentEngineViewProps) {
  const [sub, setSub] = useState<"bandeja" | "revision" | "aprobado" | "devuelto">(initialSub);
  const internalDocEngine = useDocumentEngine(onAuditLog);
  const docEngine = propDocEngine || internalDocEngine;
  const { docMaster, currentArtifact, observations, flowStages } = docEngine;

  // Derive reviewer and validator stages dynamically from approval flow
  const reviewAndValidationStages = flowStages.filter((s) => s.actorRole !== "docente");
  const defaultActorStage = reviewAndValidationStages[0] || flowStages[1] || {
    id: "stage-2",
    actorId: "usr-carlos-02",
    actorName: "Ing. Carlos López, Mg.",
    actorCargo: "Responsable de revisión técnica",
    actorRole: "revisor" as const,
  };

  const [selectedStageId, setSelectedStageId] = useState<string>(defaultActorStage.id);

  const activeStage = flowStages.find((s) => s.id === selectedStageId) || defaultActorStage;
  const actorInfo = {
    id: activeStage.actorId || (activeStage.actorRole === "validador" ? "usr-patricia-03" : "usr-carlos-02"),
    nombre: activeStage.actorName,
    cargo: activeStage.actorCargo,
    role: activeStage.actorRole,
  };

  // Modals state
  const [showFirmarModal, setShowFirmarModal] = useState(false);
  const [showDevolverModal, setShowDevolverModal] = useState(false);

  const activeObservations = observations.filter((o) => o.estado === "activa");
  const isDocumentValidated = docMaster.documentState === "VALIDADO" || docMaster.documentState === "EN EJECUCIÓN";

  const handleEjecutarFirma = (certFile: string, ubicacion: string) => {
    if (actorInfo.role === "validador") {
      docEngine.validarYFirmarFinal(actorInfo.nombre, actorInfo.cargo, ubicacion);
    } else {
      docEngine.aprobarYFirmarRevisor(actorInfo.nombre, actorInfo.cargo, ubicacion);
    }
  };

  const handleEjecutarDevolucion = (motivo: string) => {
    docEngine.devolverDocumento(actorInfo.nombre, motivo);
    setSub("devuelto");
  };

  // ── SCREEN 01: BANDEJA DE REVISIÓN ──────────────────────────────────────────
  if (sub === "bandeja") {
    const pendingDocs = docEngine.documents.filter((d) => d.documentState === "EN REVISIÓN" || d.documentState === "EN VALIDACIÓN FINAL");
    const reviewedDocs = docEngine.documents.filter((d) => d.documentState === "VALIDADO" || d.documentState === "EN EJECUCIÓN");
    const returnedDocs = docEngine.documents.filter((d) => d.documentState === "DEVUELTO" || d.documentState === "EN CORRECCIÓN");

    const statCards = [
      {
        label: "Pendientes de revisión",
        val: pendingDocs.length,
        color: "#1a4f8a",
        bg: "#eff6ff",
      },
      {
        label: "Revisados / Validados",
        val: reviewedDocs.length,
        color: "#166534",
        bg: "#dcfce7",
      },
      {
        label: "Devueltos",
        val: returnedDocs.length,
        color: "#92400e",
        bg: "#fef3c7",
      },
    ];

    const estadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
      "BORRADOR": { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
      "EN REVISIÓN": { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
      "DEVUELTO": { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
      "EN CORRECCIÓN": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
      "VALIDADO": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
      "EN EJECUCIÓN": { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    };

    return (
      <div style={{ padding: "28px", maxWidth: 1240 }}>
        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>
            Inicio &rsaquo; Bandeja de revisión y validación
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
                Bandeja de Revisión y Validación
              </h1>
              <p style={{ fontSize: 13.5, color: "#6b7a8d", marginTop: 4 }}>
                Consulte y evalúe los documentos del flujo institucional que requieren su revisión o validación.
              </p>
            </div>

            {/* DEMO Switch Revisor / Validador */}
            <div
              style={{
                background: "#fff",
                borderRadius: 8,
                padding: "6px 10px",
                border: "1px solid #cbd5e1",
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
                Actor Demo:
              </span>
              {reviewAndValidationStages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStageId(stage.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    background: selectedStageId === stage.id ? "#1a4f8a" : "#f1f5f9",
                    color: selectedStageId === stage.id ? "#fff" : "#475569",
                  }}
                >
                  {stage.actorName} ({stage.subLevelName || stage.stageName})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          {statCards.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                padding: "14px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                minWidth: 170,
              }}
            >
              <div style={{ fontSize: 12, color: "#6b7a8d" }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, fontFamily: "'DM Sans',sans-serif" }}>
                {c.val}
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Documento</th>
                <th>Tipo</th>
                <th>Grupo institucional</th>
                <th>Elaborador</th>
                <th>Versión / Ronda</th>
                <th>Fecha recepción</th>
                <th>Etapa actual</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {docEngine.documents.map((doc) => {
                const es = estadoStyle[doc.documentState] || estadoStyle["BORRADOR"];
                const isDocValidated = doc.documentState === "VALIDADO" || doc.documentState === "EN EJECUCIÓN";
                const isPlan = doc.documentType === "PLAN_TRABAJO";

                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1e2a3a" }}>
                        {doc.nombre}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b" }}>
                        {doc.grupo} · {doc.periodo}
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: isPlan ? "#eff6ff" : "#f3e8ff",
                          color: isPlan ? "#1e40af" : "#7e22ce",
                        }}
                      >
                        {isPlan ? "Plan de Trabajo" : "Informe"}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: "#334155" }}>
                      <div>{doc.grupo}</div>
                      {doc.documentoRelacionadoTitulo && (
                        <div style={{ fontSize: 11, color: "#1e40af", marginTop: 2 }}>
                          Ref: {doc.documentoRelacionadoTitulo}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: "#475569" }}>{doc.currentArtifact.elaborador.nombre}</td>
                    <td style={{ fontSize: 12.5, color: "#1a4f8a", fontWeight: 700 }}>
                      Versión {doc.formalVersion} (Ronda {doc.reviewRound})
                    </td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "#475569" }}>{doc.fechaUltimaActualizacion.split(" ")[0]}</div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{doc.fechaUltimaActualizacion.split(" ")[1] || "09:15"}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12.5, color: "#1a4f8a", fontWeight: 600 }}>
                        {isDocValidated
                          ? "Validación completada"
                          : doc.currentArtifact.signatures.length >= 2
                          ? "ETAPA 3 — Validación final"
                          : "ETAPA 2 — Revisión técnica"}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 9px",
                          borderRadius: 999,
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: es.bg,
                          color: es.color,
                        }}
                      >
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: es.dot }} />
                        {doc.documentState}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          docEngine.seleccionarDocumento(doc.id);
                          setSub("revision");
                        }}
                      >
                        {isDocValidated ? "VER DOCUMENTO" : "REVISAR"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "12px 18px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{docEngine.documents.length} documentos institucionales registrados</span>
            <button
              className="btn btn-ghost btn-xs"
              onClick={docEngine.restablecerDemo}
              style={{ color: "#64748b", fontSize: 11 }}
            >
              Restablecer datos DEMO
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 03: DEVUELTO CONFIRMATION ────────────────────────────────────────
  if (sub === "devuelto") {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ maxWidth: 580, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#fef3c7",
                border: "3px solid #fde68a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="9 14 4 9 9 4" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
              Documento devuelto al elaborador
            </h1>
            <p style={{ fontSize: 13.5, color: "#6b7a8d", lineHeight: 1.6 }}>
              El Plan de Trabajo fue devuelto formalmente. El docente elaborador (Ing. Andrea Pérez, Mg.) recibirá la notificación con las observaciones para iniciar la corrección de la Ronda {docMaster.reviewRound}.
            </p>
          </div>

          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>
                Plan de Trabajo — Versión {docMaster.formalVersion}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#fee2e2", color: "#991b1b" }}>
                DEVUELTO
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 12.5 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Observaciones remitidas:</span>
                <span style={{ fontWeight: 700, color: "#dc2626" }}>{activeObservations.length} activas</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Devuelto por:</span>
                <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{actorInfo.nombre}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Ronda actual:</span>
                <span style={{ fontWeight: 600, color: "#1e2a3a" }}>Ronda {docMaster.reviewRound}</span>
              </div>
            </div>
          </div>

          <div className="alert alert-info" style={{ fontSize: 12.5 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Cuando el elaborador envíe las correcciones, se iniciará la Ronda {docMaster.reviewRound + 1} y las firmas deberán estamparse nuevamente.
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-ghost" onClick={() => setSub("bandeja")}>
              VOLVER A BANDEJA
            </button>
            <button
              className="btn btn-primary"
              onClick={() => onBackToDocente?.()}
            >
              CAMBIAR A ROL DOCENTE PARA CORREGIR →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SCREEN 02: REVISIÓN / VISOR DOCUMENTAL ──────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Top Breadcrumb & Demo Actor Bar */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
          <span
            style={{ cursor: "pointer", color: "#1a4f8a", fontWeight: 600 }}
            onClick={() => setSub("bandeja")}
          >
            Bandeja de revisión
          </span>
          <span style={{ color: "#94a3b8" }}>›</span>
          <span style={{ color: "#1e2a3a", fontWeight: 700 }}>
            Plan de Trabajo: {docMaster.grupo}
          </span>
        </div>

        {/* Actor toggle for DEMO testing */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>
            Rol / Actor activo:
          </span>
          <select
            className="form-select"
            value={selectedStageId}
            onChange={(e) => setSelectedStageId(e.target.value)}
            style={{ width: "auto", fontSize: 12, padding: "4px 24px 4px 8px" }}
          >
            {reviewAndValidationStages.map((st) => (
              <option key={st.id} value={st.id}>
                {st.actorName} ({st.subLevelName || st.stageName})
              </option>
            ))}
          </select>

          <button className="btn btn-ghost btn-xs" onClick={() => setSub("bandeja")}>
            ✕ Salir a Bandeja
          </button>
        </div>
      </div>

      {/* Embedded 70/30 PDF Viewer */}
      <div style={{ flex: 1, minHeight: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <DocumentPdfPageViewer
          artifact={currentArtifact}
          formalVersion={docMaster.formalVersion}
          reviewRound={docMaster.reviewRound}
          documentState={docMaster.documentState}
          observations={observations}
          flowStages={flowStages}
          currentUser={actorInfo}
          onOpenFirmar={() => setShowFirmarModal(true)}
          onOpenDevolver={() => setShowDevolverModal(true)}
          onAddObservacion={(pag, txt, sec, tip) => internalDocEngine.agregarObservacion(internalDocEngine.docMaster.id, pag, txt, sec, tip, actorInfo.nombre)}
          onEditObservacion={(id, texto) => internalDocEngine.editarObservacion(internalDocEngine.docMaster.id, id, texto)}
          onDeleteObservacion={(id) => internalDocEngine.eliminarObservacion(internalDocEngine.docMaster.id, id)}
        />
      </div>

      {/* Modal Firmar */}
      <ModalFirmaDocumental
        isOpen={showFirmarModal}
        onClose={() => setShowFirmarModal(false)}
        onFirmar={handleEjecutarFirma}
        tituloDocumento={docMaster.nombre}
        grupo={docMaster.grupo}
        formalVersion={docMaster.formalVersion}
        reviewRound={docMaster.reviewRound}
        actorNombre={actorInfo.nombre}
        actorCargo={actorInfo.cargo}
        ubicacionSugerida={
          actorInfo.role === "validador"
            ? "Página 4 — Firmas de Responsabilidad: Validado por"
            : "Página 4 — Firmas de Responsabilidad: Revisado por"
        }
        accionTexto={actorInfo.role === "validador" ? "VALIDAR Y FIRMAR" : "APROBAR Y FIRMAR"}
      />

      {/* Modal Devolver */}
      <ModalDevolverDocumental
        isOpen={showDevolverModal}
        onClose={() => setShowDevolverModal(false)}
        onConfirmarDevolucion={handleEjecutarDevolucion}
        tituloDocumento={docMaster.nombre}
        grupo={docMaster.grupo}
        formalVersion={docMaster.formalVersion}
        reviewRound={docMaster.reviewRound}
        observacionesActivas={activeObservations}
      />
    </div>
  );
}
