import React, { useState, useRef } from "react";
import { ActividadEjecucion, MedioVerificacion, ArchivoEvidenciaInput } from "./types";

interface ModalCargaEvidenciaProps {
  actividad: ActividadEjecucion;
  medio: MedioVerificacion;
  onClose: () => void;
  onCargar: (archivo: ArchivoEvidenciaInput) => void;
}

export default function ModalCargaEvidencia({
  actividad,
  medio,
  onClose,
  onCargar,
}: ModalCargaEvidenciaProps) {
  const [selectedFile, setSelectedFile] = useState<{
    nombre: string;
    tamano: string;
    rawFile?: File;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE_MB = 10;
  const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

  const validateAndSetFile = (file: File) => {
    setErrorMsg(null);

    // Validate PDF
    const isPdf = file.name.toLowerCase().endsWith(".pdf") && (!file.type || file.type === "application/pdf");
    if (!isPdf) {
      setErrorMsg("Solo se permiten archivos PDF.");
      setSelectedFile(null);
      return;
    }

    // Validate size (max 10MB)
    if (file.size <= 0 || file.size > MAX_SIZE_BYTES) {
      setErrorMsg("El archivo supera el tamaño máximo permitido (10 MB).");
      setSelectedFile(null);
      return;
    }

    // Format size
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
      setErrorMsg("Debe seleccionar un archivo PDF.");
      return;
    }
    onCargar({
      nombre: selectedFile.nombre,
      tamano: selectedFile.tamano,
      url: selectedFile.rawFile ? URL.createObjectURL(selectedFile.rawFile) : undefined,
      sizeBytes: selectedFile.rawFile?.size,
    });
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
        width: 520,
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
          background: "#fafbfc",
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
              Cargar evidencia
            </h2>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Medio de verificación: <strong style={{ color: "#1a4f8a" }}>{medio.nombre}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 20,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Activity context & deadline */}
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{
            background: "#f8fafc",
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            padding: "12px 14px",
            marginBottom: 16,
          }}>
            <div style={{ fontSize: 11.5, color: "#64748b", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em", marginBottom: 3 }}>
              Actividad
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 8, lineHeight: 1.35 }}>
              {actividad.nombre}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, borderTop: "1px solid #edf2f7", paddingTop: 8 }}>
              <span style={{ color: "#64748b" }}>Fecha límite de carga:</span>
              <span style={{ color: "#b45309", fontWeight: 700, background: "#fef3c7", padding: "2px 8px", borderRadius: 6 }}>
                {actividad.fechaLimiteExacta}
              </span>
            </div>
          </div>

          {/* Validation Error Alert */}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 13, color: "#991b1b", fontWeight: 500 }}>{errorMsg}</span>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label className="form-label required" style={{ fontSize: 13, marginBottom: 6 }}>
                Archivo PDF
              </label>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? "2px dashed #1a4f8a" : "2px dashed #cbd5e1",
                  borderRadius: 10,
                  padding: "24px 20px",
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

                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  background: "#e8f0fa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px",
                  color: "#1a4f8a",
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </div>

                <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2a3a", marginBottom: 4 }}>
                  Arrastre un archivo PDF aquí
                </div>
                <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 12 }}>
                  o haga clic para seleccionar desde su equipo
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  SELECCIONAR ARCHIVO
                </button>

                <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
                  Formato permitido: solo .pdf • Tamaño máximo configurable: 10 MB
                </div>
              </div>
            </div>

            {/* Selected File Details */}
            {selectedFile && (
              <div style={{
                background: "#f0fdf4",
                border: "1.5px solid #bbf7d0",
                borderRadius: 8,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: "#dc2626",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                  }}>
                    PDF
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a" }}>
                      {selectedFile.nombre}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#166534" }}>
                      Tipo: PDF • Tamaño: {selectedFile.tamano}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#64748b",
                    fontSize: 14,
                    padding: 4,
                  }}
                  title="Quitar archivo"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Actions */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              paddingTop: 12,
              borderTop: "1px solid #e2e8f0",
              marginBottom: 16,
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
                style={{ minWidth: 140, justifyContent: "center" }}
              >
                CARGAR EVIDENCIA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
