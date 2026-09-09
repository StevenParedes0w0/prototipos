// Pantalla 02 — Gestión de Usuarios y Pantalla 03 — Importar Usuarios
import React, { useState, useMemo } from "react";
import { UsuarioAdmin, GrupoInstitucional, RolSistema, RolEnGrupo } from "./types";
import UsuarioDetalleModal from "./UsuarioDetalleModal";

interface UsuariosViewProps {
  usuarios: UsuarioAdmin[];
  grupos: GrupoInstitucional[];
  onToggleEstadoUsuario: (id: string) => void;
  onCrearUsuario: (data: {
    nombres: string;
    apellidos: string;
    correo: string;
    rol: RolSistema;
  }) => { success: boolean; error?: string };
  onAsignarGrupo: (usuarioId: string, grupoId: string, rolEnGrupo: RolEnGrupo) => { success: boolean; error?: string };
  onQuitarGrupo: (usuarioId: string, grupoId: string) => void;
}

export default function UsuariosView({
  usuarios,
  grupos,
  onToggleEstadoUsuario,
  onCrearUsuario,
  onAsignarGrupo,
  onQuitarGrupo,
}: UsuariosViewProps) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");

  // Modales
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<UsuarioAdmin | null>(null);
  const [showImportarModal, setShowImportarModal] = useState(false);
  const [showNuevoModal, setShowNuevoModal] = useState(false);

  // Estados modal nuevo
  const [nuevoNombres, setNuevoNombres] = useState("");
  const [nuevoApellidos, setNuevoApellidos] = useState("");
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [nuevoRol, setNuevoRol] = useState<RolSistema>("Docente");
  const [errorNuevo, setErrorNuevo] = useState<string | null>(null);

  // Estados modal importar Excel
  const [importPaso, setImportPaso] = useState<"upload" | "preview" | "done">("upload");
  const [importFileName, setImportFileName] = useState("docentes_fisei_2026.xlsx");

  // Filtrado
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      if (filtroEstado !== "Todos" && u.estado !== filtroEstado) return false;
      if (filtroRol !== "Todos" && u.rol !== filtroRol) return false;
      if (filtroGrupo !== "Todos" && !u.grupos.some(g => g.grupoNombre === filtroGrupo)) return false;

      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          u.nombreCompleto.toLowerCase().includes(q) ||
          u.correo.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [usuarios, filtroEstado, filtroRol, filtroGrupo, busqueda]);

  const handleCrearSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNuevo(null);
    const res = onCrearUsuario({
      nombres: nuevoNombres,
      apellidos: nuevoApellidos,
      correo: nuevoCorreo,
      rol: nuevoRol,
    });
    if (!res.success) {
      setErrorNuevo(res.error || "Error al crear usuario.");
    } else {
      setShowNuevoModal(false);
      setNuevoNombres("");
      setNuevoApellidos("");
      setNuevoCorreo("");
    }
  };

  const handleToggleEstado = (u: UsuarioAdmin) => {
    const accion = u.estado === "ACTIVO" ? "desactivar" : "activar";
    if (window.confirm(`¿Confirmar ${accion} al usuario ${u.nombreCompleto}?`)) {
      onToggleEstadoUsuario(u.id);
    }
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Usuarios</span>
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
            Usuarios
          </h1>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
            Gestión de docentes, revisores, credenciales y pertenencia a grupos institucionales.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setImportPaso("upload");
              setShowImportarModal(true);
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            IMPORTAR USUARIOS
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setShowNuevoModal(true)}
          >
            + NUEVO USUARIO
          </button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        padding: "14px 18px",
        marginBottom: 16,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {/* Busqueda */}
        <div style={{ flex: 1, minWidth: 220 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por nombre o correo institucional..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 13, padding: "6px 12px" }}
          />
        </div>

        {/* Estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Estado:</span>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            <option>ACTIVO</option>
            <option>INACTIVO</option>
          </select>
        </div>

        {/* Rol */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Rol:</span>
          <select
            className="form-select"
            value={filtroRol}
            onChange={(e) => setFiltroRol(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            <option>Docente</option>
            <option>Revisor</option>
            <option>Docente / Revisor</option>
            <option>Administrador</option>
          </select>
        </div>

        {/* Grupo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo:</span>
          <select
            className="form-select"
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 28px 5px 10px" }}
          >
            <option>Todos</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.nombre}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo institucional</th>
              <th>Rol</th>
              <th>Grupos</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron usuarios registrados con los criterios seleccionados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => {
                const isActivo = u.estado === "ACTIVO";
                return (
                  <tr key={u.id}>
                    <td>
                      <div
                        onClick={() => setUsuarioSeleccionado(u)}
                        style={{ fontWeight: 700, color: "#1a4f8a", cursor: "pointer", fontSize: 13 }}
                      >
                        {u.nombreCompleto}
                      </div>
                    </td>
                    <td style={{ fontSize: 12.5, color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>
                      {u.correo}
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: u.rol.includes("Revisor") ? "#0891b2" : u.rol.includes("Admin") ? "#7c3aed" : "#334155",
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {u.rol}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#1a4f8a",
                        background: "#eff6ff",
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}>
                        {u.grupos.length} {u.grupos.length === 1 ? "grupo" : "grupos"}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        padding: "3px 9px",
                        borderRadius: 999,
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: isActivo ? "#dcfce7" : "#f1f5f9",
                        color: isActivo ? "#166534" : "#64748b",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: isActivo ? "#22c55e" : "#94a3b8" }} />
                        {u.estado}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>
                      {u.ultimoAcceso}
                    </td>
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setUsuarioSeleccionado(u)}
                        >
                          VER
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setUsuarioSeleccionado(u)}
                        >
                          EDITAR
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleToggleEstado(u)}
                          style={{ color: isActivo ? "#dc2626" : "#16a34a" }}
                        >
                          {isActivo ? "DESACTIVAR" : "ACTIVAR"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pantalla 04 — Modal Detalle Usuario */}
      {usuarioSeleccionado && (
        <UsuarioDetalleModal
          usuario={usuarioSeleccionado}
          gruposDisponibles={grupos}
          onClose={() => setUsuarioSeleccionado(null)}
          onAsignarGrupo={onAsignarGrupo}
          onQuitarGrupo={onQuitarGrupo}
        />
      )}

      {/* Pantalla 03 — Modal Importar Usuarios (Simulación Excel) */}
      {showImportarModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 500,
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
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Importar usuarios
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", margin: "4px 0 0" }}>
                Importe la nómina institucional mediante un archivo Excel.
              </p>
            </div>

            <div style={{ padding: "24px" }}>
              {importPaso === "upload" && (
                <>
                  <div
                    onClick={() => setImportPaso("preview")}
                    style={{
                      border: "2px dashed #93c5fd",
                      background: "#eff6ff",
                      borderRadius: 10,
                      padding: "36px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      marginBottom: 16,
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "#dbeafe",
                      color: "#1a4f8a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 12px",
                    }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 4 }}>
                      Haga clic para cargar la plantilla o arrastre el archivo aquí
                    </div>
                    <div style={{ fontSize: 12.5, color: "#64748b" }}>
                      Formato soportado: <strong>.xlsx</strong> (Archivo sugerido: {importFileName})
                    </div>
                  </div>

                  <div style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: 8,
                    padding: "12px 14px",
                    fontSize: 12.5,
                    color: "#92400e",
                    lineHeight: 1.5,
                    marginBottom: 20,
                  }}>
                    ℹ Los usuarios nuevos recibirán una contraseña temporal y deberán cambiarla en su primer inicio de sesión.
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button className="btn btn-ghost" onClick={() => setShowImportarModal(false)}>
                      Cancelar
                    </button>
                    <button className="btn btn-primary" onClick={() => setImportPaso("preview")}>
                      Continuar a previsualización
                    </button>
                  </div>
                </>
              )}

              {importPaso === "preview" && (
                <>
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "16px",
                    marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 12.5, color: "#64748b", marginBottom: 6 }}>
                      Archivo cargado: <strong style={{ color: "#1e2a3a" }}>{importFileName}</strong>
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1a4f8a", marginBottom: 12 }}>
                      48 registros encontrados en el archivo
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                      <div style={{ background: "#dcfce7", padding: "10px", borderRadius: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>42</div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#166534" }}>Nuevos</div>
                      </div>
                      <div style={{ background: "#f1f5f9", padding: "10px", borderRadius: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#475569" }}>6</div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#475569" }}>Existentes</div>
                      </div>
                      <div style={{ background: "#fef3c7", padding: "10px", borderRadius: 6, textAlign: "center" }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: "#92400e" }}>2</div>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: "#92400e" }}>Con observaciones</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                    <button className="btn btn-ghost" onClick={() => setImportPaso("upload")}>
                      Volver
                    </button>
                    <button className="btn btn-primary" onClick={() => setImportPaso("done")}>
                      IMPORTAR USUARIOS
                    </button>
                  </div>
                </>
              )}

              {importPaso === "done" && (
                <div style={{ textAlign: "center", padding: "10px 0" }}>
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: "#dcfce7",
                    color: "#16a34a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", marginBottom: 6 }}>
                    Importación completada
                  </h3>
                  <p style={{ fontSize: 14, color: "#166534", fontWeight: 700, marginBottom: 12 }}>
                    42 usuarios importados correctamente.
                  </p>
                  <p style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, marginBottom: 20 }}>
                    Los usuarios importados quedarán preparados para recibir sus credenciales temporales mediante el mecanismo institucional que se establezca. Las contraseñas no se muestran en pantalla.
                  </p>

                  <button className="btn btn-primary" onClick={() => setShowImportarModal(false)}>
                    Finalizar y ver usuarios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Nuevo Usuario */}
      {showNuevoModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            width: 500,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                Nuevo usuario institucional
              </h2>
            </div>

            <form onSubmit={handleCrearSubmit} style={{ padding: "20px 24px" }}>
              {errorNuevo && (
                <div style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#991b1b",
                  padding: "10px 12px",
                  borderRadius: 6,
                  fontSize: 12.5,
                  marginBottom: 14,
                }}>
                  {errorNuevo}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="form-label required">Nombres</label>
                  <input
                    type="text"
                    className="form-input"
                    value={nuevoNombres}
                    onChange={(e) => setNuevoNombres(e.target.value)}
                    placeholder="Ej. Juan Carlos"
                    required
                  />
                </div>
                <div>
                  <label className="form-label required">Apellidos</label>
                  <input
                    type="text"
                    className="form-input"
                    value={nuevoApellidos}
                    onChange={(e) => setNuevoApellidos(e.target.value)}
                    placeholder="Ej. Morales Silva"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <label className="form-label required">Correo institucional (@uta.edu.ec)</label>
                <input
                  type="email"
                  className="form-input"
                  value={nuevoCorreo}
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  placeholder="usuario@uta.edu.ec"
                  required
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label required">Rol en el sistema</label>
                <select
                  className="form-select"
                  value={nuevoRol}
                  onChange={(e) => setNuevoRol(e.target.value as RolSistema)}
                  style={{ width: "100%" }}
                >
                  <option value="Docente">Docente</option>
                  <option value="Revisor">Revisor</option>
                  <option value="Docente / Revisor">Docente / Revisor</option>
                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowNuevoModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
