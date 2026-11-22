import { createClient } from "@supabase/supabase-js";

// Vite reemplaza estas variables en tiempo de compilación con los valores
// de .env.local. Si falta alguna, la aplicación muestra un aviso en lugar
// de fallar con un error poco claro.
const URL_SUPABASE = import.meta.env.VITE_SUPABASE_URL ?? "";
const CLAVE_PUBLICABLE = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigurado = Boolean(URL_SUPABASE && CLAVE_PUBLICABLE);

// Un único cliente para toda la aplicación: la sesión y la Data API
// comparten la misma instancia.
// PKCE evita que el token viaje en el fragmento de la URL. La navegación
// de la aplicación usa el hash (#/reservas), así que un flujo implícito
// podría chocar con la vista actual.
export const supabase = supabaseConfigurado
  ? createClient(URL_SUPABASE, CLAVE_PUBLICABLE, {
      auth: {
        flowType: "pkce",
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const urlSupabase = URL_SUPABASE;
export const clavePublicable = CLAVE_PUBLICABLE;
