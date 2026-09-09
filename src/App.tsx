import { useState, useRef, useEffect } from "react";
import { useActividadesState } from "./modulo5/useActividadesState";
import MisActividadesView from "./modulo5/MisActividadesView";
import DetalleActividadView from "./modulo5/DetalleActividadView";
import MisEvidenciasView from "./modulo5/MisEvidenciasView";
import { useSeguimientoState } from "./modulo6/useSeguimientoState";
import BandejaEvidenciasRevisorView from "./modulo6/BandejaEvidenciasRevisorView";
import RevisarEvidenciaView from "./modulo6/RevisarEvidenciaView";
import SeguimientoPlanesView from "./modulo6/SeguimientoPlanesView";
import DetalleSeguimientoPlanView from "./modulo6/DetalleSeguimientoPlanView";

// ─── Types ───────────────────────────────────────────────────────────────────

type AuthScreen = "login" | "changePassword" | "recovery" | "app";
type AppView = "inicio" | "planes" | "actividades" | "evidencias" | "notificaciones" | "perfil" | "bandeja" | "planesRevision" | "seguimiento" | "grupos" | "evidenciasValidar";
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
};

// ─── Shared: FISEI Logo Block ─────────────────────────────────────────────────

function FISEILogoMark({ size = 44 }: { size?: number }) {
  const s = size;
  return (
    <div style={{
      width: s, height: s, borderRadius: Math.round(s * 0.22),
      background: "#1a4f8a",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      flexShrink: 0, border: "2px solid rgba(255,255,255,0.18)", gap: Math.round(s * 0.04),
    }}>
      {/* Placeholder: stacked lines representing a document/crest */}
      <div style={{ width: s * 0.55, height: 2, background: "rgba(255,255,255,0.85)", borderRadius: 1 }} />
      <div style={{ width: s * 0.4, height: 1.5, background: "rgba(255,255,255,0.55)", borderRadius: 1 }} />
      <div style={{ width: s * 0.5, height: 1.5, background: "rgba(255,255,255,0.55)", borderRadius: 1 }} />
      <div style={{ width: s * 0.32, height: 1.5, background: "rgba(255,255,255,0.35)", borderRadius: 1 }} />
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
              <div style={{ color: "#e8f0fa", fontWeight: 700, fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>Gestión de Planes de Trabajo</div>
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
              Gestión de<br />Planes de Trabajo
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

function LoginScreen({ onLogin, onForgot, onFirstLogin }: {
  onLogin: () => void;
  onForgot: () => void;
  onFirstLogin: () => void;
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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

          <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", padding: "11px 16px", fontSize: 14, fontWeight: 700, letterSpacing: "0.03em" }}>
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

function Sidebar({ view, setView, onLogout, collapsed, setCollapsed, userRole, onRoleSwitch }: {
  view: AppView;
  setView: (v: AppView) => void;
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  userRole: "docente" | "revisor";
  onRoleSwitch: () => void;
}) {
  const docenteItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: "inicio",         label: "Inicio",                icon: Ico.home },
    { id: "planes",         label: "Mis Planes de Trabajo", icon: Ico.file },
    { id: "actividades",    label: "Mis Actividades",       icon: Ico.activity },
    { id: "evidencias",     label: "Evidencias",            icon: Ico.paperclip },
    { id: "notificaciones", label: "Notificaciones",        icon: Ico.bell },
    { id: "perfil",         label: "Perfil",                icon: Ico.user },
  ];
  const revisorItems: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: "evidenciasValidar", label: "Evidencias por validar", icon: Ico.paperclip },
    { id: "seguimiento",    label: "Seguimiento",           icon: Ico.activity },
    { id: "bandeja",        label: "Bandeja de revisión (Planes)", icon: Ico.file },
    { id: "planesRevision", label: "Planes de Trabajo",     icon: Ico.home },
    { id: "grupos",         label: "Grupos asignados",      icon: Ico.users },
    { id: "notificaciones", label: "Notificaciones",        icon: Ico.bell },
    { id: "perfil",         label: "Perfil",                icon: Ico.user },
  ];
  const navItems = userRole === "revisor" ? revisorItems : docenteItems;
  const currentUser = userRole === "revisor" ? REVISOR : DOCENTE;

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
                <div style={{ color: "#e8f0fa", fontWeight: 700, fontSize: 13, fontFamily: "'DM Sans',sans-serif", lineHeight: 1.2 }}>Gestión de Planes de Trabajo</div>
                <div style={{ color: "#7aaed0", fontSize: 10.5 }}>FISEI — UTA</div>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              title="Contraer navegación"
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
              background: userRole === "revisor" ? "#1a6a4a" : "#2563ab", color: "#fff",
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
            background: userRole === "revisor" ? "#1a6a4a" : "#2563ab", color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700,
          }} title={currentUser.nombreCorto}>{currentUser.avatar}</div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, marginTop: 8 }}>
        {!collapsed && (
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4a6d94", padding: "12px 24px 4px" }}>
            Principal
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
            {!collapsed && n.id === "notificaciones" && (
              <span style={{
                marginLeft: "auto", background: "#ef4444", color: "#fff",
                borderRadius: 99, fontSize: 10, fontWeight: 700, padding: "0px 6px", lineHeight: "16px",
              }}>3</span>
            )}
            {collapsed && n.id === "notificaciones" && (
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
          title={collapsed ? (userRole === "revisor" ? "Cambiar a Docente" : "Cambiar a Revisor") : undefined}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 8,
            padding: collapsed ? "10px 0" : "8px 16px",
            borderRadius: 6, cursor: "pointer",
            fontSize: 12, color: userRole === "revisor" ? "#6adba8" : "#7aaed0",
            marginBottom: 4, transition: "all 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          {!collapsed && (userRole === "revisor" ? "Modo: Revisor" : "Modo: Docente")}
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

function TopBar({ view, userRole }: { view: AppView; userRole: "docente" | "revisor" }) {
  const currentUser = userRole === "revisor" ? REVISOR : DOCENTE;
  const avatarBg = userRole === "revisor" ? "#1a6a4a" : "#1a4f8a";
  const labels: Record<AppView, string> = {
    inicio: "Inicio",
    planes: "Mis Planes de Trabajo",
    actividades: "Mis Actividades",
    evidencias: "Evidencias",
    notificaciones: "Notificaciones",
    perfil: "Perfil",
    bandeja: "Bandeja de revisión (Planes)",
    planesRevision: "Planes de Trabajo",
    seguimiento: "Seguimiento",
    grupos: "Grupos asignados",
    evidenciasValidar: "Evidencias por validar",
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

        {/* Bell */}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ color: "#64748b" }}>{Ico.bell}</span>
          <span style={{
            position: "absolute", top: -5, right: -5,
            width: 14, height: 14, borderRadius: "50%", background: "#ef4444",
            color: "#fff", fontSize: 9, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>3</span>
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
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚧</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13 }}>Este módulo se desarrollará en la siguiente iteración.</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÓDULO 2 — PLANES DE TRABAJO (DOCENTE)
// ═══════════════════════════════════════════════════════════════════════════════

type PlanesSubView = "list" | "step1" | "step2" | "step3edit" | "step3review" | "step4" | "step5" | "step6" | "step7" | "step8";

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
  tipo: "obligatoria" | "opcional" | "otra";
  descripcion: string;
  desde: string;
  hasta: string;
  responsables: string[];
  recursos: string[];
  medios: string[];
}

const RESPONSABLES_GRUPO = [
  "Ing. Andrea Pérez, Mg.",
  "Ing. Carlos López, Mg.",
  "Ing. María Torres, Mg.",
  "Dr. Luis Almeida",
  "Ing. Patricia Salazar, Mg.",
  "MSc. Roberto Vega",
];

const RECURSOS_CATALOGO = [
  "Matriz de seguimiento", "Almacenamiento institucional", "Reglamento de titulación",
  "Sistema de gestión académica", "Sala de reuniones", "Equipos de cómputo",
];

const MEDIOS_CATALOGO = ["Informe", "Acta", "Oficio", "Resolución", "Registro fotográfico", "Certificado"];

// ─── Stepper ──────────────────────────────────────────────────────────────────

const STEPS = [
  "Información general",
  "Actividades",
  "Matriz de actividades",
  "Contenido",
  "Anexos",
  "Previsualización",
  "Firma y envío",
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

// ─── 01 — Mis Planes de Trabajo (List) ───────────────────────────────────────

function PlanesListado({ onNew, onContinuar, planEstado, onCorregir, observacionesRevision, mensajeDevolucion, fechaDevolucion, onNavigateActividades }: {
  onNew: () => void;
  onContinuar: () => void;
  planEstado: "borrador" | "en-revision" | "devuelto" | "en-correccion";
  onCorregir?: () => void;
  observacionesRevision?: Observacion[];
  mensajeDevolucion?: string;
  fechaDevolucion?: string;
  onNavigateActividades?: () => void;
}) {
  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [showObsModal, setShowObsModal] = useState(false);

  const comisionEstado =
    planEstado === "en-revision" ? "EN REVISIÓN" :
    planEstado === "devuelto" ? "DEVUELTO" :
    planEstado === "en-correccion" ? "EN CORRECCIÓN" : "BORRADOR";
  const comisionAcciones =
    planEstado === "en-revision" ? ["ver", "ver-estado"] :
    planEstado === "devuelto" ? ["ver-obs", "corregir"] :
    planEstado === "en-correccion" ? ["ver-obs", "continuar"] : ["continuar"];
  const comisionActualizado =
    planEstado === "devuelto" || planEstado === "en-correccion"
      ? (fechaDevolucion || new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }).replace(".", ""))
      : planEstado === "en-revision"
        ? new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "")
        : "04 sep. 2026";

  const TODOS_LOS_PLANES = [
    { nombre: "Plan de Trabajo", grupo: "Unidad de Titulación",           periodo: "Julio – Diciembre 2026", version: "Versión 1.0", estado: "EN EJECUCIÓN",  actualizado: "05 sep. 2026",      acciones: ["ver", "actividades"] },
    { nombre: "Plan de Trabajo", grupo: "Comisión de Eventos Académicos", periodo: "Julio – Diciembre 2026", version: "Versión 1.0", estado: comisionEstado,   actualizado: comisionActualizado, acciones: comisionAcciones },
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
    "EN EJECUCIÓN":  { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "ARCHIVADO":     { bg: "#f1f5f9", color: "#334155", dot: "#64748b" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>
            Mis Planes de Trabajo
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
            {mensajeDevolucion && (
              <div style={{ margin: "14px 24px 0", padding: "10px 14px", background: "#fef3c7", borderRadius: 8, fontSize: 13, color: "#92400e", border: "1px solid #fde68a" }}>
                <b>Mensaje del revisor:</b> {mensajeDevolucion}
              </div>
            )}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 24px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              {(observacionesRevision ?? []).length === 0 ? (
                <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", marginTop: 20 }}>No hay observaciones registradas.</p>
              ) : (observacionesRevision ?? []).map((o, idx) => (
                <div key={o.id} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 14px", border: "1px solid #e2e8f0" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: o.tipo === "general" ? "#475569" : "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 }}>
                    {o.tipo === "general" ? "General" : o.seccion}
                  </div>
                  <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.55, marginBottom: 4 }}>"{o.texto}"</p>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.autor} — {o.fecha}</div>
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
                        <button className="btn btn-ghost btn-xs">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          Ver
                        </button>
                      )}
                      {p.acciones.includes("actividades") && (
                        <button className="btn btn-ghost btn-xs" onClick={onNavigateActividades}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                          Actividades
                        </button>
                      )}
                      {p.acciones.includes("ver-estado") && (
                        <button className="btn btn-ghost btn-xs">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          Ver estado
                        </button>
                      )}
                      {p.acciones.includes("continuar") && (
                        <button className="btn btn-secondary btn-xs" onClick={onContinuar}>
                          Continuar edición
                        </button>
                      )}
                      {p.acciones.includes("ver-obs") && (
                        <button className="btn btn-ghost btn-xs" onClick={() => setShowObsModal(true)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          Ver observaciones
                        </button>
                      )}
                      {p.acciones.includes("corregir") && (
                        <button className="btn btn-secondary btn-xs" style={{ background: "#f59e0b", border: "none", color: "#1e2a3a" }} onClick={onCorregir}>
                          CORREGIR
                        </button>
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

function Step1InfoGeneral({ onNext, onCancel, maxReached = 3 }: { onNext: () => void; onCancel: () => void; maxReached?: number }) {
  const [grupo, setGrupo] = useState("Unidad de Titulación");
  const [periodo, setPeriodo] = useState("Julio – Diciembre 2026");
  const [saving] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const canContinue = !!grupo && !!periodo;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={1} maxReached={maxReached} />

      {/* Page header */}
      <div style={{ padding: "20px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
            Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo
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
                  <div className="form-hint">Actualmente el sistema gestiona Planes de Trabajo.</div>
                </div>
                <div>
                  <label className="form-label required">Período académico</label>
                  <select className="form-select" value={periodo} onChange={e => setPeriodo(e.target.value)}>
                    <option>Julio – Diciembre 2026</option>
                    <option>Enero – Junio 2027</option>
                  </select>
                  <div className="form-hint">Las fechas de las actividades deben estar dentro de este período.</div>
                </div>
              </div>
            </div>

            {/* Grupo */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Grupo institucional</h3>
              <div>
                <label className="form-label required">Seleccione su grupo institucional</label>
                <select className="form-select" value={grupo} onChange={e => setGrupo(e.target.value)} style={{ marginBottom: 12 }}>
                  <option value="">— Seleccione —</option>
                  <option>Unidad de Titulación</option>
                  <option>Comisión de Eventos Académicos</option>
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
                      <div style={{ fontSize: 13.5, color: "#334155" }}>Unidad</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Rol del docente</div>
                      <div style={{ fontSize: 13.5, color: "#334155" }}>Miembro</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>Miembros</div>
                      <div style={{ fontSize: 13.5, color: "#334155" }}>6 docentes</div>
                    </div>
                    <div>
                      <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12.5, color: "#1a4f8a", fontWeight: 500, padding: 0 }}>
                        Ver integrantes →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                  { label: "Docente elaborador", val: "Ing. Andrea Pérez, Mg." },
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

            <div style={{ padding: "11px 14px", borderRadius: 8, background: "#f0f6ff", border: "1px solid #bfdbfe", fontSize: 12, color: "#1e40af", lineHeight: 1.6 }}>
              <strong>Pasos siguientes:</strong> Después de guardar la información general, deberá seleccionar las actividades del plan y configurar la matriz.
            </div>
          </div>
        </div>
      </div>

      <FormFooter
        onNext={onNext}
        onSave={() => {}}
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

function Step2Actividades({ onPrev, onNext, maxReached = 3 }: { onPrev: () => void; onNext: () => void; maxReached?: number }) {
  const [filter, setFilter] = useState("Todas");
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [otrasActs, setOtrasActs] = useState<{ id: number; nombre: string; descripcion: string }[]>([]);
  const [otraDesc, setOtraDesc] = useState("");
  const [saving] = useState(false);

  const obligatorias = ACTIVIDADES_CATALOGO.filter(a => a.tipo === "obligatoria");
  const opcionales = ACTIVIDADES_CATALOGO.filter(a => a.tipo === "opcional").filter(a =>
    filter === "Todas" || a.categoria === filter
  );

  const toggle = (id: number) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const totalSelected = obligatorias.length + selected.length + otrasActs.length;
  const filters = ["Todas", "POA", "Plan de Mejoras", "Acción de Mejora", "Otras"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={2} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Seleccionar actividades</h1>
          <p style={{ fontSize: 13, color: "#6b7a8d", marginTop: 3 }}>
            Seleccione las actividades que formarán parte de su Plan de Trabajo. Las actividades obligatorias ya se encuentran incluidas.
          </p>
        </div>
        <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "8px 14px", fontSize: 12.5, color: "#475569" }}>
          <div><strong>Grupo:</strong> Unidad de Titulación</div>
          <div><strong>Período:</strong> Julio – Diciembre 2026</div>
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

      <FormFooter onPrev={onPrev} onNext={onNext} onSave={() => {}} saving={saving} canContinue={true} />

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
                <label className="form-label required">Descripción de la actividad</label>
                <textarea className="form-textarea" value={otraDesc} onChange={e => setOtraDesc(e.target.value)}
                  placeholder="Describa la actividad que desea incorporar al Plan de Trabajo." />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Categoría</label>
                <input className="form-input" value="Otra" disabled style={{ background: "#f8fafc", color: "#475569" }} />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="btn btn-primary" disabled={!otraDesc.trim()} onClick={() => {
                  if (!otraDesc.trim()) return;
                  setOtrasActs(s => [...s, { id: Date.now(), nombre: otraDesc.trim(), descripcion: "" }]);
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
  return a.desde && a.hasta && a.responsables.length > 0 && a.recursos.length > 0 && a.medios.length > 0;
}

function Step3Matriz({
  onPrev, onNext, maxReached = 3,
  matriz, setMatriz, saving, onSave, initialEditId = null,
}: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  matriz: ActividadMatriz[]; setMatriz: (m: ActividadMatriz[]) => void;
  saving: boolean; onSave: (m: ActividadMatriz[]) => void;
  initialEditId?: number | null;
}) {
  const [editId, setEditId] = useState<number | null>(initialEditId);
  const [dateError, setDateError] = useState("");
  const [recursoSearch, setRecursoSearch] = useState("");
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const rowRefs = useRef<Record<number, HTMLTableRowElement | null>>({});

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

  const editAct = editId ? matriz.find(a => a.id === editId) ?? null : null;
  const incompletas = matriz.filter(a => !isCompleta(a));
  const completas = matriz.length - incompletas.length;
  const canContinue = incompletas.length === 0;

  function updateAct(updated: ActividadMatriz) {
    const next = matriz.map(a => a.id === updated.id ? updated : a);
    setMatriz(next);
  }

  function validateDates(desde: string, hasta: string) {
    if (!desde || !hasta) return "";
    if (desde > hasta) return "La fecha Desde no puede ser posterior a la fecha Hasta.";
    const min = "2026-07-01", max = "2026-12-31";
    if (desde < min || hasta > max) return "La fecha seleccionada se encuentra fuera del período Julio – Diciembre 2026.";
    return "";
  }

  function abrirPrimeroIncompleto() {
    const primero = matriz.find(a => !isCompleta(a));
    if (!primero) return;
    setEditId(primero.id);
    setHighlightId(primero.id);
    setTimeout(() => {
      rowRefs.current[primero.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setHighlightId(null), 1400);
    }, 50);
  }

  function guardarYSiguiente() {
    // After saving current, find next incomplete (excluding current)
    const siguienteIncompleta = matriz.find(a => a.id !== editId && !isCompleta(a));
    setEditId(null);
    if (siguienteIncompleta) {
      setTimeout(() => {
        setEditId(siguienteIncompleta.id);
        setHighlightId(siguienteIncompleta.id);
        rowRefs.current[siguienteIncompleta.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => setHighlightId(null), 1400);
      }, 120);
    }
  }

  // After saving current activity, check if any remaining (excluding current) are incomplete
  const editActIsNowComplete = editAct ? isCompleta(editAct) : false;
  const otrasIncompletas = editId ? matriz.filter(a => a.id !== editId && !isCompleta(a)) : incompletas;
  const haySiguienteIncompleta = editActIsNowComplete && otrasIncompletas.length > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", position: "relative" }}>
      <Stepper current={3} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Configurar matriz de actividades</h1>
            <p style={{ fontSize: 13, color: "#6b7a8d", marginTop: 3 }}>
              Complete la planificación de cada actividad definiendo fechas, responsables, recursos y medios de verificación.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12.5, color: "#6b7a8d" }}>{matriz.length} actividades seleccionadas</span>
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
                return (
                  <tr
                    key={a.id}
                    ref={el => { rowRefs.current[a.id] = el; }}
                    onClick={() => { if (!completa) { setEditId(a.id); setRecursoSearch(""); } }}
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
                        <span style={{ fontSize: 10.5, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: 99 }}>{a.categoria}</span>
                        {a.tipo === "obligatoria" && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: "#f0fdf4", color: "#166534", padding: "1px 6px", borderRadius: 99 }}>OBL.</span>
                        )}
                        {a.tipo === "otra" && (
                          <span style={{ fontSize: 10.5, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "1px 6px", borderRadius: 99 }}>OTRA</span>
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
                      {a.responsables.length ? `${a.responsables.length} persona${a.responsables.length > 1 ? "s" : ""}` : "—"}
                    </td>
                    <td style={{ fontSize: 12.5, color: a.recursos.length ? "#334155" : "#94a3b8", paddingLeft: 14 }}>
                      {a.recursos.length ? `${a.recursos.length} recurso${a.recursos.length > 1 ? "s" : ""}` : "—"}
                    </td>
                    <td style={{ fontSize: 12.5 }}>
                      {a.medios.length ? a.medios.map(m => (
                        <span key={m} style={{ display: "inline-block", fontSize: 10.5, background: "#f1f5f9", color: "#475569", borderRadius: 4, padding: "1px 5px", marginRight: 3, marginBottom: 2 }}>{m}</span>
                      )) : <span style={{ color: "#94a3b8" }}>—</span>}
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        fontSize: 10.5, fontWeight: 700, padding: "2px 7px", borderRadius: 99,
                        background: completa ? "#dcfce7" : "#fef3c7",
                        color: completa ? "#166534" : "#92400e",
                      }}>
                        {completa ? "COMPLETA" : "PENDIENTE"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={e => { e.stopPropagation(); setEditId(editId === a.id ? null : a.id); setRecursoSearch(""); setDateError(""); }}
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
            onClick={() => setEditId(null)}
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
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#dbeafe", color: "#1e40af", padding: "1px 7px", borderRadius: 99 }}>{editAct.categoria}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {editAct.tipo === "obligatoria" ? "Obligatoria" : editAct.tipo === "otra" ? "Tipo: Otra" : "Opcional"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setEditId(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7a8d", padding: 4, borderRadius: 4, display: "flex", marginTop: -2 }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>

            {/* Drawer body — scrollable */}
            <div style={{ flex: 1, overflowY: "auto", padding: "18px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Fechas */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="form-label required">Desde</label>
                  <input type="date" className="form-input" value={editAct.desde}
                    onChange={e => {
                      updateAct({ ...editAct, desde: e.target.value });
                      setDateError(validateDates(e.target.value, editAct.hasta));
                    }} />
                </div>
                <div>
                  <label className="form-label required">Hasta</label>
                  <input type="date" className="form-input" value={editAct.hasta}
                    onChange={e => {
                      updateAct({ ...editAct, hasta: e.target.value });
                      setDateError(validateDates(editAct.desde, e.target.value));
                    }} />
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
                      checked={editAct.responsables.length === RESPONSABLES_GRUPO.length}
                      onChange={e => updateAct({ ...editAct, responsables: e.target.checked ? [...RESPONSABLES_GRUPO] : [] })}
                      style={{ accentColor: "#1a4f8a" }}
                    />
                    Seleccionar todos
                  </label>
                  {RESPONSABLES_GRUPO.map(r => (
                    <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#334155", cursor: "pointer" }}>
                      <input type="checkbox"
                        checked={editAct.responsables.includes(r)}
                        onChange={e => updateAct({ ...editAct, responsables: e.target.checked ? [...editAct.responsables, r] : editAct.responsables.filter(x => x !== r) })}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      {r}
                    </label>
                  ))}
                </div>
                {editAct.responsables.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {editAct.responsables.map(r => (
                      <span key={r} style={{ fontSize: 11.5, background: "#dbeafe", color: "#1e40af", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>
                        {r.split(" ").slice(0, 3).join(" ")}
                      </span>
                    ))}
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
                  {RECURSOS_CATALOGO.filter(r => r.toLowerCase().includes(recursoSearch.toLowerCase())).map(r => (
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
                {editAct.recursos.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {editAct.recursos.map(r => (
                      <span key={r} style={{ fontSize: 11.5, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 99, fontWeight: 500 }}>{r}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Medios */}
              <div>
                <label className="form-label required">Medios de verificación</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 5, background: "#f8fafc", borderRadius: 8, padding: "10px 12px", border: "1.5px solid #e2e8f0" }}>
                  {MEDIOS_CATALOGO.map(m => (
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
                {editAct.medios.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 7 }}>
                    {editAct.medios.map(m => (
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
                  onClick={() => { onSave(matriz); guardarYSiguiente(); }}
                >
                  Guardar y configurar siguiente pendiente →
                </button>
              )}
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setEditId(null)}>Cancelar</button>
                <button className="btn btn-primary btn-sm" onClick={() => { onSave(matriz); setEditId(null); }}>
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

function Step3Revision({ onPrev, onNext, maxReached = 3, onGoToMatrix, matriz, saving = false }: {
  onPrev: () => void; onNext: () => void; maxReached?: number; onGoToMatrix?: () => void;
  matriz: ActividadMatriz[]; saving?: boolean;
}) {
  const total = matriz.length;
  const configuradas = matriz.filter(isCompleta).length;
  const pendientes = total - configuradas;
  const matrizCompleta = pendientes === 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={3} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
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
                    <button className="btn btn-ghost btn-xs">
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
                    { label: "Responsables", val: a.responsables.length ? a.responsables.join(", ") : "—" },
                    { label: "Recursos", val: a.recursos.length ? a.recursos.join(", ") : "—" },
                    { label: "Medios de verificación", val: a.medios.length ? a.medios.join(", ") : "—" },
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
        nextLabel="Continuar a Contenido →"
      />
    </div>
  );
}

// ─── Step 4 — Contenido ───────────────────────────────────────────────────────

function Step4Contenido({ onPrev, onNext, maxReached = 4, justificacion, setJustificacion, objetivo, setObjetivo, saving = false, onSave }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  justificacion: string; setJustificacion: (v: string) => void;
  objetivo: string; setObjetivo: (v: string) => void;
  saving?: boolean; onSave?: () => void;
}) {
  const [showExit, setShowExit] = useState(false);
  const [activeSection, setActiveSection] = useState<"justificacion" | "objetivo">("justificacion");

  const wordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;
  const canContinue = justificacion.trim().length > 0 && objetivo.trim().length > 0;

  const [aiMenu, setAiMenu] = useState<"justificacion" | "objetivo" | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModal, setAiModal] = useState<{ field: "justificacion" | "objetivo"; original: string; suggestion: string; option: string } | null>(null);

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
    setAiLoading(true);
    const original = field === "justificacion" ? justificacion : objetivo;
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
    onSave?.();
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
                <span style={{ fontSize: 16 }}>✨</span>
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
              <button className="btn btn-ghost" onClick={() => setAiModal(null)}>DESCARTAR</button>
              <button className="btn btn-primary" style={{ background: "#7c3aed", border: "none" }} onClick={applyAiSuggestion}>APLICAR SUGERENCIA</button>
            </div>
          </div>
        </div>
      )}

      <Stepper current={4} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
          Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo
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
                    <button className="btn btn-ghost btn-xs" style={{ fontSize: 11.5, gap: 4, border: "1px solid #e9d5ff", color: "#7c3aed", background: "#faf5ff" }}
                      onClick={e => { e.stopPropagation(); setAiMenu(aiMenu === "justificacion" ? null : "justificacion"); }}>
                      ✨ MEJORAR REDACCIÓN
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
                onChange={e => setJustificacion(e.target.value)}
                placeholder="Describa la necesidad, contexto y fundamento..."
              />
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4, textAlign: "right" }}>
                {wordCount(justificacion)} palabras
              </div>
              {justificacion.trim().length === 0 && (
                <p className="form-error" style={{ marginTop: 4 }}>Complete esta sección antes de continuar.</p>
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
                    <button className="btn btn-ghost btn-xs" style={{ fontSize: 11.5, gap: 4, border: "1px solid #e9d5ff", color: "#7c3aed", background: "#faf5ff" }}
                      onClick={e => { e.stopPropagation(); setAiMenu(aiMenu === "objetivo" ? null : "objetivo"); }}>
                      ✨ MEJORAR OBJETIVO
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
                onChange={e => setObjetivo(e.target.value)}
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
  const [modalNombre, setModalNombre] = useState("");
  const [modalDesc, setModalDesc] = useState("");
  const [modalFile, setModalFile] = useState("");

  const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const canContinue = tieneAnexos === "no" || (tieneAnexos === "si" && anexos.length > 0);

  const handleAddAnexo = () => {
    if (!modalNombre.trim()) return;
    setAnexos([...anexos, { id: Date.now(), nombre: modalNombre, descripcion: modalDesc, archivo: modalFile || "archivo_adjunto.pdf" }]);
    setModalNombre(""); setModalDesc(""); setModalFile("");
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
          <div style={{ background: "#fff", borderRadius: 12, width: 480, padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", marginBottom: 18, fontFamily: "'DM Sans',sans-serif" }}>Agregar anexo</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label className="form-label required">Nombre del anexo</label>
                <input className="form-input" placeholder="Ej. Cronograma complementario"
                  value={modalNombre} onChange={e => setModalNombre(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Descripción</label>
                <textarea className="form-textarea" style={{ minHeight: 70 }} placeholder="Descripción breve del contenido del anexo..."
                  value={modalDesc} onChange={e => setModalDesc(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Archivo adjunto</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input className="form-input" placeholder="Seleccionar archivo..."
                    value={modalFile} onChange={e => setModalFile(e.target.value)} readOnly />
                  <button className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Examinar
                  </button>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleAddAnexo} disabled={!modalNombre.trim()}>Agregar anexo</button>
            </div>
          </div>
        </div>
      )}

      <Stepper current={5} maxReached={maxReached} />

      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>Anexos</h1>
        <p style={{ fontSize: 13, color: "#6b7a8d" }}>
          Indique si el Plan de Trabajo incluirá anexos y organice los elementos que formarán parte del documento.
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
                { val: "si" as const, label: "Sí", desc: "Incluir sección de anexos en el documento" },
                { val: "no" as const, label: "No", desc: "El documento se generará sin anexos" },
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
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e2a3a" }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: "#6b7a8d", marginTop: 2 }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* No anexos message */}
          {tieneAnexos === "no" && (
            <div className="alert alert-info">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              El documento será generado sin sección de anexos.
            </div>
          )}

          {/* Sí: list */}
          {tieneAnexos === "si" && (
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>
                  Anexos del documento
                  <span style={{ marginLeft: 8, fontSize: 11.5, color: "#6b7a8d", fontWeight: 400 }}>{anexos.length} {anexos.length === 1 ? "elemento" : "elementos"}</span>
                </h3>
                <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
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
                          Anexo {LETRAS[idx]} — {a.nombre}
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
                          <button onClick={() => mover(idx, -1)} disabled={idx === 0} style={{
                            width: 22, height: 20, background: "none", border: "1px solid #e2e8f0",
                            borderRadius: 3, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: idx === 0 ? 0.3 : 1,
                          }}>↑</button>
                          <button onClick={() => mover(idx, 1)} disabled={idx === anexos.length - 1} style={{
                            width: 22, height: 20, background: "none", border: "1px solid #e2e8f0",
                            borderRadius: 3, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center",
                            opacity: idx === anexos.length - 1 ? 0.3 : 1,
                          }}>↓</button>
                        </div>
                        <button className="btn btn-ghost btn-xs">Editar</button>
                        <button className="btn btn-xs" style={{ background: "#fee2e2", color: "#991b1b", border: "none" }}
                          onClick={() => setAnexos(anexos.filter(x => x.id !== a.id))}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ padding: "10px 18px", background: "#f8fafc", borderTop: "1px solid #f1f5f9", fontSize: 11.5, color: "#94a3b8" }}>
                El sistema asigna automáticamente la numeración (Anexo A, B, C…). Si elimina un anexo, la secuencia se reordena.
              </div>
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

function Step6Preview({ onPrev, onNext, maxReached = 6, matriz, justificacion, objetivo, tieneAnexos, anexos, fechaElaboracion }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  matriz: ActividadMatriz[]; justificacion: string; objetivo: string;
  tieneAnexos: "si" | "no" | null; anexos: Anexo[];
  fechaElaboracion: string;
}) {
  const [zoom, setZoom] = useState(100);
  const LETRAS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const matrizRows = matriz.map(a => ({
    act: a.nombre,
    desde: a.desde || "—",
    hasta: a.hasta || "—",
    resp: a.responsables.length > 0 ? a.responsables.join(", ") : "—",
    rec: a.recursos.length > 0 ? a.recursos.join(", ") : "—",
    med: a.medios.length > 0 ? a.medios.join(", ") : "—",
  }));

  const configuredCount = matriz.filter(isCompleta).length;
  const anexosCheck = tieneAnexos === "si" ? "✓ Anexos revisados" : tieneAnexos === "no" ? "✓ Sin anexos" : "Anexos (pendiente)";

  const checks = [
    "Información general completa",
    `${configuredCount} / ${matriz.length} actividades configuradas`,
    "Justificación completa",
    "Objetivo completo",
    anexosCheck,
    "Formato institucional generado",
    "Documento listo para firma",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stepper current={6} maxReached={maxReached} />

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>
          Previsualizar Plan de Trabajo
        </h1>
        <p style={{ fontSize: 13, color: "#6b7a8d" }}>
          Revise el documento completo antes de firmarlo y enviarlo al flujo de aprobación.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 28px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 270px", gap: 18, maxWidth: 1200 }}>

          {/* PDF viewer area */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Toolbar */}
            <div style={{
              background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0",
              padding: "8px 14px", display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 12.5, color: "#475569" }}>Página 1 de 4</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                <button onClick={() => setZoom(z => Math.max(60, z - 10))} className="btn btn-ghost btn-xs" style={{ padding: "2px 8px", fontSize: 14 }}>−</button>
                <span style={{ fontSize: 12.5, color: "#475569", minWidth: 44, textAlign: "center" }}>{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="btn btn-ghost btn-xs" style={{ padding: "2px 8px", fontSize: 14 }}>+</button>
                <button className="btn btn-ghost btn-xs" onClick={() => setZoom(100)}>Ajustar</button>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8, flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                DESCARGAR BORRADOR
              </button>
            </div>

            {/* Simulated A4 document */}
            <div style={{
              background: "#6b7a8d", borderRadius: 8, padding: "20px",
              display: "flex", flexDirection: "column", gap: 16, alignItems: "center",
            }}>
              <div style={{
                width: `${Math.min(100, zoom)}%`, maxWidth: 760,
                background: "#fff", borderRadius: 4,
                boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                padding: "48px 52px", fontFamily: "'Times New Roman', serif",
                position: "relative", overflow: "hidden",
              }}>
                {/* BORRADOR watermark */}
                <div style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%,-50%) rotate(-35deg)",
                  fontSize: 72, fontWeight: 800, color: "rgba(200,50,50,0.07)",
                  letterSpacing: 8, userSelect: "none", pointerEvents: "none", whiteSpace: "nowrap",
                }}>BORRADOR</div>

                {/* Institutional header */}
                <div style={{ borderBottom: "2.5px solid #1a4f8a", paddingBottom: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    {/* Logo */}
                    <div style={{
                      width: 56, height: 56, borderRadius: 6, background: "#f0f4f8",
                      border: "1.5px solid #d1d9e0", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, color: "#94a3b8", textAlign: "center", lineHeight: 1.3,
                    }}>LOGO<br/>UTA</div>
                    {/* Institution info */}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Universidad Técnica de Ambato
                      </div>
                      <div style={{ fontSize: 9.5, color: "#475569", marginTop: 1 }}>
                        Facultad de Ingeniería en Sistemas, Electrónica e Industrial
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#1e2a3a", marginTop: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
                        Plan de Trabajo: Comisión de Eventos Académicos
                      </div>
                    </div>
                  </div>
                  {/* Metadata row */}
                  <div style={{ display: "flex", gap: 0, marginTop: 10, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                    {[
                      { label: "Unidad académica", val: "FISEI – UTA" },
                      { label: "Período", val: "Julio – Diciembre 2026" },
                      { label: "Fecha de elaboración", val: fechaElaboracion },
                      { label: "Versión", val: "1.0" },
                    ].map((item, i) => (
                      <div key={i} style={{ flex: 1, paddingRight: 10, borderRight: i < 3 ? "1px solid #e2e8f0" : "none", paddingLeft: i > 0 ? 10 : 0 }}>
                        <div style={{ fontSize: 7.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>{item.label}</div>
                        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#1e2a3a", marginTop: 1 }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 1. Justificación */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                    1. Justificación
                  </div>
                  <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.7, textAlign: "justify" }}>
                    {justificacion || "—"}
                  </p>
                </div>

                {/* 2. Objetivo */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                    2. Objetivo
                  </div>
                  <p style={{ fontSize: 11, color: "#334155", lineHeight: 1.7, textAlign: "justify" }}>
                    {objetivo || "—"}
                  </p>
                </div>

                {/* 3. Matriz */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                    3. Matriz de Actividades
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9.5 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Actividad", "Desde", "Hasta", "Responsable", "Recursos", "Medios"].map(h => (
                          <th key={h} style={{ padding: "5px 7px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 9 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {matrizRows.map((r, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "5px 7px", color: "#334155", borderBottom: "1px solid #f1f5f9", lineHeight: 1.4 }}>{r.act}</td>
                          <td style={{ padding: "5px 7px", color: "#475569", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{r.desde}</td>
                          <td style={{ padding: "5px 7px", color: "#475569", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap" }}>{r.hasta}</td>
                          <td style={{ padding: "5px 7px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{r.resp}</td>
                          <td style={{ padding: "5px 7px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{r.rec}</td>
                          <td style={{ padding: "5px 7px", color: "#475569", borderBottom: "1px solid #f1f5f9" }}>{r.med}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 4. Anexos — solo si el plan los tiene */}
                {tieneAnexos === "si" && (
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                      4. Anexos
                    </div>
                    {anexos.length > 0 ? anexos.map((a, idx) => (
                      <p key={a.id} style={{ fontSize: 10, color: "#475569" }}>Anexo {LETRAS[idx]} — {a.nombre}</p>
                    )) : (
                      <p style={{ fontSize: 10, color: "#94a3b8" }}>No se han agregado anexos.</p>
                    )}
                  </div>
                )}

                {/* 5. Firmas de Responsabilidad */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                    5. Firmas de Responsabilidad
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Acciones", "Nombre", "Cargo", "Firma"].map(h => (
                          <th key={h} style={{ padding: "5px 7px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { accion: "Elaborado por:", nombre: "Ing. Andrea Pérez, Mg.", cargo: "Docente elaborador", firma: "Pendiente" },
                        { accion: "Revisado por:", nombre: "Responsable de revisión", cargo: "Responsable de revisión", firma: "Pendiente" },
                        { accion: "Revisado por:", nombre: "Coordinador/a", cargo: "Coordinador/a académico", firma: "Pendiente" },
                        { accion: "Validado por:", nombre: "Autoridad correspondiente", cargo: "Autoridad académica", firma: "Pendiente" },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "6px 7px", color: "#1a4f8a", fontWeight: 700, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap" }}>{row.accion}</td>
                          <td style={{ padding: "6px 7px", color: "#1e2a3a", borderBottom: "1px solid #e2e8f0" }}>{row.nombre}</td>
                          <td style={{ padding: "6px 7px", color: "#475569", borderBottom: "1px solid #e2e8f0" }}>{row.cargo}</td>
                          <td style={{ padding: "6px 7px", color: "#94a3b8", borderBottom: "1px solid #e2e8f0", fontStyle: "italic" }}>{row.firma}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 6. Control de historial de cambios */}
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 4 }}>
                    6. Control de Historial de Cambios
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9.5 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Versión", "Descripción del Cambio", "Fecha de Actualización"].map(h => (
                          <th key={h} style={{ padding: "5px 7px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8.5 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "5px 7px", color: "#334155", fontSize: 9.5 }}>1.0</td>
                        <td style={{ padding: "5px 7px", color: "#334155", fontSize: 9.5 }}>Elaboración inicial del Plan de Trabajo</td>
                        <td style={{ padding: "5px 7px", color: "#475569", fontSize: 9.5 }}>{fechaElaboracion}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Side verification panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px", position: "sticky", top: 0 }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 14 }}>Verificación del documento</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {checks.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <span style={{ fontSize: 12.5, color: "#334155" }}>{c}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 7, background: "#dcfce7", border: "1px solid #bbf7d0", display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: "#166534" }}>LISTO PARA FIRMAR</span>
              </div>
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="btn btn-ghost btn-sm" onClick={onPrev} style={{ justifyContent: "center" }}>
                  Volver a editar contenido
                </button>
                <button className="btn btn-ghost btn-sm" style={{ justifyContent: "center" }}>
                  Revisar matriz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: "#fff", borderTop: "1px solid #e2e8f0",
        padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-ghost" onClick={onPrev}>← Anterior</button>
          <SaveIndicator saving={false} />
        </div>
        <button className="btn btn-primary" onClick={onNext}>
          CONTINUAR A FIRMA →
        </button>
      </div>
    </div>
  );
}

// ─── Step 7 — Firma y Envío ───────────────────────────────────────────────────

function Step7Firma({ onPrev, onNext, maxReached = 7, onEnviarRevision }: {
  onPrev: () => void; onNext: () => void; maxReached?: number;
  onEnviarRevision: () => void;
}) {
  const [certFile, setCertFile] = useState("certificado_firma.p12");
  const [certPass, setCertPass] = useState("••••••••");
  const [showPass, setShowPass] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);

  const canSign = certFile.length > 0 && certPass.length > 0 && confirmed;

  const flowSteps = [
    { num: 1, label: "Elaborador",  name: "Ing. Andrea Pérez, Mg.",   estado: signed ? "✓ Firmado" : "Firma pendiente",  done: signed,  active: !signed },
    { num: 2, label: "Revisión",    name: "Responsable de revisión",   estado: "Pendiente",                               done: false,   active: signed  },
    { num: 3, label: "Coordinación", name: "Coordinador/a",            estado: "Pendiente",                               done: false,   active: false   },
    { num: 4, label: "Validación",  name: "Autoridad correspondiente", estado: "Pendiente",                               done: false,   active: false   },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {showSendModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 460, padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Enviar Plan de Trabajo</h2>
            <p style={{ fontSize: 13, color: "#6b7a8d", marginBottom: 20 }}>
              El documento firmado será enviado al primer paso del flujo de revisión. Mientras permanezca en revisión no podrá modificar esta versión.
            </p>
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {[
                { label: "Grupo", val: "Unidad de Titulación" },
                { label: "Versión", val: "1.0" },
                { label: "Siguiente etapa", val: "Revisión" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6b7a8d" }}>{r.label}</span>
                  <span style={{ color: "#1e2a3a", fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowSendModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={() => { setShowSendModal(false); onEnviarRevision(); onNext(); }}>CONFIRMAR ENVÍO</button>
            </div>
          </div>
        </div>
      )}

      <Stepper current={7} maxReached={maxReached} />

      <div style={{ padding: "16px 28px 0" }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>Mis Planes de Trabajo &rsaquo; Nuevo Plan de Trabajo</div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>
          Firmar y enviar Plan de Trabajo
        </h1>
        <p style={{ fontSize: 13, color: "#6b7a8d" }}>
          Firme electrónicamente el documento y envíelo al flujo institucional de revisión.
        </p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 18, maxWidth: 1050 }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Document card */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 6 }}>Plan de Trabajo</div>
                  <div style={{ fontSize: 12.5, color: "#6b7a8d", display: "flex", flexDirection: "column", gap: 3 }}>
                    <span>Unidad de Titulación</span>
                    <span>Período: Julio – Diciembre 2026</span>
                    <span>Versión: 1.0</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999,
                    fontSize: 11.5, fontWeight: 700, background: "#dcfce7", color: "#166534",
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                    LISTO PARA FIRMA
                  </span>
                  <button className="btn btn-ghost btn-sm" onClick={onPrev}>Previsualizar nuevamente</button>
                </div>
              </div>
            </div>

            {/* Firma electrónica */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a4f8a" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Firma electrónica</h3>
              </div>

              {!signed ? (
                <>
                  <p style={{ fontSize: 12.5, color: "#6b7a8d", marginBottom: 16 }}>
                    Para firmar el documento seleccione su certificado de firma electrónica e ingrese la contraseña correspondiente.
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <div>
                      <label className="form-label required">Certificado de firma</label>
                      <div style={{ display: "flex", gap: 8 }}>
                        <input className="form-input" value={certFile} onChange={e => setCertFile(e.target.value)} style={{ flex: 1 }} />
                        <button className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                          Examinar
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label required">Contraseña del certificado</label>
                      <div style={{ position: "relative" }}>
                        <input
                          className="form-input"
                          type={showPass ? "text" : "password"}
                          value={certPass}
                          onChange={e => setCertPass(e.target.value)}
                          style={{ paddingRight: 40 }}
                        />
                        <button onClick={() => setShowPass(v => !v)} style={{
                          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                          background: "none", border: "none", cursor: "pointer", color: "#64748b",
                        }}>
                          {showPass
                            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>

                    <div className="alert alert-info" style={{ fontSize: 12, gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                      El certificado y su contraseña se utilizarán únicamente durante el proceso de firma y no serán almacenados permanentemente por el sistema.
                    </div>

                    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                      <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                        style={{ accentColor: "#1a4f8a", marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55 }}>
                        Confirmo que he revisado el contenido del documento y deseo firmar esta versión.
                      </span>
                    </label>

                    <button className="btn btn-primary" disabled={!canSign} onClick={() => setSigned(true)} style={{ alignSelf: "flex-start" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
                      FIRMAR DOCUMENTO
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "#dcfce7", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534" }}>Documento firmado electrónicamente</div>
                      <div style={{ fontSize: 12, color: "#15803d", marginTop: 2 }}>
                        Firmado por: Ing. Andrea Pérez, Mg. · 05/09/2026 · 23:41
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm" style={{ alignSelf: "flex-start" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    Ver detalles de firma
                  </button>
                </div>
              )}
            </div>

            {signed && (
              <button className="btn btn-primary" onClick={() => setShowSendModal(true)} style={{ alignSelf: "flex-start" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                ENVIAR A REVISIÓN
              </button>
            )}
          </div>

          {/* Right — flow */}
          <div>
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px" }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 6 }}>Flujo de aprobación</h3>
              <p style={{ fontSize: 12, color: "#6b7a8d", marginBottom: 16, lineHeight: 1.55 }}>
                Este documento seguirá el flujo de aprobación configurado para la Unidad de Titulación.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {flowSteps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 12 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: s.done ? "#1a4f8a" : s.active ? "#eff6ff" : "#f1f5f9",
                        border: s.active && !s.done ? "2px solid #1a4f8a" : s.done ? "none" : "2px solid #d1d9e0",
                        fontSize: 11, fontWeight: 700,
                        color: s.done ? "#fff" : s.active ? "#1a4f8a" : "#94a3b8",
                      }}>
                        {s.done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> : s.num}
                      </div>
                      {i < flowSteps.length - 1 && (
                        <div style={{ width: 1.5, height: 28, background: "#e2e8f0", margin: "2px 0" }} />
                      )}
                    </div>
                    <div style={{ paddingBottom: i < flowSteps.length - 1 ? 20 : 0, paddingTop: 3 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#1e2a3a" }}>{s.label}</div>
                      <div style={{ fontSize: 11.5, color: "#6b7a8d" }}>{s.name}</div>
                      <div style={{ fontSize: 11, marginTop: 2, color: s.done ? "#16a34a" : s.active ? "#1a4f8a" : "#94a3b8", fontWeight: s.done || s.active ? 600 : 400 }}>
                        {s.estado}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        background: "#fff", borderTop: "1px solid #e2e8f0",
        padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="btn btn-ghost" onClick={onPrev}>← Anterior</button>
          <SaveIndicator saving={false} />
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          {signed ? "Documento firmado. Puede enviarlo a revisión." : "Complete la firma para habilitar el envío."}
        </div>
      </div>
    </div>
  );
}

// ─── Step 8 — Confirmación / En Revisión ─────────────────────────────────────

function Step8Confirmacion({ onViewStatus, onBackToList }: { onViewStatus: () => void; onBackToList: () => void }) {
  const timelineItems = [
    { label: "Elaborado y firmado", done: true,  active: false },
    { label: "En revisión",         done: false, active: true  },
    { label: "Coordinación",        done: false, active: false },
    { label: "Validación final",    done: false, active: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Header bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "16px 28px" }}>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>Mis Planes de Trabajo &rsaquo; Plan de Trabajo</div>
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
              Su Plan de Trabajo fue enviado correctamente al primer paso del flujo de aprobación.
            </p>
          </div>

          {/* Summary card */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Plan de Trabajo</div>
                <div style={{ fontSize: 13, color: "#6b7a8d", marginTop: 2 }}>Unidad de Titulación</div>
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
                { label: "Versión", val: "1.0" },
                { label: "Enviado", val: "05/09/2026" },
                { label: "Etapa actual", val: "Revisión" },
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
            Recibirá una notificación cuando el documento sea aprobado, devuelto con observaciones o avance a una nueva etapa.
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

const DEFAULT_JUSTIFICACION = "La Unidad de Titulación desarrolla actividades orientadas al seguimiento de los procesos de graduación, acompañamiento a estudiantes y cumplimiento de la normativa institucional vigente. Durante el período Julio – Diciembre 2026 se han identificado necesidades específicas de fortalecimiento en las áreas de seguimiento y difusión normativa.";
const DEFAULT_OBJETIVO = "Coordinar y ejecutar las actividades de la Unidad de Titulación durante el período Julio – Diciembre 2026, asegurando el seguimiento de los procesos académicos y el cumplimiento de los lineamientos institucionales.";

interface PlanDraft {
  matriz: ActividadMatriz[];
  justificacion: string;
  objetivo: string;
  tieneAnexos: "si" | "no" | null;
  anexos: Anexo[];
  estado: "borrador" | "en-revision" | "devuelto" | "en-correccion";
  fechaEnvio: string;
  fechaElaboracion: string;
  fechaDevolucion: string;
  mensajeDevolucion: string;
  observacionesRevision: Observacion[];
}

function todayFormatted() {
  return new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" });
}

const DEFAULT_DRAFT: PlanDraft = {
  matriz: MATRIZ_INICIAL,
  justificacion: DEFAULT_JUSTIFICACION,
  objetivo: DEFAULT_OBJETIVO,
  tieneAnexos: null,
  anexos: [],
  estado: "borrador",
  fechaEnvio: "",
  fechaElaboracion: todayFormatted(),
  fechaDevolucion: "",
  mensajeDevolucion: "",
  observacionesRevision: [],
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

function PlanesView({ onNavigateActividades }: { onNavigateActividades?: () => void } = {}) {
  const [sub, setSub] = useState<PlanesSubView>("list");
  const [maxReached, setMaxReached] = useState(3);
  const [draft, setDraftState] = useState<PlanDraft>(loadDraft);
  const [saving, setSaving] = useState(false);
  const [initialEditId, setInitialEditId] = useState<number | null>(null);

  function updateDraft(changes: Partial<PlanDraft>) {
    setDraftState(prev => ({ ...prev, ...changes }));
  }

  function saveDraft(changes: Partial<PlanDraft>) {
    const next = { ...draft, ...changes };
    setDraftState(next);
    setSaving(true);
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch {}
    setTimeout(() => setSaving(false), 700);
  }

  function goToMatrizCompletarPendientes() {
    const first = draft.matriz.find(a => !isCompleta(a));
    setInitialEditId(first?.id ?? null);
    setSub("step3edit");
  }

  function handleEnviarRevision() {
    const today = new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" });
    saveDraft({ estado: "en-revision", fechaEnvio: today });
  }

  function handleCorregir() {
    saveDraft({ estado: "en-correccion" });
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {sub === "list" && (
        <PlanesListado
          planEstado={draft.estado}
          onNew={() => setSub("step1")}
          onContinuar={() => { setInitialEditId(null); setSub("step3edit"); }}
          onCorregir={handleCorregir}
          observacionesRevision={draft.observacionesRevision}
          mensajeDevolucion={draft.mensajeDevolucion}
          fechaDevolucion={draft.fechaDevolucion}
          onNavigateActividades={onNavigateActividades}
        />
      )}
      {sub === "step1" && (
        <Step1InfoGeneral maxReached={maxReached} onNext={() => { setMaxReached(m => Math.max(m, 2)); setSub("step2"); }} onCancel={() => setSub("list")} />
      )}
      {sub === "step2" && (
        <Step2Actividades maxReached={maxReached} onPrev={() => setSub("step1")} onNext={() => { setMaxReached(m => Math.max(m, 3)); setSub("step3edit"); }} />
      )}
      {sub === "step3edit" && (
        <Step3Matriz
          maxReached={maxReached}
          matriz={draft.matriz}
          setMatriz={m => updateDraft({ matriz: m })}
          saving={saving}
          onSave={m => saveDraft({ matriz: m })}
          initialEditId={initialEditId}
          onPrev={() => setSub("step2")}
          onNext={() => { setMaxReached(m => Math.max(m, 3)); setInitialEditId(null); setSub("step3review"); }}
        />
      )}
      {sub === "step3review" && (
        <Step3Revision
          maxReached={maxReached}
          matriz={draft.matriz}
          saving={saving}
          onPrev={() => { setInitialEditId(null); setSub("step3edit"); }}
          onNext={() => { setMaxReached(m => Math.max(m, 4)); setSub("step4"); }}
          onGoToMatrix={goToMatrizCompletarPendientes}
        />
      )}
      {sub === "step4" && (
        <Step4Contenido
          maxReached={maxReached}
          justificacion={draft.justificacion}
          setJustificacion={v => updateDraft({ justificacion: v })}
          objetivo={draft.objetivo}
          setObjetivo={v => updateDraft({ objetivo: v })}
          saving={saving}
          onSave={() => saveDraft({})}
          onPrev={() => setSub("step3review")}
          onNext={() => { setMaxReached(m => Math.max(m, 5)); setSub("step5"); }}
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
          onPrev={() => setSub("step4")}
          onNext={() => { setMaxReached(m => Math.max(m, 6)); setSub("step6"); }}
        />
      )}
      {sub === "step6" && (
        <Step6Preview
          maxReached={maxReached}
          matriz={draft.matriz}
          justificacion={draft.justificacion}
          objetivo={draft.objetivo}
          tieneAnexos={draft.tieneAnexos}
          anexos={draft.anexos}
          fechaElaboracion={draft.fechaElaboracion}
          onPrev={() => setSub("step5")}
          onNext={() => { setMaxReached(m => Math.max(m, 7)); setSub("step7"); }}
        />
      )}
      {sub === "step7" && (
        <Step7Firma
          maxReached={maxReached}
          onEnviarRevision={handleEnviarRevision}
          onPrev={() => setSub("step6")}
          onNext={() => setSub("step8")}
        />
      )}
      {sub === "step8" && (
        <Step8Confirmacion onViewStatus={() => setSub("list")} onBackToList={() => setSub("list")} />
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────

// ─── Módulo 4 — Revisor ───────────────────────────────────────────────────────

type RevisorSub = "bandeja" | "revision" | "aprobado" | "devuelto";

interface Observacion {
  id: number;
  tipo: "general" | "seccion";
  seccion: string;
  texto: string;
  autor: string;
  fecha: string;
}

const SECCIONES_DOC = ["Información general", "Justificación", "Objetivo", "Matriz de actividades", "Anexos", "Firmas de responsabilidad", "Historial de cambios"];

const BANDEJA_PLANES = [
  { id: 1, nombre: "Plan de Trabajo", grupo: "Comisión de Eventos Académicos", elaborador: "Ing. Andrea Pérez, Mg.", version: "1.0", recibido: "06 sep. 2026", hora: "09:15", etapa: "Revisión", estado: "PENDIENTE" },
  { id: 2, nombre: "Plan de Trabajo", grupo: "Unidad de Titulación",           elaborador: "Ing. María Torres, Mg.",  version: "1.0", recibido: "05 sep. 2026", hora: "16:40", etapa: "Revisión", estado: "PENDIENTE" },
];

function RevisorView({ onBackToDocente, onDevolver }: {
  onBackToDocente: () => void;
  onDevolver?: (data: { mensaje: string; obs: Observacion[] }) => void;
}) {
  const [sub, setSub] = useState<RevisorSub>("bandeja");
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(0);
  const [decisionMade, setDecisionMade] = useState(false);
  const [obs, setObs] = useState<Observacion[]>([
    { id: 1, tipo: "seccion", seccion: "Justificación",      texto: "Reforzar la relación entre la necesidad identificada y las actividades propuestas.", autor: REVISOR.nombre, fecha: "06 sep. 2026 — 10:25" },
    { id: 2, tipo: "seccion", seccion: "Matriz de actividades", texto: "La actividad 4 requiere revisar el recurso seleccionado.",                         autor: REVISOR.nombre, fecha: "06 sep. 2026 — 10:28" },
    { id: 3, tipo: "general", seccion: "",                    texto: "Verificar coherencia del documento antes de reenviar.",                              autor: REVISOR.nombre, fecha: "06 sep. 2026 — 10:30" },
  ]);
  const [editObsId, setEditObsId] = useState<number | null>(null);
  const [editObsText, setEditObsText] = useState("");
  const [showObsDrawer, setShowObsDrawer] = useState(false);
  const [obsForm, setObsForm] = useState<{ tipo: "general" | "seccion"; seccion: string; texto: string }>({ tipo: "general", seccion: "", texto: "" });
  const [showDevolverModal, setShowDevolverModal] = useState(false);
  const [devolverMsg, setDevolverMsg] = useState("Por favor, revise las observaciones registradas y realice las correcciones correspondientes antes de reenviar el documento.");
  const [showFirmarModal, setShowFirmarModal] = useState(false);
  const [certFile, setCertFile] = useState("certificado_firma.p12");
  const [certPass, setCertPass] = useState("••••••••");
  const [showPass, setShowPass] = useState(false);
  const [firmaConfirmed, setFirmaConfirmed] = useState(false);
  const [signed, setSigned] = useState(false);
  const [caseB, setCaseB] = useState(false);
  const [firmaDate] = useState(new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" }));
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [pdfZoom, setPdfZoom] = useState(100);

  const plan = BANDEJA_PLANES[selectedPlanIdx];
  const canSign = certFile.length > 0 && certPass.length > 0 && firmaConfirmed && obs.length === 0;

  // Read the real signed draft from localStorage to show in PDF
  const pdfDraft: PlanDraft = (() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PlanDraft>;
        if (parsed && Array.isArray(parsed.matriz)) return { ...DEFAULT_DRAFT, ...parsed };
      }
    } catch {}
    return DEFAULT_DRAFT;
  })();

  function addObs() {
    if (!obsForm.texto.trim()) return;
    setObs(prev => [...prev, { id: Date.now(), tipo: obsForm.tipo, seccion: obsForm.seccion, texto: obsForm.texto, autor: REVISOR.nombre, fecha: new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" }) + " — " + new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" }) }]);
    setObsForm({ tipo: "general", seccion: "", texto: "" });
    setShowObsDrawer(false);
  }

  // ── Screen 01: Bandeja ────────────────────────────────────────────────────
  if (sub === "bandeja") {
    const statCards = [
      { label: "Pendientes de revisión", val: 2, color: "#1a4f8a", bg: "#eff6ff" },
      { label: "Revisados hoy",          val: 2, color: "#166534", bg: "#dcfce7" },
      { label: "Devueltos",              val: 1, color: "#92400e", bg: "#fef3c7" },
    ];
    const estadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
      "PENDIENTE":   { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
      "EN REVISIÓN": { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
      "APROBADO":    { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
      "DEVUELTO":    { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    };
    return (
      <div style={{ padding: "28px", maxWidth: 1200 }}>
        {/* Header */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>Inicio &rsaquo; Bandeja de revisión</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 4 }}>Bandeja de revisión</h1>
              <p style={{ fontSize: 13.5, color: "#6b7a8d" }}>Consulte los documentos que requieren su revisión en la etapa actual.</p>
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
          {statCards.map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "14px 20px", display: "flex", flexDirection: "column", gap: 4, minWidth: 160 }}>
              <div style={{ fontSize: 12, color: "#6b7a8d" }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, fontFamily: "'DM Sans',sans-serif" }}>{c.val}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "12px 16px", marginBottom: 14, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          {[
            { label: "Período", opts: ["Julio – Diciembre 2026"] },
            { label: "Grupo",   opts: ["Todos"] },
            { label: "Estado",  opts: ["Pendientes"] },
          ].map(f => (
            <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{f.label}:</span>
              <select className="form-select" style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ position: "relative", marginLeft: "auto" }}>
            <svg style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input className="form-input" placeholder="Buscar documento o elaborador..." style={{ paddingLeft: 28, width: 240, fontSize: 12.5 }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Documento</th><th>Grupo institucional</th><th>Elaborador</th>
                <th>Versión</th><th>Recibido</th><th>Etapa</th><th>Estado</th><th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {BANDEJA_PLANES.map((p, i) => {
                const es = estadoStyle[p.estado] ?? estadoStyle["PENDIENTE"];
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: "#1e2a3a" }}>{p.nombre}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>Para revisión institucional</div>
                    </td>
                    <td style={{ fontSize: 13, color: "#334155" }}>{p.grupo}</td>
                    <td style={{ fontSize: 13, color: "#475569" }}>{p.elaborador}</td>
                    <td style={{ fontSize: 12.5, color: "#475569" }}>Versión {p.version}</td>
                    <td>
                      <div style={{ fontSize: 12.5, color: "#475569" }}>{p.recibido}</div>
                      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{p.hora}</div>
                    </td>
                    <td><span style={{ fontSize: 12.5, color: "#1a4f8a", fontWeight: 600 }}>{p.etapa}</span></td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: es.bg, color: es.color }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: es.dot, display: "inline-block" }} />
                        {p.estado}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => { setSelectedPlanIdx(i); setSub("revision"); }}>
                        REVISAR
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div style={{ padding: "11px 18px", borderTop: "1px solid #f1f5f9", fontSize: 12, color: "#94a3b8" }}>
            {BANDEJA_PLANES.length} documentos pendientes de revisión
          </div>
        </div>
      </div>
    );
  }

  // ── Screen 06: Confirmación ───────────────────────────────────────────────
  if (sub === "aprobado") {
    const approvedCount = caseB ? 2 : 1;
    const totalRevisores = 2;
    const allDone = approvedCount === totalRevisores;
    const timelineItems = [
      { label: "Elaborado y firmado", done: true,  active: false },
      { label: `Revisión — ${approvedCount}/${totalRevisores}`, done: allDone, active: !allDone },
      { label: "Coordinación",        done: false, active: allDone },
      { label: "Validación final",    done: false, active: false },
    ];

    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ maxWidth: 660, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#dcfce7", border: "3px solid #bbf7d0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>
              {allDone ? "Etapa de revisión completada" : "Documento aprobado correctamente"}
            </h1>
            <p style={{ fontSize: 13.5, color: "#6b7a8d", lineHeight: 1.6 }}>
              {allDone
                ? "Todos los revisores requeridos aprobaron el documento. El Plan ha avanzado a la siguiente etapa."
                : "Su aprobación fue registrada. El documento continuará en esta etapa hasta que todos los revisores obligatorios hayan completado su revisión."}
            </p>
          </div>

          {/* Reviewer status */}
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Revisión — {approvedCount} de {totalRevisores} revisores aprobados</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: allDone ? "#dcfce7" : "#dbeafe", color: allDone ? "#166534" : "#1e40af" }}>
                {allDone ? "COMPLETADA" : "EN CURSO"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { nombre: REVISOR.nombre, aprobado: true },
                { nombre: "Ing. Patricia Salazar, Mg.", aprobado: caseB },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: r.aprobado ? "#dcfce7" : "#fef3c7", border: `2px solid ${r.aprobado ? "#22c55e" : "#f59e0b"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {r.aprobado
                      ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", display: "block" }} />}
                  </div>
                  <span style={{ fontSize: 13, color: "#1e2a3a" }}>{r.nombre}</span>
                  <span style={{ marginLeft: "auto", fontSize: 11.5, color: r.aprobado ? "#16a34a" : "#92400e", fontWeight: 600 }}>{r.aprobado ? "Aprobado y firmado" : "Pendiente"}</span>
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
                    <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: t.done ? "#1a4f8a" : t.active ? "#fff" : "#f1f5f9", border: t.done ? "none" : t.active ? "2.5px solid #1a4f8a" : "2px solid #d1d9e0" }}>
                      {t.done ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : t.active ? <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1a4f8a" }} />
                        : <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#d1d9e0" }} />}
                    </div>
                    {i < timelineItems.length - 1 && <div style={{ flex: 1, height: 2, background: "#e2e8f0" }} />}
                  </div>
                  <div style={{ fontSize: 11, color: t.done || t.active ? "#1e2a3a" : "#94a3b8", fontWeight: t.active ? 600 : 400, textAlign: "center" }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          {!caseB && (
            <div className="alert alert-info" style={{ fontSize: 13 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Ing. Patricia Salazar, Mg. aún tiene pendiente su revisión en esta etapa.
            </div>
          )}

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-ghost" onClick={() => setSub("bandeja")}>VOLVER A BANDEJA</button>
            <button className="btn btn-ghost" onClick={() => setSub("revision")}>VER DOCUMENTO</button>
            {!caseB && (
              <button className="btn btn-ghost btn-sm" onClick={() => setCaseB(true)} style={{ fontSize: 10.5, color: "#94a3b8", border: "1px dashed #d1d9e0" }} title="Solo visible en modo demostración">
                [DEMO] Simular 2ª aprobación →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Screen devuelto confirmation ─────────────────────────────────────────
  if (sub === "devuelto") {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 28px" }}>
        <div style={{ maxWidth: 580, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fef3c7", border: "3px solid #fde68a", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>Plan devuelto al elaborador</h1>
            <p style={{ fontSize: 13.5, color: "#6b7a8d", lineHeight: 1.6 }}>
              El documento fue devuelto con las observaciones registradas. El elaborador recibirá una notificación para realizar las correcciones correspondientes.
            </p>
          </div>
          <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a" }}>Plan de Trabajo — {plan.grupo}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#fef3c7", color: "#92400e" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
                DEVUELTO
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Observaciones registradas", val: `${obs.length}` },
                { label: "Devuelto por", val: REVISOR.nombre },
                { label: "Etapa", val: "Elaborador — Corrección requerida" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6b7a8d" }}>{r.label}</span>
                  <span style={{ color: "#1e2a3a", fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="alert alert-info" style={{ fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Cuando el elaborador corrija el documento y lo reenvíe, todos los revisores del paso deberán revisar nuevamente desde cero.
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="btn btn-ghost" onClick={() => setSub("bandeja")}>VOLVER A BANDEJA</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Screens 02–05: Revisión del documento ─────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      {/* Drawer: Agregar observación */}
      {showObsDrawer && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.35)", zIndex: 100 }} onClick={() => setShowObsDrawer(false)} />
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 460, background: "#fff", zIndex: 101, boxShadow: "-8px 0 32px rgba(0,0,0,0.18)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px 14px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif" }}>Nueva observación</h2>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label className="form-label required">Tipo de observación</label>
                <div style={{ display: "flex", gap: 10 }}>
                  {[{ val: "general" as const, label: "General" }, { val: "seccion" as const, label: "Sección específica" }].map(opt => (
                    <label key={opt.val} style={{ flex: 1, cursor: "pointer", borderRadius: 8, padding: "10px 14px", border: `1.5px solid ${obsForm.tipo === opt.val ? "#1a4f8a" : "#e2e8f0"}`, background: obsForm.tipo === opt.val ? "#eff6ff" : "#fff", display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="radio" name="obsTipo" value={opt.val} checked={obsForm.tipo === opt.val} onChange={() => setObsForm(f => ({ ...f, tipo: opt.val, seccion: "" }))} style={{ accentColor: "#1a4f8a" }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#1e2a3a" }}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {obsForm.tipo === "seccion" && (
                <div>
                  <label className="form-label required">Sección</label>
                  <select className="form-select" value={obsForm.seccion} onChange={e => setObsForm(f => ({ ...f, seccion: e.target.value }))}>
                    <option value="">Seleccionar sección…</option>
                    {SECCIONES_DOC.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="form-label required">Observación</label>
                <textarea className="form-textarea" style={{ minHeight: 120, fontSize: 13.5 }}
                  placeholder={obsForm.tipo === "general" ? "Describa la observación general sobre el documento..." : "Describa el problema encontrado en esta sección..."}
                  value={obsForm.texto} onChange={e => setObsForm(f => ({ ...f, texto: e.target.value }))} />
              </div>
            </div>
            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowObsDrawer(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={addObs} disabled={!obsForm.texto.trim() || (obsForm.tipo === "seccion" && !obsForm.seccion)}>AGREGAR OBSERVACIÓN</button>
            </div>
          </div>
        </>
      )}

      {/* Modal: Devolver con observaciones */}
      {showDevolverModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 500, padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", marginBottom: 6, fontFamily: "'DM Sans',sans-serif" }}>Devolver Plan de Trabajo</h2>
            <p style={{ fontSize: 13, color: "#6b7a8d", marginBottom: 18 }}>
              El documento será devuelto al elaborador para realizar correcciones. La versión permanecerá registrada como parte del historial de revisión.
            </p>
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
              {[
                { label: "Documento", val: "Plan de Trabajo" },
                { label: "Grupo",     val: plan.grupo },
                { label: "Versión",   val: `1.0` },
                { label: "Observaciones", val: `${obs.length}` },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6b7a8d" }}>{r.label}</span>
                  <span style={{ color: "#1e2a3a", fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label required">Mensaje para el elaborador</label>
              <textarea className="form-textarea" style={{ minHeight: 80, fontSize: 13.5 }}
                value={devolverMsg} onChange={e => setDevolverMsg(e.target.value)} />
            </div>
            <div className="alert alert-warning" style={{ fontSize: 12.5, marginBottom: 18 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Al devolver el documento, el flujo de aprobación se detendrá y el Plan volverá al elaborador.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setShowDevolverModal(false)}>Cancelar</button>
              <button className="btn btn-secondary" style={{ background: "#f59e0b", border: "none", color: "#1e2a3a" }}
                onClick={() => {
                  setShowDevolverModal(false);
                  setDecisionMade(true);
                  setSub("devuelto");
                  const today = new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" });
                  try {
                    const raw = localStorage.getItem(DRAFT_KEY);
                    const parsed = raw ? JSON.parse(raw) : {};
                    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...parsed, estado: "devuelto", fechaDevolucion: today, mensajeDevolucion: devolverMsg, observacionesRevision: obs }));
                  } catch {}
                  onDevolver?.({ mensaje: devolverMsg, obs });
                }}>
                CONFIRMAR DEVOLUCIÓN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Aprobar y firmar */}
      {showFirmarModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,47,86,0.45)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 12, width: 520, padding: "28px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>Aprobar y firmar documento</h2>
              <p style={{ fontSize: 13, color: "#6b7a8d" }}>Al firmar confirma que ha revisado y aprobado esta versión del Plan de Trabajo.</p>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Documento", val: "Plan de Trabajo" },
                { label: "Grupo",     val: plan.grupo },
                { label: "Versión",   val: "1.0" },
                { label: "Elaborador", val: plan.elaborador },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#6b7a8d" }}>{r.label}</span>
                  <span style={{ color: "#1e2a3a", fontWeight: 600 }}>{r.val}</span>
                </div>
              ))}
            </div>
            {obs.length > 0 && (
              <div className="alert alert-warning" style={{ fontSize: 12.5 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                Existen observaciones pendientes asociadas a esta revisión. Elimínelas o devuelva el documento antes de aprobar.
                <button className="btn btn-ghost btn-xs" style={{ marginLeft: "auto" }} onClick={() => setShowFirmarModal(false)}>REVISAR OBSERVACIONES</button>
              </div>
            )}
            {!signed ? (
              <>
                <div>
                  <label className="form-label required">Certificado de firma</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input className="form-input" value={certFile} onChange={e => setCertFile(e.target.value)} style={{ flex: 1 }} />
                    <button className="btn btn-ghost btn-sm" style={{ whiteSpace: "nowrap" }}>Examinar</button>
                  </div>
                </div>
                <div>
                  <label className="form-label required">Contraseña del certificado</label>
                  <div style={{ position: "relative" }}>
                    <input className="form-input" type={showPass ? "text" : "password"} value={certPass} onChange={e => setCertPass(e.target.value)} style={{ paddingRight: 40 }} />
                    <button onClick={() => setShowPass(v => !v)} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#64748b" }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
                <div className="alert alert-info" style={{ fontSize: 12 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  El certificado y su contraseña se utilizarán únicamente durante el proceso de firma y no serán almacenados permanentemente.
                </div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                  <input type="checkbox" checked={firmaConfirmed} onChange={e => setFirmaConfirmed(e.target.checked)} style={{ accentColor: "#1a4f8a", marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.55 }}>Confirmo que he revisado el documento y apruebo esta versión.</span>
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button className="btn btn-ghost" onClick={() => setShowFirmarModal(false)}>Cancelar</button>
                  <button className="btn btn-primary" disabled={!canSign} onClick={() => setSigned(true)}>APROBAR Y FIRMAR</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#dcfce7", borderRadius: 8, border: "1px solid #bbf7d0" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: "#166534" }}>Documento aprobado y firmado</div>
                    <div style={{ fontSize: 12, color: "#15803d", marginTop: 2 }}>Firmado por: {REVISOR.nombre} · {firmaDate} · 11:05</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button className="btn btn-primary" onClick={() => { setShowFirmarModal(false); setDecisionMade(true); setSub("aprobado"); }}>
                    VER ESTADO DEL PLAN →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "12px 24px", flexShrink: 0 }}>
        <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 2 }}>
          <span style={{ cursor: "pointer", color: "#1a4f8a" }} onClick={() => setSub("bandeja")}>Bandeja de revisión</span>
          {" "}›{" "}Plan de Trabajo › Revisión
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>Revisar Plan de Trabajo</h1>
            <div style={{ display: "flex", gap: 16, fontSize: 12.5, color: "#6b7a8d" }}>
              <span><b style={{ color: "#1e2a3a" }}>Grupo:</b> {plan.grupo}</span>
              <span><b style={{ color: "#1e2a3a" }}>Elaborador:</b> {plan.elaborador}</span>
              <span><b style={{ color: "#1e2a3a" }}>Versión:</b> 1.0</span>
              <span><b style={{ color: "#1e2a3a" }}>Recibido:</b> {plan.recibido} — {plan.hora}</span>
            </div>
          </div>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "#dbeafe", color: "#1e40af" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", display: "inline-block" }} />
            EN REVISIÓN
          </span>
        </div>
      </div>

      {/* Main layout: PDF + right panel */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, maxWidth: 1300 }}>

          {/* PDF viewer */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e2e8f0", padding: "8px 14px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12.5, color: "#475569" }}>Página 1 de 4</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
                <button onClick={() => setPdfZoom(z => Math.max(60, z - 10))} className="btn btn-ghost btn-xs" style={{ padding: "2px 8px", fontSize: 14 }}>−</button>
                <span style={{ fontSize: 12.5, color: "#475569", minWidth: 44, textAlign: "center" }}>{pdfZoom}%</span>
                <button onClick={() => setPdfZoom(z => Math.min(150, z + 10))} className="btn btn-ghost btn-xs" style={{ padding: "2px 8px", fontSize: 14 }}>+</button>
                <button className="btn btn-ghost btn-xs" onClick={() => setPdfZoom(100)}>Ajustar</button>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8, flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                DESCARGAR DOCUMENTO
              </button>
            </div>

            {/* A4 document */}
            <div style={{ background: "#6b7a8d", borderRadius: 8, padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: `${Math.min(100, pdfZoom)}%`, maxWidth: 720, background: "#fff", borderRadius: 4, boxShadow: "0 4px 24px rgba(0,0,0,0.25)", padding: "40px 48px", fontFamily: "'Times New Roman', serif", position: "relative", overflow: "hidden" }}>
                {/* Institutional header */}
                <div style={{ borderBottom: "2.5px solid #1a4f8a", paddingBottom: 12, marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 6, background: "#f0f4f8", border: "1.5px solid #d1d9e0", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#94a3b8", textAlign: "center", lineHeight: 1.3 }}>LOGO<br/>UTA</div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5 }}>Universidad Técnica de Ambato</div>
                      <div style={{ fontSize: 9.5, color: "#475569", marginTop: 1 }}>Facultad de Ingeniería en Sistemas, Electrónica e Industrial</div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#1e2a3a", marginTop: 8, textTransform: "uppercase" }}>Plan de Trabajo: {plan.grupo}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", marginTop: 10, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
                    {[{ label: "Unidad académica", val: "FISEI – UTA" }, { label: "Período", val: "Julio – Diciembre 2026" }, { label: "Versión", val: "1.0" }].map((item, i) => (
                      <div key={i} style={{ flex: 1, paddingRight: 10, borderRight: i < 2 ? "1px solid #e2e8f0" : "none", paddingLeft: i > 0 ? 10 : 0 }}>
                        <div style={{ fontSize: 7.5, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.3 }}>{item.label}</div>
                        <div style={{ fontSize: 9.5, fontWeight: 600, color: "#1e2a3a", marginTop: 1 }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Content sections */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5, borderBottom: "1px solid #e2e8f0", paddingBottom: 3 }}>1. Justificación</div>
                  <p style={{ fontSize: 10.5, color: "#334155", lineHeight: 1.7, textAlign: "justify" }}>{pdfDraft.justificacion}</p>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5, borderBottom: "1px solid #e2e8f0", paddingBottom: 3 }}>2. Objetivo</div>
                  <p style={{ fontSize: 10.5, color: "#334155", lineHeight: 1.7, textAlign: "justify" }}>{pdfDraft.objetivo}</p>
                </div>

                {/* Matriz - compact */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5, borderBottom: "1px solid #e2e8f0", paddingBottom: 3 }}>3. Matriz de Actividades</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Actividad", "Desde", "Hasta", "Responsable", "Recursos", "Medios"].map(h => (
                          <th key={h} style={{ padding: "4px 6px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pdfDraft.matriz.map((a, i) => (
                        <tr key={a.id} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "4px 6px", color: "#334155", borderBottom: "1px solid #f1f5f9", lineHeight: 1.3, fontSize: 8.5 }}>{a.nombre}</td>
                          <td style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", fontSize: 8.5 }}>{a.desde || "—"}</td>
                          <td style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", whiteSpace: "nowrap", fontSize: 8.5 }}>{a.hasta || "—"}</td>
                          <td style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", fontSize: 8.5 }}>{a.responsables.join(", ") || "—"}</td>
                          <td style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", fontSize: 8.5 }}>{a.recursos.join(", ") || "—"}</td>
                          <td style={{ padding: "4px 6px", color: "#475569", borderBottom: "1px solid #f1f5f9", fontSize: 8.5 }}>{a.medios.join(", ") || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Firmas — elaborador firmado, revisor pendiente */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6, borderBottom: "1px solid #e2e8f0", paddingBottom: 3 }}>5. Firmas de Responsabilidad</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Acciones", "Nombre", "Cargo", "Firma"].map(h => (
                          <th key={h} style={{ padding: "4px 6px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { accion: "Elaborado por:", nombre: plan.elaborador, cargo: "Docente elaborador", firma: "Firmado electrónicamente\n" + plan.elaborador + "\n05/09/2026  23:41", firmado: true },
                        { accion: "Revisado por:", nombre: REVISOR.nombre, cargo: "Docente revisor", firma: signed ? `Firmado electrónicamente\n${REVISOR.nombre}\n${firmaDate}  11:05` : "Pendiente", firmado: signed },
                        { accion: "Revisado por:", nombre: "Ing. Patricia Salazar, Mg.", cargo: "Docente revisor", firma: "Pendiente", firmado: false },
                        { accion: "Validado por:", nombre: "Autoridad correspondiente", cargo: "Autoridad académica", firma: "Pendiente", firmado: false },
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : "#f8fafc" }}>
                          <td style={{ padding: "5px 6px", color: "#1a4f8a", fontWeight: 700, borderBottom: "1px solid #e2e8f0", whiteSpace: "nowrap", fontSize: 8.5 }}>{row.accion}</td>
                          <td style={{ padding: "5px 6px", color: "#1e2a3a", borderBottom: "1px solid #e2e8f0", fontSize: 8.5 }}>{row.nombre}</td>
                          <td style={{ padding: "5px 6px", color: "#475569", borderBottom: "1px solid #e2e8f0", fontSize: 8.5 }}>{row.cargo}</td>
                          <td style={{ padding: "5px 6px", borderBottom: "1px solid #e2e8f0", fontSize: 8.5 }}>
                            {row.firmado
                              ? <span style={{ color: "#166534", fontWeight: 600, whiteSpace: "pre-line" }}>{row.firma}</span>
                              : <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Pendiente</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Historial */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5, borderBottom: "1px solid #e2e8f0", paddingBottom: 3 }}>6. Control de Historial de Cambios</div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 8.5 }}>
                    <thead>
                      <tr style={{ background: "#1a4f8a" }}>
                        {["Versión", "Descripción del Cambio", "Fecha de Actualización"].map(h => (
                          <th key={h} style={{ padding: "4px 6px", color: "#fff", textAlign: "left", fontWeight: 600, fontSize: 8 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: "4px 6px", color: "#334155", fontSize: 8.5 }}>1.0</td>
                        <td style={{ padding: "4px 6px", color: "#334155", fontSize: 8.5 }}>Elaboración inicial del Plan de Trabajo</td>
                        <td style={{ padding: "4px 6px", color: "#475569", fontSize: 8.5 }}>05/09/2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Review info */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 18px" }}>
              <h3 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 12 }}>Revisión del documento</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Etapa actual", val: "Revisión" },
                  { label: "Revisor",      val: REVISOR.nombre },
                  { label: "Grupo",        val: plan.grupo },
                  { label: "Versión",      val: "1.0" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                    <span style={{ color: "#6b7a8d" }}>{r.label}</span>
                    <span style={{ color: "#1e2a3a", fontWeight: 600, textAlign: "right", maxWidth: 160 }}>{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval flow */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 18px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 12 }}>Flujo de aprobación</h3>
              {[
                { label: "Elaborado y firmado", done: true,  active: false, count: null },
                { label: "Revisión",            done: false, active: true,  count: `${signed ? 1 : 0} de 2 revisores aprobados` },
                { label: "Coordinación",        done: false, active: false, count: null },
                { label: "Validación final",    done: false, active: false, count: null },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 10, marginBottom: i < 3 ? 0 : 0 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: s.done ? "#1a4f8a" : s.active ? "#eff6ff" : "#f1f5f9", border: s.active && !s.done ? "2px solid #1a4f8a" : s.done ? "none" : "2px solid #d1d9e0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {s.done ? <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.active ? "#1a4f8a" : "#d1d9e0" }} />}
                    </div>
                    {i < 3 && <div style={{ width: 1.5, height: 20, background: "#e2e8f0", margin: "2px 0" }} />}
                  </div>
                  <div style={{ paddingBottom: i < 3 ? 14 : 0, paddingTop: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#1e2a3a" }}>{s.label}</div>
                    {s.count && <div style={{ fontSize: 11, color: "#1a4f8a", marginTop: 1 }}>{s.count}</div>}
                  </div>
                </div>
              ))}

              {/* Reviewers in this stage */}
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7a8d", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Revisores de esta etapa</div>
                {[
                  { nombre: REVISOR.nombre, estado: signed ? "Aprobado y firmado" : "Pendiente", aprobado: signed },
                  { nombre: "Ing. Patricia Salazar, Mg.", estado: "Pendiente", aprobado: false },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: r.aprobado ? "#22c55e" : "#f59e0b", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, color: "#1e2a3a", fontWeight: 500 }}>{r.nombre}</div>
                      <div style={{ fontSize: 11, color: r.aprobado ? "#16a34a" : "#92400e" }}>{r.aprobado ? "✓ " : "● "}{r.estado}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "16px 18px" }}>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 10 }}>Aspectos a verificar</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {["Información general", "Justificación", "Objetivo", "Matriz de actividades", "Anexos", "Firmas y formato documental"].map(item => (
                  <label key={item} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!checklist[item]} onChange={e => setChecklist(c => ({ ...c, [item]: e.target.checked }))} style={{ accentColor: "#1a4f8a", width: 14, height: 14 }} />
                    <span style={{ fontSize: 12.5, color: checklist[item] ? "#16a34a" : "#475569", textDecoration: checklist[item] ? "line-through" : "none" }}>{item}</span>
                  </label>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 10, lineHeight: 1.5 }}>Este checklist es de apoyo para el revisor y no modifica el documento.</p>
            </div>

            {/* Observations list */}
            <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                  Observaciones
                  <span style={{ marginLeft: 6, background: obs.length > 0 ? "#fee2e2" : "#f1f5f9", color: obs.length > 0 ? "#dc2626" : "#94a3b8", borderRadius: 99, fontSize: 10.5, fontWeight: 700, padding: "1px 7px" }}>{obs.length}</span>
                </h3>
                <button className="btn btn-ghost btn-xs" onClick={() => setShowObsDrawer(true)}>+ Agregar</button>
              </div>
              {obs.length === 0 ? (
                <div style={{ padding: "20px 16px", textAlign: "center", fontSize: 12.5, color: "#94a3b8" }}>Sin observaciones registradas.</div>
              ) : (
                <div style={{ maxHeight: 280, overflowY: "auto" }}>
                  {obs.map((o, idx) => (
                    <div key={o.id} style={{ padding: "12px 16px", borderBottom: idx < obs.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                        <span style={{ fontSize: 10.5, fontWeight: 700, color: o.tipo === "general" ? "#475569" : "#1a4f8a", textTransform: "uppercase", letterSpacing: 0.4 }}>
                          {o.tipo === "general" ? "General" : o.seccion}
                        </span>
                        {!decisionMade && (
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              title="Editar observación"
                              onClick={() => { setEditObsId(o.id); setEditObsText(o.texto); }}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: "2px 4px", borderRadius: 4, display: "flex", alignItems: "center" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            </button>
                            <button
                              title="Eliminar observación"
                              onClick={() => setObs(prev => prev.filter(x => x.id !== o.id))}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px 4px", borderRadius: 4, display: "flex", alignItems: "center" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                            </button>
                          </div>
                        )}
                        {decisionMade && (
                          <span style={{ fontSize: 10, color: "#94a3b8", fontStyle: "italic" }}>Historial</span>
                        )}
                      </div>
                      {editObsId === o.id && !decisionMade ? (
                        <div style={{ marginBottom: 6 }}>
                          <textarea className="form-textarea" style={{ minHeight: 70, fontSize: 12.5 }} value={editObsText} onChange={e => setEditObsText(e.target.value)} />
                          <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
                            <button className="btn btn-primary btn-xs" onClick={() => { setObs(prev => prev.map(x => x.id === o.id ? { ...x, texto: editObsText } : x)); setEditObsId(null); }}>Guardar</button>
                            <button className="btn btn-ghost btn-xs" onClick={() => setEditObsId(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <p style={{ fontSize: 12.5, color: "#334155", lineHeight: 1.55, marginBottom: 4 }}>"{o.texto}"</p>
                      )}
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>{o.autor} — {o.fecha}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-primary" onClick={() => setShowFirmarModal(true)} style={{ justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                APROBAR Y FIRMAR
              </button>
              <button onClick={() => setShowDevolverModal(true)} style={{ justifyContent: "center", padding: "9px 16px", borderRadius: 8, border: "1.5px solid #f59e0b", background: "#fffbeb", color: "#92400e", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>
                DEVOLVER CON OBSERVACIONES
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowObsDrawer(true)} style={{ justifyContent: "center" }}>
                Agregar observación
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedApp({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<AppView>("inicio");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<"docente" | "revisor">("docente");
  const [planesViewKey, setPlanesViewKey] = useState(0);
  const seguimientoState = useSeguimientoState();

  function handleRoleSwitch() {
    if (userRole === "docente") {
      setUserRole("revisor");
      setView("evidenciasValidar");
    } else {
      setUserRole("docente");
      setView("planes");
      setPlanesViewKey(k => k + 1);
    }
  }

  function handleDevolver(data: { mensaje: string; obs: Observacion[] }) {
    const today = new Date().toLocaleDateString("es-EC", { day: "2-digit", month: "2-digit", year: "numeric" });
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      localStorage.setItem(DRAFT_KEY, JSON.stringify({
        ...parsed,
        estado: "devuelto",
        fechaDevolucion: today,
        mensajeDevolucion: data.mensaje,
        observacionesRevision: data.obs,
      }));
    } catch {}
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      <Sidebar
        view={view} setView={setView} onLogout={onLogout}
        collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed}
        userRole={userRole} onRoleSwitch={handleRoleSwitch}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar view={view} userRole={userRole} />
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
              onNavigateActividades={() => {
                seguimientoState.setActividadSeleccionadaId(null);
                setView("actividades");
              }}
            />
          )}
          {view === "actividades" && (
            seguimientoState.actividadSeleccionada ? (
              <DetalleActividadView
                actividad={seguimientoState.actividadSeleccionada}
                onBack={() => seguimientoState.setActividadSeleccionadaId(null)}
                onCargarEvidencia={seguimientoState.cargarEvidencia}
                onReemplazarEvidencia={seguimientoState.reemplazarEvidencia}
              />
            ) : (
              <MisActividadesView
                actividades={seguimientoState.actividades}
                onSelectActividad={seguimientoState.setActividadSeleccionadaId}
                resumen={seguimientoState.resumen}
              />
            )
          )}
          {view === "evidencias" && (
            <MisEvidenciasView
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
          {view === "notificaciones" && <PlaceholderView label="Notificaciones" />}
          {view === "perfil" && <PlaceholderView label="Perfil" />}
          {(view === "bandeja" || view === "planesRevision" || view === "grupos") && (
            <RevisorView onBackToDocente={handleRoleSwitch} onDevolver={handleDevolver} />
          )}
        </main>
      </div>
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
