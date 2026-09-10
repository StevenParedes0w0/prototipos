import React, { useState } from "react";

const USUARIOS = {
  docente: {
    nombre: "Ing. Andrea Pérez, Mg.",
    correo: "andrea.perez@uta.edu.ec",
    avatar: "AP",
    avatarBg: "#2563ab",
    roles: ["Docente"],
    estado: "Activo",
    grupos: [
      { nombre: "Unidad de Titulación", tipo: "Unidad Académica", rolGrupo: "Miembro" },
      { nombre: "Comisión de Eventos Académicos", tipo: "Comisión Institucional", rolGrupo: "Miembro" },
    ],
    contextoActual: null as string | null,
  },
  revisor: {
    nombre: "Ing. Carlos López, Mg.",
    correo: "carlos.lopez@uta.edu.ec",
    avatar: "CL",
    avatarBg: "#1a6a4a",
    roles: ["Docente", "Revisor"],
    estado: "Activo",
    grupos: [
      { nombre: "Unidad de Titulación", tipo: "Unidad Académica", rolGrupo: "Coordinador" },
      { nombre: "Comisión de Eventos Académicos", tipo: "Comisión Institucional", rolGrupo: "Miembro" },
    ],
    contextoActual: "Revisor" as string | null,
  },
  admin: {
    nombre: "Ing. Laura Medina, Mg.",
    correo: "laura.medina@uta.edu.ec",
    avatar: "LM",
    avatarBg: "#7c3aed",
    roles: ["Administrador"],
    estado: "Activo",
    grupos: [] as { nombre: string; tipo: string; rolGrupo: string }[],
    contextoActual: null as string | null,
  },
};

function IcoLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}

function IcoEye() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function IcoEyeOff() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PwdField({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (v: string) => void; error?: string; }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "#374151", marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••••"
          style={{
            width: "100%", padding: "9px 40px 9px 12px", borderRadius: 8,
            border: `1.5px solid ${error ? "#fca5a5" : "#d1d5db"}`,
            fontSize: 13.5, outline: "none", background: "#fff", color: "#1e293b",
            boxSizing: "border-box", fontFamily: "inherit",
          }}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
          style={{
            position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#94a3b8",
            padding: 4, display: "flex", alignItems: "center",
          }}
        >
          {show ? <IcoEyeOff /> : <IcoEye />}
        </button>
      </div>
      {error && <p style={{ fontSize: 12, color: "#dc2626", marginTop: 4 }}>{error}</p>}
    </div>
  );
}

