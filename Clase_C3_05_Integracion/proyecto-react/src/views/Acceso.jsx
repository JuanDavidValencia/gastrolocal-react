import { useState } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/useAuth.js";
import { supabaseConfigurado } from "../lib/supabase.js";

export function Acceso() {
  const { sesion, entrar } = useAuth();
  const { search, hash } = useLocation();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState("");
  const falloOAuth = [search, hash.slice(1)].some((parte) => {
    const parametros = new URLSearchParams(parte);
    return parametros.has("error") || parametros.has("error_code");
  });
  const mensaje = error || (falloOAuth && !pendiente
    ? "Google no completó el acceso. Intenta iniciar sesión de nuevo."
    : "");

  async function iniciar() {
    setPendiente(true);
    setError("");
    try {
      await entrar();
    } catch {
      setError("No se pudo iniciar el acceso con Google. Vuelve a intentar.");
      setPendiente(false);
    }
  }

  if (sesion === undefined) {
    return <p className="reservas-cargando" role="status">Comprobando tu sesión…</p>;
  }
  if (sesion) return <Navigate to="/reservas" replace />;

  return (
    <section className="seccion-reservas" aria-labelledby="titulo-acceso">
      <div className="encabezado-reservas">
        <h1 id="titulo-acceso">Acceso</h1>
        <p>Entra con Google para crear y administrar tus reservas.</p>
      </div>
      <div className="panel-reserva panel-sesion">
        {!supabaseConfigurado ? (
          <p role="alert">
            Falta configurar las variables públicas de Supabase. Consulta el README.
          </p>
        ) : (
          <>
            <button type="button" className="boton-primario" onClick={iniciar} disabled={pendiente}>
              {pendiente ? "Abriendo el acceso…" : "Iniciar sesión con Google"}
            </button>
            {mensaje && <p className="reservas-aviso-error" role="alert">{mensaje}</p>}
          </>
        )}
      </div>
    </section>
  );
}
