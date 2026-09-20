import { canonicalDemoActorId, flowFromConfiguration, hasConfiguredNextStage } from "./documentEngine/workflow";
import { composeArtifactPages, getSignatureSlots } from "./documentEngine/pagination";
import { getResponsibleDisplayLabel } from "./documentEngine/responsibleDisplay";
import { useState, useRef, useEffect } from "react";
import logoUta from "./img/Logo UTA-Azul.png";
import MisActividadesView from "./modulo5/MisActividadesView";
import DetalleActividadView from "./modulo5/DetalleActividadView";
import MisEvidenciasView from "./modulo5/MisEvidenciasView";
import { useSeguimientoState } from "./modulo6/useSeguimientoState";
import BandejaEvidenciasRevisorView from "./modulo6/BandejaEvidenciasRevisorView";
import RevisarEvidenciaView from "./modulo6/RevisarEvidenciaView";
import SeguimientoPlanesView from "./modulo6/SeguimientoPlanesView";
import DetalleSeguimientoPlanView from "./modulo6/DetalleSeguimientoPlanView";
import { GRUPOS_ADMIN_INICIALES, RECURSOS_CATALOGO_INICIALES, MEDIOS_CATALOGO_INICIALES } from "./modulo7/mockDataAdmin";
import { GrupoInstitucional, PeriodoAcademico, FeriadoItem, TipoUnidadInstitucional, UnidadInstitucional } from "./modulo7/types";
import { useAdminState } from "./modulo7/useAdminState";
import AdminDashboardView from "./modulo7/AdminDashboardView";
import UsuariosView from "./modulo7/UsuariosView";
import GruposInstitucionalesView from "./modulo7/GruposInstitucionalesView";
import GrupoDetalleView from "./modulo7/GrupoDetalleView";
import PeriodosAcademicosView from "./modulo7/PeriodosAcademicosView";
import ActividadesInstitucionalesView from "./modulo7/ActividadesInstitucionalesView";
import CatalogosView from "./modulo7/CatalogosView";
import FlujosAprobacionView from "./modulo7/FlujosAprobacionView";
import ConfigurarFlujoView from "./modulo7/ConfigurarFlujoView";
import FeriadosView from "./modulo7/FeriadosView";
import PlantillasDocumentalesView from "./modulo7/PlantillasDocumentalesView";
import UnidadesInstitucionalesView from "./modulo7/UnidadesInstitucionalesView";
import { useNotificacionesState } from "./modulo8/useNotificacionesState";
import { useAuditoriaState } from "./modulo8/useAuditoriaState";
import NotificacionesDropdown from "./modulo8/NotificacionesDropdown";
import NotificacionesView from "./modulo8/NotificacionesView";
import AuditoriaView from "./modulo8/AuditoriaView";
import AuditoriaDetalleDrawer from "./modulo8/AuditoriaDetalleDrawer";
import TrazabilidadModal from "./modulo8/TrazabilidadModal";
import { NotificacionItem } from "./modulo8/types";
import { ReportePlanItem } from "./modulo9/types";
import { useReportesState } from "./modulo9/useReportesState";
import ReportesDocenteView from "./modulo9/ReportesDocenteView";
import ReportesRevisorView from "./modulo9/ReportesRevisorView";
import ReportesAdminView from "./modulo9/ReportesAdminView";
import ReporteDetallePlanView from "./modulo9/ReporteDetallePlanView";
import ConsultaHistoricaView from "./modulo9/ConsultaHistoricaView";
import PlanHistoricoDetalleView from "./modulo9/PlanHistoricoDetalleView";
import CierrePeriodosView from "./modulo9/CierrePeriodosView";
import ModalGenerarReporte from "./modulo9/ModalGenerarReporte";
import ModalVistaPreviaReporte from "./modulo9/ModalVistaPreviaReporte";
import ModalCompararVersiones from "./modulo9/ModalCompararVersiones";
import ModalConfirmarCierre from "./modulo9/ModalConfirmarCierre";
import PerfilView from "./modulo10/PerfilView";
import { useDocumentEngine } from "./documentEngine/useDocumentEngine";
import DocumentPdfPageViewer from "./documentEngine/DocumentPdfPageViewer";
import ModalFirmaDocumental from "./documentEngine/ModalFirmaDocumental";
import ModalDevolverDocumental from "./documentEngine/ModalDevolverDocumental";
import RevisorDocumentEngineView from "./documentEngine/RevisorDocumentEngineView";
import MisDocumentosView from "./modulo11/MisDocumentosView";
import WizardInformeView from "./modulo11/WizardInformeView";
import { Eye, ClipboardList, Info, FilePenLine, MessageSquare, RotateCcw, Settings, Sparkles } from "./components/icons";
import { TableActionButton } from "./components/TableActionButton";

// ─── Types ───────────────────────────────────────────────────────────────────

type AuthScreen = "login" | "changePassword" | "recovery" | "app";
type AppView =
  | "inicio"
  | "planes"
  | "actividades"
  | "evidencias"
  | "notificaciones"
  | "perfil"
  | "bandeja"
  | "planesRevision"
  | "seguimiento"
  | "grupos"
  | "evidenciasValidar"
  | "adminInicio"
  | "adminUsuarios"
  | "adminGrupos"
  | "adminPeriodos"
  | "adminActividades"
  | "adminCatalogos"
  | "adminFlujos"
  | "adminFeriados"
  | "adminPlantillas"
  | "adminUnidades"
  | "adminAuditoria"
  | "reportes"
  | "cierrePeriodos";
type PlanEstado = "Borrador" | "En revisión" | "Observado" | "Aprobado" | "Devuelto" | "En ejecución";
type ActividadEstado = "EN CURSO" | "CUMPLIDA" | "PENDIENTE" | "PRÓXIMA A VENCER" | "VENCIDA";

// ─── Shared Icons ─────────────────────────────────────────────────────────────

const Ico = {
  eye: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  eyeOff: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  checkCircle: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  alert: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  home: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  file: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
    </svg>
  ),
  activity: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  ),
  paperclip: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  bell: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  user: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  logOut: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  chevronRight: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  clock: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  arrowLeft: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  upload: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  shieldCheck: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </svg>
  ),
  users: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  search: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  history: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/>
    </svg>
  ),
  chart: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  archive: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
    </svg>
  ),
};

// ─── Shared: FISEI Logo Block ─────────────────────────────────────────────────

function FISEILogoMark({ size = 44 }: { size?: number }) {
  const s = size;
  return (
    <div style={{
      width: s, height: s, borderRadius: Math.round(s * 0.2),
      background: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: "1.5px solid rgba(255,255,255,0.25)",
      padding: Math.max(2, Math.round(s * 0.06)),
      overflow: "hidden",
      boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
    }}>
      <img
        src={logoUta}
        alt="Universidad Técnica de Ambato"
        style={{ width: "100%", height: "100%", objectFit: "contain" }}
      />
    </div>
  );
}

// ─── Auth Layout (shared wrapper for screens 1–3) ────────────────────────────

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", height: "100%", minHeight: "100vh" }}>
      {/* Left institutional panel */}
      <div style={{
        width: "50%", minWidth: 420,
        background: "#0f2f56",
        display: "flex", flexDirection: "column",
        padding: "48px 56px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Subtle background texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "radial-gradient(circle at 20% 80%, #fff 0%, transparent 50%), radial-gradient(circle at 80% 20%, #2563ab 0%, transparent 50%)",
        }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 56 }}>
            <FISEILogoMark size={48} />
            <div>
              <div style={{ color: "#e8f0fa", fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>Gestión Documental Académica</div>
              <div style={{ color: "#8ab8d8", fontSize: 11.5 }}>FISEI — Universidad Técnica de Ambato</div>
            </div>
          </div>

          {/* Main text */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#8ab8d8", marginBottom: 16,
            }}>
              Universidad Técnica de Ambato
            </div>
            <h1 style={{
              fontSize: 30, fontWeight: 800, color: "#e8f0fa", lineHeight: 1.2,
              fontFamily: "'DM Sans',sans-serif", marginBottom: 10,
            }}>
              UTAPED <br /> 
            </h1>
            <p style={{ fontSize: 14.5, color: "#7aaed0", lineHeight: 1.65, marginBottom: 32, maxWidth: 340 }}>
              Planificación, seguimiento y evidencias docentes.
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                "Planes de trabajo por período académico",
                "Matriz de actividades con evidencias PDF",
                "Flujo de aprobación institucional",
                "Historial de versiones y auditoría",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "rgba(37,99,171,0.35)", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#7aaed0",
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <span style={{ fontSize: 13, color: "#8ab8d8" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20, marginTop: 40 }}>
            <div style={{ fontSize: 11, color: "#6b96c8", lineHeight: 1.5 }}>
              Facultad de Ingeniería en Sistemas,<br />Electrónica e Industrial — UTA
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1, background: "#f0f4f8",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "48px 40px",
      }}>
        {children}
      </div>
    </div>
  );
}

// ─── Screen 01 — Login ────────────────────────────────────────────────────────

type CaptchaChallenge = { left: number; right: number };

function createCaptchaChallenge(previous?: CaptchaChallenge): CaptchaChallenge {
  let challenge: CaptchaChallenge;
  do {
    challenge = {
      left: Math.floor(Math.random() * 8) + 2,
      right: Math.floor(Math.random() * 8) + 2,
    };
  } while (previous && challenge.left === previous.left && challenge.right === previous.right);
  return challenge;
}

function LoginScreen({ onLogin, onForgot, onFirstLogin }: {
  onLogin: () => void;
  onForgot: () => void;
  onFirstLogin: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [captcha, setCaptcha] = useState<CaptchaChallenge>(() => createCaptchaChallenge());
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const captchaIsCorrect = captchaAnswer.trim() === String(captcha.left + captcha.right);

  function renewCaptcha() {
    setCaptcha(previous => createCaptchaChallenge(previous));
    setCaptchaAnswer("");
    setCaptchaError(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captchaIsCorrect) {
      setCaptchaError(true);
      return;
    }
    // Simulate: wrong creds → error, correct → login
    if (email === "andrea.perez@uta.edu.ec" && pwd === "temporal123") {
      onFirstLogin();
    } else if (email === "andrea.perez@uta.edu.ec" && pwd === "Mi$Clave2026") {
      onLogin();
    } else {
      setHasError(true);
    }
  }

  return (
    <AuthLayout>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>
            Iniciar sesión
          </h2>
          <p style={{ fontSize: 13.5, color: "#6b7a8d" }}>
            Ingrese con las credenciales asignadas por la institución.
          </p>
        </div>

        {hasError && (
          <div style={{
            background: "#fee2e2", border: "1.5px solid #fecaca", borderRadius: 8,
            padding: "10px 14px", marginBottom: 18,
            display: "flex", alignItems: "center", gap: 9,
          }}>
            <span style={{ color: "#dc2626", flexShrink: 0 }}>{Ico.alert}</span>
            <span style={{ fontSize: 13.5, color: "#991b1b" }}>Correo o contraseña incorrectos.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="form-label required">Correo institucional</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#94a3b8", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{Ico.mail}</span>
              <input
                className={`form-input form-input-icon-left${hasError ? " form-input-error" : ""}`}
                style={{ padding: "8px 12px 8px 38px", borderColor: hasError ? "#fca5a5" : undefined }}
                type="email"
                placeholder="usuario@uta.edu.ec"
                value={email}
                onChange={e => { setEmail(e.target.value); setHasError(false); }}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="form-label required">Contraseña</label>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "#94a3b8", pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{Ico.lock}</span>
              <input
                className={`form-input form-input-icon-left${hasError ? " form-input-error" : ""}`}
                style={{ padding: "8px 40px 8px 38px", borderColor: hasError ? "#fca5a5" : undefined }}
                type={showPwd ? "text" : "password"}
                placeholder="••••••••••"
                value={pwd}
                onChange={e => { setPwd(e.target.value); setHasError(false); }}
                autoComplete="current-password"
              />
              <button type="button" onClick={() => setShowPwd(s => !s)} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                padding: 4, display: "flex", alignItems: "center",
              }} aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}>
                {showPwd ? Ico.eyeOff : Ico.eye}
              </button>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
              <label className="form-label required" htmlFor="login-captcha" style={{ marginBottom: 0 }}>Verificación de seguridad</label>
              <button type="button" onClick={renewCaptcha} style={{
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "#1a4f8a", fontSize: 12.5, fontWeight: 600,
              }} aria-label="Cambiar desafío de verificación">
                Cambiar desafío
              </button>
            </div>
            <p id="login-captcha-question" data-testid="login-captcha-question" style={{
              margin: "0 0 8px", fontSize: 13, color: "#475569", fontWeight: 500,
            }}>
              ¿Cuánto es {captcha.left} + {captcha.right}?
            </p>
            <input
              id="login-captcha"
              className={`form-input${captchaError ? " form-input-error" : ""}`}
              style={{ borderColor: captchaError ? "#fca5a5" : undefined }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Resultado"
              value={captchaAnswer}
              onChange={e => {
                const answer = e.target.value;
                setCaptchaAnswer(answer);
                if (answer.trim() === String(captcha.left + captcha.right)) setCaptchaError(false);
              }}
              onBlur={() => setCaptchaError(Boolean(captchaAnswer.trim()) && !captchaIsCorrect)}
              aria-label="Respuesta de verificación"
              aria-invalid={captchaError}
              aria-describedby={captchaError ? "login-captcha-error" : "login-captcha-question"}
            />
            {captchaError && (
              <p id="login-captcha-error" role="alert" style={{ margin: "6px 0 0", fontSize: 12.5, color: "#b91c1c" }}>
                El resultado no coincide. Intente nuevamente o cambie el desafío.
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" style={{ accentColor: "#1a4f8a", width: 15, height: 15 }} />
              <span style={{ fontSize: 13, color: "#475569" }}>Recordar sesión</span>
            </label>
            <button type="button" onClick={onForgot} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: "#1a4f8a", fontWeight: 500, padding: 0, textDecoration: "none",
            }}>
              ¿Olvidó su contraseña?
            </button>
          </div>

          <button type="submit" className="btn btn-primary" disabled={!captchaIsCorrect} style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em" }}>
            INICIAR SESIÓN
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 24, textAlign: "center", lineHeight: 1.6 }}>
          Este sistema es de uso institucional. El acceso está restringido<br />a usuarios autorizados por la FISEI.
        </p>
      </div>
    </AuthLayout>
  );
}

// ─── Screen 02 — Change Password ──────────────────────────────────────────────

