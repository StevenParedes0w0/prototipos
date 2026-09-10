import React from "react";

interface EmptyStateViewProps {
  mensaje: string;
  detalle?: string;
  icono?: React.ReactNode;
}

export default function EmptyStateView({ mensaje, detalle, icono }: EmptyStateViewProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        color: "#94a3b8",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 16, opacity: 0.6 }}>
        {icono ?? (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
        )}
      </div>
      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#64748b", margin: "0 0 6px" }}>
        {mensaje}
      </p>
      {detalle && (
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.6, maxWidth: 360 }}>
          {detalle}
        </p>
      )}
    </div>
  );
}
