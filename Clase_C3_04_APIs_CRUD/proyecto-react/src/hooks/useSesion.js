import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigurado } from "../lib/supabase.js";

// Mantiene sincronizada la sesión de Supabase con React.
// La fuente de verdad es el SDK; este hook solo refleja sus cambios.
export function useSesion() {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(supabaseConfigurado);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supabase) {
      setCargando(false);
      return;
    }

    let vigente = true;

    supabase.auth
      .getSession()
      .then(({ data, error: fallo }) => {
        if (!vigente) return;
        if (fallo) setError(fallo.message);
        setSesion(data.session ?? null);
        setCargando(false);
      })
      .catch((fallo) => {
        if (!vigente) return;
        setError(fallo.message);
        setCargando(false);
      });

    // El callback de onAuthStateChange no debe hacer llamadas a Auth con await:
    // bloquearía el proceso interno de autenticación. Solo actualiza el estado.
    const { data: suscripcion } = supabase.auth.onAuthStateChange(
      (_evento, nuevaSesion) => {
        if (!vigente) return;
        setSesion(nuevaSesion ?? null);
        setCargando(false);
        if (nuevaSesion) setError("");
      },
    );

    return () => {
      vigente = false;
      suscripcion.subscription.unsubscribe();
    };
  }, []);

  const iniciarSesionConGoogle = useCallback(async () => {
    if (!supabase) return;
    setError("");

    // Volvemos a la vista de reservas: el hash no interfiere con el código
    // PKCE, que Supabase agrega en la cadena de consulta (?code=...).
    const destino = `${window.location.origin}${window.location.pathname}#/reservas`;

    const { error: fallo } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: destino },
    });

    if (fallo) setError(fallo.message);
  }, []);

  const cerrarSesion = useCallback(async () => {
    if (!supabase) return;

    // scope "local" cierra la sesión en este navegador; no borra la cuenta
    // de Google ni las filas de la base de datos.
    const { error: fallo } = await supabase.auth.signOut({ scope: "local" });
    if (fallo) setError(fallo.message);
  }, []);

  return {
    sesion,
    usuario: sesion?.user ?? null,
    cargando,
    error,
    iniciarSesionConGoogle,
    cerrarSesion,
  };
}
