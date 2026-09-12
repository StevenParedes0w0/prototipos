import React, { useEffect, useRef, useState } from "react";

interface ModalFirmaDocumentalProps {
  isOpen: boolean;
  onClose: () => void;
  onFirmar: (certFile: string, ubicacion: string) => boolean | void;
  tituloDocumento?: string;
  grupo?: string;
  formalVersion?: string;
  reviewRound?: number;
  actorNombre: string;
  actorCargo: string;
  ubicacionSugerida?: string;
  accionTexto?: string; // "FIRMAR DOCUMENTO", "APROBAR Y FIRMAR", "VALIDAR Y FIRMAR"
}

export default function ModalFirmaDocumental({
  isOpen,
  onClose,
  onFirmar,
  tituloDocumento = "Plan de Trabajo",
  grupo = "Comisión de Eventos Académicos",
  formalVersion = "1.0",
  reviewRound = 1,
  actorNombre,
  actorCargo,
  ubicacionSugerida = "Ubicación no disponible",
  accionTexto = "FIRMAR DOCUMENTO",
}: ModalFirmaDocumentalProps) {
  const [certFile, setCertFile] = useState("");
  const [certPass, setCertPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [ubicacion, setUbicacion] = useState(ubicacionSugerida);
  const [confirmado, setConfirmado] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCertFile(""); setCertPass(""); setConfirmado(false);
      setShowPass(false); setUbicacion(ubicacionSugerida); setError("");
    }
  }, [isOpen, actorNombre, ubicacionSugerida]);

  if (!isOpen) return null;

  const validCertificate = /\.(p12|pfx)$/i.test(certFile.trim());
  const canSign = validCertificate && certPass.trim().length > 0 && confirmado && !isSigning;

  const handleEjecutarFirma = () => {
    if (!canSign) return;
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      const accepted = onFirmar(certFile, ubicacion);
      if (accepted === false) {
        setError("No se pudo firmar. Verifique la identidad, la etapa activa y el certificado seleccionado.");
        setCertPass("");
        return;
      }
      setCertPass("");
      setCertFile("");
      setConfirmado(false);
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 47, 86, 0.48)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 520,
          maxWidth: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1a4f8a",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans', sans-serif" }}>
                Firmar documento
              </h2>
              <div style={{ fontSize: 12, color: "#6b7a8d" }}>
                Versión formal {formalVersion} — Ronda de revisión {reviewRound}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 18,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Metadata Card */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 8,
              padding: "12px 14px",
              border: "1px solid #e2e8f0",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              fontSize: 12.5,
            }}
          >
            <div>
              <span style={{ color: "#64748b" }}>Documento: </span>
              <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{tituloDocumento}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Grupo: </span>
              <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{grupo}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Firmante: </span>
              <span style={{ fontWeight: 600, color: "#1a4f8a" }}>{actorNombre}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Cargo: </span>
              <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{actorCargo}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div>
            <label className="form-label required" style={{ fontSize: 12.5, marginBottom: 5 }}>
              Archivo de certificado (.p12 / .pfx)
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="file" accept=".p12,.pfx" ref={fileRef} style={{display:"none"}} onChange={event => {setCertFile(event.target.files?.[0]?.name || "");setError("");}} />
              <input
                className="form-input"
                value={certFile}
                readOnly
                placeholder="Seleccione archivo .p12 o .pfx"
                style={{ flex: 1, fontSize: 13 }}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => fileRef.current?.click()}
                style={{ whiteSpace: "nowrap", fontSize: 12 }}
              >
                Examinar…
              </button>
            </div>
          </div>
          {certFile && !validCertificate && <div role="alert" style={{fontSize:12,color:"#b91c1c"}}>Seleccione un archivo .p12 o .pfx.</div>}

          <div>
            <label className="form-label required" style={{ fontSize: 12.5, marginBottom: 5 }}>
              Contraseña del certificado
            </label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showPass ? "text" : "password"}
                value={certPass}
                onChange={(e) => setCertPass(e.target.value)}
                placeholder="Ingrese contraseña de su firma"
                style={{ paddingRight: 38, fontSize: 13 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#64748b",
                }}
              >
                {showPass ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="form-label" style={{ fontSize: 12.5, marginBottom: 5 }}>
              Ubicación en el documento
            </label>
            <input
              className="form-input"
              value={ubicacion}
              readOnly
              style={{ fontSize: 12.5, background: "#f8fafc", color: "#334155" }}
            />
          </div>
          {error && <div role="alert" style={{fontSize:12,color:"#b91c1c"}}>{error}</div>}

          {/* Privacy Message */}
          <div
            style={{
              padding: "10px 12px",
              background: "#eff6ff",
              borderRadius: 8,
              border: "1px solid #bfdbfe",
              fontSize: 12,
              color: "#1e40af",
              lineHeight: 1.45,
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 2 }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              El certificado y su contraseña se utilizan únicamente durante el proceso de firma y no se almacenan permanentemente.
            </span>
          </div>

          {/* Confirmation Checkbox */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginTop: 2 }}>
            <input
              type="checkbox"
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
              style={{ accentColor: "#1a4f8a", marginTop: 2, flexShrink: 0, width: 16, height: 16 }}
            />
            <span style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.5 }}>
              Confirmo haber revisado el contenido completo del documento.
            </span>
          </label>

          {/* Subtle note */}
          <div style={{ fontSize: 11, color: "#94a3b8", fontStyle: "italic", textAlign: "right" }}>
            Mecanismo de firma sujeto a integración institucional.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button className="btn btn-ghost" onClick={onClose} disabled={isSigning}>
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            disabled={!canSign}
            onClick={handleEjecutarFirma}
            style={{ minWidth: 160, justifyContent: "center" }}
          >
            {isSigning ? (
              <span>Firmando…</span>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {accionTexto}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