function ModalCambiarContrasena({ onClose }: { onClose: () => void }) {
  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [errors, setErrors] = useState<{ actual?: string; nueva?: string; confirmar?: string }>({});
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!actual) errs.actual = "Ingrese su contraseña actual.";
    if (!nueva) errs.nueva = "Ingrese una nueva contraseña.";
    else if (nueva === actual) errs.nueva = "La nueva contraseña no puede ser igual a la actual.";
    if (!confirmar) errs.confirmar = "Confirme la nueva contraseña.";
    else if (nueva && confirmar !== nueva) errs.confirmar = "Las contraseñas ingresadas no coinciden.";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSuccess(true);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
        backdropFilter: "blur(2px)", zIndex: 2000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 14, width: 440, maxWidth: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)", border: "1px solid #e2e8f0", overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a4f8a" }}>
              <IcoLock />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0 }}>Cambiar contraseña</h2>
              <p style={{ fontSize: 11.5, color: "#64748b", margin: 0 }}>Actualice sus credenciales de acceso</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 18, padding: 4 }}>✕</button>
        </div>

        <div style={{ padding: "22px 24px" }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", color: "#15803d", fontSize: 24 }}>
                ✓
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#166534", marginBottom: 6 }}>✓ Contraseña actualizada correctamente.</h3>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.6 }}>Su nueva contraseña ha sido registrada exitosamente.</p>
              <button onClick={onClose} style={{ padding: "9px 24px", borderRadius: 8, border: "none", background: "#0f2f56", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <PwdField id="pwd-actual" label="Contraseña actual" value={actual} onChange={v => { setActual(v); setErrors(e => ({...e, actual: undefined})); }} error={errors.actual} />
              <PwdField id="pwd-nueva" label="Nueva contraseña" value={nueva} onChange={v => { setNueva(v); setErrors(e => ({...e, nueva: undefined})); }} error={errors.nueva} />
              <PwdField id="pwd-confirmar" label="Confirmar nueva contraseña" value={confirmar} onChange={v => { setConfirmar(v); setErrors(e => ({...e, confirmar: undefined})); }} error={errors.confirmar} />
              <div style={{ background: "#eff6ff", border: "1.5px solid #bfdbfe", borderRadius: 8, padding: "10px 13px", fontSize: 12, color: "#1e40af", lineHeight: 1.55 }}>
                ℹ La nueva contraseña debe cumplir los requisitos de seguridad configurados por la institución.
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", paddingTop: 4 }}>
                <button type="button" onClick={onClose} style={{ padding: "9px 18px", borderRadius: 8, border: "1.5px solid #d1d5db", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#0f2f56", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  ACTUALIZAR CONTRASEÑA
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PerfilView({ userRole }: { userRole: "docente" | "revisor" | "admin" }) {
  const [showModal, setShowModal] = useState(false);
  const user = USUARIOS[userRole];

  return (
    <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto", fontFamily: "'DM Sans','Inter',sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f2f56", margin: 0 }}>Mi Perfil</h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: "4px 0 0" }}>
          Consulte la información asociada a su cuenta institucional.
        </p>
      </div>

      {/* Hero block */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 20, padding: "28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: user.avatarBg, color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 800, flexShrink: 0,
            boxShadow: `0 0 0 4px ${user.avatarBg}33`,
          }}>
            {user.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1e293b", margin: "0 0 4px" }}>{user.nombre}</h2>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px" }}>{user.correo}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#dcfce7", color: "#166534", border: "1px solid #86efac" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
                ACTIVO
              </span>
              {user.roles.map(r => (
                <span key={r} style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#eff6ff", color: "#1d4ed8", border: "1px solid #bfdbfe" }}>
                  {r}
                </span>
              ))}
              {user.contextoActual && (
                <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: "#f0fdf4", color: "#15803d", border: "1px solid #86efac" }}>
                  Contexto actual: {user.contextoActual}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Account info */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Información de la cuenta</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Los campos institucionales están en modo solo lectura</p>
            </div>
            <div style={{ padding: "4px 20px 12px" }}>
              {[
                { label: "Nombre completo", value: user.nombre },
                { label: "Correo institucional", value: user.correo },
                { label: "Rol del sistema", value: user.roles.join(" / ") },
                { label: "Estado de cuenta", value: "Activo" },
              ].map((row, i) => (
                <div key={i} style={{ padding: "12px 0", borderBottom: i < 3 ? "1px solid #f1f5f9" : "none" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px" }}>{row.label}</p>
                  <p style={{ fontSize: 14, color: "#1e293b", fontWeight: 500, margin: 0 }}>{row.value}</p>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.55, margin: "12px 0 0" }}>
                La información institucional (nombre, correo y rol) es administrada por la Facultad. Para solicitar cambios, contacte a la administración del sistema.
              </p>
            </div>
          </div>

          {/* Groups */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Grupos institucionales</h3>
              {user.grupos.length > 0 && (
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Grupos en los que participa actualmente</p>
              )}
            </div>
            <div style={{ padding: "16px 20px" }}>
              {user.grupos.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0", color: "#94a3b8" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🏛️</div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: "#64748b", margin: "0 0 4px" }}>Rol administrativo del sistema</p>
                  <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>
                    El Administrador gestiona el sistema institucional.<br />
                    La participación en grupos académicos se configura por separado.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {user.grupos.map((g, i) => (
                    <div key={i} style={{ padding: "14px 16px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div>
                          <p style={{ fontSize: 13.5, fontWeight: 700, color: "#1e293b", margin: "0 0 2px" }}>{g.nombre}</p>
                          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{g.tipo}</p>
                        </div>
                        <span style={{
                          flexShrink: 0, padding: "2px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 700,
                          background: g.rolGrupo === "Coordinador" ? "#eff6ff" : "#f8fafc",
                          color: g.rolGrupo === "Coordinador" ? "#1d4ed8" : "#475569",
                          border: `1px solid ${g.rolGrupo === "Coordinador" ? "#bfdbfe" : "#d1d5db"}`,
                        }}>
                          {g.rolGrupo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — Security */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1e293b", margin: 0 }}>Seguridad</h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Gestión de acceso a la cuenta</p>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ padding: "16px", borderRadius: 10, background: "#f8fafc", border: "1.5px solid #e2e8f0", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#dbeafe", display: "flex", alignItems: "center", justifyContent: "center", color: "#1a4f8a" }}>
                    <IcoLock />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1e293b", margin: 0 }}>Contraseña</p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Última modificación: DEMO</p>
                  </div>
                </div>
                <button
                  id="btn-cambiar-contrasena"
                  onClick={() => setShowModal(true)}
                  style={{
                    width: "100%", padding: "9px 16px", borderRadius: 8,
                    border: "none", background: "#0f2f56", color: "#fff",
                    fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                    letterSpacing: "0.03em", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                >
                  <IcoLock />
                  CAMBIAR CONTRASEÑA
                </button>
              </div>
              <div style={{ padding: "12px 14px", borderRadius: 8, background: "#fffbeb", border: "1.5px solid #fde68a", fontSize: 12, color: "#92400e", lineHeight: 1.55 }}>
                <strong>Nota:</strong> No comparta su contraseña con terceros. El sistema no solicita credenciales fuera del proceso de inicio de sesión.
              </div>
            </div>
          </div>

          <div style={{ padding: "12px 14px", borderRadius: 10, background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8", display: "flex", gap: 6, alignItems: "center" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Fecha del sistema: <strong style={{ color: "#475569" }}>07/09/2026</strong>
          </div>
        </div>
      </div>

      {showModal && <ModalCambiarContrasena onClose={() => setShowModal(false)} />}
    </div>
  );
}
