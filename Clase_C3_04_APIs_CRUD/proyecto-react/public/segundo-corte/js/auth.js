import { REDIRECT_URL } from './config.js'
import { obtenerCliente } from './supabase-client.js'

// El cliente vive en un módulo aparte para que la capa de datos (api.js)
// y la capa de autenticación compartan la misma instancia.
export { obtenerCliente }

// PASO 2. Calculamos la URL de retorno.
// Google vuelve a Supabase por https://PROYECTO.supabase.co/auth/v1/callback
// y Supabase vuelve a nuestra página por la dirección de este paso.
// Con Live Server debe ser la URL HTTP real: host, puerto y ruta deben coincidir
// con lo que agregaste en la lista de Redirect URLs de Supabase.
export function urlDeRetorno() {
  if (REDIRECT_URL) {
    return REDIRECT_URL
  }
  return window.location.origin + window.location.pathname
}

// PASO 3. Iniciamos el acceso con Google.
// El navegador viaja a Google, donde la persona elige su cuenta y autoriza
// identidad, correo y perfil. Nuestra página nunca recoge su contraseña.
// Google devuelve a Supabase, Auth comprueba el resultado y crea o recupera
// la cuenta de la aplicación, y después reenvía a urlDeRetorno().
// El SDK puede devolver un campo error: lo lanzamos con throw para que lo
// atienda el bloque catch de quien llama.
export async function iniciarSesionConGoogle() {
  const { error } = await obtenerCliente().auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: urlDeRetorno()
    }
  })
  if (error) throw error
}

// PASO 4. Cerramos la sesión de la aplicación en este navegador.
// scope: 'local' NO elimina la cuenta de Google ni los registros de la base de datos.
export async function cerrarSesion() {
  const { error } = await obtenerCliente().auth.signOut({ scope: 'local' })
  if (error) throw error
}

// PASO 5. Consultamos el usuario en el servidor de Supabase Auth.
// getUser() hace una petición de red, así que el dato es auténtico y se puede
// usar para basar reglas de autorización en él.
// Si no hay sesión activa no es un fallo: simplemente no hay nadie conectado.
export async function obtenerUsuario() {
  const { data, error } = await obtenerCliente().auth.getUser()
  if (error) {
    if (error.name === 'AuthSessionMissingError') return null
    throw error
  }
  return data.user
}

// PASO 6. Nos enteramos de los cambios de sesión (acceso, cierre, token renovado).
// IMPORTANTE: el callback SOLO presenta esos cambios. Dentro de él no se hacen
// llamadas a Auth con await, porque bloquearían el proceso de autenticación.
// Por eso recibe la sesión ya resuelta en lugar de llamar a getUser().
// Devolvemos la suscripción por si luego se quiere cancelar.
export function escucharCambiosDeSesion(callback) {
  const { data } = obtenerCliente().auth.onAuthStateChange((evento, session) => {
    callback(evento, session)
  })
  return data.subscription
}

// Detecta el error que Supabase deja en la URL cuando la persona regresa.
// Por ejemplo, si canceló el acceso en la pantalla de Google.
// Los parámetros pueden llegar en el fragmento (#...) o en la búsqueda (?...).
export function leerErrorDeRetorno() {
  const fragmento = new URLSearchParams(window.location.hash.slice(1))
  const busqueda = new URLSearchParams(window.location.search)

  const codigo = fragmento.get('error_code') || busqueda.get('error_code')
  const descripcion = fragmento.get('error_description') || busqueda.get('error_description')

  if (!codigo && !descripcion) return null

  // Limpiamos el error de la barra de direcciones, pero nunca el fragmento
  // que trae los tokens de una entrada exitosa.
  if (!window.location.hash.includes('access_token')) {
    busqueda.delete('error')
    busqueda.delete('error_code')
    busqueda.delete('error_description')
    const query = busqueda.toString()
    window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''))
  }

  return descripcion || codigo
}
