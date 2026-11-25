import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../context/useAuth.js";
import { supabaseConfigurado } from "../lib/supabase.js";
const CLAVE = "gastrolocal:retorno";
function destinoValido(destino) { return /^\/(reservas|favoritos|perfil)(\/|\?|$)/.test(destino || "") ? destino : "/reservas"; }
function leerRetorno() { try { return sessionStorage.getItem(CLAVE); } catch { return null; } }
export function Acceso() {
  const { sesion, entrar } = useAuth(); const { search, hash } = useLocation();
  const [pendiente, setPendiente] = useState(false); const [error, setError] = useState("");
  const parametros = new URLSearchParams(search);
  const destino = destinoValido(parametros.get("volver") || leerRetorno());
  const falloOAuth = [search, hash.slice(1)].some(parte => { const p = new URLSearchParams(parte); return p.has("error") || p.has("error_code"); });
  async function iniciar() {
    setPendiente(true); setError(""); try { try { sessionStorage.setItem(CLAVE, destino); } catch { /* Retorno al listado si no se puede persistir. */ } await entrar(); }
    catch { setError("No se pudo iniciar el acceso con Google. Vuelve a intentar."); setPendiente(false); }
  }
  if (sesion === undefined) return <p role="status" className="reservas-cargando">Comprobando tu sesión…</p>;
  if (sesion) return <Navigate to={destino} replace />;
  return <section className="gl-login"><div className="gl-login-art"><span className="gl-eyebrow">TU PRÓXIMO BUEN MOMENTO</span><h1>Guarda el lugar.<br /><em>Comparte la mesa.</em></h1><p>Tus favoritos y reservas, en un solo espacio.</p><img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80" alt="Un plato de pasta con ingredientes frescos" /></div><div className="gl-login-form"><span className="gl-eyebrow">BIENVENIDO A GASTROLOCAL</span><h2>Qué bueno tenerte aquí.</h2><p>Entra con tu cuenta de Google para guardar restaurantes, gestionar tus reservas y editar tu perfil.</p>{!supabaseConfigurado ? <p className="reservas-aviso-error" role="alert">El acceso no está disponible en este momento.</p> : <button className="gl-google" onClick={iniciar} disabled={pendiente}><span aria-hidden="true">G</span>{pendiente ? "Abriendo Google…" : "Continuar con Google"}<span aria-hidden="true">→</span></button>}{(error || falloOAuth) && <p className="reservas-aviso-error" role="alert">{error || "Google no completó el acceso. Intenta de nuevo."}</p>}<p className="gl-login-note">Tu sesión mantiene tus favoritos y reservas asociados a tu cuenta.</p><Link to="/restaurantes">Seguir explorando sin iniciar sesión ↗</Link></div></section>;
}