import React from "react";

interface AccesoRestringidoViewProps {
  tipo: "restringido" | "noDisponible";
  onVolver: () => void;
}

export default function AccesoRestringidoView({ tipo, onVolver }: AccesoRestringidoViewProps) {
  const esRestringido = tipo === "restringido";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        color: "#64748b",
        textAlign: "center",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background: esRestringido ? "#fef3c7" : "#f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
          color: esRestringido ? "#92400e" : "#475569",
        }}
      >
        {esRestringido ? (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        )}
      </div>

      {/* Title */}
      <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "0 0 8px" }}>
        {esRestringido ? "Acceso restringido" : "Recurso no disponible"}
      </h2>

      {/* Message */}
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 28px", lineHeight: 1.6 }}>
        {esRestringido
          ? "No dispone de permisos para acceder a este recurso."
          : "No fue posible encontrar el elemento solicitado."}
      </p>

      {/* Action */}
      <button
        id={`btn-${esRestringido ? "volver" : "volver-inicio"}`}
        onClick={onVolver}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 22px",
          borderRadius: 8,
          border: "1.5px solid #0f2f56",
          background: "#0f2f56",
          color: "#fff",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.03em",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
        </svg>
        {esRestringido ? "VOLVER" : "VOLVER AL INICIO"}
      </button>
    </div>
  );
}
