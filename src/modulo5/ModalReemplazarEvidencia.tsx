import React, { useState, useRef } from "react";
import { ActividadEjecucion, MedioVerificacion, ArchivoEvidenciaInput } from "./types";

interface ModalReemplazarEvidenciaProps {
  actividad: ActividadEjecucion;
  medio: MedioVerificacion;
  onClose: () => void;
  onReemplazar: (archivo: ArchivoEvidenciaInput, motivo?: string) => void;
}

export default function ModalReemplazarEvidencia({
  actividad,
  medio,
  onClose,
  onReemplazar,
}: ModalReemplazarEvidenciaProps) {
  const [selectedFile, setSelectedFile] = useState<{
    nombre: string;
    tamano: string;
    rawFile?: File;
  } | null>(null);
  const [motivo, setMotivo] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);

    const isPdf = file.name.toLowerCase().endsWith(".pdf") && (!file.type || file.type === "application/pdf");
    if (!isPdf) {
      setErrorMsg("Solo se permiten archivos PDF.");
      setSelectedFile(null);
      return;
    }

    if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
      setErrorMsg("El archivo supera el tamaño máximo permitido (10 MB).");
      setSelectedFile(null);
      return;
    }

    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    const sizeStr = `${sizeInMB} MB`;

    setSelectedFile({
      nombre: file.name,
      tamano: sizeStr,
      rawFile: file,
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length !== 1) { setErrorMsg("Seleccione exactamente un archivo PDF por medio."); return; }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Debe seleccionar un nuevo archivo PDF para reemplazar.");
      return;
    }
    onReemplazar(
      {
        nombre: selectedFile.nombre,
        tamano: selectedFile.tamano,
      url: selectedFile.rawFile ? URL.createObjectURL(selectedFile.rawFile) : undefined,
      sizeBytes: selectedFile.rawFile?.size,
      },
      motivo.trim() || undefined
    );
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,47,86,0.55)",
      zIndex: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: 540,
        maxWidth: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fffbeb",
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#92400e", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
              Reemplazar evidencia
            </h2>
            <div style={{ fontSize: 12, color: "#b45309", marginTop: 2 }}>
              Medio de verificación: <strong>{medio.nombre}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#92400e",
              fontSize: 20,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "18px 24px" }}>
          {/* Institutional Warning Notice */}
          <div style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 16,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div style={{ fontSize: 13, color: "#92400e", lineHeight: 1.5 }}>
              <strong>Existe un archivo cargado para este medio de verificación.</strong>
              <div style={{ marginTop: 2 }}>
                El nuevo archivo sustituirá al actual para efectos de la evidencia vigente. La versión anterior se conservará en el historial de trazabilidad institucional.
              </div>
            </div>
          </div>

          {/* Current File Info */}
          <div style={{
            background: "#f8fafc",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            padding: "12px 14px",
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#64748b", letterSpacing: "0.04em", marginBottom: 6 }}>
              Archivo actual vigente
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 12 }}>[PDF]</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a" }}>
                  {medio.archivoVigente?.nombre || "Archivo existente"}
                </span>
              </div>
              <span style={{ fontSize: 11.5, color: "#64748b" }}>
                Cargado: {medio.archivoVigente?.fechaCarga || "—"}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div style={{
              background: "#fee2e2",
              border: "1.5px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 13, color: "#991b1b", fontWeight: 500 }}>{errorMsg}</span>
            </div>
          )}

          {/* Drag & drop new file */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label required" style={{ fontSize: 13, marginBottom: 6 }}>
                Nuevo archivo PDF
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? "2px dashed #1a4f8a" : "2px dashed #cbd5e1",
                  borderRadius: 10,
                  padding: "20px 18px",
                  textAlign: "center",
                  background: isDragging ? "#eff6ff" : "#fbfcfe",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />

                <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 4 }}>
                  {selectedFile ? selectedFile.nombre : "Arrastre el nuevo archivo PDF aquí"}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>
                  {selectedFile ? `Tamaño: ${selectedFile.tamano}` : "o haga clic para examinar"}
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  SELECCIONAR NUEVO ARCHIVO
                </button>
              </div>
            </div>

            {/* Motivo opcional */}
            <div style={{ marginBottom: 18 }}>
              <label className="form-label" style={{ fontSize: 12.5 }}>
                Motivo del reemplazo (opcional para trazabilidad)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Ej.: Corrección de firmas / Anexo complementario actualizado"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                style={{ fontSize: 13 }}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid #e2e8f0",
            }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFile}
                style={{ background: "#d97706", borderColor: "#d97706" }}
              >
                REEMPLAZAR ARCHIVO
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
