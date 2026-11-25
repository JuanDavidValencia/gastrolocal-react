import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { leerPerfil, guardarPerfil, guardarFoto } from "../services/cuenta.js";
import { CabeceraPagina } from "../components/CatalogoUI.jsx";
import { Imagen } from "../components/Imagen.jsx";
function fotoValida(valor) { if (!valor) return true; try { return new URL(valor).protocol === "https:"; } catch { return false; } }
export default function Perfil() {
  const { sesion } = useAuth(); const user = sesion.user;
  const [campos, setCampos] = useState(null); const [foto, setFoto] = useState(""); const [existe, setExiste] = useState(false);
  const [errorCarga, setErrorCarga] = useState(""); const [error, setError] = useState(""); const [mensaje, setMensaje] = useState(""); const [ocupado, setOcupado] = useState(false); const [revision, setRevision] = useState(0);
  useEffect(() => {
    const c = new AbortController(); setCampos(null); setErrorCarga("");
    leerPerfil(user.id, c.signal).then(perfil => {
      if (c.signal.aborted) return;
      setExiste(Boolean(perfil)); setFoto(perfil?.foto_url || user.user_metadata?.avatar_url || "");
      setCampos({ nombre: perfil?.nombre || user.user_metadata?.full_name || "", email: perfil?.email || user.email || "", telefono: perfil?.telefono || "", direccion: perfil?.direccion || "" });
    }).catch(e => { if (!c.signal.aborted) setErrorCarga(e.message); });
    return () => c.abort();
  }, [user.id, revision]);
  function cambiar(e) { setCampos(prev => ({ ...prev, [e.target.name]: e.target.value })); setError(""); setMensaje(""); }
  async function guardar(evento, soloFoto = false) {
    evento.preventDefault(); setError(""); setMensaje("");
    if (!fotoValida(foto.trim())) { setError("Usa una dirección HTTPS válida para la foto."); return; }
    if (!soloFoto && (campos.nombre.trim().length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(campos.email.trim()))) { setError("Escribe un nombre de al menos 3 caracteres y un correo válido."); return; }
    setOcupado(true);
    try {
      if (soloFoto) await guardarFoto(user.id, foto.trim());
      else { await guardarPerfil(user.id, { nombre: campos.nombre.trim(), email: campos.email.trim(), telefono: campos.telefono.trim() || null, direccion: campos.direccion.trim() || null, foto_url: foto.trim() || null }); setExiste(true); }
      setMensaje(soloFoto ? "Tu foto se actualizó correctamente." : "Tu perfil se guardó correctamente.");
    } catch (e) { setError(e.message); } finally { setOcupado(false); }
  }
  return <><CabeceraPagina etiqueta="TU ESPACIO" titulo="Todo empieza contigo" descripcion="Actualiza tus datos y deja tu perfil listo para tu próxima reserva." />{errorCarga ? <div className="gl-empty" role="alert"><p>{errorCarga}</p><button className="boton-primario" onClick={() => setRevision(n => n + 1)}>Reintentar</button></div> : !campos ? <p role="status">Cargando tu perfil…</p> : <div className="gl-profile"><aside className="gl-profile-aside"><div className="gl-avatar">{foto ? <Imagen src={foto} alt="Tu foto de perfil" /> : <span>{(campos.nombre || "G").slice(0, 1).toUpperCase()}</span>}</div><h2>{campos.nombre || "Tu perfil"}</h2><p>Tu cuenta de GastroLocal</p><div className="gl-profile-hint">Tus favoritos y reservas están vinculados a tu cuenta.</div></aside><div className="gl-profile-main"><form onSubmit={guardar} className="gl-profile-form"><h2>Datos personales</h2><p>Los datos de contacto de tu perfil. Tu acceso con Google se mantiene igual.</p><fieldset disabled={ocupado}><div className="gl-form-grid">{[["nombre", "Nombre completo", "text", "name"], ["email", "Correo de contacto", "email", "email"], ["telefono", "Teléfono", "tel", "tel"], ["direccion", "Dirección", "text", "street-address"]].map(([name, label, type, auto]) => <div className="campo" key={name}><label htmlFor={`perfil-${name}`}>{label}</label><input id={`perfil-${name}`} name={name} type={type} autoComplete={auto} required={name === "nombre" || name === "email"} maxLength={name === "direccion" ? 250 : 150} value={campos[name]} onChange={cambiar} /></div>)}</div><button className="boton-primario" type="submit">{ocupado ? "Guardando…" : "Guardar perfil"}</button></fieldset></form><form className="gl-profile-photo" onSubmit={e => guardar(e, true)}><h2>Una foto para tu perfil</h2><div className="campo"><label htmlFor="perfil-foto">URL de la foto (HTTPS)</label><input id="perfil-foto" type="url" value={foto} onChange={e => { setFoto(e.target.value); setMensaje(""); }} disabled={ocupado} placeholder="https://…" /></div><div className="acciones-formulario"><button type="submit" className="boton-secundario" disabled={ocupado || !existe}>Cambiar solo la foto</button><button type="button" className="gl-text-button" disabled={ocupado || !user.user_metadata?.avatar_url} onClick={() => setFoto(user.user_metadata?.avatar_url || "")}>Usar mi foto de Google</button></div>{!existe && <p className="gl-small">Guarda primero tu perfil para cambiar únicamente la foto.</p>}</form>{mensaje && <p className="reservas-aviso-exito" role="status">{mensaje}</p>}{error && <p className="reservas-aviso-error" role="alert">{error}</p>}</div></div>}</>;
}