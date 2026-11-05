import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js'

// -----------------------------------------------------------------------------
// Cliente de Supabase compartido por toda la aplicación.
// Se crea una sola vez y de forma perezosa: si el SDK no se cargó, el error
// aparece en el momento de usarlo y no al importar el módulo.
// -----------------------------------------------------------------------------

let cliente = null

// createClient(url, clave) prepara el SDK. El mismo cliente sirve para
// Supabase Auth y para la Data API.
export function obtenerCliente() {
  if (!cliente) {
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('El SDK de Supabase no se cargó. Revisa tu conexión a internet.')
    }
    cliente = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  }
  return cliente
}

// Devuelve el token de la sesión actual, o null si la persona no ha iniciado sesión.
// Es el token que autoriza las escrituras: sin él, RLS rechaza la operación.
export async function obtenerTokenSesion() {
  const { data, error } = await obtenerCliente().auth.getSession()
  if (error) throw error
  return data.session?.access_token ?? null
}