function ChangePasswordScreen({ onDone, onCancel }: { onDone: () => void; onCancel: () => void }) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [mismatch, setMismatch] = useState(false);

  const criteria = [
    { label: "Mínimo 8 caracteres", met: newPwd.length >= 8 },
    { label: "Al menos una letra mayúscula", met: /[A-Z]/.test(newPwd) },
    { label: "Al menos una letra minúscula", met: /[a-z]/.test(newPwd) },
    { label: "Al menos un número", met: /[0-9]/.test(newPwd) },
  ];
  const allMet = criteria.every(c => c.met);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPwd !== confirmPwd) { setMismatch(true); return; }
    if (!allMet) return;
    onDone();
  }

  return (
    <AuthLayout>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Lock icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24, color: "#1a4f8a",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>
          Establecer nueva contraseña
        </h2>
        <p style={{ fontSize: 13.5, color: "#6b7a8d", marginBottom: 24, lineHeight: 1.6 }}>
          Por seguridad, debe cambiar su contraseña temporal antes de continuar.
        </p>

        {/* Email reference (read-only) */}
        <div style={{
          background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8,
          padding: "10px 14px", marginBottom: 24, display: "flex", alignItems: "center", gap: 9,
        }}>
          <span style={{ color: "#94a3b8" }}>{Ico.mail}</span>
          <span style={{ fontSize: 13.5, color: "#475569", fontFamily: "'JetBrains Mono',monospace" }}>
            andrea.perez@uta.edu.ec
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8", background: "#e2e8f0", padding: "2px 7px", borderRadius: 99 }}>Solo lectura</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label className="form-label required">Nueva contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showNew ? "text" : "password"}
                placeholder="••••••••••"
                value={newPwd}
                onChange={e => { setNewPwd(e.target.value); setMismatch(false); }}
                style={{ paddingRight: 40 }}
              />
              <button type="button" onClick={() => setShowNew(s => !s)} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                padding: 4, display: "flex", alignItems: "center",
              }}>{showNew ? Ico.eyeOff : Ico.eye}</button>
            </div>
          </div>

          {/* Criteria */}
          <div style={{
            background: "#f8fafc", border: "1.5px solid #e2e8f0",
            borderRadius: 8, padding: "12px 14px",
            display: "flex", flexDirection: "column", gap: 7,
          }}>
            {criteria.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                  background: c.met ? "#dcfce7" : "#f1f5f9",
                  border: `1.5px solid ${c.met ? "#86efac" : "#d1d9e0"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}>
                  {c.met && <span style={{ color: "#166534" }}>{Ico.check}</span>}
                </div>
                <span style={{ fontSize: 12.5, color: c.met ? "#166534" : "#6b7a8d", transition: "color 0.2s" }}>{c.label}</span>
              </div>
            ))}
          </div>

          <div>
            <label className="form-label required">Confirmar nueva contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                className="form-input"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••••"
                value={confirmPwd}
                onChange={e => { setConfirmPwd(e.target.value); setMismatch(false); }}
                style={{
                  paddingRight: 40,
                  borderColor: mismatch ? "#fca5a5" : confirmPwd && confirmPwd === newPwd ? "#86efac" : undefined,
                }}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
                padding: 4, display: "flex", alignItems: "center",
              }}>{showConfirm ? Ico.eyeOff : Ico.eye}</button>
            </div>
            {mismatch && (
              <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                {Ico.alert} Las contraseñas ingresadas no coinciden.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!allMet || !confirmPwd || confirmPwd !== newPwd}
            style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em" }}
          >
            GUARDAR CONTRASEÑA Y CONTINUAR
          </button>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button type="button" onClick={onCancel} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12.5, color: "#6b7a8d", padding: 0,
              display: "inline-flex", alignItems: "center", gap: 5,
            }}>
              ← Cancelar y volver al acceso
            </button>
            <p style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 5, lineHeight: 1.55 }}>
              Si cancela este proceso, deberá iniciar sesión nuevamente<br />para continuar con el cambio de contraseña.
            </p>
          </div>
        </form>

        <div style={{
          marginTop: 20, padding: "10px 14px", borderRadius: 8,
          background: "#f0fdf4", border: "1px solid #bbf7d0",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <span style={{ color: "#16a34a", flexShrink: 0, marginTop: 1 }}>{Ico.shieldCheck}</span>
          <p style={{ fontSize: 12, color: "#166534", lineHeight: 1.6 }}>
            Su contraseña será almacenada de forma segura y no podrá ser consultada por otros usuarios.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

// ─── Screen 03 — Recovery ─────────────────────────────────────────────────────

function RecoveryScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <AuthLayout>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {!sent ? (
          <>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 24, color: "#1a4f8a",
            }}>
              {Ico.mail}
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>
              Recuperar contraseña
            </h2>
            <p style={{ fontSize: 13.5, color: "#6b7a8d", marginBottom: 28, lineHeight: 1.65 }}>
              Ingrese su correo institucional. Le enviaremos las instrucciones necesarias para recuperar el acceso a su cuenta.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label required">Correo institucional</label>
                <input
                    className="form-input"
                    type="email"
                    placeholder="usuario@uta.edu.ec"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={!email.includes("@uta.edu.ec")}
                style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em" }}
              >
                ENVIAR INSTRUCCIONES
              </button>
            </form>

            <button
              onClick={onBack}
              style={{
                marginTop: 20, background: "none", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 6,
                fontSize: 13.5, color: "#1a4f8a", fontWeight: 500, padding: 0,
              }}
            >
              {Ico.arrowLeft} Volver a iniciar sesión
            </button>
          </>
        ) : (
          <RecoverySuccess onBack={onBack} />
        )}
      </div>
    </AuthLayout>
  );
}

function RecoverySuccess({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 72, height: 72, borderRadius: "50%",
        background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px", color: "#16a34a",
      }}>
        {Ico.checkCircle}
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
        Revise su correo
      </h2>
      <p style={{ fontSize: 13.5, color: "#6b7a8d", marginBottom: 8, lineHeight: 1.65 }}>
        Hemos enviado las instrucciones de recuperación a
      </p>
      <p style={{
        fontSize: 14, fontWeight: 700, color: "#1e2a3a",
        fontFamily: "'JetBrains Mono',monospace", marginBottom: 20,
      }}>
        a••••••••@uta.edu.ec
      </p>
      <p style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 32, lineHeight: 1.6 }}>
        Si no encuentra el mensaje, revise la carpeta de correo no deseado.
      </p>
      <button onClick={onBack} style={{
        background: "none", border: "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 13.5, color: "#1a4f8a", fontWeight: 500,
      }}>
        {Ico.arrowLeft} Volver a iniciar sesión
      </button>
    </div>
  );
}

// ─── Screen 04 — Authenticated App ───────────────────────────────────────────

const DOCENTE = {
  nombre: "Ing. Andrea Pérez, Mg.",
  nombreCorto: "Andrea Pérez",
  correo: "andrea.perez@uta.edu.ec",
  avatar: "AP",
  rol: "Docente",
  periodo: "Julio – Diciembre 2026",
};

const REVISOR = {
  nombre: "Ing. Carlos López, Mg.",
  nombreCorto: "Carlos López",
  correo: "carlos.lopez@uta.edu.ec",
  avatar: "CL",
  rol: "Revisor",
};

const ADMINISTRADOR = {
  nombre: "Ing. Laura Medina, Mg.",
  nombreCorto: "Laura Medina",
  correo: "laura.medina@uta.edu.ec",
  avatar: "LM",
  rol: "Administrador",
};

function Sidebar({ view, setView, onLogout, collapsed, setCollapsed, userRole, onRoleSwitch, noLeidasCount, sessionUser }: {
  view: AppView;
  setView: (v: AppView) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  userRole: "docente" | "revisor" | "admin";
  onRoleSwitch: () => void;
  noLeidasCount: number;
  sessionUser: {nombre:string;correo:string;avatar:string;nombreCorto:string;rol:string};
}) {
  const docenteItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: "inicio",         label: "Inicio",                icon: Ico.home },
    { id: "planes",         label: "Documentación Académica",icon: Ico.file },
    { id: "actividades",    label: "Mis Actividades",       icon: Ico.activity },
    { id: "evidencias",     label: "Evidencias",            icon: Ico.paperclip },
    { id: "reportes",       label: "Mis Reportes",          icon: Ico.chart },
    { id: "notificaciones", label: "Notificaciones",        icon: Ico.bell },
    { id: "perfil",         label: "Perfil",                icon: Ico.user },
  ];
  const revisorItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: "evidenciasValidar", label: "Evidencias por validar", icon: Ico.paperclip },
    { id: "seguimiento",    label: "Seguimiento",           icon: Ico.activity },
    { id: "bandeja",        label: "Bandeja de revisión (Documentos)", icon: Ico.file },
    { id: "planesRevision", label: "Planes de Trabajo",     icon: Ico.home },
    { id: "grupos",         label: "Grupos asignados",      icon: Ico.users },
    { id: "reportes",       label: "Reportes de Seguimiento", icon: Ico.chart },
    { id: "notificaciones", label: "Notificaciones",        icon: Ico.bell },
    { id: "perfil",         label: "Perfil",                icon: Ico.user },
  ];
  const adminItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: "adminInicio",       label: "Panel General",           icon: Ico.home },
    { id: "adminUsuarios",     label: "Gestión de Usuarios",     icon: Ico.user },
    { id: "adminGrupos",       label: "Grupos Institucionales",  icon: Ico.users },
    { id: "adminPeriodos",     label: "Períodos Académicos",     icon: Ico.clock },
    { id: "adminActividades",  label: "Catálogo Actividades",    icon: Ico.activity },
    { id: "adminCatalogos",    label: "Recursos y Medios",       icon: Ico.paperclip },
    { id: "adminUnidades",     label: "Unidades Institucionales",icon: Ico.home },
    { id: "adminFlujos",       label: "Flujos de Aprobación",    icon: Ico.shieldCheck },
    { id: "adminFeriados",     label: "Feriados y Restricciones",icon: Ico.alert },
    { id: "adminPlantillas",   label: "Plantillas Documentales", icon: Ico.file },
    { id: "adminAuditoria",    label: "Auditoría",               icon: Ico.search },
    { id: "reportes",          label: "Reportes Institucionales",icon: Ico.chart },
    { id: "cierrePeriodos",    label: "Cierre de Períodos",      icon: Ico.archive },
    { id: "notificaciones",    label: "Notificaciones",          icon: Ico.bell },
    { id: "perfil",            label: "Perfil",                  icon: Ico.user },
  ];
  const navItems = userRole === "admin" ? adminItems : userRole === "revisor" ? revisorItems : docenteItems;
  const currentUser = sessionUser;
  const avatarBg = userRole === "admin" ? "#7c3aed" : userRole === "revisor" ? "#1a6a4a" : "#2563ab";

  const w = collapsed ? 64 : 244;

  return (
    <aside style={{
      width: w, minWidth: w, background: "#0f2f56",
      display: "flex", flexDirection: "column", overflowY: "auto",
      transition: "width 0.2s ease, min-width 0.2s ease", flexShrink: 0,
    }}>
      {/* Logo / toggle */}
      <div style={{ padding: collapsed ? "16px 0 14px" : "20px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {collapsed ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <FISEILogoMark size={34} />
            <button
              onClick={() => setCollapsed(false)}
              title="Expandir navegación"
              aria-label="Expandir barra lateral"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7aaed0", padding: 4, borderRadius: 4, display: "flex" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FISEILogoMark size={38} />
              <div>
                <div style={{ color: "#e8f0fa", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.2 }}>Gestión Documental Académica</div>
                <div style={{ color: "#7aaed0", fontSize: 10.5 }}>FISEI — UTA</div>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              title="Contraer navegación"
              aria-label="Contraer barra lateral"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#7aaed0", padding: 4, borderRadius: 4, display: "flex", flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* User */}
      {!collapsed && (
        <div style={{ margin: "12px 12px 4px", padding: "10px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: avatarBg, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>{currentUser.avatar}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ color: "#dce8f5", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {currentUser.nombreCorto}
              </div>
              <div style={{ color: "#4a7ab0", fontSize: 10.5 }}>{currentUser.rol}</div>
            </div>
          </div>
        </div>
      )}
      {collapsed && (
        <div style={{ display: "flex", justifyContent: "center", padding: "10px 0 4px" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: avatarBg, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
          }} title={currentUser.nombreCorto}>{currentUser.avatar}</div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, marginTop: 8 }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6d94", padding: "12px 24px 4px" }}>
            {userRole === "admin" ? "Administración" : "Principal"}
          </div>
        )}
        {navItems.map(n => (
          <div
            key={n.id}
            onClick={() => setView(n.id)}
            title={collapsed ? n.label : undefined}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: collapsed ? 0 : 10,
              padding: collapsed ? "10px 0" : "9px 16px",
              borderRadius: 6, cursor: "pointer",
              fontSize: 13.5, color: view === n.id ? "#fff" : "#c8d8ed",
              background: view === n.id ? "#1a4f8a" : "transparent",
              margin: collapsed ? "2px 8px" : "1px 8px", transition: "all 0.15s",
              position: "relative",
            }}
            onMouseEnter={e => { if (view !== n.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={e => { if (view !== n.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            {n.icon}
            {!collapsed && n.label}
            {!collapsed && n.id === "notificaciones" && noLeidasCount > 0 && (
              <span style={{
                marginLeft: "auto", background: "#ef4444", color: "#fff",
                borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "0px 6px", lineHeight: "16px",
              }}>{noLeidasCount}</span>
            )}
            {collapsed && n.id === "notificaciones" && noLeidasCount > 0 && (
              <span style={{
                position: "absolute", top: 6, right: 6,
                width: 8, height: 8, borderRadius: "50%", background: "#ef4444",
              }} />
            )}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: "12px 8px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {/* Role switcher */}
        <div
          onClick={onRoleSwitch}
          title={collapsed ? `Modo: ${userRole}` : undefined}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 8,
            padding: collapsed ? "10px 0" : "8px 16px",
            borderRadius: 6, cursor: "pointer",
            fontSize: 12,
            color: userRole === "admin" ? "#c4b5fd" : userRole === "revisor" ? "#6adba8" : "#7aaed0",
            marginBottom: 4, transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {!collapsed && (userRole === "admin" ? "Contexto: Administrador" : userRole === "revisor" ? "Contexto: Revisor" : "Contexto: Docente")}
        </div>
        <div
          onClick={onLogout}
          title={collapsed ? "Cerrar sesión" : undefined}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 10,
            padding: collapsed ? "10px 0" : "9px 16px",
            borderRadius: 6, cursor: "pointer",
            fontSize: 13.5, color: "#6b96c8", transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; (e.currentTarget as HTMLElement).style.color = "#c8d8ed"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "#6b96c8"; }}
        >
          {Ico.logOut}
          {!collapsed && " Cerrar sesión"}
        </div>
        {!collapsed && (
          <div style={{ padding: "8px 16px", fontSize: 10.5, color: "#2d5580" }}>
            © 2026 FISEI — UTA
          </div>
        )}
      </div>
    </aside>
  );
}

function TopBar({
  view,
  userRole,
  noLeidasCount,
  notificaciones,
  onMarcarLeida,
  onMarcarTodasLeidas,
  onNavigateToNotificaciones,
  onSelectAction,
  sessionUser,
}: {
  view: AppView;
  userRole: "docente" | "revisor" | "admin";
  noLeidasCount: number;
  notificaciones: NotificacionItem[];
  onMarcarLeida: (id: string) => void;
  onMarcarTodasLeidas: () => void;
  onNavigateToNotificaciones: () => void;
  onSelectAction: (n: NotificacionItem) => void;
  sessionUser: {nombre:string;correo:string;avatar:string;nombreCorto:string;rol:string};
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const currentUser = sessionUser;
  const avatarBg = userRole === "admin" ? "#7c3aed" : userRole === "revisor" ? "#1a6a4a" : "#1a4f8a";
  const labels: Record<AppView, string> = {
    inicio: "Inicio",
    planes: "Gestión Documental Académica",
    actividades: "Mis Actividades",
    evidencias: "Evidencias",
    notificaciones: "Notificaciones",
    perfil: "Perfil",
    bandeja: "Bandeja de revisión (Documentos)",
    planesRevision: "Planes de Trabajo",
    seguimiento: "Seguimiento",
    grupos: "Grupos asignados",
    evidenciasValidar: "Evidencias por validar",
    adminInicio: "Panel de Administración",
    adminUsuarios: "Gestión de Usuarios",
    adminGrupos: "Grupos Institucionales",
    adminPeriodos: "Períodos Académicos",
    adminActividades: "Catálogo de Actividades",
    adminCatalogos: "Catálogos de Recursos y Medios",
    adminFlujos: "Flujos de Aprobación",
    adminFeriados: "Feriados y Días Restringidos",
    adminPlantillas: "Plantillas Documentales",
    adminUnidades: "Unidades Académicas y Administrativas",
    adminAuditoria: "Auditoría Institucional",
    reportes: "Reportes y Consulta Histórica",
    cierrePeriodos: "Cierre de Períodos Académicos",
  };

  return (
    <header style={{
      height: 56, background: "#fff", borderBottom: "1px solid #e2e8f0",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", flexShrink: 0,
    }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
        <span style={{ color: "#94a3b8" }}>FISEI–UTA</span>
        <span style={{ color: "#d1d9e0" }}>{Ico.chevronRight}</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>{labels[view]}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Period — only shown for docente */}
        {userRole === "docente" && (
          <div style={{
            fontSize: 12.5, color: "#475569", background: "#f8fafc",
            border: "1.5px solid #e2e8f0", borderRadius: 6,
            padding: "4px 10px", display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ color: "#94a3b8" }}>{Ico.clock}</span>
            {DOCENTE.periodo}
          </div>
        )}

        {/* Bell con dropdown interactivo y badge reactivo */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            style={{
              position: "relative",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 4,
              borderRadius: 6,
              background: isDropdownOpen ? "#f1f5f9" : "transparent",
              transition: "background 0.15s ease",
            }}
            title="Notificaciones"
          >
            <span style={{ color: isDropdownOpen ? "#1a4f8a" : "#64748b" }}>{Ico.bell}</span>
            {noLeidasCount > 0 && (
              <span style={{
                position: "absolute", top: -3, right: -3,
                minWidth: 16, height: 16, borderRadius: "50%", background: "#ef4444",
                color: "#fff", fontSize: 9.5, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "0 3px",
              }}>{noLeidasCount}</span>
            )}
          </div>

          <NotificacionesDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            notificaciones={notificaciones}
            noLeidasCount={noLeidasCount}
            onMarcarLeida={onMarcarLeida}
            onMarcarTodasLeidas={onMarcarTodasLeidas}
            onNavigateToAll={onNavigateToNotificaciones}
            onSelectAction={onSelectAction}
          />
        </div>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#334155" }}>{currentUser.nombre}</div>
            <div style={{ fontSize: 11, color: "#94a3b8" }}>{currentUser.rol}</div>
          </div>
          <div style={{
            width: 34, height: 34, borderRadius: "50%",
            background: avatarBg, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
          }}>{currentUser.avatar}</div>
        </div>
      </div>
    </header>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { bg: string; color: string; dot: string }> = {
    "EN EJECUCIÓN":      { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "EN CURSO":          { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "CUMPLIDA":          { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE":         { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "PRÓXIMA A VENCER":  { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "VENCIDA":           { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    "CARGADO":              { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE DE CARGA":   { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  };
  const s = map[estado] ?? { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 700,
      background: s.bg, color: s.color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, display: "inline-block" }} />
      {estado}
    </span>
  );
}

function DashboardInicio({
  onNavigateActividades,
  onNavigatePlanes,
  onSelectActividad,
  resumen,
  actividadesData,
}: {
  onNavigateActividades?: () => void;
  onNavigatePlanes?: () => void;
  onSelectActividad?: (id: string) => void;
  resumen?: {
    total: number;
    enCurso: number;
    pendientes: number;
    completas: number;
    vencidas: number;
    pct: number;
  };
  actividadesData?: any[];
}) {
  // Reactive state for Actividades
  const act1 = actividadesData?.find(a => a.id === "act-1");
  const act3 = actividadesData?.find(a => a.id === "act-3");
  const act10 = actividadesData?.find(a => a.id === "act-10");

  const actividades = [
    {
      id: "act-1",
      nombre: act1?.nombre || "Seguimiento al avance de trabajos de titulación",
      hasta: "18 sep. 2026",
      estado: (act1?.estado || "EN CURSO") as ActividadEstado,
      diasRestantes: act1?.estado === "EVIDENCIAS COMPLETAS" ? "Completado" : "Faltan 11 días",
    },
    {
      id: "act-3",
      nombre: act3?.nombre || "Difusión de normativa interna de titulación",
      hasta: "03 sep. 2026",
      estado: (act3?.estado || "EVIDENCIAS COMPLETAS") as ActividadEstado,
      diasRestantes: "Completado",
    },
    {
      id: "act-10",
      nombre: act10?.nombre || "Consolidación del banco de reactivos",
      hasta: "10 oct. 2026",
      estado: (act10?.estado || "PENDIENTE") as ActividadEstado,
      diasRestantes: "Faltan 33 días",
    },
  ];

  const notificaciones = [
    {
      icono: Ico.clock,
      texto: act1?.estado === "EVIDENCIAS COMPLETAS" ? "Evidencias completadas para la actividad de titulación." : "Una actividad vence en 11 días.",
      detalle: "Seguimiento al avance de trabajos de titulación",
      hora: "07/09/2026, 09:14",
      tipo: act1?.estado === "EVIDENCIAS COMPLETAS" ? "success" : "warning",
    },
    { icono: Ico.check, texto: "Su solicitud de ampliación fue aprobada.", detalle: "Período: Julio – Diciembre 2026", hora: "06/09/2026, 16:30", tipo: "success" },
    { icono: Ico.alert, texto: "Un documento requiere correcciones.", detalle: "Plan de Trabajo — Unidad de Titulación, Versión 1.0", hora: "05/09/2026, 11:02", tipo: "danger" },
  ];

  const notiColors: Record<string, { bg: string; color: string }> = {
    warning: { bg: "#fef3c7", color: "#92400e" },
    success: { bg: "#dcfce7", color: "#166534" },
    danger:  { bg: "#fee2e2", color: "#991b1b" },
  };

  const progreso = resumen ? resumen.completas : 6;
  const total = resumen ? resumen.total : 10;
  const pct = resumen ? resumen.pct : Math.round((progreso / total) * 100);

  const act1Medios = act1 ? act1.medios : [
    { nombre: "Informe", estado: "CARGADA" },
    { nombre: "Acta", estado: "PENDIENTE" },
  ];
  const act1Cargadas = act1Medios.filter((m: any) => m.estado === "CARGADA").length;
  const act1Total = act1Medios.length;

  return (
    <div style={{ padding: "28px 28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Greeting */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
          Buenos días, Ing. Andrea Pérez, Mg.
        </h1>
        <p style={{ color: "#6b7a8d", fontSize: 13.5 }}>
          Este es el resumen de sus planes, actividades y evidencias del período actual.
        </p>
      </div>

      {/* BLOQUE 1 — Plan de Trabajo */}
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", padding: "22px 24px", marginBottom: 20,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8", marginBottom: 4 }}>
              Plan de Trabajo activo
            </div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 6 }}>
              Plan de Trabajo — Unidad de Titulación
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <EstadoBadge estado="EN EJECUCIÓN" />
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Período: {DOCENTE.periodo}</span>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Versión 1.0</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="btn btn-secondary btn-sm" onClick={onNavigateActividades}>{Ico.activity} VER ACTIVIDADES</button>
            <button className="btn btn-primary btn-sm" onClick={onNavigatePlanes}>{Ico.file} VER PLAN</button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#475569", fontWeight: 600 }}>
              {progreso} de {total} actividades cumplidas
            </span>
          </div>
          <div style={{ height: 8, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${pct}%`, borderRadius: 99,
              background: "linear-gradient(90deg, #1a4f8a, #2563ab)",
              transition: "width 0.6s ease",
            }} />
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
            {[
              { label: "Cumplidas", value: resumen ? resumen.completas : 7, color: "#166534", bg: "#dcfce7" },
              { label: "En curso", value: resumen ? resumen.enCurso : 2, color: "#1e40af", bg: "#dbeafe" },
              { label: "Pendiente", value: resumen ? resumen.pendientes : 1, color: "#475569", bg: "#f1f5f9" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: "50%", background: s.bg,
                  fontSize: 11, fontWeight: 800, color: s.color,
                }}>{s.value}</span>
                <span style={{ fontSize: 12.5, color: "#64748b" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row: Actividades + Evidencias */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20, marginBottom: 20 }}>
        {/* BLOQUE 2 — Próximas actividades */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Próximas actividades</h3>
          </div>
          <div style={{ padding: "4px 0" }}>
            {actividades.map((a, i) => (
              <div key={i} style={{
                padding: "14px 20px", borderBottom: i < actividades.length - 1 ? "1px solid #f8fafc" : "none",
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 4, lineHeight: 1.4 }}>{a.nombre}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>Hasta: <strong style={{ color: "#475569" }}>{a.hasta}</strong></span>
                    {a.diasRestantes && (
                      <span style={{ fontSize: 11.5, color: "#92400e", background: "#fef3c7", padding: "2px 7px", borderRadius: 99, fontWeight: 500 }}>
                        {a.diasRestantes}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                  <EstadoBadge estado={a.estado} />
                  <button className="btn btn-ghost btn-xs" onClick={() => onSelectActividad?.(a.id)}>Ver actividad</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE 3 — Evidencias pendientes */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #fde68a", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #fef3c7", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#d97706" }}>{Ico.paperclip}</span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Evidencias pendientes</h3>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 12.5, color: "#6b7a8d", marginBottom: 12 }}>
              <span style={{ fontWeight: 700 }}>Actividad:</span> Seguimiento al avance de trabajos de titulación
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {act1Medios.map((ev: any, i: number) => {
                const cargado = ev.estado === "CARGADA";
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: 8,
                    background: cargado ? "#f0fdf4" : "#fffbeb",
                    border: `1.5px solid ${cargado ? "#bbf7d0" : "#fde68a"}`,
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#334155" }}>{ev.nombre}</span>
                    <EstadoBadge estado={cargado ? "CARGADO" : "PENDIENTE DE CARGA"} />
                  </div>
                );
              })}
            </div>

            <div style={{ fontSize: 12, color: "#6b7a8d", marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: act1Cargadas === act1Total ? "#166534" : "#92400e" }}>
                {act1Cargadas} de {act1Total}
              </span> evidencias cargadas
            </div>

            {act1Cargadas === act1Total ? (
              <button
                className="btn btn-sm"
                style={{ width: "100%", justifyContent: "center", background: "#dcfce7", color: "#166534", border: "1.5px solid #86efac", fontWeight: 700 }}
                onClick={() => onSelectActividad?.("act-1")}
              >
                {Ico.check} EVIDENCIAS COMPLETAS (VER)
              </button>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => onSelectActividad?.("act-1")}
              >
                {Ico.upload} CARGAR EVIDENCIA
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Row: Notificaciones + Grupos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20 }}>
        {/* BLOQUE 4 — Notificaciones */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Notificaciones importantes</h3>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#fee2e2", color: "#991b1b", padding: "2px 8px", borderRadius: 99 }}>3 nuevas</span>
          </div>
          <div style={{ padding: "4px 0" }}>
            {notificaciones.map((n, i) => {
              const c = notiColors[n.tipo];
              return (
                <div key={i} style={{
                  padding: "13px 20px", display: "flex", alignItems: "flex-start", gap: 12,
                  borderBottom: i < notificaciones.length - 1 ? "1px solid #f8fafc" : "none",
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: c.bg, display: "flex", alignItems: "center", justifyContent: "center",
                    color: c.color,
                  }}>{n.icono}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 2 }}>{n.texto}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>{n.detalle}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>{n.hora}</span>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#1a4f8a", fontWeight: 500, padding: 0 }}>
                        Ver detalle →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BLOQUE 5 — Mis grupos */}
        <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#64748b" }}>{Ico.users}</span>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Mis grupos institucionales</h3>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {[
                { nombre: "Unidad de Titulación", rol: "Miembro" },
                { nombre: "Comisión de Eventos Académicos", rol: "Miembro" },
              ].map((g, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 8,
                  background: "#f8fafc", border: "1.5px solid #e2e8f0",
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 3 }}>{g.nombre}</div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>Rol: <span style={{ color: "#475569", fontWeight: 500 }}>{g.rol}</span></div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: "100%", justifyContent: "center" }}>
              {Ico.users} VER MIS GRUPOS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#94a3b8" }}>
      <Settings aria-hidden="true" style={{width:40,height:40,marginBottom:12}} />
      <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13 }}>Este módulo se desarrollará en la siguiente iteración.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULO 2 — PLANES DE TRABAJO (DOCENTE)
// ═══════════════════════════════════════════════════════════════════════════════

type PlanesSubView = "list" | "step1" | "step2" | "step3edit" | "step3review" | "step4" | "step5" | "step6" | "step7" | "step8" | "wizardInforme";

// ─── Catalog data ─────────────────────────────────────────────────────────────

const ACTIVIDADES_CATALOGO = [
  { id: 1, nombre: "Seguimiento al avance de trabajos de titulación", categoria: "POA", tipo: "obligatoria" as const, descripcion: "Monitoreo y acompañamiento a los estudiantes durante el proceso de titulación." },
  { id: 2, nombre: "Difusión de normativa interna de titulación", categoria: "Plan de Mejoras", tipo: "obligatoria" as const, descripcion: "Socialización del reglamento y procedimientos de titulación vigentes." },
  { id: 3, nombre: "Consolidación del banco de reactivos", categoria: "POA", tipo: "opcional" as const, descripcion: "Actualización y organización del banco de preguntas para evaluaciones." },
  { id: 4, nombre: "Jornada informativa para estudiantes", categoria: "Plan de Mejoras", tipo: "opcional" as const, descripcion: "Sesión de orientación sobre procesos académicos y reglamentos." },
  { id: 5, nombre: "Seguimiento de procesos de graduación", categoria: "Acción de Mejora", tipo: "opcional" as const, descripcion: "Revisión del estado de los trámites de graduación por cohorte." },
];

interface ActividadMatriz {
  id: number;
  nombre: string;
  categoria: string;
  activityType?: "POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra";
  tipo: "obligatoria" | "opcional" | "otra";
  descripcion: string;
  desde: string;
  hasta: string;
  responsables: string[];
  responsableIds?: string[];
  responsableNames?: string[];
  responsablesEtiqueta?: string;
  recursos: string[];
  medios: string[];
}

type ActivityType = NonNullable<ActividadMatriz["activityType"]>;
const ACTIVITY_TYPES: ActivityType[] = ["POA", "Plan de Mejoras", "Acción de Mejora", "Otra"];
function getActivityType(activity: unknown): ActivityType {
  const value = activity && typeof activity === "object" ? activity as { activityType?: unknown; categoria?: unknown } : {};
  return ACTIVITY_TYPES.includes(value.activityType as ActivityType)
    ? value.activityType as ActivityType
    : ACTIVITY_TYPES.includes(value.categoria as ActivityType) ? value.categoria as ActivityType : "Otra";
}

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = [
  "Información general",
  "Contenido",
  "Actividades",
  "Anexos",
  "Previsualización",
  "Firma y Finalización",
];

function Stepper({ current, maxReached }: { current: number; maxReached: number }) {
  return (
    <div style={{
      background: "#fff", borderBottom: "1px solid #e2e8f0",
      padding: "0 28px", overflowX: "auto",
    }}>
      <div style={{ display: "flex", alignItems: "stretch", minWidth: "max-content" }}>
        {STEPS.map((label, i) => {
          const step = i + 1;
          const done = step < current;
          const active = step === current;
          const locked = step > maxReached;
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 0,
            }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 20px 12px",
                borderBottom: `2.5px solid ${active ? "#1a4f8a" : "transparent"}`,
                opacity: locked ? 0.4 : 1,
              }}>
                {/* Circle */}
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  background: done ? "#1a4f8a" : active ? "#1a4f8a" : "#e2e8f0",
                  color: done || active ? "#fff" : "#94a3b8",
                  border: active ? "none" : done ? "none" : "1.5px solid #d1d9e0",
                }}>
                  {done ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : step}
                </div>
                <span style={{
                  fontSize: 12.5, fontWeight: active ? 700 : 500,
                  color: active ? "#1a4f8a" : done ? "#334155" : "#94a3b8",
                  whiteSpace: "nowrap",
                }}>
                  {label}
                  {locked && (
                    <svg style={{ marginLeft: 5, verticalAlign: "middle" }} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  )}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ width: 1, height: 20, background: "#e2e8f0", flexShrink: 0, alignSelf: "center" }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Save Indicator ───────────────────────────────────────────────────────────

function SaveIndicator({ saving }: { saving: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: saving ? "#6b7a8d" : "#16a34a" }}>
      {saving ? (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 1s linear infinite" }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          Guardando...
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Cambios guardados
        </>
      )}
    </div>
  );
}

