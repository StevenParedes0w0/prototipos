// Pantalla 01 — Panel de Administración
import React from "react";

interface AdminDashboardViewProps {
  onNavigate: (seccion: string) => void;
  metricas?: {
    usuariosActivos: number;
    gruposInstitucionales: number;
    periodoActivo: string;
    flujosConfigurados: number;
  };
}

export default function AdminDashboardView({ onNavigate, metricas }: AdminDashboardViewProps) {
  const tarjetasResumen = [
    {
      titulo: "Usuarios activos",
      valor: metricas?.usuariosActivos ? metricas.usuariosActivos.toLocaleString("es-EC") : "2.000",
      etiqueta: "Docentes y revisores registrados",
      color: "#1a4f8a",
      bg: "#eff6ff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
    },
    {
      titulo: "Grupos institucionales",
      valor: metricas?.gruposInstitucionales ?? 23,
      etiqueta: "Comisiones, unidades y clubes",
      color: "#0891b2",
      bg: "#ecfeff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      titulo: "Período activo",
      valor: metricas?.periodoActivo || "Julio – Diciembre 2026",
      etiqueta: "Ventana de ejecución vigente",
      color: "#16a34a",
      bg: "#f0fdf4",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
    {
      titulo: "Flujos configurados",
      valor: metricas?.flujosConfigurados ?? 23,
      etiqueta: "Etapas de revisión y aprobación",
      color: "#7c3aed",
      bg: "#f5f3ff",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      ),
    },
  ];

  const accesosRapidos = [
    {
      id: "usuarios",
      titulo: "Usuarios",
      descripcion: "Nómina institucional, roles, importación de docentes y asignación a grupos.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
      ),
      badge: "Gestión y roles",
    },
    {
      id: "grupos",
      titulo: "Grupos institucionales",
      descripcion: "Comisiones, unidades de titulación, clubes y sus docentes integrantes.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      badge: "Comisiones y unidades",
    },
    {
      id: "periodos",
      titulo: "Períodos académicos",
      descripcion: "Apertura y cierre de ciclos, ventanas de elaboración y revisión.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      badge: "Calendario",
    },
    {
      id: "actividadesAdmin",
      titulo: "Actividades institucionales",
      descripcion: "Catálogo de actividades POA, Planes de Mejora y obligatoriedad.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        </svg>
      ),
      badge: "Catálogo base",
    },
    {
      id: "catalogos",
      titulo: "Catálogos",
      descripcion: "Administración de recursos de trabajo y medios de verificación (1 PDF).",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      badge: "Recursos y medios",
    },
    {
      id: "flujos",
      titulo: "Flujos de aprobación",
      descripcion: "Secuencia de revisión por etapas, pares asignados y reglas de aprobación.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
      badge: "Etapas y revisores",
    },
    {
      id: "feriados",
      titulo: "Feriados y días restringidos",
      descripcion: "Días inhábiles para fechas Desde y Hasta de las actividades.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      badge: "Reglas de inicio/fin",
    },
    {
      id: "plantillas",
      titulo: "Plantillas documentales",
      descripcion: "Estructura institucional de secciones para el Plan de Trabajo e informes.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      badge: "Formatos FISEI",
    },
  ];

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
          <span>FISEI–UTA</span>
          <span style={{ color: "#cbd5e1" }}>/</span>
          <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Administración</span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 6px" }}>
          Administración
        </h1>
        <p style={{ fontSize: 14, color: "#64748d", margin: 0 }}>
          Configure los elementos institucionales utilizados en la gestión de Planes de Trabajo.
        </p>
      </div>

      {/* Resumen Métricas */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}>
        {tarjetasResumen.map((t, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "20px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#64748b", marginBottom: 6 }}>
                {t.titulo}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
                {t.valor}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>
                {t.etiqueta}
              </div>
            </div>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: t.bg,
              color: t.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {t.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Sección Configuración Institucional */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Configuración institucional
        </h2>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Acceda directamente a los módulos de parametrización institucional.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
        gap: 16,
      }}>
        {accesosRapidos.map((acc) => (
          <div
            key={acc.id}
            onClick={() => onNavigate(acc.id)}
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              padding: "20px",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#93c5fd";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.03)";
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: "#eff6ff",
                  color: "#1a4f8a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  {acc.icon}
                </div>
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#1a4f8a",
                  background: "#dbeafe",
                  padding: "3px 8px",
                  borderRadius: 99,
                }}>
                  {acc.badge}
                </span>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e2a3a", margin: "0 0 6px" }}>
                {acc.titulo}
              </h3>
              <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
                {acc.descripcion}
              </p>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12.5,
              fontWeight: 700,
              color: "#1a4f8a",
              marginTop: 16,
              paddingTop: 12,
              borderTop: "1px solid #f1f5f9",
            }}>
              <span>Configurar</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
