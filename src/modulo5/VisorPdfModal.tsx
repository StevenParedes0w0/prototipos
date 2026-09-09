import React, { useState } from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";
import { DOCENTE_ACTUAL } from "./useActividadesState";

/**
 * REGLA INSTITUCIONAL DEL VISOR DE EVIDENCIAS:
 * VER debe visualizar exactamente el archivo PDF cargado por el usuario.
 * El PDF institucional simulado en esta vista sirve como representación DEMO de alta fidelidad,
 * pero en la implementación real de producción se renderiza el archivo binario/blob PDF subido por el
 * usuario, garantizando que nunca se sustituya por un documento generado.
 */

interface VisorPdfModalProps {
  actividad: ActividadEjecucion;
  medio: MedioVerificacion;
  onClose: () => void;
  onOpenReemplazar?: () => void;
}

export default function VisorPdfModal({
  actividad,
  medio,
  onClose,
  onOpenReemplazar,
}: VisorPdfModalProps) {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = 3;
  const [zoom, setZoom] = useState(100);

  const archivo = medio.archivoVigente;
  const nombreArchivo = archivo?.nombre || "documento_evidencia.pdf";
  const cargadoPor = archivo?.cargadoPor || DOCENTE_ACTUAL;
  const fechaCarga = archivo?.fechaCarga || "—";
  const esResponsable = actividad.responsables.includes(DOCENTE_ACTUAL);
  const puedeReemplazar = esResponsable && actividad.estado !== "VENCIDA" && medio.estado === "CARGADA";

  const handleDescargar = () => {
    // Simulated download notification
    const element = document.createElement("a");
    const file = new Blob([
      `Universidad Técnica de Ambato - FISEI\nEvidencia: ${medio.nombre}\nActividad: ${actividad.nombre}\nDocumento: ${nombreArchivo}\nCargado por: ${cargadoPor}\nFecha: ${fechaCarga}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = nombreArchivo;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,35,60,0.75)",
      zIndex: 450,
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Top bar */}
      <header style={{
        height: 60,
        background: "#0f2f56",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        flexShrink: 0,
        color: "#fff",
      }}>
        {/* Document meta */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: "#dc2626",
            borderRadius: 4,
            padding: "3px 8px",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.05em",
          }}>
            PDF
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: 8 }}>
              <span>Evidencia — {medio.nombre}</span>
              <span style={{ fontSize: 12, fontWeight: 400, color: "#93c5fd" }}>({nombreArchivo})</span>
            </div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>
              Actividad: {actividad.nombre} • Subido por: <strong style={{ color: "#cbd5e1" }}>{cargadoPor}</strong> ({fechaCarga})
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Page controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255,255,255,0.08)",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
          }}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina <= 1}
              style={{
                background: "none",
                border: "none",
                color: pagina <= 1 ? "#64748b" : "#fff",
                cursor: pagina <= 1 ? "not-allowed" : "pointer",
                padding: "2px 6px",
                fontWeight: 700,
              }}
            >
              ◀
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina >= totalPaginas}
              style={{
                background: "none",
                border: "none",
                color: pagina >= totalPaginas ? "#64748b" : "#fff",
                cursor: pagina >= totalPaginas ? "not-allowed" : "pointer",
                padding: "2px 6px",
                fontWeight: 700,
              }}
            >
              ▶
            </button>
          </div>

          {/* Zoom controls */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.08)",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
          }}>
            <button
              onClick={() => setZoom(z => Math.max(50, z - 15))}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "0 6px", fontSize: 14 }}
              title="Reducir zoom"
            >
              -
            </button>
            <span style={{ width: 45, textAlign: "center" }}>{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(175, z + 15))}
              style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: "0 6px", fontSize: 14 }}
              title="Aumentar zoom"
            >
              +
            </button>
            <button
              onClick={() => setZoom(100)}
              style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", cursor: "pointer", padding: "2px 6px", borderRadius: 4, fontSize: 11, marginLeft: 4 }}
            >
              Ajustar
            </button>
          </div>

          {/* Actions */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleDescargar}
            style={{ color: "#fff", borderColor: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.1)" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            DESCARGAR
          </button>

          {puedeReemplazar && onOpenReemplazar && (
            <button
              className="btn btn-sm"
              onClick={onOpenReemplazar}
              style={{ background: "#d97706", color: "#fff", border: "none" }}
            >
              REEMPLAZAR
            </button>
          )}

          <button
            onClick={onClose}
            title="Cerrar visor"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              cursor: "pointer",
              color: "#fff",
              borderRadius: 6,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            ✕
          </button>
        </div>
      </header>

      {/* PDF Viewport */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        background: "#334155",
        padding: "32px 16px",
        display: "flex",
        justifyContent: "center",
      }}>
        {/* Render of Institutional PDF Sheet */}
        <div style={{
          width: 780 * (zoom / 100),
          minHeight: 1050 * (zoom / 100),
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          padding: `${48 * (zoom / 100)}px ${56 * (zoom / 100)}px`,
          position: "relative",
          fontSize: `${13.5 * (zoom / 100)}px`,
          lineHeight: 1.6,
          color: "#1e293b",
          transition: "width 0.15s ease",
          fontFamily: "'Times New Roman', Times, serif",
        }}>
          {/* Institutional Header with crest banner */}
          <div style={{
            borderBottom: `2px solid #1a4f8a`,
            paddingBottom: 16,
            marginBottom: 24,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: "bold", color: "#1a4f8a", letterSpacing: "0.05em" }}>
                UNIVERSIDAD TÉCNICA DE AMBATO
              </div>
              <div style={{ fontSize: "12px", color: "#475569", fontWeight: "bold" }}>
                FACULTAD DE INGENIERÍA EN SISTEMAS, ELECTRÓNICA E INDUSTRIAL
              </div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                {actividad.planNombre} • Período Académico: {actividad.periodo}
              </div>
            </div>
            <div style={{
              border: "1.5px solid #1a4f8a",
              borderRadius: 4,
              padding: "4px 10px",
              textAlign: "right",
              fontSize: "10px",
              color: "#1a4f8a",
            }}>
              <div>DOCUMENTO OFICIAL</div>
              <div style={{ fontWeight: "bold" }}>MEDIO: {medio.nombre.toUpperCase()}</div>
              <div>VERSIÓN 1.0 - VIGENTE</div>
            </div>
          </div>

          {/* Page content conditioned by page number */}
          {pagina === 1 && (
            <div>
              <div style={{ textAlign: "center", margin: "24px 0 20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "bold", textTransform: "uppercase", margin: 0, color: "#0f172a" }}>
                  EVIDENCIA DE ACTIVIDAD: {actividad.nombre}
                </h2>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: 4 }}>
                  Código de Registro Institucional: FISEI-PT-2026-{actividad.id.toUpperCase()}
                </div>
              </div>

              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "12px 16px", borderRadius: 4, marginBottom: 20, fontSize: "12px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ width: "25%", fontWeight: "bold", color: "#334155", padding: "4px 0" }}>Actividad:</td>
                      <td style={{ color: "#0f172a" }}>{actividad.nombre}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "4px 0" }}>Grupo Asignado:</td>
                      <td style={{ color: "#0f172a" }}>{actividad.grupo}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "4px 0" }}>Responsables:</td>
                      <td style={{ color: "#0f172a" }}>{actividad.responsables.join(", ")}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", color: "#334155", padding: "4px 0" }}>Período de Ejecución:</td>
                      <td style={{ color: "#0f172a" }}>Del {actividad.desde} al {actividad.hasta}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: "13.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                1. ANTECEDENTES Y OBJETO
              </h3>
              <p style={{ textAlign: "justify", textIndent: "24px", marginBottom: 14 }}>
                En cumplimiento con la planificación operativa del Plan de Trabajo de la {actividad.grupo} para el período {actividad.periodo}, se procedió a ejecutar las labores correspondientes a la actividad <strong>"{actividad.nombre}"</strong>. El presente documento constituye el medio formal de verificación de las acciones desarrolladas, respaldado conforme a los estándares académicos de la Facultad.
              </p>

              <h3 style={{ fontSize: "13.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                2. DESARROLLO DE ACCIONES Y RESULTADOS
              </h3>
              <p style={{ textAlign: "justify", textIndent: "24px", marginBottom: 14 }}>
                Durante el lapso reglamentario, la comisión coordinó los mecanismos técnicos y operativos utilizando los recursos asignados ({actividad.recursos.join(", ")}). Se dio seguimiento integral a las metas trazadas, registrando oportunamente las novedades y asegurando la consistencia de los indicadores correspondientes.
              </p>

              <div style={{ textAlign: "center", marginTop: 30, color: "#94a3b8", fontSize: "11px", fontStyle: "italic" }}>
                [Continúa en la siguiente página con el detalle de cumplimiento y firmas de legalización]
              </div>
            </div>
          )}

          {pagina === 2 && (
            <div>
              <h3 style={{ fontSize: "13.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                3. DETALLE DE PARTICIPACIÓN Y VERIFICACIÓN
              </h3>
              <p style={{ textAlign: "justify", marginBottom: 14 }}>
                Se detalla a continuación el cumplimiento de los hitos asociados a este medio de verificación:
              </p>

              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: "11.5px" }}>
                <thead>
                  <tr style={{ background: "#f1f5f9" }}>
                    <th style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "left" }}>Hito / Entregable</th>
                    <th style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center" }}>Fecha Límite</th>
                    <th style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center" }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px" }}>Generación de matrices de control</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center" }}>{actividad.desde}</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center", color: "#166534", fontWeight: "bold" }}>Completado</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px" }}>Revisión y consolidación de expedientes</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center" }}>{actividad.hasta}</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center", color: "#166534", fontWeight: "bold" }}>Completado</td>
                  </tr>
                  <tr>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px" }}>Carga de evidencia en plataforma institucional</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center" }}>{actividad.fechaLimiteExacta}</td>
                    <td style={{ border: "1px solid #cbd5e1", padding: "6px 10px", textAlign: "center", color: "#1a4f8a", fontWeight: "bold" }}>Cargado</td>
                  </tr>
                </tbody>
              </table>

              <h3 style={{ fontSize: "13.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 4 }}>
                4. CONCLUSIONES
              </h3>
              <p style={{ textAlign: "justify", textIndent: "24px", marginBottom: 14 }}>
                Las actividades planificadas se cumplieron conforme a las directrices institucionales, disponiendo de la información requerida para los posteriores procesos de auditoría y acreditación académica de la FISEI.
              </p>
            </div>
          )}

          {pagina === 3 && (
            <div>
              <h3 style={{ fontSize: "13.5px", fontWeight: "bold", color: "#1a4f8a", borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 40 }}>
                5. CONSTANCIA Y FIRMAS DE RESPONSABILIDAD
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, marginTop: 50 }}>
                {actividad.responsables.map((r, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{
                      borderBottom: "1px solid #334155",
                      width: "80%",
                      margin: "0 auto 8px",
                      paddingBottom: 25,
                    }}>
                      <div style={{
                        display: "inline-block",
                        background: "#eff6ff",
                        border: "1px dashed #3b82f6",
                        borderRadius: 4,
                        padding: "4px 10px",
                        fontSize: "10px",
                        color: "#1d4ed8",
                      }}>
                        FIRMADO ELECTRÓNICAMENTE POR:<br />
                        <strong>{r}</strong><br />
                        Validez verificada
                      </div>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "12px", color: "#0f172a" }}>{r}</div>
                    <div style={{ fontSize: "10.5px", color: "#64748b" }}>Docente Responsable / FISEI - UTA</div>
                  </div>
                ))}
              </div>

              {/* Security watermark footer */}
              <div style={{
                position: "absolute",
                bottom: 30,
                left: 56 * (zoom / 100),
                right: 56 * (zoom / 100),
                borderTop: "1px solid #e2e8f0",
                paddingTop: 8,
                display: "flex",
                justifyContent: "space-between",
                fontSize: "10px",
                color: "#94a3b8",
              }}>
                <span>Archivo: {nombreArchivo} • Cargado por: {cargadoPor}</span>
                <span>Página {pagina} de {totalPaginas}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
