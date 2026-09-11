import React, { useState } from "react";
import { useDocumentEngine } from "../documentEngine/useDocumentEngine";
import { DocumentMasterState, DocumentType } from "../documentEngine/types";
import DetalleDocumentoModal from "./DetalleDocumentoModal";
import { Eye, ClipboardList, FilePenLine, MessageSquare, RotateCcw, Download, BadgeCheck, PenLine } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";

interface MisDocumentosViewProps {
  docEngine: ReturnType<typeof useDocumentEngine>;
  onNewPlan: () => void;
  onNewInforme: () => void;
  onContinuarPlan: (docId: string) => void;
  onCorregirPlan: (docId: string) => void;
  onNavigateActividades: () => void;
}

export default function MisDocumentosView({
  docEngine,
  onNewPlan,
  onNewInforme,
  onContinuarPlan,
  onCorregirPlan,
  onNavigateActividades,
}: MisDocumentosViewProps) {
  const { documents, seleccionarDocumento } = docEngine;

  // Modals state
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<DocumentMasterState | null>(null);
  const [showObsModalDoc, setShowObsModalDoc] = useState<DocumentMasterState | null>(null);

  // Filters state
  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroTipo, setFiltroTipo] = useState<string>("Todos los tipos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Statistics
  const totalDocs = documents.length;
  const planesCount = documents.filter((d) => d.documentType === "PLAN_TRABAJO").length;
  const informesCount = documents.filter((d) => d.documentType === "INFORME").length;
  const atencionCount = documents.filter(
    (d) => d.documentState === "DEVUELTO" || d.documentState === "EN CORRECCIÓN" || d.documentState === "BORRADOR"
  ).length;

  // Filtered list
  const filteredDocuments = documents.filter((doc) => {
    if (filtroPeriodo !== "Todos los períodos" && doc.periodo !== filtroPeriodo) return false;
    if (filtroTipo === "Plan de Trabajo" && doc.documentType !== "PLAN_TRABAJO") return false;
    if (filtroTipo === "Informe" && doc.documentType !== "INFORME") return false;
    if (filtroEstado !== "Todos" && doc.documentState !== filtroEstado) return false;
    if (filtroGrupo !== "Todos" && doc.grupo !== filtroGrupo) return false;
    if (busqueda) {
      const matchName = doc.nombre.toLowerCase().includes(busqueda.toLowerCase());
      const matchGrupo = doc.grupo.toLowerCase().includes(busqueda.toLowerCase());
      if (!matchName && !matchGrupo) return false;
    }
    return true;
  });

  const estadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "BORRADOR": { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "EN REVISIÓN": { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "DEVUELTO": { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    "EN CORRECCIÓN": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "APROBADO": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "VALIDADO": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "EN EJECUCIÓN": { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "ARCHIVADO": { bg: "#f1f5f9", color: "#334155", dot: "#64748b" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1240, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Gestión Documental Académica
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Consulte, cree y gestione los documentos asociados a sus grupos institucionales y períodos académicos.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowTipoModal(true)}
          style={{ flexShrink: 0, padding: "10px 18px", fontSize: 13.5, fontWeight: 700 }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          NUEVO DOCUMENTO
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Total de documentos</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans', sans-serif" }}>
            {totalDocs}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Planes de Trabajo</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1a4f8a", fontFamily: "'DM Sans', sans-serif" }}>
            {planesCount}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Informes</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#7e22ce", fontFamily: "'DM Sans', sans-serif" }}>
            {informesCount}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px" }}>
          <div style={{ fontSize: 12, color: "#64748b" }}>Requieren atención</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: atencionCount > 0 ? "#b45309" : "#166534", fontFamily: "'DM Sans', sans-serif" }}>
            {atencionCount}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "14px 18px",
          marginBottom: 16,
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Período:</span>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
            >
              <option>Julio – Diciembre 2026</option>
              <option>Enero – Junio 2026</option>
              <option>Todos los períodos</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Tipo de documento:</span>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option>Todos los tipos</option>
              <option>Plan de Trabajo</option>
              <option>Informe</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Grupo institucional:</span>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
            >
              <option>Todos</option>
              <option>Unidad de Titulación</option>
              <option>Comisión de Eventos Académicos</option>
              <option>Club Académico de Software</option>
            </select>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Estado:</span>
            <select
              className="form-select"
              style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option>Todos</option>
              <option>BORRADOR</option>
              <option>EN REVISIÓN</option>
              <option>DEVUELTO</option>
              <option>EN CORRECCIÓN</option>
              <option>VALIDADO</option>
              <option>EN EJECUCIÓN</option>
            </select>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <input
            className="form-input"
            placeholder="Buscar por nombre o grupo institucional..."
            style={{ width: 260, fontSize: 12.5 }}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
      </div>

      {/* Main Documents Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Tipo</th>
              <th>Grupo institucional</th>
              <th>Período</th>
              <th>Versión</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocuments.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "36px", color: "#64748b", fontSize: 13 }}>
                  No se encontraron documentos con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => {
                const es = estadoStyle[doc.documentState] || estadoStyle["BORRADOR"];
                const isPlan = doc.documentType === "PLAN_TRABAJO";

                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: "#1e2a3a" }}>
                        {doc.nombre}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b" }}>
                        {doc.currentArtifact.elaborador?.nombre ? `Elaborado por: ${doc.currentArtifact.elaborador.nombre}` : ""}
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
                    <td style={{ fontSize: 12.5, color: "#475569" }}>{doc.periodo}</td>
                    <td style={{ fontSize: 12.5, color: "#1a4f8a", fontWeight: 700 }}>
                      v{doc.formalVersion} (R{doc.reviewRound})
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
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: es.dot, display: "inline-block" }} />
                        {doc.documentState}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b" }}>{doc.fechaUltimaActualizacion}</td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <TableActionButton
                          title="Ver documento"
                          icon={Eye}
                          onClick={() => {
                            seleccionarDocumento(doc.id);
                            setSelectedDocForDetail(doc);
                          }}
                        />

                        {isPlan && (doc.documentState === "EN EJECUCIÓN" || doc.documentState === "VALIDADO") && (
                          <TableActionButton
                            title="Ver actividades"
                            icon={ClipboardList}
                            onClick={onNavigateActividades}
                          />
                        )}

                        {doc.documentState === "DEVUELTO" && (
                          <>
                            <TableActionButton
                              title="Ver observaciones"
                              icon={MessageSquare}
                              variant="destructive"
                              onClick={() => setShowObsModalDoc(doc)}
                            />
                            <TableActionButton
                              title="Corregir documento"
                              icon={RotateCcw}
                              variant="constructive"
                              onClick={() => {
                                seleccionarDocumento(doc.id);
                                onCorregirPlan(doc.id);
                              }}
                            />
                          </>
                        )}

                        {doc.documentState === "BORRADOR" && (
                          <TableActionButton
                            title="Continuar elaboración"
                            icon={FilePenLine}
                            variant="constructive"
                            onClick={() => {
                              seleccionarDocumento(doc.id);
                              if (isPlan) onContinuarPlan(doc.id);
                            }}
                          />
                        )}

                        {doc.documentState === "EN CORRECCIÓN" && (
                          <>
                            <TableActionButton
                              title="Ver observaciones"
                              icon={MessageSquare}
                              variant="destructive"
                              onClick={() => setShowObsModalDoc(doc)}
                            />
                            <TableActionButton
                              title="Continuar corrección"
                              icon={RotateCcw}
                              variant="constructive"
                              onClick={() => {
                                seleccionarDocumento(doc.id);
                                onCorregirPlan(doc.id);
                              }}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: SELECCIONAR TIPO DE DOCUMENTO */}
      {showTipoModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 60, 0.65)",
            zIndex: 350,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              width: 620,
              maxWidth: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Crear nuevo documento
                </h2>
                <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>
                  Seleccione el tipo de documento institucional que desea generar
                </div>
              </div>
              <button onClick={() => setShowTipoModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 20 }}>
                ✕
              </button>
            </div>

            <div style={{ padding: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {/* Card Plan de Trabajo */}
              <div
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1a4f8a";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(26,79,138,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                onClick={() => {
                  setShowTipoModal(false);
                  onNewPlan();
                }}
              >
                <div>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eff6ff", color: "#1a4f8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 12 }}>
                    📋
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e2a3a", margin: "0 0 6px" }}>
                    Plan de Trabajo
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                    Planifique actividades, objetivos y medios de verificación para un grupo y período académico.
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginTop: 8 }}>
                    Formato UTA-SGC-A-2-1-P7-T1
                  </p>
                </div>
                <button className="btn btn-primary btn-sm" style={{ marginTop: 16, width: "100%", justifyContent: "center" }}>
                  CREAR PLAN DE TRABAJO
                </button>
              </div>

              {/* Card Informe */}
              <div
                style={{
                  border: "2px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  background: "#fff",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#1a4f8a";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 20px rgba(26,79,138,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
                onClick={() => {
                  setShowTipoModal(false);
                  onNewInforme();
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#eff6ff", color: "#1a4f8a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      📑
                    </div>
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#1e2a3a", margin: "0 0 6px" }}>
                    Informe
                  </h3>
                  <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: 0 }}>
                    Documente la ejecución, resultados y seguimiento de las actividades institucionales.
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginTop: 8 }}>
                    Formato UTA-SGC-A-2-1-P7-T2
                  </p>
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: 16, width: "100%", justifyContent: "center" }}
                >
                  CREAR INFORME
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VER DETALLE DEL DOCUMENTO (A4, REVISIÓN, FIRMAS, HISTORIAL, ACTIVIDADES) */}
      {selectedDocForDetail && (
        <DetalleDocumentoModal
          documento={selectedDocForDetail}
          onClose={() => setSelectedDocForDetail(null)}
          onNavigateActividades={() => {
            setSelectedDocForDetail(null);
            onNavigateActividades();
          }}
        />
      )}

      {/* MODAL 3: VER OBSERVACIONES */}
      {showObsModalDoc && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 35, 60, 0.65)",
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
              width: 580,
              maxWidth: "100%",
              maxHeight: "85vh",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                  Observaciones de Revisión
                </h3>
                <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                  {showObsModalDoc.nombre} · Versión {showObsModalDoc.formalVersion} (Ronda {showObsModalDoc.reviewRound})
                </div>
              </div>
              <button onClick={() => setShowObsModalDoc(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 18 }}>
                ✕
              </button>
            </div>
            <div style={{ padding: "20px 22px", overflowY: "auto", flex: 1, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 8, padding: "12px 14px", color: "#92400e", fontSize: 13 }}>
                <strong>Motivo de devolución:</strong> {showObsModalDoc.mensajeDevolucion || "Por favor, revise la matriz y los medios de verificación antes de reenviar."}
              </div>

              {showObsModalDoc.observations && showObsModalDoc.observations.length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1e2a3a", marginBottom: 8, textTransform: "uppercase" }}>
                    Observaciones registradas ({showObsModalDoc.observations.length}):
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {showObsModalDoc.observations.map((obs) => (
                      <div
                        key={obs.id}
                        style={{
                          background: "#fff",
                          border: "1px solid #fed7aa",
                          borderRadius: 8,
                          padding: "10px 14px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#9a3412", fontWeight: 700, marginBottom: 4 }}>
                          <span>{obs.seccion || `Página ${obs.pagina}`}</span>
                          <span>{obs.revisor}</span>
                        </div>
                        <div style={{ fontSize: 12.5, color: "#334155" }}>
                          {obs.texto}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ fontSize: 12, color: "#64748b", background: "#f8fafc", padding: "10px 12px", borderRadius: 6 }}>
                Haga clic en <strong>CONTINUAR CORRECCIÓN</strong> para ajustar el documento y resolver las observaciones en la nueva versión formal.
              </div>
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setShowObsModalDoc(null)}>
                Cerrar
              </button>
              <button
                className="btn btn-primary"
                style={{ background: "#f59e0b", color: "#1e2a3a", border: "none", fontWeight: 700 }}
                onClick={() => {
                  const docId = showObsModalDoc.id;
                  setShowObsModalDoc(null);
                  seleccionarDocumento(docId);
                  onCorregirPlan(docId);
                }}
              >
                CONTINUAR CORRECCIÓN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