// ─── Form Footer ──────────────────────────────────────────────────────────────

function FormFooter({
  onPrev, onNext, onSave, prevLabel = "← Anterior", nextLabel = "Continuar →",
  canContinue = true, saving = false,
}: {
  onPrev?: () => void; onNext: () => void; onSave?: () => void;
  prevLabel?: string; nextLabel?: string; canContinue?: boolean; saving?: boolean;
}) {
  return (
    <div style={{
      background: "#fff", borderTop: "1px solid #e2e8f0",
      padding: "14px 28px", display: "flex", alignItems: "center",
      justifyContent: "space-between", flexShrink: 0,
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {onPrev && (
          <button className="btn btn-ghost" onClick={onPrev}>{prevLabel}</button>
        )}
        <SaveIndicator saving={saving} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {onSave && (
          <button className="btn btn-ghost" onClick={onSave}>
            Guardar borrador
          </button>
        )}
        <button className="btn btn-primary" onClick={onNext} disabled={!canContinue}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Exit Modal ───────────────────────────────────────────────────────────────

function ExitModal({ onKeep, onSaveAndExit }: { onKeep: () => void; onSaveAndExit: () => void }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: 440, maxWidth: "90%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ padding: "20px 22px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e2a3a" }}>¿Desea salir del Plan de Trabajo?</div>
        </div>
        <div style={{ padding: "18px 22px" }}>
          <p style={{ fontSize: 13.5, color: "#475569", marginBottom: 20 }}>
            Existen cambios sin guardar. Si sale ahora, perderá la información ingresada en este paso.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button className="btn btn-ghost" onClick={onKeep}>Continuar editando</button>
            <button className="btn btn-primary" onClick={onSaveAndExit}>Guardar y salir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 01 — Gestión Documental Académica (List) ───────────────────────────────────────

function PlanesListado({ onNew, onContinuar, planEstado, formalVersion = "1.0", reviewRound = 1, onCorregir, observacionesRevision, mensajeDevolucion, fechaDevolucion, onNavigateActividades, initialShowObsModal }: {
  onNew: () => void;
  onContinuar: () => void;
  planEstado: "borrador" | "en-revision" | "devuelto" | "en-correccion" | "validado";
  formalVersion?: string;
  reviewRound?: number;
  onCorregir?: () => void;
  observacionesRevision?: any[];
  mensajeDevolucion?: string;
  fechaDevolucion?: string;
  onNavigateActividades?: () => void;
  initialShowObsModal?: boolean;
}) {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [showObsModal, setShowObsModal] = useState(initialShowObsModal || false);

  useEffect(() => {
    if (initialShowObsModal) {
      setShowObsModal(true);
    }
  }, [initialShowObsModal]);

  const comisionEstado =
    planEstado === "en-revision" ? "EN REVISIÓN" :
    planEstado === "devuelto" ? "DEVUELTO" :
    planEstado === "validado" ? "VALIDADO" :
    planEstado === "en-correccion" ? "EN CORRECCIÓN" : "BORRADOR";
  const comisionAcciones =
    planEstado === "en-revision" ? ["ver", "ver-estado"] :
    planEstado === "devuelto" ? ["ver-obs", "corregir"] :
    planEstado === "validado" ? ["ver"] :
    planEstado === "en-correccion" ? ["ver-obs", "continuar"] : ["continuar"];
  const comisionActualizado =
    planEstado === "devuelto" || planEstado === "en-correccion"
      ? (fechaDevolucion || new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }).replace(".", ""))
      : planEstado === "en-revision"
        ? new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
        : "04 sep. 2026";

  const TODOS_LOS_PLANES = [
    { nombre: "Plan de Trabajo", grupo: "Unidad de Titulación",           periodo: "Julio – Diciembre 2026", version: "Versión 1.0", estado: "EN EJECUCIÓN",  actualizado: "05 sep. 2026",      acciones: ["ver", "actividades"] },
    { nombre: "Plan de Trabajo", grupo: "Comisión de Eventos Académicos", periodo: "Julio – Diciembre 2026", version: `Versión ${formalVersion} (Ronda ${reviewRound})`, estado: comisionEstado,   actualizado: comisionActualizado, acciones: comisionAcciones },
    { nombre: "Plan de Trabajo", grupo: "Club Académico de Software",     periodo: "Enero – Junio 2026",    version: "Versión 1.0", estado: "ARCHIVADO",      actualizado: "30 jun. 2026",      acciones: ["ver"] },
  ];

  function handleNew() {
    if (planEstado === "en-revision" || planEstado === "devuelto" || planEstado === "en-correccion") {
      setShowDuplicateAlert(true);
    } else {
      onNew();
    }
  }

  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroEstado,  setFiltroEstado]  = useState("Todos");
  const [filtroGrupo,  setFiltroGrupo]   = useState("Todos");
  const [busqueda,     setBusqueda]       = useState("");

  const planes = TODOS_LOS_PLANES.filter(p => {
    if (filtroPeriodo !== "Todos los períodos" && p.periodo !== filtroPeriodo) return false;
    if (filtroEstado  !== "Todos"              && p.estado   !== filtroEstado)  return false;
    if (filtroGrupo   !== "Todos"              && p.grupo    !== filtroGrupo)   return false;
    if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase()) &&
        !p.grupo.toLowerCase().includes(busqueda.toLowerCase())) return false;
    return true;
  });

  const estadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "BORRADOR":      { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "EN REVISIÓN":   { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "DEVUELTO":      { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    "EN CORRECCIÓN": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "APROBADO":      { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "VALIDADO":      { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "EN EJECUCIÓN":  { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "ARCHIVADO":     { bg: "#f1f5f9", color: "#334155", dot: "#64748b" },
  };

  const listaObs = (observacionesRevision && observacionesRevision.length > 0)
    ? observacionesRevision
    : [
        { id: 1, pagina: 3, tipo: "seccion" as const, seccion: "Matriz de actividades", texto: "Ajustar el cronograma y recursos en la sección de ponencias magistrales.", autor: "Ing. Carlos López, Mg.", fecha: "07/09/2026 — 10:25" },
        { id: 2, pagina: 3, tipo: "general" as const, seccion: "", texto: "Por favor, especifique medios de verificación y cronograma definitivo antes de reenviar.", autor: "Ing. Carlos López, Mg.", fecha: "07/09/2026 — 10:30" },
      ];

  return (
    <div style={{ padding: "28px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
            Gestión Documental Académica
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7a8d" }}>
            Consulte, continúe o revise los Planes de Trabajo asociados a sus grupos institucionales.
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleNew} style={{ flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          NUEVO PLAN DE TRABAJO
        </button>
      </div>

      {/* Modal: Ver observaciones de devolución */}
      {showObsModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 540, maxHeight: "80vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Observaciones del revisor</h2>
              <button onClick={() => setShowObsModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>✕</button>
            </div>
            <div style={{ margin: "14px 24px 0", padding: "10px 14px", background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e", border: "1px solid #fde68a" }}>
              <b>Mensaje del revisor:</b> {mensajeDevolucion || "Por favor, revise las observaciones registradas y realice las correcciones correspondientes antes de reenviar el documento."}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {listaObs.map((o: any) => (
                <div key={o.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: o.tipo === "general" ? "#475569" : "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>
                    {o.pagina ? `PÁGINA ${o.pagina} · ` : ""}{o.tipo === "general" ? "General" : (o.seccion || "Sección")}
                  </div>
                  <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.55, marginBottom: 4 }}>"{o.texto}"</p>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.autor || o.revisor} — {o.fecha}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setShowObsModal(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {showDuplicateAlert && (
        <div style={{ marginBottom: 16, background: "#fef3c7", border: "1px solid #f59e0b", borderRadius: 10, padding: "16px 18px", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#92400e", marginBottom: 4 }}>Ya existe un Plan de Trabajo para este grupo y período.</div>
            <div style={{ fontSize: 12.5, color: "#92400e" }}>El Plan de la Comisión de Eventos Académicos — Julio – Diciembre 2026 está actualmente EN REVISIÓN. No es posible crear una nueva versión hasta que el proceso de aprobación concluya.</div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button className="btn btn-ghost btn-sm" style={{ background: "#fff", border: "1px solid #f59e0b", color: "#92400e" }}>VER PLAN</button>
              <button className="btn btn-ghost btn-xs" onClick={() => setShowDuplicateAlert(false)} style={{ color: "#92400e" }}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{
        background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0",
        padding: "14px 18px", marginBottom: 16,
        display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 10, flex: 1, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Período:</span>
            <select className="form-select" style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}>
              <option>Julio – Diciembre 2026</option>
              <option>Enero – Junio 2026</option>
              <option>Todos los períodos</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Estado:</span>
            <select className="form-select" style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
              <option>Todos</option>
              <option>BORRADOR</option>
              <option>EN REVISIÓN</option>
              <option>APROBADO</option>
              <option>EN EJECUCIÓN</option>
              <option>ARCHIVADO</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo:</span>
            <select className="form-select" style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
              value={filtroGrupo} onChange={e => setFiltroGrupo(e.target.value)}>
              <option>Todos</option>
              <option>Unidad de Titulación</option>
              <option>Comisión de Eventos Académicos</option>
              <option>Club Académico de Software</option>
            </select>
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="form-input" placeholder="Buscar plan..." style={{ paddingLeft: 30, width: 200, fontSize: 13 }}
            value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Grupo institucional</th>
              <th>Período</th>
              <th>Versión</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {planes.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "#94a3b8", fontSize: 13 }}>
                  No se encontraron planes con los filtros seleccionados.
                </td>
              </tr>
            ) : planes.map((p, i) => {
              const es = estadoStyle[p.estado] ?? estadoStyle["ARCHIVADO"];
              return (
                <tr key={i}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1e2a3a" }}>{p.nombre}</div>
                    <div style={{ fontSize: 11.5, color: "#94a3b8" }}>Elaborador: Ing. Andrea Pérez, Mg.</div>
                  </td>
                  <td style={{ fontSize: 13, color: "#334155" }}>{p.grupo}</td>
                  <td style={{ fontSize: 13, color: "#475569" }}>{p.periodo}</td>
                  <td style={{ fontSize: 12.5, color: "#475569" }}>{p.version}</td>
                  <td>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 5,
                      padding: "3px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                      background: es.bg, color: es.color,
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: es.dot, display: "inline-block" }} />
                      {p.estado}
                    </span>
                  </td>
                  <td style={{ fontSize: 12.5, color: "#64748b" }}>{p.actualizado}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.acciones.includes("ver") && (
                        <TableActionButton title="Ver documento" icon={Eye} />
                      )}
                      {p.acciones.includes("actividades") && (
                        <TableActionButton title="Ver actividades" icon={ClipboardList} onClick={onNavigateActividades} />
                      )}
                      {p.acciones.includes("ver-estado") && (
                        <TableActionButton title="Ver estado" icon={Info} />
                      )}
                      {p.acciones.includes("continuar") && (
                        <TableActionButton title="Continuar elaboración" icon={FilePenLine} variant="constructive" onClick={onContinuar} />
                      )}
                      {p.acciones.includes("ver-obs") && (
                        <TableActionButton title="Ver observaciones" icon={MessageSquare} onClick={() => setShowObsModal(true)} />
                      )}
                      {p.acciones.includes("corregir") && (
                        <TableActionButton title="Continuar corrección" icon={RotateCcw} variant="constructive" onClick={onCorregir} />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div style={{ padding: "12px 18px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
          {planes.length} {planes.length === 1 ? "plan encontrado" : "planes encontrados"}
          {filtroPeriodo === "Julio – Diciembre 2026" && (
            <span style={{ marginLeft: 8, color: "#bfdbfe" }}>· Período activo</span>
          )}
        </div>
      </div>

      {/* Info box */}
      <div style={{ marginTop: 16, padding: "11px 14px", borderRadius: 8, background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", gap: 8, alignItems: "flex-start" }}>
        <svg style={{ color: "#64748b", flexShrink: 0, marginTop: 1 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <p style={{ fontSize: 12.5, color: "#6b7a8d" }}>
          Un docente puede tener más de un Plan de Trabajo si pertenece a distintos grupos institucionales.
          Cada plan es independiente y tiene su propio flujo de aprobación.
        </p>
      </div>
    </div>
  );
}

// ─── 02 — Información General ─────────────────────────────────────────────────

function Step1InfoGeneral({ onNext, onCancel, maxReached = 3, grupo, periodo, unitType, institutionalUnitId, careerId, onChange, grupos, periodos, unidades, elaborador, error, onSave }: { onNext: () => void; onCancel: () => void; maxReached?: number; grupo: string; periodo: string; unitType: TipoUnidadInstitucional; institutionalUnitId: string; careerId: string; onChange: (v: Partial<PlanDraft>) => void; grupos: GrupoInstitucional[]; periodos: PeriodoAcademico[]; unidades: UnidadInstitucional[]; elaborador: string; error: string; onSave: () => void }) {
  const setGrupo = (grupo: string) => onChange({grupo});
  const setPeriodo = (periodo: string) => onChange({periodo});
  const [saving] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const selectedUnit = unidades.find(u => u.id === institutionalUnitId && u.tipo === unitType);
  const canContinue = grupos.some(g => g.nombre === grupo) && periodos.some(p => p.nombre === periodo) && Boolean(selectedUnit) && (unitType === "ADMINISTRATIVE" || Boolean(selectedUnit?.carreras.some(c => c.id === careerId && c.estado === "ACTIVO")));
  const [showMembers,setShowMembers] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={1} maxReached={maxReached} />

      {/* Page header */}
      <div style={{ padding: "20px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
            Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>
            Crear Plan de Trabajo
          </h1>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, maxWidth: 1100 }}>
          {/* Main form card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Tipo documento */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Información del plan</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label className="form-label">Tipo de documento</label>
                  <input className="form-input" value="Plan de Trabajo" disabled style={{ background: "#f8fafc", color: "#475569" }} />
                </div>
                <div>
                  <label className="form-label">Período académico</label>
                  <input className="form-input" value={periodo} disabled style={{ background: "#f8fafc", color: "#475569" }} />
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Procedencia institucional</h3>
              <div style={{ display: "grid", gridTemplateColumns: unitType === "ACADEMIC" ? "1fr 1.4fr 1.2fr" : "1fr 2fr", gap: 14 }}>
                <div><label className="form-label">Tipo de unidad</label><input className="form-input" data-testid="institutional-unit-type" value={unitType === "ACADEMIC" ? "Unidad académica" : "Unidad administrativa"} disabled style={{ background: "#f8fafc", color: "#475569" }} /></div>
                <div><label className="form-label">Facultad</label><input className="form-input" data-testid="institutional-unit-select" value={selectedUnit?.nombre || ""} disabled style={{ background: "#f8fafc", color: "#475569" }} /></div>
                {unitType === "ACADEMIC" && <div><label className="form-label">Carrera</label><input className="form-input" data-testid="career-select" value={selectedUnit?.carreras.find(c => c.id === careerId)?.nombre || ""} disabled style={{ background: "#f8fafc", color: "#475569" }} /></div>}
              </div>
            </div>

            {/* Grupo */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Grupo institucional</h3>
              <div>
                <label className="form-label required">Seleccione su grupo institucional</label>
                <select className="form-select" value={grupo} onChange={e => setGrupo(e.target.value)} style={{ marginBottom: 12 }}>
                  <option value="">— Seleccione —</option>
                  {grupos.filter(g => g.estado === "ACTIVO").map(g => <option key={g.id}>{g.nombre}</option>)}
                </select>

                {grupo && (
                  <div style={{
                    background: "#f0f6ff", border: "1.5px solid #bfdbfe",
                    borderRadius: 8, padding: "14px 16px",
                    display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
                  }}>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Grupo</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>{grupo}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Tipo</div>
                      <div style={{ fontSize: 13.5, color: "#334155" }}>{grupos.find(g => g.nombre === grupo)?.tipo}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Rol del docente</div>
                      <div style={{ fontSize: 13.5, color: "#334155" }}>Miembro</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Miembros</div>
                      <div style={{ fontSize: 13.5, color: "#334155" }}>{grupos.find(g => g.nombre === grupo)?.miembros.length || 0} integrantes</div>
                    </div>
                    <div>
                      <button onClick={() => setShowMembers(v => !v)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "#1a4f8a", fontWeight: 500, padding: 0 }}>
                        Ver integrantes →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {showMembers && <div className="alert alert-info">{grupos.find(g => g.nombre === grupo)?.miembros.map(m => <p key={m.usuarioId}>{m.nombreCompleto} — {m.rolEnGrupo}</p>)}</div>}
            {error && <p role="alert" className="alert alert-error">{error}</p>}
            {/* Plantilla */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Plantilla del documento</h3>
              <div>
                <label className="form-label">Plantilla</label>
                <input className="form-input" value="Plan de Trabajo institucional" disabled style={{ background: "#f8fafc", color: "#475569" }} />
                <div className="form-hint">Las secciones y estructura del documento serán cargadas automáticamente según la plantilla vigente.</div>
              </div>
            </div>
          </div>

          {/* Right summary card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Resumen del plan</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { label: "Docente elaborador", val: elaborador },
                  { label: "Período", val: periodo || "—" },
                  { label: "Grupo", val: grupo || "—" },
                  { label: "Versión", val: "Versión 1.0" },
                  { label: "Estado inicial", val: "BORRADOR" },
                ].map((row, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", gap: 2, paddingBottom: 10, borderBottom: i < 4 ? "1px solid #f1f5f9" : "none" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</div>
                    <div style={{ fontSize: 13.5, color: "#1e2a3a", fontWeight: row.label === "Estado inicial" ? 700 : 500 }}>
                      {row.label === "Estado inicial" ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f1f5f9", color: "#475569", padding: "2px 9px", borderRadius: 99, fontSize: 11.5, fontWeight: 700 }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#94a3b8", display: "inline-block" }} />
                          {row.val}
                        </span>
                      ) : row.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      <FormFooter
        onNext={onNext}
        onSave={onSave}
        prevLabel="Cancelar"
        onPrev={() => setShowExit(true)}
        canContinue={canContinue}
        saving={saving}
        nextLabel="Continuar →"
      />

      {showExit && <ExitModal onKeep={() => setShowExit(false)} onSaveAndExit={onCancel} />}
    </div>
  );
}

// ─── 03 — Selección de Actividades ───────────────────────────────────────────

function Step2Actividades({ onPrev, onNext, maxReached = 3, matriz, onChange, catalogo, grupoNombre, periodoNombre }: { onPrev: () => void; onNext: () => void; maxReached?: number; matriz: ActividadMatriz[]; onChange: (m: ActividadMatriz[]) => void; catalogo: typeof ACTIVIDADES_CATALOGO; grupoNombre: string; periodoNombre: string }) {
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<number[]>(matriz.filter(a => a.tipo === "opcional").map(a => a.id));
  const [showModal, setShowModal] = useState(false);
  const [otrasActs, setOtrasActs] = useState<{ id: number; nombre: string; descripcion: string; categoria?: string }[]>(matriz.filter(a => a.tipo === "otra"));
  const [otraDesc, setOtraDesc] = useState("");
  const [categoria, setCategoria] = useState("");
  const commitSelection = () => onChange([...catalogo.filter(a => a.tipo === "obligatoria" || selected.includes(a.id)), ...otrasActs.map(a => ({...a, tipo: "otra" as const, categoria: a.categoria || "Actividad"}))].map(a => matriz.find(m => m.id === a.id && m.nombre === a.nombre) || {...a, desde: "", hasta: "", responsables: [], recursos: [], medios: []}));
  const [saving] = useState(false);

  const obligatorias = catalogo.filter(a => a.tipo === "obligatoria");
  const opcionales = catalogo.filter(a => a.tipo === "opcional").filter(a =>
    filter === "Todas" || a.categoria === filter
  );

  const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const totalSelected = obligatorias.length + selected.length + otrasActs.length;
  const filters = ["Todas", "POA", "Plan de Mejoras", "Acción de Mejora", "Otras"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={3} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Seleccionar actividades</h1>
          <p style={{ fontSize: 13, color: "#6b7a8d", marginTop: 3 }}>
            Seleccione las actividades que formarán parte de su Plan de Trabajo. Las actividades obligatorias ya se encuentran incluidas.
          </p>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, color: "#475569" }}>
          <div><strong>Grupo:</strong> {grupoNombre}</div>
          <div><strong>Período:</strong> {periodoNombre}</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, maxWidth: 1100 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Filters */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {filters.map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "5px 13px", borderRadius: 99, fontSize: 12.5, fontWeight: 500, cursor: "pointer",
                  background: filter === f ? "#1a4f8a" : "#fff",
                  color: filter === f ? "#fff" : "#475569",
                  border: `1.5px solid ${filter === f ? "#1a4f8a" : "#d1d9e0"}`,
                  transition: "all 0.15s",
                }}>{f}</button>
              ))}
            </div>

            {/* Obligatorias */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a4f8a" }} />
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Actividades obligatorias</h3>
                <span style={{ fontSize: 12, color: "#6b7a8d" }}>Estas actividades han sido definidas para el grupo y no pueden eliminarse.</span>
              </div>
              {obligatorias.map(a => (
                <div key={a.id} style={{
                  padding: "13px 18px", borderBottom: "1px solid #f8fafc",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: "#fafcff",
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, background: "#1a4f8a",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 3 }}>{a.nombre}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{a.descripcion}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 99 }}>{a.categoria}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#f0fdf4", color: "#166534", padding: "2px 8px", borderRadius: 99, display: "flex", alignItems: "center", gap: 4 }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        OBLIGATORIA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Opcionales */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#94a3b8" }} />
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Actividades opcionales</h3>
                <span style={{ fontSize: 12, color: "#6b7a8d" }}>Seleccione las actividades que desea incluir.</span>
              </div>
              {opcionales.map(a => (
                <div key={a.id} style={{
                  padding: "13px 18px", borderBottom: "1px solid #f8fafc",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: selected.includes(a.id) ? "#fafcff" : "#fff",
                  cursor: "pointer",
                }} onClick={() => toggle(a.id)}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 4, marginTop: 1, flexShrink: 0,
                    border: `1.5px solid ${selected.includes(a.id) ? "#1a4f8a" : "#d1d9e0"}`,
                    background: selected.includes(a.id) ? "#1a4f8a" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s",
                  }}>
                    {selected.includes(a.id) && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 3 }}>{a.nombre}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>{a.descripcion}</div>
                    <div style={{ marginTop: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 99 }}>{a.categoria}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Otras actividades added */}
            {otrasActs.length > 0 && (
              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9" }}>
                  <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Actividades seleccionadas — Otras</h3>
                </div>
                {otrasActs.map(a => (
                  <div key={a.id} style={{ padding: "13px 18px", borderBottom: "1px solid #f8fafc", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a", marginBottom: 4 }}>{a.nombre}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 99 }}>OTRA</span>
                        <span style={{ fontSize: 11.5, color: "#94a3b8" }}>Actividad personalizada</span>
                      </div>
                    </div>
                    <button onClick={() => setOtrasActs(s => s.filter(x => x.id !== a.id))} style={{
                      background: "none", border: "none", cursor: "pointer", color: "#dc2626",
                      fontSize: 12, padding: "3px 6px", borderRadius: 4, flexShrink: 0,
                    }}>Eliminar</button>
                  </div>
                ))}
              </div>
            )}

            {/* Add otra */}
            <button className="btn btn-ghost" style={{ alignSelf: "flex-start" }} onClick={() => setShowModal(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              AGREGAR OTRA ACTIVIDAD
            </button>
          </div>

          {/* Summary panel */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px", alignSelf: "start", position: "sticky", top: 0 }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Resumen de selección</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Obligatorias", val: obligatorias.length, color: "#1a4f8a", bg: "#dbeafe" },
                { label: "Opcionales seleccionadas", val: selected.length, color: "#475569", bg: "#f1f5f9" },
                { label: "Actividades adicionales", val: otrasActs.length, color: "#475569", bg: "#f1f5f9" },
              ].map((s, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  paddingBottom: 10, borderBottom: i < 2 ? "1px solid #f1f5f9" : "none",
                }}>
                  <span style={{ fontSize: 13, color: "#475569" }}>{s.label}</span>
                  <span style={{
                    fontSize: 13, fontWeight: 700, background: s.bg, color: s.color,
                    borderRadius: 99, padding: "2px 10px",
                  }}>{s.val}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 4, borderTop: "1.5px solid #e2e8f0" }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#1a4f8a", fontFamily: "'DM Sans',sans-serif" }}>{totalSelected}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "#94a3b8", textAlign: "center" }}>actividades</div>
            </div>
          </div>
        </div>
      </div>

      <FormFooter onPrev={() => { commitSelection(); onPrev(); }} onNext={() => { commitSelection(); onNext(); }} onSave={commitSelection} saving={saving} canContinue={totalSelected > 0} />

      {/* Modal */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 480, maxWidth: "90%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1e2a3a" }}>Agregar otra actividad</h3>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18 }}>×</button>
            </div>
            <div style={{ padding: "20px 22px" }}>
              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Nombre de actividad</label>
                <textarea className="form-textarea" value={otraDesc} onChange={e => setOtraDesc(e.target.value)}
                  placeholder="Describa la actividad que desea incorporar al Plan de Trabajo." />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Categoría</label>
                <input className="form-input" value={categoria} onChange={e => setCategoria(e.target.value)} placeholder="Actividad (categoría opcional)" style={{ background: "#f8fafc", color: "#475569" }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={!otraDesc.trim()} onClick={() => {
                  if (!otraDesc.trim()) return;
                  setOtrasActs(s => [...s, { id: Date.now(), nombre: otraDesc.trim(), descripcion: "", categoria: categoria.trim() || "Actividad" }]);
                  setOtraDesc("");
                  setShowModal(false);
                }}>Agregar actividad</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── 04 — Matriz de Actividades ───────────────────────────────────────────────

const MATRIZ_INICIAL: ActividadMatriz[] = [
  {
    id: 1, nombre: "Seguimiento al avance de trabajos de titulación", categoria: "POA", tipo: "obligatoria", descripcion: "",
    desde: "2026-09-02", hasta: "2026-09-18",
    responsables: ["Ing. Andrea Pérez, Mg.", "Ing. Carlos López, Mg."],
    recursos: ["Matriz de seguimiento", "Almacenamiento institucional"],
    medios: ["Informe", "Acta"],
  },
  {
    id: 2, nombre: "Difusión de normativa interna de titulación", categoria: "Plan de Mejoras", tipo: "obligatoria", descripcion: "",
    desde: "", hasta: "", responsables: [], recursos: [], medios: [],
  },
  {
    id: 3, nombre: "Consolidación del banco de reactivos", categoria: "POA", tipo: "opcional", descripcion: "",
    desde: "2026-10-01", hasta: "2026-10-10",
    responsables: ["Ing. Andrea Pérez, Mg."],
    recursos: ["Sistema de gestión académica"],
    medios: ["Informe"],
  },
  {
    id: 4, nombre: "Jornada informativa para estudiantes", categoria: "Plan de Mejoras", tipo: "opcional", descripcion: "",
    desde: "", hasta: "", responsables: [], recursos: [], medios: [],
  },
  {
    id: 5, nombre: "Taller de socialización: proceso de graduación", categoria: "Otra", tipo: "otra", descripcion: "",
    desde: "2026-11-05", hasta: "2026-11-05",
    responsables: ["Ing. Andrea Pérez, Mg.", "Dr. Luis Almeida"],
    recursos: ["Sala de reuniones"],
    medios: ["Acta"],
  },
];

function isCompleta(a: ActividadMatriz) {
  return (
    Boolean(a.nombre.trim()) &&
    Boolean(a.desde) &&
    Boolean(a.hasta) &&
    a.desde <= a.hasta &&
    a.responsables.length > 0 &&
    a.recursos.length > 0 &&
    a.recursos.every(v => v.trim().length > 0) &&
    a.medios.length > 0 &&
    a.medios.every(v => v.trim().length > 0)
  );
}

function Step3Matriz({
  onPrev, onNext, maxReached = 3,
  matriz, setMatriz, saving, onSave, initialEditId = null, responsablesGrupo, responsablesGrupoIds, groupType, recursosCatalogo, mediosCatalogo, periodo, feriados,
}: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  matriz: ActividadMatriz[]; setMatriz: (m: ActividadMatriz[]) => void;
  saving: boolean; onSave: (m: ActividadMatriz[]) => void;
  initialEditId?: number | null;
  responsablesGrupo: string[]; responsablesGrupoIds: string[]; groupType?: string; recursosCatalogo: string[]; mediosCatalogo: string[]; periodo?: PeriodoAcademico; feriados: FeriadoItem[];
}) {
  const [editId, setEditId] = useState<number | null>(initialEditId);
  const [dateError, setDateError] = useState("");
  const [recursoOtroError, setRecursoOtroError] = useState("");
  const [medioOtroError, setMedioOtroError] = useState("");
  const [recursoSearch, setRecursoSearch] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});
  const recursoOtroInputRef = useRef<HTMLInputElement>(null);
  const medioOtroInputRef = useRef<HTMLInputElement>(null);
  const responsibleSelection = (names: string[]) => {
    const responsableNames = [...new Set(names)];
    const responsableIds = responsablesGrupo.flatMap((name, index) => responsableNames.includes(name) && responsablesGrupoIds[index] ? [responsablesGrupoIds[index]] : []);
    return {responsables:responsableNames,responsableNames,responsableIds};
  };

  function handleOpenEdit(id: number | null) {
    setEditId(id);
    setRecursoSearch("");
    setDateError("");
    setRecursoOtroError("");
    setMedioOtroError("");
  }

  function handleAgregarActividad() {
    const id = Math.max(0, ...matriz.map(activity => activity.id)) + 1;
    setMatriz([...matriz, { id, nombre: "", categoria: "POA", activityType: "POA", tipo: "otra", descripcion: "", desde: "", hasta: "", responsables: [], recursos: [], medios: [] }]);
    handleOpenEdit(id);
  }

  // Auto-open & highlight when arriving via "Completar pendientes"
  useEffect(() => {
    if (initialEditId != null) {
      setHighlightId(initialEditId);
      setTimeout(() => {
        rowRefs.current[initialEditId]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightId(null), 1400);
      }, 80);
    }
  }, []); // eslint-disable-line

  const editAct = editId !== null ? matriz.find(a => a.id === editId) ?? null : null;
  const incompletas = matriz.filter(a => !isCompleta(a) || !!validateDates(a.desde, a.hasta));
  const completas = matriz.length - incompletas.length;
  const canContinue = matriz.length > 0 && incompletas.length === 0;

  function updateAct(updated: ActividadMatriz) {
    const next = matriz.map(a => a.id === updated.id ? updated : a);
    setMatriz(next);
  }

  function validateDates(desde: string, hasta: string) {
    if (!desde || !hasta) return "";
    if (desde > hasta) return "La fecha Desde no puede ser posterior a la fecha Hasta.";
    const min = periodo?.desde || "2026-07-01", max = periodo?.hasta || "2026-12-31";
    if (desde < min || hasta > max) return "La fecha seleccionada se encuentra fuera del período académico.";
    if (feriados.some(f => f.estado === "ACTIVO" && (f.fecha === desde || f.fecha === hasta))) return "La fecha coincide con un feriado o receso institucional.";
    return "";
  }

  function validateOtroFields(): boolean {
    if (!editAct) return false;
    let valid = true;
    let firstInvalidRef: React.RefObject<HTMLInputElement | null> | null = null;

    const recursoOtroSelected = editAct.recursos.some(v => !recursosCatalogo.includes(v));
    const recursoOtroVal = editAct.recursos.filter(v => !recursosCatalogo.includes(v)).join("; ").trim();
    if (recursoOtroSelected && !recursoOtroVal) {
      setRecursoOtroError("Especifique el recurso personalizado o desmarque ‘Otro’.");
      valid = false;
      if (!firstInvalidRef) firstInvalidRef = recursoOtroInputRef;
    } else {
      setRecursoOtroError("");
    }

    const medioOtroSelected = editAct.medios.some(v => !mediosCatalogo.includes(v));
    const medioOtroVal = editAct.medios.filter(v => !mediosCatalogo.includes(v)).join("; ").trim();
    if (medioOtroSelected && !medioOtroVal) {
      setMedioOtroError("Especifique el medio personalizado o desmarque ‘Otro’.");
      valid = false;
      if (!firstInvalidRef) firstInvalidRef = medioOtroInputRef;
    } else {
      setMedioOtroError("");
    }

    if (!valid) {
      setTimeout(() => {
        firstInvalidRef?.current?.focus();
      }, 50);
      return false;
    }

    return true;
  }

  function handleGuardarActividad() {
    if (!validateOtroFields()) return;
    const error = editAct ? validateDates(editAct.desde, editAct.hasta) : "";
    if (error) { setDateError(error); return; }
    onSave(matriz);
    handleOpenEdit(null);
  }

  function handleGuardarYSiguiente() {
    if (!validateOtroFields()) return;
    const error = editAct ? validateDates(editAct.desde, editAct.hasta) : "";
    if (error) { setDateError(error); return; }
    onSave(matriz);
    guardarYSiguiente();
  }

  function abrirPrimeroIncompleto() {
    const primero = matriz.find(a => !isCompleta(a));
    if (!primero) return;
    handleOpenEdit(primero.id);
    setHighlightId(primero.id);
    setTimeout(() => {
      rowRefs.current[primero.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightId(null), 1400);
    }, 50);
  }

  function guardarYSiguiente() {
    // After saving current, find next incomplete (excluding current)
    const siguienteIncompleta = matriz.find(a => a.id !== editId && !isCompleta(a));
    handleOpenEdit(null);
    if (siguienteIncompleta) {
      setTimeout(() => {
        handleOpenEdit(siguienteIncompleta.id);
        setHighlightId(siguienteIncompleta.id);
        rowRefs.current[siguienteIncompleta.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightId(null), 1400);
      }, 120);
    }
  }

  // After saving current activity, check if any remaining (excluding current) are incomplete
  const editActIsNowComplete = editAct ? isCompleta(editAct) && !validateDates(editAct.desde, editAct.hasta) : false;
  const otrasIncompletas = editId ? matriz.filter(a => a.id !== editId && !isCompleta(a)) : incompletas;
  const haySiguienteIncompleta = editActIsNowComplete && otrasIncompletas.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <Stepper current={3} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Actividades</h1>
            <p style={{ fontSize: 13, color: "#6b7a8d", marginTop: 3 }}>
              Registre cada actividad con sus fechas, responsables, recursos y medios de verificación.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="btn btn-primary btn-sm" onClick={handleAgregarActividad}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Agregar actividad
            </button>
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
              background: canContinue ? "#dcfce7" : "#fef3c7",
              color: canContinue ? "#166534" : "#92400e",
            }}>
              {completas} / {matriz.length} configuradas
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
        {/* Full-width table — not compressed by drawer */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table className="data-table" style={{ tableLayout: "fixed", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Actividad</th>
                <th style={{ width: "10%" }}>Desde</th>
                <th style={{ width: "10%" }}>Hasta</th>
                <th style={{ width: "10%", paddingLeft: 14 }}>Responsables</th>
                <th style={{ width: "10%", paddingLeft: 14 }}>Recursos</th>
                <th style={{ width: "14%" }}>Medios</th>
                <th style={{ width: "11%" }}>Estado</th>
                <th style={{ width: "7%" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {matriz.map(a => {
                const completa = isCompleta(a);
                const active = editId === a.id;
                const highlighted = highlightId === a.id;
                const recursosValidos = a.recursos.filter(r => r.trim().length > 0);
                const mediosValidos = a.medios.filter(m => m.trim().length > 0);
                return (
                  <tr
                    key={a.id}
                    ref={el => { rowRefs.current[a.id] = el; }}
                    onClick={() => { if (!completa) { handleOpenEdit(a.id); } }}
                    style={{
                      background: highlighted ? "#fefce8" : active ? "#f0f6ff" : undefined,
                      cursor: !completa ? "pointer" : "default",
                      transition: "background 0.3s",
                      outline: highlighted ? "2px solid #fbbf24" : undefined,
                    }}
                  >
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a", marginBottom: 3, lineHeight: 1.3 }}>{a.nombre}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: 99 }}>{getActivityType(a)}</span>
                        {a.tipo === "obligatoria" && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: "#f0fdf4", color: "#166534", padding: "1px 6px", borderRadius: 99 }}>OBL.</span>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: a.desde ? "#334155" : "#94a3b8" }}>
                      {a.desde ? a.desde.split("-").reverse().join("/") : "—"}
                    </td>
                    <td style={{ fontSize: 12, fontFamily: "'JetBrains Mono',monospace", color: a.hasta ? "#334155" : "#94a3b8" }}>
                      {a.hasta ? a.hasta.split("-").reverse().join("/") : "—"}
                    </td>
                    <td style={{ fontSize: 12.5, color: a.responsables.length ? "#334155" : "#94a3b8", paddingLeft: 14 }}>
                      {a.responsables.length ? getResponsibleDisplayLabel({groupType,selectedResponsibleIds:a.responsableIds || a.responsables,allGroupMemberIds:a.responsableIds ? responsablesGrupoIds : responsablesGrupo,selectedResponsibleNames:a.responsableNames || a.responsables}) : "—"}
                    </td>
                    <td style={{ fontSize: 12.5, color: recursosValidos.length ? "#334155" : "#94a3b8", paddingLeft: 14 }}>
                      {recursosValidos.length ? `${recursosValidos.length} recurso${recursosValidos.length > 1 ? "s" : ""}` : "—"}
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {mediosValidos.length ? mediosValidos.map(m => (
                        <span key={m} style={{ display: "inline-block", fontSize: 10.5, background: "#f1f5f9", color: "#475569", borderRadius: 4, padding: "1px 5px", marginRight: 3, marginBottom: 2 }}>{m}</span>
                      )) : <span style={{ color: "#94a3b8" }}>—</span>}
                    </td>
                    <td>
                      <span
                        title={!completa ? "Falta completar información obligatoria de esta actividad." : undefined}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 4,
                          fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                          background: completa ? "#dcfce7" : "#fef3c7",
                          color: completa ? "#166534" : "#92400e",
                          cursor: !completa ? "help" : "default",
                        }}
                      >
                        {!completa && (
                          <svg
                            aria-label="Falta completar información obligatoria de esta actividad."
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ flexShrink: 0 }}
                          >
                            <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        )}
                        {completa ? "COMPLETA" : "PENDIENTE"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={e => { e.stopPropagation(); handleOpenEdit(editId === a.id ? null : a.id); }}
                        style={{ background: active ? "#1a4f8a" : undefined, color: active ? "#fff" : undefined }}
                      >
                        {completa ? "Editar" : "Completar"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 10, fontSize: 12.5, color: "#64748b" }}>La matriz institucional del T1 se genera automáticamente con estas actividades.</p>

        {!canContinue && (
          <div style={{ marginTop: 14, padding: "11px 16px", background: "#fef3c7", border: "1.5px solid #fde68a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg style={{ color: "#d97706", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span style={{ fontSize: 13, color: "#92400e" }}>
                {incompletas.length} {incompletas.length === 1 ? "actividad está pendiente" : "actividades están pendientes"} de configurar.
              </span>
            </div>
            <button
              className="btn btn-xs"
              style={{ background: "#d97706", color: "#fff", border: "none", fontWeight: 700 }}
              onClick={abrirPrimeroIncompleto}
            >
              COMPLETAR PENDIENTES
            </button>
          </div>
        )}
      </div>

      {/* Overlay drawer — superpuesto, no comprime la tabla */}
      {editAct && (
        <>
          {/* Overlay backdrop */}
          <div
            onClick={() => handleOpenEdit(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,47,86,0.25)", zIndex: 100,
              backdropFilter: "none",
            }}
          />
          {/* Drawer */}
          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: 460,
            background: "#fff", boxShadow: "-6px 0 32px rgba(0,0,0,0.18)",
            zIndex: 101, display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Drawer header */}
            <div style={{ padding: "16px 20px", background: "#f0f6ff", borderBottom: "1px solid #bfdbfe", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1e40af", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
                    Configurar actividad
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", lineHeight: 1.3 }}>{editAct.nombre}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "1px 7px", borderRadius: 99 }}>{getActivityType(editAct)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenEdit(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a8d", padding: 4, borderRadius: 4, display: "flex", marginTop: -2 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Drawer body — scrollable */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label required">Tipo de actividad</label>
                <select className="form-select" aria-label="Tipo de actividad" value={getActivityType(editAct)} onChange={e => updateAct({ ...editAct, categoria: e.target.value, activityType: e.target.value as ActivityType })}>
                  <option value="POA">POA</option><option value="Plan de Mejoras">Plan de Mejoras</option><option value="Acción de Mejora">Acción de Mejora</option><option value="Otra">Otra</option>
                </select>
              </div>
              <div>
                <label className="form-label required">Actividad</label>
                <textarea className="form-textarea" aria-label="Actividad" value={editAct.nombre} placeholder="Describa la actividad" onChange={e => updateAct({ ...editAct, nombre: e.target.value })} />
              </div>
              {/* Fechas */}
              <div style={{ padding: 12, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#475569", marginBottom: 8, letterSpacing: "0.04em" }}>DURACIÓN DE LA ACTIVIDAD</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label required">Desde</label>
                  <input aria-label="Desde" type="date" className="form-input" value={editAct.desde}
                    onChange={e => {
                      updateAct({ ...editAct, desde: e.target.value });
                      setDateError(validateDates(e.target.value, editAct.hasta));
                    }} />
                </div>
                <div>
                  <label className="form-label required">Hasta</label>
                  <input aria-label="Hasta" type="date" className="form-input" value={editAct.hasta}
                    onChange={e => {
                      updateAct({ ...editAct, hasta: e.target.value });
                      setDateError(validateDates(editAct.desde, e.target.value));
                    }} />
                </div>
              </div>
              </div>

              {dateError && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", borderRadius: 6, padding: "8px 11px", fontSize: 12.5, color: "#991b1b", display: "flex", gap: 7, alignItems: "flex-start" }}>
                  <svg style={{ flexShrink: 0, marginTop: 1 }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  {dateError}
                </div>
              )}

              <div style={{ fontSize: 11.5, color: "#6b7a8d", background: "#f8fafc", borderRadius: 6, padding: "7px 10px", border: "1px solid #e2e8f0" }}>
                La actividad estará disponible para evidencias hasta las 23:59 del día seleccionado.
              </div>

              {/* Responsables */}
              <div>
                <label className="form-label required">Responsables</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, background: "#f8fafc", borderRadius: 8, padding: "10px 12px", border: "1.5px solid #e2e8f0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#1a4f8a", fontWeight: 600, cursor: "pointer", marginBottom: 4 }}>
                    <input type="checkbox"
                      checked={responsablesGrupo.length > 0 && responsablesGrupo.every(r => editAct.responsables.includes(r))}
                      onChange={e => updateAct({ ...editAct, ...responsibleSelection(e.target.checked ? responsablesGrupo : []) })}
                      style={{ accentColor: "#1a4f8a" }}
                    />
                    Seleccionar todos
                  </label>
                  {responsablesGrupo.map(r => (
                    <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155", cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={editAct.responsables.includes(r)}
                        onChange={e => updateAct({ ...editAct, ...responsibleSelection(e.target.checked ? [...editAct.responsables, r] : editAct.responsables.filter(x => x !== r)) })}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      {r}
                    </label>
                  ))}
                </div>
                {editAct.responsables.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    <span style={{ fontSize: 11.5, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>
                      {getResponsibleDisplayLabel({groupType,selectedResponsibleIds:editAct.responsableIds || editAct.responsables,allGroupMemberIds:editAct.responsableIds ? responsablesGrupoIds : responsablesGrupo,selectedResponsibleNames:editAct.responsableNames || editAct.responsables})}
                    </span>
                  </div>
                )}
              </div>

              {/* Recursos */}
              <div>
                <label className="form-label required">Recursos</label>
                <div style={{ position: "relative", marginBottom: 6 }}>
                  <svg style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  <input className="form-input" placeholder="Buscar recurso…" style={{ paddingLeft: 26, fontSize: 12.5, padding: "6px 10px 6px 26px" }}
                    value={recursoSearch} onChange={e => setRecursoSearch(e.target.value)} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#f8fafc", borderRadius: 8, padding: "10px 12px", border: "1.5px solid #e2e8f0" }}>
                  {recursosCatalogo.filter(r => r.toLowerCase().includes(recursoSearch.toLowerCase())).map(r => (
                    <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155", cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={editAct.recursos.includes(r)}
                        onChange={e => updateAct({ ...editAct, recursos: e.target.checked ? [...editAct.recursos, r] : editAct.recursos.filter(x => x !== r) })}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      {r}
                    </label>
                  ))}
                </div>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    aria-label="Otro recurso" checked={editAct.recursos.some(v => !recursosCatalogo.includes(v))}
                    onChange={e => {
                      updateAct({
                        ...editAct,
                        recursos: e.target.checked
                          ? [...editAct.recursos, ""]
                          : editAct.recursos.filter(v => recursosCatalogo.includes(v)),
                      });
                      if (!e.target.checked) setRecursoOtroError("");
                    }}
                    style={{ accentColor: "#1a4f8a" }}
                  />
                  <span>Otro</span>
                </label>
                {editAct.recursos.some(v => !recursosCatalogo.includes(v)) && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>
                      <span>Especifique el recurso</span>
                      <span style={{ color: "#dc2626", fontWeight: 700 }} title="Campo obligatorio">*</span>
                    </div>
                    <input
                      ref={recursoOtroInputRef}
                      className="form-input"
                      aria-label="Especifique el recurso"
                      placeholder="Especifique el recurso"
                      style={recursoOtroError ? { borderColor: "#ef4444", background: "#fff5f5" } : undefined}
                      value={editAct.recursos.filter(v => !recursosCatalogo.includes(v)).join("; ")}
                      onChange={e => {
                        updateAct({
                          ...editAct,
                          recursos: [...editAct.recursos.filter(v => recursosCatalogo.includes(v)), e.target.value],
                        });
                        if (e.target.value.trim()) setRecursoOtroError("");
                      }}
                    />
                    {recursoOtroError && (
                      <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{recursoOtroError}</span>
                      </div>
                    )}
                  </div>
                )}
                {editAct.recursos.filter(r => r.trim()).length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {editAct.recursos.filter(r => r.trim()).map(r => (
                      <span key={r} style={{ fontSize: 11.5, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>{r}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medios */}
              <div>
                <label className="form-label required">Medios de verificación</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#f8fafc", borderRadius: 8, padding: "10px 12px", border: "1.5px solid #e2e8f0" }}>
                  {mediosCatalogo.map(m => (
                    <label key={m} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155", cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={editAct.medios.includes(m)}
                        onChange={e => updateAct({ ...editAct, medios: e.target.checked ? [...editAct.medios, m] : editAct.medios.filter(x => x !== m) })}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      {m}
                    </label>
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: "#6b7a8d", marginTop: 6 }}>
                  Durante la ejecución deberá cargar un archivo PDF por cada medio seleccionado.
                </div>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    aria-label="Otro medio de verificación" checked={editAct.medios.some(v => !mediosCatalogo.includes(v))}
                    onChange={e => {
                      updateAct({
                        ...editAct,
                        medios: e.target.checked
                          ? [...editAct.medios, ""]
                          : editAct.medios.filter(v => mediosCatalogo.includes(v)),
                      });
                      if (!e.target.checked) setMedioOtroError("");
                    }}
                    style={{ accentColor: "#1a4f8a" }}
                  />
                  <span>Otro</span>
                </label>
                {editAct.medios.some(v => !mediosCatalogo.includes(v)) && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#334155", marginBottom: 3, display: "flex", alignItems: "center", gap: 3 }}>
                      <span>Especifique el medio de verificación</span>
                      <span style={{ color: "#dc2626", fontWeight: 700 }} title="Campo obligatorio">*</span>
                    </div>
                    <input
                      ref={medioOtroInputRef}
                      className="form-input"
                      aria-label="Especifique el medio de verificación"
                      placeholder="Especifique el medio de verificación"
                      style={medioOtroError ? { borderColor: "#ef4444", background: "#fff5f5" } : undefined}
                      value={editAct.medios.filter(v => !mediosCatalogo.includes(v)).join("; ")}
                      onChange={e => {
                        updateAct({
                          ...editAct,
                          medios: [...editAct.medios.filter(v => mediosCatalogo.includes(v)), e.target.value],
                        });
                        if (e.target.value.trim()) setMedioOtroError("");
                      }}
                    />
                    {medioOtroError && (
                      <div style={{ fontSize: 12, color: "#dc2626", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>{medioOtroError}</span>
                      </div>
                    )}
                  </div>
                )}
                {editAct.medios.filter(m => m.trim()).length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {editAct.medios.filter(m => m.trim()).map(m => (
                      <span key={m} style={{ fontSize: 11.5, background: "#f0fdf4", color: "#166534", padding: "2px 8px", borderRadius: 99, fontWeight: 500, border: "1px solid #bbf7d0" }}>{m}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Drawer footer */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #e2e8f0", background: "#fff", flexShrink: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {haySiguienteIncompleta && (
                <button
                  className="btn btn-secondary"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={handleGuardarYSiguiente}
                >
                  Guardar y configurar siguiente pendiente →
                </button>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => handleOpenEdit(null)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={handleGuardarActividad}>
                  Guardar actividad
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <FormFooter onPrev={onPrev} onNext={onNext} onSave={() => onSave(matriz)} saving={saving} canContinue={canContinue} />
    </div>
  );
}

// ─── 05 — Revisión de la Matriz ───────────────────────────────────────────────

function Step3Revision({ onPrev, onNext, maxReached = 3, onGoToMatrix, onEditActivity, matriz, groupType, responsablesGrupo, responsablesGrupoIds, saving = false }: {
  onPrev: () => void; onNext: () => void; maxReached?: number; onGoToMatrix?: () => void; onEditActivity?: (id: number) => void;
  groupType?: string; responsablesGrupo: string[]; responsablesGrupoIds: string[];
  matriz: ActividadMatriz[]; saving?: boolean;
}) {
  const total = matriz.length;
  const configuradas = matriz.filter(isCompleta).length;
  const pendientes = total - configuradas;
  const matrizCompleta = pendientes === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={4} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Revisar matriz de actividades</h1>
            <p style={{ fontSize: 13, color: "#6b7a8d", marginTop: 3 }}>
              Verifique la planificación antes de continuar con la redacción del Plan de Trabajo.
            </p>
          </div>
          {/* Summary counters */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {[
              { label: "Actividades", val: total, color: "#1e2a3a", bg: "#f1f5f9" },
              { label: "Configuradas", val: configuradas, color: "#166534", bg: "#dcfce7" },
              { label: "Pendientes", val: pendientes, color: pendientes > 0 ? "#92400e" : "#94a3b8", bg: pendientes > 0 ? "#fef3c7" : "#f1f5f9" },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", background: s.bg, borderRadius: 8, padding: "6px 14px", minWidth: 80 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: s.color, fontFamily: "'DM Sans',sans-serif" }}>{s.val}</div>
                <div style={{ fontSize: 11, color: "#6b7a8d" }}>{s.label}</div>
              </div>
            ))}
            <span style={{
              fontSize: 12, fontWeight: 700, padding: "5px 12px", borderRadius: 8,
              background: matrizCompleta ? "#dcfce7" : "#fef3c7",
              color: matrizCompleta ? "#166534" : "#92400e",
              border: `1.5px solid ${matrizCompleta ? "#bbf7d0" : "#fde68a"}`,
            }}>
              {matrizCompleta ? "MATRIZ COMPLETA" : "INCOMPLETA"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
        {/* Matriz table — near-document presentation */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden", maxWidth: 1100 }}>
          <div style={{ padding: "14px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>Matriz de Actividades — Unidad de Titulación</span>
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Período: Julio – Diciembre 2026</span>
          </div>

          {matriz.map((a, i) => {
            const completa = isCompleta(a);
            return (
              <div key={a.id} style={{
                borderBottom: i < matriz.length - 1 ? "1px solid #f1f5f9" : "none",
                background: completa ? "#fff" : "#fffbeb",
              }}>
                {/* Activity header row */}
                <div style={{ padding: "14px 20px 10px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", fontFamily: "'JetBrains Mono',monospace" }}>#{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>{a.nombre}</span>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "1px 7px", borderRadius: 99 }}>{a.categoria}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: a.tipo === "obligatoria" ? "#f0fdf4" : "#f1f5f9", color: a.tipo === "obligatoria" ? "#166534" : "#475569", padding: "1px 7px", borderRadius: 99 }}>
                        {a.tipo === "obligatoria" ? "OBLIGATORIA" : a.tipo === "otra" ? "OTRA" : "OPCIONAL"}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {!completa && (
                      <span style={{ fontSize: 11, fontWeight: 700, background: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: 99 }}>PENDIENTE</span>
                    )}
                    <button className="btn btn-ghost btn-xs" onClick={() => onEditActivity?.(a.id)} aria-label={`Editar actividad ${a.nombre}`}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Editar
                    </button>
                  </div>
                </div>

                {/* Detail grid */}
                <div style={{ padding: "0 20px 14px", display: "grid", gridTemplateColumns: "120px 120px 1fr 1fr 1fr", gap: 12 }}>
                  {[
                    { label: "Desde", val: a.desde ? a.desde.split("-").reverse().join("/") : "—" },
                    { label: "Hasta", val: a.hasta ? a.hasta.split("-").reverse().join("/") : "—" },
                    { label: "Responsables", val: a.responsables.length ? getResponsibleDisplayLabel({groupType,selectedResponsibleIds:a.responsableIds || a.responsables,allGroupMemberIds:a.responsableIds ? responsablesGrupoIds : responsablesGrupo,selectedResponsibleNames:a.responsableNames || a.responsables}) : "—" },
                    { label: "Recursos", val: a.recursos.filter(r => r.trim()).length ? a.recursos.filter(r => r.trim()).join(", ") : "—" },
                    { label: "Medios de verificación", val: a.medios.filter(m => m.trim()).length ? a.medios.filter(m => m.trim()).join(", ") : "—" },
                  ].map((col, j) => (
                    <div key={j}>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 3 }}>{col.label}</div>
                      <div style={{ fontSize: 12.5, color: col.val === "—" ? "#cbd5e1" : "#334155", fontFamily: j < 2 ? "'JetBrains Mono',monospace" : undefined }}>
                        {col.val}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {!matrizCompleta && (
          <div style={{ marginTop: 14, padding: "11px 16px", background: "#fef3c7", border: "1.5px solid #fde68a", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <svg style={{ color: "#d97706", flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span style={{ fontSize: 13, color: "#92400e" }}>
                {pendientes} {pendientes === 1 ? "actividad está pendiente" : "actividades están pendientes"} de configurar.
              </span>
            </div>
            <button
              className="btn btn-xs"
              style={{ background: "#d97706", color: "#fff", border: "none", fontWeight: 700 }}
              onClick={onGoToMatrix}
            >
              COMPLETAR PENDIENTES
            </button>
          </div>
        )}
      </div>

      <FormFooter
        onPrev={onPrev}
        onNext={onNext}
        onSave={() => {}}
        saving={saving}
        canContinue={matrizCompleta}
        nextLabel="Continuar a Anexos →"
      />
    </div>
  );
}

// ─── Step 4 — Contenido ───────────────────────────────────────────────────────

function Step4Contenido({ onPrev, onNext, maxReached = 4, justificacion, setJustificacion, objetivo, setObjetivo, saving = false, onSave, textoBase }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  justificacion: string; setJustificacion: (v: string) => void;
  objetivo: string; setObjetivo: (v: string) => void;
  saving?: boolean; onSave?: () => void; textoBase?: string;
}) {
  const [showExit, setShowExit] = useState(false);
  const [activeSection, setActiveSection] = useState<"justificacion" | "objetivo">("justificacion");

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const canContinue = justificacion.trim().length > 0 && objetivo.trim().length > 0;

  const [aiMenu, setAiMenu] = useState<"justificacion" | "objetivo" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModal, setAiModal] = useState<{ field: "justificacion" | "objetivo"; original: string; suggestion: string; option: string } | null>(null);
  const [aiError, setAiError] = useState("");

  const AI_OPTIONS_JUST = ["Mejorar redacción", "Corregir ortografía y gramática", "Hacer más claro", "Dar tono más formal"];
  const AI_OPTIONS_OBJ  = ["Mejorar redacción", "Hacer más claro", "Dar tono institucional", "Corregir ortografía y gramática"];

  function simulateSuggestion(text: string, field: "justificacion" | "objetivo", option: string): string {
    const prefix = option === "Dar tono más formal" || option === "Dar tono institucional"
      ? "En el marco del cumplimiento de la normativa institucional vigente, "
      : "En atención a los requerimientos académicos establecidos, ";
    const core = text.trim().replace(/\s+/g, " ");
    if (field === "justificacion") {
      return `${prefix}${core} En consecuencia, el presente Plan de Trabajo responde a las necesidades identificadas para el período Julio – Diciembre 2026, orientado al fortalecimiento de los procesos académicos bajo los lineamientos de la Facultad de Ingeniería en Sistemas, Electrónica e Industrial.`;
    }
    return `${prefix}${core.endsWith(".") ? core : core + "."} Este objetivo se enmarca en las directrices institucionales de la Universidad Técnica de Ambato para el período vigente.`;
  }

  function handleAiOption(field: "justificacion" | "objetivo", option: string) {
    setAiMenu(null);
    const original = field === "justificacion" ? justificacion : objetivo;
    if (!original.trim()) {
      setAiError("Ingrese un texto antes de solicitar una mejora.");
      return;
    }
    setAiError("");
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      setAiModal({ field, original, suggestion: simulateSuggestion(original, field, option), option });
    }, 1200);
  }

  function applyAiSuggestion() {
    if (!aiModal) return;
    if (aiModal.field === "justificacion") {
      setJustificacion(aiModal.suggestion);
    } else {
      setObjetivo(aiModal.suggestion);
    }
    setAiModal(null);
  }

  const sections: { key: string; label: string; done: boolean; editable: boolean; opcional?: boolean }[] = [
    { key: "auto",          label: "Información general",  done: true,                           editable: false },
    { key: "auto",          label: "Matriz de actividades", done: true,                           editable: false },
    { key: "justificacion", label: "Justificación",         done: justificacion.trim().length > 0, editable: true },
    { key: "objetivo",      label: "Objetivo",              done: objetivo.trim().length > 0,      editable: true },
    { key: "opcional",      label: "Anexos",                done: false,                           editable: false, opcional: true },
    { key: "auto",          label: "Firmas de responsabilidad", done: false,                       editable: false },
    { key: "auto",          label: "Historial de cambios",  done: false,                           editable: false },
  ];

  const miniBar = (
    <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
      {[
        { icon: "B", title: "Negrita", style: { fontWeight: 800 } },
        { icon: "I", title: "Cursiva", style: { fontStyle: "italic" } },
        { icon: "≡", title: "Lista con viñetas", style: {} },
        { icon: "1.", title: "Lista numerada", style: {} },
        { icon: "↺", title: "Deshacer", style: {} },
        { icon: "↻", title: "Rehacer", style: {} },
      ].map((b, i) => (
        <button key={i} title={b.title} style={{
          width: 28, height: 26, borderRadius: 4, border: "1px solid #d1d9e0",
          background: "#f8fafc", cursor: "pointer", fontSize: 12,
          display: "flex", alignItems: "center", justifyContent: "center", ...b.style,
        }}>{b.icon}</button>
      ))}
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }} onClick={() => aiMenu && setAiMenu(null)}>
      {showExit && <ExitModal onKeep={() => setShowExit(false)} onSaveAndExit={onPrev} />}

      {/* AI loading overlay */}
      {aiLoading && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.35)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 36px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 36, height: 36, border: "3px solid #e2e8f0", borderTop: "3px solid #7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1e2a3a" }}>Generando sugerencia...</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>La IA está analizando el texto</div>
          </div>
        </div>
      )}

      {/* AI comparison modal */}
      {aiModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 640, maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Sparkles aria-hidden="true" style={{width:18,height:18,color:"#1a4f8a"}} />
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Sugerencia de redacción</h2>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>{aiModal.option}</p>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Texto original</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "12px 14px" }}>
                  {aiModal.original}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Versión sugerida</div>
                <div style={{ fontSize: 13, color: "#1e2a3a", lineHeight: 1.65, background: "#f5f3ff", border: "1.5px solid #c4b5fd", borderRadius: 8, padding: "12px 14px" }}>
                  {aiModal.suggestion}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 6, padding: "8px 12px", background: "#fef3c7", borderRadius: 6, border: "1px solid #fde68a" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 12, color: "#92400e" }}>La sugerencia generada debe ser revisada por el docente antes de incorporarse al documento.</span>
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" data-testid="ai-suggestion-discard" onClick={() => setAiModal(null)}>DESCARTAR</button>
              <button className="btn btn-primary" data-testid="ai-suggestion-apply" style={{ background: "#1a4f8a", border: "none" }} onClick={applyAiSuggestion}>APLICAR SUGERENCIA</button>
            </div>
          </div>
        </div>
      )}

      <Stepper current={2} maxReached={maxReached} />
      <div style={{padding:"8px 28px"}}><button className="btn btn-ghost btn-sm" onClick={() => setJustificacion(textoBase || DEFAULT_JUSTIFICACION)}>Cargar texto base DEMO editable</button><span style={{fontSize:12,color:"#64748b"}}>Puede editarlo, reemplazarlo o eliminarlo.</span></div>
      {aiError && <p role="alert" className="form-error" style={{margin:"0 28px"}}>{aiError}</p>}

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
          Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>
          Contenido del Plan de Trabajo
        </h1>
        <p style={{ fontSize: 13, color: "#6b7a8d" }}>
          Complete las secciones textuales del documento. La matriz de actividades y demás elementos institucionales serán incorporados automáticamente.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 18, maxWidth: 1100 }}>

          {/* Main editing area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Justificación */}
            <div style={{ background: "#fff", borderRadius: 10, border: activeSection === "justificacion" ? "1.5px solid #1a4f8a" : "1px solid #e2e8f0", padding: "20px" }}
              onClick={() => setActiveSection("justificacion")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>
                  <span style={{ color: "#94a3b8", marginRight: 8, fontSize: 12 }}>1.</span>Justificación
                  <span style={{ marginLeft: 8, fontSize: 10, color: "#dc2626" }}>*</span>
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {justificacion.trim() && (
                    <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Completa
                    </span>
                  )}
                  <div style={{ position: "relative" }}>
                    <button className="btn btn-ghost btn-xs" aria-label="Mejorar redacción de Justificación" style={{ fontSize: 11.5, gap: 4, border: "1px solid #bfdbfe", color: "#1a4f8a", background: "#eff6ff" }}
                      onClick={e => { e.stopPropagation(); setAiMenu(aiMenu === "justificacion" ? null : "justificacion"); }}>
                      <Sparkles aria-hidden="true" style={{width:14,height:14}}/> MEJORAR REDACCIÓN
                    </button>
                    {aiMenu === "justificacion" && (
                      <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 220 }}
                        onClick={e => e.stopPropagation()}>
                        {AI_OPTIONS_JUST.map(opt => (
                          <button key={opt} onClick={() => handleAiOption("justificacion", opt)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "9px 14px",
                            background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1e2a3a",
                          }} onMouseEnter={e => (e.currentTarget.style.background = "#f5f3ff")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#6b7a8d", marginBottom: 10 }}>
                Describa la necesidad, contexto y fundamento de las actividades propuestas en el Plan de Trabajo.
              </p>
              {miniBar}
              <textarea
                className="form-textarea"
                style={{ minHeight: 130, fontSize: 13.5, lineHeight: 1.65, resize: "vertical" }}
                value={justificacion}
                aria-label="Justificación"
                onChange={e => { setAiError(""); setJustificacion(e.target.value); }}
                placeholder="Describa la necesidad, contexto y fundamento..."
              />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: "right" }}>
                {wordCount(justificacion)} palabras
              </div>
              {justificacion.trim().length === 0 && (
                <p className="form-error" style={{ marginTop: 4 }}>Ingrese la justificación del Plan de Trabajo para continuar.</p>
              )}
            </div>

            {/* Objetivo */}
            <div style={{ background: "#fff", borderRadius: 10, border: activeSection === "objetivo" ? "1.5px solid #1a4f8a" : "1px solid #e2e8f0", padding: "20px" }}
              onClick={() => setActiveSection("objetivo")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>
                  <span style={{ color: "#94a3b8", marginRight: 8, fontSize: 12 }}>2.</span>Objetivo
                  <span style={{ marginLeft: 8, fontSize: 10, color: "#dc2626" }}>*</span>
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {objetivo.trim() && (
                    <span style={{ fontSize: 11, color: "#16a34a", display: "flex", alignItems: "center", gap: 4 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Completo
                    </span>
                  )}
                  <div style={{ position: "relative" }}>
                    <button className="btn btn-ghost btn-xs" aria-label="Mejorar redacción de Objetivo" style={{ fontSize: 11.5, gap: 4, border: "1px solid #bfdbfe", color: "#1a4f8a", background: "#eff6ff" }}
                      onClick={e => { e.stopPropagation(); setAiMenu(aiMenu === "objetivo" ? null : "objetivo"); }}>
                      <Sparkles aria-hidden="true" style={{width:14,height:14}}/> MEJORAR OBJETIVO
                    </button>
                    {aiMenu === "objetivo" && (
                      <div style={{ position: "absolute", right: 0, top: "calc(100% + 4px)", background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 50, minWidth: 220 }}
                        onClick={e => e.stopPropagation()}>
                        {AI_OPTIONS_OBJ.map(opt => (
                          <button key={opt} onClick={() => handleAiOption("objetivo", opt)} style={{
                            display: "block", width: "100%", textAlign: "left", padding: "9px 14px",
                            background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#1e2a3a",
                          }} onMouseEnter={e => (e.currentTarget.style.background = "#f5f3ff")}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#6b7a8d", marginBottom: 10 }}>
                Defina el objetivo general que orientará el desarrollo de las actividades del Plan de Trabajo.
              </p>
              {miniBar}
              <textarea
                className="form-textarea"
                style={{ minHeight: 90, fontSize: 13.5, lineHeight: 1.65, resize: "vertical" }}
                value={objetivo}
                aria-label="Objetivo"
                onChange={e => { setAiError(""); setObjetivo(e.target.value); }}
                placeholder="Defina el objetivo general..."
              />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: "right" }}>
                {wordCount(objetivo)} palabras
              </div>
              {objetivo.trim().length === 0 && (
                <p className="form-error" style={{ marginTop: 4 }}>Complete esta sección antes de continuar.</p>
              )}
            </div>

            {/* Matriz info card */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 2 }}>Matriz de actividades</div>
                <div style={{ fontSize: 12.5, color: "#6b7a8d", display: "flex", alignItems: "center", gap: 6 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  5 actividades configuradas — Completa
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={onPrev} style={{ flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                VER MATRIZ
              </button>
            </div>
          </div>

          {/* Side panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 18px", position: "sticky", top: 0 }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Contenido del documento</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {sections.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 9,
                    padding: "7px 10px", borderRadius: 6,
                    background: s.editable && (s.key === activeSection) ? "#eff6ff" : "transparent",
                    cursor: s.editable ? "pointer" : "default",
                  }} onClick={() => s.editable && setActiveSection(s.key as "justificacion" | "objetivo")}>
                    <div style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: s.done ? "#dcfce7" : s.editable ? "#fef3c7" : "#f1f5f9",
                    }}>
                      {s.done ? (
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : (
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: s.editable ? "#f59e0b" : "#d1d9e0" }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 12.5, color: s.done ? "#1e2a3a" : s.editable ? "#92400e" : "#94a3b8",
                      fontWeight: s.editable ? 500 : 400,
                    }}>{s.label}</span>
                    {!s.editable && (
                      <span style={{ marginLeft: "auto", fontSize: 10, color: s.opcional ? "#92400e" : "#94a3b8", background: s.opcional ? "#fef3c7" : "#f1f5f9", padding: "1px 6px", borderRadius: 99 }}>
                        {s.opcional ? "OPC" : "AUTO"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.55 }}>
                  Las secciones institucionales se generan automáticamente según la plantilla vigente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FormFooter
        onPrev={() => setShowExit(true)}
        onNext={onNext}
        onSave={() => onSave?.()}
        saving={saving}
        canContinue={canContinue}
        nextLabel="Continuar →"
      />
    </div>
  );
}

// ─── Step 5 — Anexos ──────────────────────────────────────────────────────────

interface Anexo { id: number; nombre: string; descripcion: string; archivo: string; }

function Step5Anexos({ onPrev, onNext, maxReached = 5, tieneAnexos, setTieneAnexos, anexos, setAnexos, saving = false, onSave }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  tieneAnexos: "si" | "no" | null; setTieneAnexos: (v: "si" | "no" | null) => void;
  anexos: Anexo[]; setAnexos: (v: Anexo[]) => void;
  saving?: boolean; onSave?: () => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingId,setEditingId] = useState<number | null>(null);
  const annexFileRef=useRef<HTMLInputElement>(null);
  const [modalFile, setModalFile] = useState("");

  const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const canContinue = tieneAnexos === "no" || (tieneAnexos === "si" && anexos.length > 0);

  const handleAddAnexo = () => {
    if (!modalFile.trim()) return;
    const next={id:editingId || Math.max(0, ...anexos.map(anexo => anexo.id)) + 1,nombre:modalFile.trim(),descripcion:"",archivo:modalFile.trim()};
    setAnexos(editingId ? anexos.map(a => a.id === editingId ? next : a) : [...anexos,next]);
    setEditingId(null);
    setModalFile("");
    setShowModal(false);
  };

  const mover = (idx: number, dir: -1 | 1) => {
    const arr = [...anexos];
    const to = idx + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[idx], arr[to]] = [arr[to], arr[idx]];
    setAnexos(arr);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 480, maxHeight:"90vh",overflowY:"auto", padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>{editingId ? "Editar anexo" : "Agregar anexo"}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="form-label required">Archivo</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="form-input" placeholder="Seleccionar archivo..."
                    value={modalFile} onChange={e => setModalFile(e.target.value)} readOnly />
                  <input type="file" ref={annexFileRef} style={{display:"none"}} onChange={e => setModalFile(e.target.files?.[0]?.name || "")} /><button onClick={() => annexFileRef.current?.click()} className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Examinar
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAddAnexo} disabled={!modalFile.trim()}>{editingId ? "Guardar cambios" : "Agregar"}</button>
            </div>
          </div>
        </div>
      )}

      <Stepper current={4} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Gestión Documental Académica &rsaquo; Nuevo Plan de Trabajo</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>Anexos</h1>
        <p style={{ fontSize: 13, color: "#6b7a8d" }}>
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
        <div style={{ maxWidth: 820, display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Question */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "22px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>
              ¿Este Plan de Trabajo contiene anexos?
            </h3>
            <div style={{ display: "flex", gap: 14 }}>
              {[
                { val: "si" as const, label: "Sí" },
                { val: "no" as const, label: "No" },
              ].map(opt => (
                <label key={opt.val} style={{
                  flex: 1, cursor: "pointer", borderRadius: 8, padding: "14px 16px",
                  border: `1.5px solid ${tieneAnexos === opt.val ? "#1a4f8a" : "#e2e8f0"}`,
                  background: tieneAnexos === opt.val ? "#eff6ff" : "#fff",
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                  <input type="radio" name="tieneAnexos" value={opt.val}
                    checked={tieneAnexos === opt.val}
                    onChange={() => setTieneAnexos(opt.val)}
                    style={{ accentColor: "#1a4f8a", marginTop: 2, flexShrink: 0 }}
                  />
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a" }}>{opt.label}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Sí: list */}
          {tieneAnexos === "si" && (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>
                  Anexos
                  <span style={{ marginLeft: 8, fontSize: 11.5, color: "#6b7a8d", fontWeight: 400 }}>{anexos.length} {anexos.length === 1 ? "elemento" : "elementos"}</span>
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => {setEditingId(null);setModalFile("");setShowModal(true);}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  AGREGAR ANEXO
                </button>
              </div>
              {anexos.length === 0 ? (
                <div style={{ padding: "32px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                  No se han agregado anexos. Use el botón para agregar.
                </div>
              ) : (
                <div>
                  {anexos.map((a, idx) => (
                    <div key={a.id} style={{
                      padding: "13px 18px", borderBottom: idx < anexos.length - 1 ? "1px solid #f1f5f9" : "none",
                      display: "flex", alignItems: "flex-start", gap: 12,
                    }}>
                      {/* Letter badge */}
                      <div style={{
                        width: 32, height: 32, borderRadius: 6, background: "#eff6ff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 800, fontSize: 13, color: "#1a4f8a", flexShrink: 0,
                      }}>
                        {LETRAS[idx]}
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a" }}>
                          Anexo {LETRAS[idx]}
                        </div>
                        {a.descripcion && (
                          <div style={{ fontSize: 12, color: "#6b7a8d", marginTop: 2 }}>{a.descripcion}</div>
                        )}
                        {a.archivo && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span style={{ fontSize: 11.5, color: "#64748b" }}>{a.archivo}</span>
                          </div>
                        )}
                      </div>
                      {/* Reorder + actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <button title="Subir anexo" aria-label="Subir anexo" onClick={() => mover(idx, -1)} disabled={idx === 0} style={{
                            width: 22, height: 20, background: "none", border: "1px solid #e2e8f0",
                            borderRadius: 3, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: idx === 0 ? 0.3 : 1,
                          }}>↑</button>
                          <button title="Bajar anexo" aria-label="Bajar anexo" onClick={() => mover(idx, 1)} disabled={idx === anexos.length - 1} style={{
                            width: 22, height: 20, background: "none", border: "1px solid #e2e8f0",
                            borderRadius: 3, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: idx === anexos.length - 1 ? 0.3 : 1,
                          }}>↓</button>
                        </div>
                        <button title="Reemplazar archivo" aria-label="Reemplazar archivo" className="btn btn-ghost btn-xs" onClick={() => {setEditingId(a.id);setModalFile(a.archivo);setShowModal(true);}}>Reemplazar</button>
                        <button className="btn btn-xs" style={{ background: "#fee2e2", color: "#991b1b", border: "none" }}
                          onClick={() => setAnexos(anexos.filter(x => x.id !== a.id))}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tieneAnexos === null && (
            <div className="alert alert-warning">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Seleccione si el Plan de Trabajo contiene anexos para continuar.
            </div>
          )}
        </div>
      </div>

      <FormFooter
        onPrev={onPrev}
        onNext={onNext}
        onSave={() => onSave?.()}
        saving={saving}
        canContinue={canContinue}
        nextLabel="Continuar →"
      />
    </div>
  );
}

// ─── Step 6 — Previsualización ────────────────────────────────────────────────

function Step6Preview({ onPrev, onNext, maxReached = 6, artifact, docEngine, previewLayout }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  artifact: import("./documentEngine/types").DocumentArtifact;
  docEngine?: ReturnType<typeof useDocumentEngine>;
  previewLayout?: PreviewLayoutControls;
}) {
  useEffect(() => { previewLayout?.enter(); return () => previewLayout?.exit(); }, []);
  return <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <Stepper current={5} maxReached={maxReached} />
    <div style={{flex:1,minHeight:0}}><DocumentPdfPageViewer artifact={artifact} formalVersion={artifact.formalVersion} reviewRound={artifact.reviewRound} documentState="BORRADOR" observations={[]} flowStages={docEngine?.flowStages || []} currentUser={{id:artifact.elaborador.id,nombre:artifact.elaborador.nombre,cargo:artifact.elaborador.cargo,role:"docente"}} readOnly onOpenFirmar={() => {}} onOpenDevolver={() => {}} onAddObservacion={() => {}} previewExpanded={previewLayout?.expanded} onPreviewExpandedChange={previewLayout?.setExpanded} /></div>
    <FormFooter onPrev={onPrev} onNext={onNext} onSave={() => {}} saving={false} canContinue={true} />
  </div>;
}

// ─── Step 7 — Firma y Finalización ───────────────────────────────────────────────────

function Step7Firma({ onPrev, onNext, maxReached = 7, docEngine }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  docEngine?: ReturnType<typeof useDocumentEngine>;
}) {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const doc = docEngine?.docMaster;
  const slot = doc?.currentArtifact.signatureSlots?.find(s => s.role === "docente");
  const actorEligible = Boolean(doc && canonicalDemoActorId(doc.currentArtifact.elaborador.id) === canonicalDemoActorId(docEngine?.currentUser.id));
  const flowConfigured = Boolean(doc && hasConfiguredNextStage(doc.flowStages));
  return <div style={{display:"flex",flexDirection:"column",height:"100%"}}>
    <Stepper current={6} maxReached={maxReached} />
    <div style={{padding:28}}><h1 style={{fontSize:22,fontWeight:700,color:"#0f2f56"}}>Firma y Finalización</h1>
      <p style={{margin:"16px 0"}}>La firma finaliza la elaboración y envía automáticamente el documento a la siguiente etapa configurada.</p>
      {!flowConfigured && <div role="alert" style={{marginBottom:16,padding:12,borderRadius:8,background:"#fffbeb",border:"1px solid #fcd34d",color:"#92400e"}}><strong>El flujo de aprobación de este grupo aún no está completamente configurado.</strong><br/>Solicite al administrador completar la configuración del flujo.</div>}
      {doc?.documentState === "LISTO PARA FIRMA" && <button className="btn btn-primary" disabled={!slot || !actorEligible || !flowConfigured} onClick={() => setShowConfirm(true)}>FIRMAR Y FINALIZAR ELABORACIÓN</button>}
      <button className="btn btn-ghost" onClick={onPrev}>Volver a previsualización</button>
    </div>
    {showConfirm && (
      <div role="dialog" aria-modal="true" aria-label="Confirmar firma y finalización" style={{position:"fixed",inset:0,backgroundColor:"rgba(0,0,0,0.4)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}}>
        <div style={{background:"#fff",padding:24,borderRadius:12,width:400,maxWidth:"90%",boxShadow:"0 10px 25px rgba(0,0,0,0.15)"}}>
          <div style={{display:"flex",gap:16,alignItems:"flex-start",marginBottom:20}}>
            <div style={{background:"#eff6ff",color:"#3b82f6",padding:10,borderRadius:"50%",flexShrink:0}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h3 style={{fontSize:18,fontWeight:600,color:"#1e293b",margin:"0 0 8px 0"}}>Confirmar firma y finalización</h3>
              <p style={{fontSize:14,color:"#64748b",margin:0,lineHeight:1.5}}>
                Está a punto de firmar y finalizar la elaboración de este documento. Después de continuar se generará el artefacto correspondiente para el flujo de revisión. ¿Desea continuar?
              </p>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
            <button className="btn btn-ghost" onClick={() => setShowConfirm(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={() => { setShowConfirm(false); setOpen(true); }}>Firmar y finalizar</button>
          </div>
        </div>
      </div>
    )}
    {doc && <ModalFirmaDocumental isOpen={open} onClose={() => setOpen(false)} tituloDocumento={doc.nombre} grupo={doc.grupo} formalVersion={doc.formalVersion} reviewRound={doc.reviewRound} actorNombre={doc.currentArtifact.elaborador.nombre} actorCargo={doc.currentArtifact.elaborador.cargo} ubicacionSugerida={slot ? `Página ${slot.pageNumber || slot.pageIndex} — ${slot.label}` : "Ubicación no disponible"} accionTexto="FIRMAR Y FINALIZAR ELABORACIÓN" actorEligible={actorEligible} hasValidSignatureSlot={Boolean(slot)} onFirmar={(file, location, mode) => {const signed=docEngine!.firmarComoElaborador(doc.id,file,location,mode);if(signed) onNext();return signed;}} />}
  </div>;
}

function Step8Confirmacion({ onViewStatus, onBackToList, docEngine }: { onViewStatus: () => void; onBackToList: () => void; docEngine?: ReturnType<typeof useDocumentEngine> }) {
  const timelineItems = (docEngine?.flowStages || []).map(stage => ({label:stage.stageName,done:stage.estado === "FIRMADO" || stage.estado === "APROBADO",active:stage.estado === "EN_CURSO"}));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Header bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px" }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Gestión Documental Académica &rsaquo; Plan de Trabajo</div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ maxWidth: 680, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Success icon + title */}
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%", background: "#dcfce7",
              border: "3px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
              Plan de Trabajo enviado a revisión
            </h1>
            <p style={{ fontSize: 13.5, color: "#6b7a8d", lineHeight: 1.6 }}>
              Documento firmado correctamente. La elaboración ha finalizado y continúa al siguiente nivel configurado.
            </p>
          </div>

          {/* Summary card */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Plan de Trabajo</div>
                <div style={{ fontSize: 13, color: "#6b7a8d", marginTop: 2 }}>{docEngine?.docMaster.grupo}</div>
              </div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999,
                fontSize: 11.5, fontWeight: 700, background: "#dbeafe", color: "#1e40af",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6" }} />
                EN REVISIÓN
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
              {[
                { label: "Versión formal", val: "1.0" },
                { label: "Finalizado", val: docEngine?.currentArtifact.elaborationFinalizedAt || "—" },
                { label: "Etapa actual", val: "Revisión Nivel 1" },
              ].map(r => (
                <div key={r.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 }}>{r.label}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginTop: 3 }}>{r.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
            <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Estado del flujo</h3>
            <div style={{ display: "flex", gap: 0 }}>
              {timelineItems.map((t, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {i > 0 && <div style={{ flex: 1, height: 2, background: t.done || t.active ? "#1a4f8a" : "#e2e8f0" }} />}
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: t.done ? "#1a4f8a" : t.active ? "#fff" : "#f1f5f9",
                      border: t.done ? "none" : t.active ? "2.5px solid #1a4f8a" : "2px solid #d1d9e0",
                    }}>
                      {t.done ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      ) : t.active ? (
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a4f8a" }} />
                      ) : (
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d1d9e0" }} />
                      )}
                    </div>
                    {i < timelineItems.length - 1 && <div style={{ flex: 1, height: 2, background: "#e2e8f0" }} />}
                  </div>
                  <div style={{ fontSize: 11.5, color: t.done || t.active ? "#1e2a3a" : "#94a3b8", fontWeight: t.active ? 600 : 400, textAlign: "center" }}>
                    {t.active && <span style={{ color: "#1a4f8a" }}>●&nbsp;</span>}{t.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="alert alert-info" style={{ fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            El documento continuará según el flujo institucional configurado.
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn btn-ghost" onClick={onBackToList}>
              VOLVER A MIS PLANES
            </button>
            <button className="btn btn-primary" onClick={onViewStatus}>
              VER ESTADO DEL PLAN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PlanesView — Orchestrator ────────────────────────────────────────────────

const DRAFT_KEY = "fisei-plan-draft-v1";

const DEFAULT_JUSTIFICACION = "La Comisión de Eventos Académicos de la FISEI planifica y ejecuta jornadas científicas, conferencias y talleres orientados al fortalecimiento de competencias disciplinares en Ingeniería en Sistemas, Electrónica e Industrial durante el período Julio – Diciembre 2026.";
const DEFAULT_OBJETIVO = "Organizar y ejecutar 5 eventos académicos institucionales de alto impacto durante el período académico Julio – Diciembre 2026, garantizando la participación de docentes y estudiantes.";

interface PlanDraft {
  unitType: TipoUnidadInstitucional;
  institutionalUnitId: string;
  careerId: string;
  fuente: string;
  collectsPersonalData: boolean;
  grupo: string;
  periodo: string;
  matriz: ActividadMatriz[];
  justificacion: string;
  objetivo: string;
  tieneAnexos: "si" | "no" | null;
  anexos: Anexo[];
  fechaElaboracion: string;
}

function todayFormatted() {
  return new Date().toLocaleDateString("es-EC", {day:"2-digit",month:"2-digit",year:"numeric",timeZone:"America/Guayaquil"});
}

const DEFAULT_DRAFT: PlanDraft = {
  unitType: "ACADEMIC",
  institutionalUnitId: "unit-fisei",
  careerId: "career-software",
  fuente: "",
  collectsPersonalData: false,
  grupo: "Unidad de Titulación",
  periodo: "Julio – Diciembre 2026",
  matriz: MATRIZ_INICIAL,
  justificacion: DEFAULT_JUSTIFICACION,
  objetivo: DEFAULT_OBJETIVO,
  tieneAnexos: null,
  anexos: [],
  fechaElaboracion: todayFormatted(),
};

function loadDraft(): PlanDraft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PlanDraft>;
      if (parsed && Array.isArray(parsed.matriz) && parsed.matriz.length > 0) {
        return { ...DEFAULT_DRAFT, ...parsed };
      }
    }
  } catch {}
  return { ...DEFAULT_DRAFT };
}

type PreviewLayoutControls = { enter: () => void; exit: () => void; expanded: boolean; setExpanded: (value: boolean) => void };

function PlanesView({ onNavigateActividades, initialShowObsModal, docEngine, adminState, previewLayout }: {
  adminState?: ReturnType<typeof useAdminState>;
  onNavigateActividades?: () => void;
  initialShowObsModal?: boolean;
  docEngine?: ReturnType<typeof useDocumentEngine>;
  previewLayout?: PreviewLayoutControls;
} = {}) {
  const [sub, setSub] = useState<PlanesSubView>("list");
  const [maxReached, setMaxReached] = useState(1);
  const [draft, setDraftState] = useState<PlanDraft>(loadDraft);
  const [saving, setSaving] = useState(false);
  const [initialEditId, setInitialEditId] = useState<number | null>(null);
  const [informeEditId, setInformeEditId] = useState<string | undefined>();
  const [formError, setFormError] = useState("");

  const grupoActual = (adminState?.grupos || GRUPOS_ADMIN_INICIALES).find(g => g.nombre === draft.grupo);
  const unidadActual = adminState?.unidadesInstitucionales.find(u => u.id === draft.institutionalUnitId);
  const carreraActual = unidadActual?.carreras.find(c => c.id === draft.careerId);
  const periodoActual = adminState?.periodos.find(p => p.nombre === draft.periodo);
  const miembrosAplicables = (grupoActual?.miembros || []).filter(m => !adminState || adminState.usuarios.some(u => u.id === m.usuarioId && u.estado === "ACTIVO"));
  const responsablesGrupo = miembrosAplicables.map(m => m.nombreCompleto);
  const responsablesGrupoIds = miembrosAplicables.map(m => canonicalDemoActorId(m.usuarioId));
  const gruposDisponibles = (adminState?.grupos || GRUPOS_ADMIN_INICIALES).filter(g => g.estado === "ACTIVO" && g.miembros.some(m => canonicalDemoActorId(m.usuarioId) === docEngine?.currentUser.id));
  const actividadesIniciales: ActividadMatriz[] = (adminState
    ? adminState.actividadesCatalogo.filter(a => a.estado === "ACTIVO" && (a.gruposAsociadosNombres.includes(draft.grupo) || grupoActual?.actividades.some(g => g.actividadId === a.id))).map((a, index) => ({
      id: index + 1, nombre: a.nombre, descripcion: a.descripcion, categoria: a.categoria, activityType: ACTIVITY_TYPES.includes(a.categoria as ActivityType) ? a.categoria as ActivityType : "Otra",
      tipo: grupoActual?.actividades.find(g => g.actividadId === a.id)?.obligatoriedad === "OBLIGATORIA" ? "obligatoria" as const : "opcional" as const,
      desde: "", hasta: "", responsables: [], recursos: [], medios: [],
    }))
    : ACTIVIDADES_CATALOGO.map(a => ({ ...a, activityType: a.categoria as ActivityType, desde: "", hasta: "", responsables: [], recursos: [], medios: [] }))
  ).filter(a => a.tipo === "obligatoria");
  const matrizDocumental = draft.matriz.map(a => {
    const members = miembrosAplicables;
    const responsableIds = members.filter(member => a.responsables.includes(member.nombreCompleto)).map(member => canonicalDemoActorId(member.usuarioId));
    const allGroupMemberIds = members.map(member => canonicalDemoActorId(member.usuarioId));
    const responsableNames = [...new Set(a.responsables)];
    const display = getResponsibleDisplayLabel({groupType:grupoActual?.tipo,selectedResponsibleIds:responsableIds,allGroupMemberIds,selectedResponsibleNames:responsableNames});
    return {...a,responsables:responsableNames,responsableNames,responsableIds,responsablesEtiqueta:display !== responsableNames.join(", ") ? display : undefined};
  });

  function cargarPlan(docId: string) {
    const doc = docEngine?.documents.find(d => d.id === docId);
    if (!doc) return;
    let saved: Partial<PlanDraft> = {};
    try { saved = JSON.parse(localStorage.getItem(`${DRAFT_KEY}:${docId}`) || "{}"); } catch {}
    const a = doc.currentArtifact;
    setDraftState({...DEFAULT_DRAFT, unitType:a.institutionalUnitType || "ACADEMIC", institutionalUnitId:a.institutionalUnitId || "unit-fisei", careerId:a.careerId || "career-software", grupo:doc.grupo, periodo:doc.periodo, fuente:a.fuente || "", collectsPersonalData:a.collectsPersonalData || false, justificacion:a.justificacion || "", objetivo:a.objetivo || "", matriz:(a.matriz || []).map(m => ({...m, categoria:getActivityType(m), activityType:getActivityType(m), tipo:"otra", descripcion:""})), tieneAnexos:a.tieneAnexos, anexos:a.anexos.map(x => ({...x,descripcion:""})), ...saved});
  }

  function updateDraft(changes: Partial<PlanDraft>) {
    setDraftState(prev => ({ ...prev, ...changes }));
  }

  function saveDraft(changes: Partial<PlanDraft>) {
    const next = { ...draft, ...changes };
    setDraftState(next);
    setSaving(true);
    try { localStorage.setItem(docEngine ? `${DRAFT_KEY}:${docEngine.docMaster.id}` : DRAFT_KEY, JSON.stringify(next)); } catch {}
    setTimeout(() => setSaving(false), 700);
  }

  function goToMatrizCompletarPendientes() {
    const first = draft.matriz.find(a => !isCompleta(a));
    setInitialEditId(first?.id ?? null);
    setSub("step3edit");
  }

  function handleCorregir(targetDocId = docEngine?.docMaster.id) {
    if (docEngine) {
      if (targetDocId) docEngine.iniciarCorreccion(targetDocId);
    }

    setSub("step1");
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {sub === "list" && (
        docEngine ? (
          <MisDocumentosView
            docEngine={docEngine}
            grupos={gruposDisponibles} periodos={adminState?.periodos || []}
            onNewPlan={(groupId, periodId) => { const selectedGroup=gruposDisponibles.find(g => g.id === groupId); const selectedPeriod=adminState?.periodos.find(p => p.id === periodId); const firstUnit=adminState?.unidadesInstitucionales.find(u=>u.estado==="ACTIVO"&&u.tipo==="ACADEMIC"); const firstCareer=firstUnit?.carreras.find(c=>c.estado==="ACTIVO"); if(!selectedGroup || !selectedPeriod)return; docEngine.crearNuevoDocumento("PLAN_TRABAJO", {groupId,periodId,grupo:selectedGroup.nombre,periodo:selectedPeriod.nombre,institutionalUnitType:firstUnit?.tipo,institutionalUnitId:firstUnit?.id,unidadAcademica:firstUnit?.nombre,careerId:firstCareer?.id,carrera:firstCareer?.nombre}); setDraftState({...structuredClone(DEFAULT_DRAFT),unitType:firstUnit?.tipo||"ACADEMIC",institutionalUnitId:firstUnit?.id||"unit-fisei",careerId:firstCareer?.id||"career-software",grupo:selectedGroup.nombre,periodo:selectedPeriod.nombre,matriz:[],objetivo:"",justificacion:selectedGroup.descripcion || "",fechaElaboracion:todayFormatted()}); setMaxReached(1); setFormError(""); setSub("step1"); }}
            onNewInforme={() => {setInformeEditId(undefined); setSub("wizardInforme");}}
            onContinuarInforme={id => {setInformeEditId(id); setSub("wizardInforme");}}
            onContinuarPlan={(docId) => {
              docEngine.seleccionarDocumento(docId);
              cargarPlan(docId);
              setInitialEditId(null);
              setSub("step1");
            }}
            onCorregirPlan={(docId) => {
              docEngine.seleccionarDocumento(docId);
              cargarPlan(docId);
              handleCorregir(docId);
            }}
            onNavigateActividades={onNavigateActividades || (() => {})}
          />
        ) : (
          <PlanesListado
            planEstado="borrador"
            formalVersion="1.0"
            reviewRound={1}
            onNew={() => setSub("step1")}
            onContinuar={() => { setInitialEditId(null); setSub("step3edit"); }}
            onCorregir={() => handleCorregir()}
            onNavigateActividades={onNavigateActividades}
            initialShowObsModal={initialShowObsModal}
          />
        )
      )}
      {sub === "wizardInforme" && docEngine && (
        <WizardInformeView
          docEngine={docEngine}
          adminState={adminState!}
          onFinish={() => setSub("list")}
          onCancel={() => setSub("list")}
          previewLayout={previewLayout}
        />
      )}
      {sub !== "list" && docEngine?.docMaster.documentState === "EN CORRECCIÓN" && <details style={{padding:"8px 28px"}}><summary>Ver observaciones y resaltados del documento devuelto</summary><div style={{height:650}}><DocumentPdfPageViewer artifact={docEngine.currentArtifact} formalVersion={docEngine.docMaster.formalVersion} reviewRound={docEngine.docMaster.reviewRound} documentState="EN CORRECCIÓN" observations={docEngine.observations} flowStages={docEngine.flowStages} currentUser={{id:docEngine.currentArtifact.elaborador.id,nombre:docEngine.currentArtifact.elaborador.nombre,cargo:docEngine.currentArtifact.elaborador.cargo,role:"docente"}} readOnly onOpenFirmar={() => {}} onOpenDevolver={() => {}} onAddObservacion={() => {}} onResolveObservacion={id => docEngine.resolverObservacion(docEngine.docMaster.id,id)} /></div></details>}
      {sub === "step1" && (
        <Step1InfoGeneral grupo={draft.grupo} periodo={draft.periodo} unitType={draft.unitType} institutionalUnitId={draft.institutionalUnitId} careerId={draft.careerId} elaborador={docEngine?.currentUser.nombre || DOCENTE.nombre} error={formError} onSave={() => saveDraft({})} onChange={v => {setFormError("");saveDraft(v.grupo && v.grupo !== draft.grupo ? {...v,matriz:[],justificacion:gruposDisponibles.find(g => g.nombre === v.grupo)?.descripcion || "",objetivo:""} : v);}} grupos={gruposDisponibles} periodos={adminState?.periodos.filter(p => p.estado === "ACTIVO") || []} unidades={adminState?.unidadesInstitucionales || []} maxReached={maxReached} onNext={() => {
          const selectedPeriod=adminState?.periodos.find(p=>p.nombre===draft.periodo);
          if (docEngine?.documents.some(d => d.id !== docEngine.docMaster.id && d.documentType === "PLAN_TRABAJO" && d.teacherId === docEngine.currentUser.id && d.groupId === grupoActual?.id && d.periodId === selectedPeriod?.id)) {setFormError("Ya existe un Plan de Trabajo para este docente, grupo y período.");return;}
          if (!unidadActual || (draft.unitType === "ACADEMIC" && !carreraActual)) {setFormError("Seleccione una unidad institucional válida y su carrera cuando corresponda.");return;}
          if (docEngine && grupoActual && selectedPeriod) {docEngine.actualizarDatosBasicos(docEngine.docMaster.id,{groupId:grupoActual.id,periodId:selectedPeriod.id,grupo:draft.grupo,periodo:draft.periodo,institutionalUnitType:draft.unitType,institutionalUnitId:unidadActual.id,unidadAcademica:unidadActual.nombre,careerId:draft.unitType==="ACADEMIC"?carreraActual?.id:undefined,carrera:draft.unitType==="ACADEMIC"?carreraActual?.nombre:""}); const flow=adminState?.flujos.find(f => f.grupoId === grupoActual.id); if(flow?.estado === "CONFIGURADO" && flow.etapas.length > 1 && adminState) docEngine.configurarFlujoDocumento(docEngine.docMaster.id,flowFromConfiguration(flow,adminState.usuarios));}
          setMaxReached(m => Math.max(m, 2)); setSub("step4"); }} onCancel={() => setSub("list")} />
      )}
      {sub === "step2" && (
        <Step2Actividades grupoNombre={draft.grupo} periodoNombre={draft.periodo} catalogo={adminState ? adminState.actividadesCatalogo.filter(a => a.estado === "ACTIVO" && (a.gruposAsociadosNombres.includes(draft.grupo) || grupoActual?.actividades.some(g => g.actividadId === a.id))).map(a => ({id:adminState.actividadesCatalogo.indexOf(a)+1,nombre:a.nombre,descripcion:a.descripcion,categoria:a.categoria,tipo:grupoActual?.actividades.find(g => g.actividadId === a.id)?.obligatoriedad === "OBLIGATORIA" ? "obligatoria" : "opcional"})) : ACTIVIDADES_CATALOGO} matriz={draft.matriz} onChange={m => saveDraft({ matriz: m })} maxReached={maxReached} onPrev={() => setSub("step4")} onNext={() => { setMaxReached(m => Math.max(m, 4)); setSub("step5"); }} />
      )}
      {sub === "step3edit" && (
        <Step3Matriz
          maxReached={maxReached}
          responsablesGrupo={responsablesGrupo}
          responsablesGrupoIds={responsablesGrupoIds}
          groupType={grupoActual?.tipo}
          recursosCatalogo={(adminState?.recursos || RECURSOS_CATALOGO_INICIALES).filter(r => r.estado === "ACTIVO").map(r => r.nombre)}
          mediosCatalogo={(adminState?.medios || MEDIOS_CATALOGO_INICIALES).filter(r => r.estado === "ACTIVO").map(r => r.nombre)}
          periodo={periodoActual} feriados={adminState?.feriados || []}
          matriz={draft.matriz}
          setMatriz={m => updateDraft({ matriz: m })}
          saving={saving}
          onSave={m => saveDraft({ matriz: m })}
          initialEditId={initialEditId}
          onPrev={() => setSub("step4")}
          onNext={() => { setMaxReached(m => Math.max(m, 4)); setInitialEditId(null); setSub("step5"); }}
        />
      )}
      {sub === "step3review" && (
        <Step3Revision
          maxReached={maxReached}
          matriz={draft.matriz}
          groupType={grupoActual?.tipo}
          responsablesGrupo={responsablesGrupo}
          responsablesGrupoIds={responsablesGrupoIds}
          saving={saving}
          onPrev={() => { setInitialEditId(null); setSub("step3edit"); }}
          onNext={() => { setMaxReached(m => Math.max(m, 5)); setSub("step5"); }}
          onGoToMatrix={goToMatrizCompletarPendientes}
          onEditActivity={id => {setInitialEditId(id);setSub("step3edit");}}
        />
      )}
      {sub === "step4" && (
        <Step4Contenido
          textoBase={grupoActual?.descripcion}
          maxReached={maxReached}
          justificacion={draft.justificacion}
          setJustificacion={v => saveDraft({ justificacion: v })}
          objetivo={draft.objetivo}
          setObjetivo={v => saveDraft({ objetivo: v })}
          saving={saving}
          onSave={() => saveDraft({})}
          onPrev={() => setSub("step1")}
          onNext={() => { saveDraft(draft.matriz.length ? {} : { matriz: actividadesIniciales }); setMaxReached(m => Math.max(m, 3)); setSub("step3edit"); }}
        />
      )}
      {sub === "step5" && (
        <Step5Anexos
          maxReached={maxReached}
          tieneAnexos={draft.tieneAnexos}
          setTieneAnexos={v => updateDraft({ tieneAnexos: v })}
          anexos={draft.anexos}
          setAnexos={v => updateDraft({ anexos: v })}
          saving={saving}
          onSave={() => saveDraft({})}
          onPrev={() => setSub("step3edit")}
          onNext={() => { saveDraft({}); setMaxReached(m => Math.max(m, 5)); setSub("step6"); }}
        />
      )}
      {sub === "step6" && (
        <Step6Preview
          maxReached={maxReached}
          docEngine={docEngine}
          previewLayout={previewLayout}
          artifact={(() => {
            const base = docEngine?.currentArtifact;
            if (!base) throw new Error("Documento no seleccionado");
            const matriz = matrizDocumental;
            const draftArtifact = {...base,grupo:draft.grupo,periodo:draft.periodo,unidadAcademica:unidadActual?.nombre||base.unidadAcademica,institutionalUnitType:draft.unitType,institutionalUnitId:draft.institutionalUnitId,careerId:draft.careerId,carrera:draft.unitType==="ACADEMIC"?(carreraActual?.nombre||base.carrera):"",fuente:draft.fuente,collectsPersonalData:draft.collectsPersonalData,matriz,justificacion:draft.justificacion,objetivo:draft.objetivo,tieneAnexos:draft.tieneAnexos,anexos:draft.anexos.map(a => ({...a,tamano:""}))};
            const pages = composeArtifactPages(draftArtifact,docEngine?.flowStages || []);
            return {...draftArtifact,pages,pageCount:pages.length,signatureSlots:getSignatureSlots(pages)};
          })()}
          onPrev={() => setSub("step5")}
          onNext={() => {
            if (docEngine) {
              const id = docEngine.docMaster.id;
              if (docEngine.docMaster.documentState === "EN CORRECCIÓN") docEngine.prepararNuevaRonda(id);
              docEngine.actualizarDatosBasicos(id, {groupId:grupoActual?.id || docEngine.docMaster.groupId, periodId:periodoActual?.id || docEngine.docMaster.periodId, grupo:draft.grupo, periodo:draft.periodo,institutionalUnitType:draft.unitType,institutionalUnitId:draft.institutionalUnitId,unidadAcademica:unidadActual?.nombre,carrera:draft.unitType==="ACADEMIC"?carreraActual?.nombre:"",careerId:draft.unitType==="ACADEMIC"?draft.careerId:undefined});
              const flow = adminState?.flujos.find(f => f.grupoId === grupoActual?.id);
              if (flow?.estado === "CONFIGURADO" && flow.etapas.length > 1 && adminState) docEngine.configurarFlujoDocumento(id,flowFromConfiguration(flow,adminState.usuarios));
              docEngine.generarArtefacto(id, {collectsPersonalData:draft.collectsPersonalData,fuente:draft.fuente, justificacion: draft.justificacion, objetivo: draft.objetivo, matriz: matrizDocumental, tieneAnexos: draft.tieneAnexos, anexos: draft.anexos.map(a => ({...a, tamano: ""}))});
            }
            saveDraft({}); setMaxReached(m => Math.max(m, 6)); setSub("step7");
          }}
        />
      )}
      {sub === "step7" && (
        <Step7Firma
          maxReached={maxReached}
          docEngine={docEngine}
          onPrev={() => setSub("step6")}
          onNext={() => setSub("step8")}
        />
      )}
      {sub === "step8" && (
        <Step8Confirmacion docEngine={docEngine} onViewStatus={() => setSub("list")} onBackToList={() => setSub("list")} />
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────

// ─── Módulo 4 — Revisor ───────────────────────────────────────────────────────

type RevisorSub = "bandeja" | "revision" | "aprobado" | "devuelto";

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<AppView>("inicio");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const sidebarBeforePreview = useRef<boolean | null>(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const previewLayout: PreviewLayoutControls = {
    enter: () => { if (sidebarBeforePreview.current === null) sidebarBeforePreview.current = sidebarCollapsed; setSidebarCollapsed(true); },
    exit: () => { if (sidebarBeforePreview.current !== null) { setSidebarCollapsed(sidebarBeforePreview.current); sidebarBeforePreview.current = null; } setPreviewExpanded(false); },
    expanded: previewExpanded,
    setExpanded: setPreviewExpanded,
  };
  const [userRole, setUserRole] = useState<"docente" | "revisor" | "admin">("docente");
  const [planesViewKey, setPlanesViewKey] = useState(0);
  const auditoriaState = useAuditoriaState();
  const adminState = useAdminState();
  const docEngine = useDocumentEngine(auditoriaState.registrarEvento, {flujos:adminState.flujos,usuarios:adminState.usuarios,periodos:adminState.periodos,plantillas:adminState.plantillas});
  const sessionAdmin=adminState.usuarios.find(u => canonicalDemoActorId(u.id) === docEngine.currentUser.id);
  const sessionDisplay={nombre:docEngine.currentUser.nombre,nombreCorto:docEngine.currentUser.nombre,correo:sessionAdmin?.correo || "",avatar:sessionAdmin ? sessionAdmin.nombres[0]+sessionAdmin.apellidos[0] : "DE",rol:userRole === "admin" ? "Administrador" : userRole === "revisor" ? "Revisor" : "Docente"};
  const reviewerGroupNames=adminState.flujos.filter(f => f.etapas.some(e => e.revisoresIds?.some(id => canonicalDemoActorId(id) === docEngine.currentUser.id))).map(f => f.grupoNombre);
  const notifState = useNotificacionesState(userRole, docEngine.currentUser.id);
  const seguimientoState = useSeguimientoState({documents:docEngine.documents,currentUser:docEngine.currentUser,currentRole:userRole,reviewerGroupNames,closedPeriodNames:adminState.periodos.filter(p=>p.estado === "CERRADO").map(p=>p.nombre),onAuditLog:auditoriaState.registrarEvento,onNotification:notifState.agregarNotificacion});
  const reportesState = useReportesState(userRole,{documents:docEngine.documents,actividades:seguimientoState.actividades,currentUserName:docEngine.currentUser.nombre,reviewerGroupNames,periodosAdmin:adminState.periodos});
  const prevDocumentEvents=useRef(new Set<string>(["notification-doc-plan-andrea-vinculacion-2026-1-VALIDADO-usr-andrea-01"]));
  useEffect(() => {
    for (const doc of docEngine.documents) {
      const targets = doc.documentState === "DEVUELTO" || doc.documentState === "EN CORRECCIÓN" || doc.documentState === "VALIDADO"
        ? [{id: doc.currentArtifact.elaborador.id || "", role: "Docente" as const}]
        : doc.flowStages.filter(stage => stage.estado === "EN_CURSO" && stage.actorRole !== "docente" && stage.actorId).map(stage => ({id: stage.actorId!, role: "Revisor" as const}));
      for (const target of targets) {
        const id = `notification-${doc.id}-${doc.reviewRound}-${doc.documentState}-${target.id}`;
        if (!target.id || prevDocumentEvents.current.has(id)) continue;
        prevDocumentEvents.current.add(id);
        const returned = doc.documentState === "DEVUELTO" || doc.documentState === "EN CORRECCIÓN";
        const approved = doc.documentState === "VALIDADO";
        notifState.agregarNotificacion({id, destinatarioRol: target.role, destinatarioUsuarioId: target.id, titulo: returned ? "Documento devuelto" : approved ? "Documento validado" : "Documento asignado a revisión", mensaje: doc.nombre, fechaHora: doc.fechaUltimaActualizacion, tiempoRelativo: "Escenario DEMO", tipo: returned ? "PLAN_DEVUELTO" : approved ? "PLAN_APROBADO" : "PLAN_PENDIENTE_REVISION", leida: false, objetoRelacionado: {documentId: doc.id, tipo: "Plan de Trabajo", nombre: doc.nombre, grupo: doc.grupo, accionLabel: "Abrir documento", accionDestino: target.role === "Docente" ? "planes" : "bandeja", modalDirecto: returned ? "obsPlan" : target.role === "Revisor" ? "revisionPlan" : undefined}});
      }
    }
  }, [docEngine.documents]);
  const [adminSelectedGrupoId, setAdminSelectedGrupoId] = useState<string | null>(null);
  const [adminSelectedFlujoGrupoId, setAdminSelectedFlujoGrupoId] = useState<string | null>(null);
  const [planInitialObsModal, setPlanInitialObsModal] = useState(false);
  const [revisorInitialSub, setRevisorInitialSub] = useState<RevisorSub>("bandeja");
  const [actividadModalDirecto, setActividadModalDirecto] = useState<{ tipo: "observacion" | "visor"; medioId: string } | null>(null);

  function handleRoleSwitch() {
    if (userRole === "docente") {
      setRevisorInitialSub("bandeja");
      setUserRole("revisor");
      setView("bandeja");
    } else if (userRole === "revisor") {
      setUserRole("admin");
      setView("adminInicio");
    } else {
      setUserRole("docente");
      setView("planes");
      setPlanesViewKey(k => k + 1);
    }
  }

  function handleNotificationAction(notif: NotificacionItem) {
    const targetDocId=notif.objetoRelacionado.documentId;
    if(targetDocId) {docEngine.seleccionarDocumento(targetDocId);setPlanesViewKey(k=>k+1);}
    const dest = notif.objetoRelacionado.accionDestino as AppView;
    const modalDirecto = notif.objetoRelacionado.modalDirecto;
    const actId = notif.objetoRelacionado.actividadId;
    const medioId = notif.objetoRelacionado.medioId;

    setPlanInitialObsModal(false);
    setActividadModalDirecto(null);

    // 1. Plan devuelto -> Abre plan y modal de observaciones directamente
    if (notif.tipo === "PLAN_DEVUELTO" || modalDirecto === "obsPlan") {
      setPlanInitialObsModal(true);
      if (userRole !== "docente") setUserRole("docente");
      setView("planes");
      return;
    }

    // 2. Revisión de plan (revisor) -> Abre directamente la revisión del plan
    if (notif.tipo === "PLAN_PENDIENTE_REVISION" || notif.tipo === "PLAN_CORREGIDO" || modalDirecto === "revisionPlan") {
      if (userRole !== "revisor") setUserRole("revisor");
      setRevisorInitialSub("revision");
      setView("bandeja");
      return;
    }

    // 3. Evidencia observada -> Abre actividad y modal de observación docente directamente
    if (notif.tipo === "EVIDENCIA_OBSERVADA" || modalDirecto === "observacion") {
      if (actId) seguimientoState.setActividadSeleccionadaId(actId);
      if (medioId) setActividadModalDirecto({ tipo: "observacion", medioId });
      if (userRole !== "docente") setUserRole("docente");
      setView("actividades");
      return;
    }

    // 4. Evidencia validada -> Abre actividad y visor PDF directamente
    if (notif.tipo === "EVIDENCIA_VALIDADA" || modalDirecto === "visor") {
      if (actId) seguimientoState.setActividadSeleccionadaId(actId);
      if (medioId) setActividadModalDirecto({ tipo: "visor", medioId });
      if (userRole !== "docente") setUserRole("docente");
      setView("actividades");
      return;
    }

    // 5. Revisar evidencia (revisor) -> Abre revisión de evidencia pendiente directamente
    if (notif.tipo === "EVIDENCIA_CARGADA" || notif.tipo === "EVIDENCIA_REEMPLAZADA") {
      if (userRole !== "revisor") setUserRole("revisor");
      if (actId && medioId) {
        seguimientoState.setEvidenciaSeleccionada({ actividadId: actId, medioId });
      }
      setView("evidenciasValidar");
      return;
    }

    // 6. Actividad u otro destino general
    if (actId) {
      seguimientoState.setActividadSeleccionadaId(actId);
    }
    if (dest) {
      setView(dest);
    }
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {!previewExpanded && <Sidebar
        sessionUser={sessionDisplay}
        view={view} setView={setView} onLogout={onLogout}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
        userRole={userRole} onRoleSwitch={handleRoleSwitch}
        noLeidasCount={notifState.noLeidasCount}
      />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar
          sessionUser={sessionDisplay}
          view={view}
          userRole={userRole}
          noLeidasCount={notifState.noLeidasCount}
          notificaciones={notifState.notificaciones}
          onMarcarLeida={notifState.marcarLeida}
          onMarcarTodasLeidas={notifState.marcarTodasLeidas}
          onNavigateToNotificaciones={() => setView("notificaciones")}
          onSelectAction={handleNotificationAction}
        />
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 20px",background:"#eff6ff",borderBottom:"1px solid #bfdbfe",fontSize:12}}>
          <label>Sesión DEMO: <select aria-label="Cambiar persona de la sesión DEMO" value={sessionAdmin?.id || ""} onChange={e => {const u=adminState.usuarios.find(u => u.id === e.target.value);if(u){docEngine.simularSesionDemo(u.id,u.nombreCompleto);setPlanesViewKey(k=>k+1);setRevisorInitialSub("bandeja");setView(u.rol === "Administrador" ? "adminInicio" : u.rol.includes("Revisor") ? "bandeja" : "planes");setUserRole(u.rol === "Administrador" ? "admin" : u.rol.includes("Revisor") ? "revisor" : "docente");}}}>{adminState.usuarios.filter(u => u.estado === "ACTIVO").map(u => <option key={u.id} value={u.id}>{u.nombreCompleto}</option>)}</select></label>
          <span>Cambiar contexto conserva esta identidad.</span>
          <button className="btn btn-ghost btn-xs" onClick={() => {
            docEngine.restablecerDemo();
            seguimientoState.restablecerDemo();
            try {
              Object.keys(localStorage)
                .filter(key => key === DRAFT_KEY || key.startsWith(`${DRAFT_KEY}:`) || key === "fisei-informe-draft-v2")
                .forEach(key => localStorage.removeItem(key));
            } catch {}
            setPlanesViewKey(k=>k+1);
            setView("planes");
          }}>Restablecer documentos DEMO</button>
        </div>
        <main style={{ flex: 1, overflowY: "auto", background: "#f0f4f8" }}>
          {view === "inicio" && (
            <DashboardInicio
              onNavigateActividades={() => {
                seguimientoState.setActividadSeleccionadaId(null);
                setView("actividades");
              }}
              onNavigatePlanes={() => setView("planes")}
              onSelectActividad={(id) => {
                seguimientoState.setActividadSeleccionadaId(id);
                setView("actividades");
              }}
              resumen={seguimientoState.resumen}
              actividadesData={seguimientoState.actividades}
            />
          )}
          {view === "planes" && (
            <PlanesView
              key={planesViewKey}
              adminState={adminState}
              docEngine={docEngine}
              initialShowObsModal={planInitialObsModal}
              onNavigateActividades={() => {
                seguimientoState.setActividadSeleccionadaId(null);
                setView("actividades");
              }}
              previewLayout={previewLayout}
            />
          )}
          {view === "actividades" && (
            seguimientoState.actividadSeleccionada ? (
              <DetalleActividadView
                currentUserName={docEngine.currentUser.nombre}
                actividad={seguimientoState.actividadSeleccionada}
                onBack={() => {
                  seguimientoState.setActividadSeleccionadaId(null);
                  setActividadModalDirecto(null);
                }}
                onCargarEvidencia={seguimientoState.cargarEvidencia}
                onReemplazarEvidencia={seguimientoState.reemplazarEvidencia}
                initialModalDirecto={actividadModalDirecto}
              />
            ) : (
              <MisActividadesView
                currentUserName={docEngine.currentUser.nombre}
              actividades={seguimientoState.actividades}
                onSelectActividad={(id) => {
                  setActividadModalDirecto(null);
                  seguimientoState.setActividadSeleccionadaId(id);
                }}
                resumen={seguimientoState.resumen}
              />
            )
          )}
          {view === "evidencias" && (
            <MisEvidenciasView
              currentUserName={docEngine.currentUser.nombre}
              actividades={seguimientoState.actividades}
              onCargarEvidencia={seguimientoState.cargarEvidencia}
              onReemplazarEvidencia={seguimientoState.reemplazarEvidencia}
              onNavigateToActividad={(id) => {
                seguimientoState.setActividadSeleccionadaId(id);
                setView("actividades");
              }}
            />
          )}
          {view === "evidenciasValidar" && (
            seguimientoState.evidenciaSeleccionada && seguimientoState.itemEvidenciaActivo ? (
              <RevisarEvidenciaView
                currentUserName={docEngine.currentUser.nombre}
                item={seguimientoState.itemEvidenciaActivo}
                onBack={() => seguimientoState.setEvidenciaSeleccionada(null)}
                onValidar={(actividadId: string, medioId: string) => {
                  seguimientoState.validarEvidencia(actividadId, medioId);
                  seguimientoState.setEvidenciaSeleccionada(null);
                }}
                onObservar={(actividadId: string, medioId: string, observacion: string) => {
                  seguimientoState.observarEvidencia(actividadId, medioId, observacion);
                  seguimientoState.setEvidenciaSeleccionada(null);
                }}
              />
            ) : (
              <BandejaEvidenciasRevisorView
                items={seguimientoState.itemsBandejaRevisor}
                resumen={seguimientoState.resumenBandeja}
                onSelectEvidencia={(actividadId: string, medioId: string) => {
                  seguimientoState.setEvidenciaSeleccionada({ actividadId, medioId });
                }}
              />
            )
          )}
          {view === "seguimiento" && (
            <SeguimientoPlanesView
              planes={seguimientoState.planesSeguimiento}
              resumenGlobal={seguimientoState.resumenSeguimientoGlobal}
            />
          )}
          {view === "notificaciones" && (
            <NotificacionesView
              notificaciones={notifState.notificaciones}
              noLeidasCount={notifState.noLeidasCount}
              onMarcarLeida={notifState.marcarLeida}
              onToggleLeida={notifState.toggleLeida}
              onMarcarTodasLeidas={notifState.marcarTodasLeidas}
              onRestablecerDemo={notifState.restablecerDemo}
              onActionNavigate={handleNotificationAction}
            />
          )}
          {view === "perfil" && <PerfilView userRole={userRole} currentUser={sessionAdmin} />}
          {(view === "bandeja" || view === "planesRevision") && (
            <RevisorDocumentEngineView
              docEngine={docEngine}
              userRole={userRole}
              initialSub={revisorInitialSub}
            />
          )}

          {view === "grupos" && <GruposInstitucionalesView grupos={adminState.grupos.filter(g=>g.miembros.some(m=>canonicalDemoActorId(m.usuarioId) === docEngine.currentUser.id))} onSelectGrupo={id=>{setAdminSelectedGrupoId(id);setView("adminGrupos");}} onCrearGrupo={adminState.crearGrupo} />}
          {/* Módulo 7 — Administración y Configuración Institucional */}
          {view === "adminInicio" && (
            <AdminDashboardView
              metricas={{
                usuariosActivos: adminState.usuarios.filter(u => u.estado === "ACTIVO").length,
                gruposInstitucionales: adminState.grupos.length,
                periodoActivo: adminState.periodos.find(p => p.estado === "ACTIVO")?.nombre ?? "Julio – Diciembre 2026",
                borradores: docEngine.documents.filter(d=>d.documentState === "BORRADOR" || d.documentState === "LISTO PARA FIRMA").length,
                enRevision: docEngine.documents.filter(d=>d.documentState === "EN REVISIÓN" || d.documentState === "EN VALIDACIÓN FINAL").length,
                enCorreccion: docEngine.documents.filter(d=>d.documentState === "EN CORRECCIÓN" || d.documentState === "DEVUELTO").length,
                validados: docEngine.documents.filter(d=>d.documentState === "VALIDADO").length,
                enEjecucion: docEngine.documents.filter(d=>d.documentState === "EN EJECUCIÓN" || d.operationalState === "EN EJECUCIÓN").length,
                evidenciasPendientes: seguimientoState.actividades.flatMap(a=>a.medios).filter(m=>m.estado === "PENDIENTE DE VALIDACIÓN").length,
                evidenciasObservadas: seguimientoState.actividades.flatMap(a=>a.medios).filter(m=>m.estado === "OBSERVADA").length,
                evidenciasValidadas: seguimientoState.actividades.flatMap(a=>a.medios).filter(m=>m.estado === "VALIDADA").length,
                flujosConfigurados: adminState.flujos.filter(f=>f.estado === "CONFIGURADO").length,
                flujosPendientes: adminState.flujos.filter(f=>f.estado === "PENDIENTE").length,
                actividadReciente: auditoriaState.eventos.slice(0,4).map(e=>`${e.accion}: ${e.objeto}`),
              }}
              onNavigate={(v) => {
                if (v === "adminGrupos") setAdminSelectedGrupoId(null);
                if (v === "adminFlujos") setAdminSelectedFlujoGrupoId(null);
                setView(v as AppView);
              }}
            />
          )}
          {view === "adminUsuarios" && (
            <UsuariosView
              usuarios={adminState.usuarios}
              grupos={adminState.grupos}
              onCrearUsuario={adminState.crearUsuario}
              onToggleEstadoUsuario={adminState.toggleEstadoUsuario}
              onAsignarGrupo={adminState.asignarUsuarioAGrupo}
              onQuitarGrupo={adminState.quitarUsuarioDeGrupo}
            />
          )}
          {view === "adminGrupos" && (
            adminSelectedGrupoId && adminState.grupos.find(g => g.id === adminSelectedGrupoId) ? (
              <GrupoDetalleView
                grupo={adminState.grupos.find(g => g.id === adminSelectedGrupoId)!}
                usuariosDisponibles={adminState.usuarios}
                flujo={adminState.flujos.find(f => f.grupoId === adminSelectedGrupoId)}
                onBack={() => setAdminSelectedGrupoId(null)}
                onAgregarIntegrante={adminState.asignarUsuarioAGrupo}
                onQuitarIntegrante={adminState.quitarUsuarioDeGrupo}
                onToggleObligatoriedad={adminState.toggleObligatoriedadActividadGrupo}
                onNavigateFlujos={(grupoId) => {
                  setAdminSelectedFlujoGrupoId(grupoId);
                  setView("adminFlujos");
                }}
              />
            ) : (
              <GruposInstitucionalesView
                grupos={adminState.grupos}
                onSelectGrupo={(id) => setAdminSelectedGrupoId(id)}
                onCrearGrupo={adminState.crearGrupo}
              />
            )
          )}
          {view === "adminPeriodos" && (
            <PeriodosAcademicosView
              periodos={adminState.periodos}
              onCrearPeriodo={adminState.crearPeriodo}
            />
          )}
          {view === "adminActividades" && (
            <ActividadesInstitucionalesView
              actividades={adminState.actividadesCatalogo}
              onAgregarActividad={adminState.agregarActividadCatalogo}
            />
          )}
          {view === "adminCatalogos" && (
            <CatalogosView
              recursos={adminState.recursos}
              medios={adminState.medios}
              onAgregarRecurso={adminState.agregarRecurso}
              onToggleEstadoRecurso={adminState.toggleEstadoRecurso}
              onAgregarMedio={adminState.agregarMedio}
              onToggleEstadoMedio={adminState.toggleEstadoMedio}
            />
          )}
          {view === "adminUnidades" && (
            <UnidadesInstitucionalesView unidades={adminState.unidadesInstitucionales} onGuardar={adminState.guardarUnidadInstitucional} onToggleEstado={adminState.toggleEstadoUnidadInstitucional} />
          )}
          {view === "adminFlujos" && (
            adminSelectedFlujoGrupoId && adminState.flujos.find(f => f.grupoId === adminSelectedFlujoGrupoId) ? (
              <ConfigurarFlujoView
                flujo={adminState.flujos.find(f => f.grupoId === adminSelectedFlujoGrupoId)!}
                usuariosDisponibles={adminState.usuarios}
                onBack={() => setAdminSelectedFlujoGrupoId(null)}
                onGuardarFlujo={(grupoId, etapas) => {
                  adminState.actualizarEtapasFlujo(grupoId, etapas);
                  setAdminSelectedFlujoGrupoId(null);
                }}
              />
            ) : (
              <FlujosAprobacionView
                flujos={adminState.flujos}
                onConfigurarFlujo={(grupoId) => setAdminSelectedFlujoGrupoId(grupoId)}
              />
            )
          )}
          {view === "adminFeriados" && (
            <FeriadosView
              feriados={adminState.feriados}
              onAgregarFeriado={adminState.agregarFeriado}
              onToggleEstadoFeriado={adminState.toggleEstadoFeriado}
            />
          )}
          {view === "adminPlantillas" && (
            <PlantillasDocumentalesView
              plantillas={adminState.plantillas}
              onGuardar={adminState.guardarConfiguracionPlantilla}
              onRestaurar={adminState.restaurarConfiguracionPlantilla}
            />
          )}

          {/* Módulo 8 — Auditoría Institucional */}
          {view === "adminAuditoria" && (
            <AuditoriaView
              eventos={auditoriaState.eventos}
              totalEventosCount={auditoriaState.totalEventosCount}
              filtros={auditoriaState.filtros}
              setFiltro={auditoriaState.setFiltro}
              limpiarFiltros={auditoriaState.limpiarFiltros}
              metricas={auditoriaState.metricas}
              onSelectEvento={auditoriaState.setEventoSeleccionado}
              onOpenTrazabilidad={auditoriaState.abrirTrazabilidadPorId}
            />
          )}

          {/* MÓDULO 9 — REPORTES, CONSULTA HISTÓRICA Y CIERRE DE PERÍODO */}
          {view === "reportes" && (
            <div className="p-6 max-w-7xl mx-auto">
              {reportesState.subView === "detalle" && reportesState.selectedPlan ? (
                <ReporteDetallePlanView
                  plan={reportesState.selectedPlan}
                  onVolver={() => reportesState.setSubView("resumen")}
                  onGenerarReporte={(plan) => reportesState.handleOpenGenerarReporte(plan)}
                  onVerEvidencias={() => setView("actividades")}
                />
              ) : reportesState.subView === "detalleHistorico" && reportesState.selectedHistorico ? (
                <PlanHistoricoDetalleView
                  plan={reportesState.selectedHistorico}
                  onVolver={() => reportesState.setSubView("historico")}
                  onCompararVersiones={(plan) => {
                    reportesState.setSelectedHistoricoId(plan.id);
                    reportesState.setModalCompararVersionesOpen(true);
                  }}
                  onVerTrazabilidadEvidencia={(eviId) => {
                    auditoriaState.abrirTrazabilidadPorId(eviId);
                  }}
                  onGenerarReporte={(plan) => {
                    const planAsReporte: ReportePlanItem = {
                      id: plan.id,
                      nombre: plan.planNombre,
                      grupo: plan.grupo,
                      docente: plan.docente,
                      periodo: plan.periodo,
                      version: plan.versionVigente,
                      estado: "FINALIZADO",
                      actividadesTotal: plan.actividadesTotal,
                      actividadesCompletas: plan.actividadesTotal,
                      evidenciasRequeridas: plan.evidenciasRequeridas,
                      evidenciasCargadas: plan.evidenciasValidadas,
                      evidenciasValidadas: plan.evidenciasValidadas,
                      evidenciasObservadas: 0,
                      evidenciasPendientes: 0,
                    };
                    reportesState.handleOpenGenerarReporte(planAsReporte);
                  }}
                />
              ) : reportesState.subView === "historico" ? (
                <ConsultaHistoricaView
                  planesHistoricos={reportesState.historicosFiltrados}
                  periodos={reportesState.periodos}
                  onSeleccionarPlan={(plan) => {
                    reportesState.setSelectedHistoricoId(plan.id);
                    reportesState.setSubView("detalleHistorico");
                  }}
                  onGenerarReporte={(plan) => {
                    const planAsReporte: ReportePlanItem = {
                      id: plan.id,
                      nombre: plan.planNombre,
                      grupo: plan.grupo,
                      docente: plan.docente,
                      periodo: plan.periodo,
                      version: plan.versionVigente,
                      estado: "FINALIZADO",
                      actividadesTotal: plan.actividadesTotal,
                      actividadesCompletas: plan.actividadesTotal,
                      evidenciasRequeridas: plan.evidenciasRequeridas,
                      evidenciasCargadas: plan.evidenciasValidadas,
                      evidenciasValidadas: plan.evidenciasValidadas,
                      evidenciasObservadas: 0,
                      evidenciasPendientes: 0,
                    };
                    reportesState.handleOpenGenerarReporte(planAsReporte);
                  }}
                  onVolver={() => reportesState.setSubView("resumen")}
                />
              ) : userRole === "docente" ? (
                <ReportesDocenteView
                  planes={reportesState.planesFiltrados}
                  onSeleccionarPlan={(plan) => {
                    reportesState.setSelectedPlanId(plan.id);
                    reportesState.setSubView("detalle");
                  }}
                  onGenerarReporte={(plan) => reportesState.handleOpenGenerarReporte(plan)}
                  onIrAConsultaHistorica={() => reportesState.setSubView("historico")}
                  onVerEvidencias={() => setView("actividades")}
                />
              ) : userRole === "revisor" ? (
                <ReportesRevisorView
                  planes={reportesState.planesFiltrados}
                  onSeleccionarPlan={(plan) => {
                    reportesState.setSelectedPlanId(plan.id);
                    reportesState.setSubView("detalle");
                  }}
                  onGenerarReporte={(plan) => reportesState.handleOpenGenerarReporte(plan)}
                  onIrAConsultaHistorica={() => reportesState.setSubView("historico")}
                />
              ) : (
                <ReportesAdminView
                  planes={reportesState.planesFiltrados}
                  periodos={reportesState.periodos}
                  onSeleccionarPlan={(plan) => {
                    reportesState.setSelectedPlanId(plan.id);
                    reportesState.setSubView("detalle");
                  }}
                  onGenerarReporte={(plan) => reportesState.handleOpenGenerarReporte(plan)}
                  onGenerarReporteConsolidado={() => {
                    if (reportesState.planesFiltrados.length > 0) {
                      reportesState.handleOpenGenerarReporte(reportesState.planesFiltrados[0]);
                    }
                  }}
                  onIrAConsultaHistorica={() => reportesState.setSubView("historico")}
                  onIrACierrePeriodos={() => setView("cierrePeriodos")}
                />
              )}
            </div>
          )}

          {view === "cierrePeriodos" && (
            <div className="p-6 max-w-7xl mx-auto">
              <CierrePeriodosView
                periodos={reportesState.periodos}
                onIniciarCierrePeriodo={(periodo) => {
                  reportesState.setPeriodoParaCierre(periodo);
                  reportesState.setModalConfirmarCierreOpen(true);
                }}
                onConsultarHistorico={() => {
                  setView("reportes");
                  reportesState.setSubView("historico");
                }}
                onRestablecerDemo={() => {reportesState.handleRestablecerDemo();adminState.restablecerPeriodosDemo();}}
              />
            </div>
          )}
        </main>
      </div>

      {/* Módulo 8 — Modales y Drawers Globales de Auditoría */}
      <AuditoriaDetalleDrawer
        evento={auditoriaState.eventoSeleccionado}
        onClose={() => auditoriaState.setEventoSeleccionado(null)}
        onVerTrazabilidad={auditoriaState.abrirTrazabilidadPorId}
      />
      <TrazabilidadModal
        objetoInicial={auditoriaState.trazabilidadModal}
        onClose={() => auditoriaState.setTrazabilidadModal(null)}
      />

      {/* Módulo 9 — Modales de Reportes, Vista Previa A4, Versiones y Cierre */}
      <ModalGenerarReporte
        isOpen={reportesState.modalGenerarOpen}
        onClose={() => reportesState.setModalGenerarOpen(false)}
        plan={reportesState.planParaReporte}
        onGenerar={(tipo, formato) => reportesState.handleConfirmGenerar(tipo, formato)}
      />
      <ModalVistaPreviaReporte
        isOpen={reportesState.modalVistaPreviaOpen}
        onClose={() => reportesState.setModalVistaPreviaOpen(false)}
        plan={reportesState.configReporteGenerado?.plan || null}
        tipo={reportesState.configReporteGenerado?.tipo || "resumen_plan"}
        formato={reportesState.configReporteGenerado?.formato || "PDF"}
      />
      <ModalCompararVersiones
        isOpen={reportesState.modalCompararVersionesOpen}
        onClose={() => reportesState.setModalCompararVersionesOpen(false)}
        plan={reportesState.selectedHistorico}
      />
      <ModalConfirmarCierre
        isOpen={reportesState.modalConfirmarCierreOpen}
        onClose={() => {
          reportesState.setModalConfirmarCierreOpen(false);
          reportesState.setPeriodoParaCierre(null);
        }}
        periodo={reportesState.periodoParaCierre}
        onConfirmar={(periodoId) => {reportesState.handleCerrarPeriodo(periodoId);adminState.establecerEstadoPeriodoDemo(periodoId,"CERRADO");}}
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<AuthScreen>("login");

  return (
    <div style={{ height: "100%" }}>
      {screen === "login" && (
        <LoginScreen
          onLogin={() => setScreen("app")}
          onForgot={() => setScreen("recovery")}
          onFirstLogin={() => setScreen("changePassword")}
        />
      )}
      {screen === "changePassword" && (
        <ChangePasswordScreen onDone={() => setScreen("app")} onCancel={() => setScreen("login")} />
      )}
      {screen === "recovery" && (
        <RecoveryScreen onBack={() => setScreen("login")} />
      )}
      {screen === "app" && (
        <AuthenticatedApp onLogout={() => setScreen("login")} />
      )}
    </div>
  );
}
