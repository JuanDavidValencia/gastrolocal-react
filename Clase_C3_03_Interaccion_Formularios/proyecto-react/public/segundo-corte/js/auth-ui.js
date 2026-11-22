import {
  iniciarSesionConGoogle,
  cerrarSesion,
  obtenerUsuario,
  escucharCambiosDeSesion,
  leerErrorDeRetorno
} from './auth.js'

// -----------------------------------------------------------------------------
// Presentación de la sesión en el encabezado de index.html.
// Este módulo SÍ toca el DOM, pero no llama a la red: eso lo hace auth.js.
// -----------------------------------------------------------------------------

const btnAcceder = document.querySelector('#btn-acceder')
const btnRegistrarse = document.querySelector('#btn-registrarse')
const btnCerrarSesion = document.querySelector('#btn-cerrar-sesion')
const enlacePerfil = document.querySelector('#enlace-perfil')
const fotoPerfil = document.querySelector('#foto-perfil')
const nombreUsuario = document.querySelector('#nombre-usuario')
const estadoAuth = document.querySelector('#estado-auth')

// Evita que el aviso de "sesión activa" pise el mensaje de bienvenida.
let yaAvisado = false

// Aviso accesible (role="status") para contar lo que va pasando.
// No todas las páginas tienen recuadro de estado, por eso lo comprobamos.
function mostrarEstado(texto, esError = false) {
  if (!estadoAuth) return
  estadoAuth.textContent = texto
  estadoAuth.classList.toggle('error', esError)
}

// Foto elegida por la persona en su perfil. Tiene prioridad sobre el avatar
// de Google, porque puede cambiar en cualquier momento con un PATCH.
let fotoElegida = null

// Último usuario pintado, para refrescar el avatar sin volver a consultarlo.
let usuarioActual = null

// Refresca solo el avatar del ícono de la cabecera.
function pintarAvatarActual() {
  if (!fotoPerfil) return

  // La foto elegida manda. Si no hay, se vuelve al avatar de Google.
  const google = usuarioActual?.user_metadata?.avatar_url || usuarioActual?.user_metadata?.picture
  const avatar = fotoElegida || google

  if (avatar) {
    fotoPerfil.src = avatar
    fotoPerfil.alt = 'Foto de ' + (usuarioActual?.user_metadata?.full_name || usuarioActual?.email || 'Usuario')
    fotoPerfil.hidden = false
  }
}

// Pinta el perfil y ajusta los botones según haya sesión abierta o no.
// OJO: mostrar el perfil NO sustituye las políticas RLS de Supabase.
// RLS sigue siendo la que autoriza cada fila en la base de datos.
function pintarSesion(usuario) {
  const haySesion = Boolean(usuario)

  btnAcceder.hidden = haySesion
  btnRegistrarse.hidden = haySesion
  btnCerrarSesion.hidden = !haySesion

  // El ícono de perfil es la entrada a la página de perfil.
  if (enlacePerfil) enlacePerfil.hidden = !haySesion

  if (!haySesion) {
    usuarioActual = null
    nombreUsuario.textContent = ''
    if (fotoPerfil) fotoPerfil.hidden = true
    return
  }

  usuarioActual = usuario

  const nombre = usuario.user_metadata?.full_name || usuario.email || 'Usuario'
  nombreUsuario.textContent = nombre

  // La foto del perfil (nuestra columna) manda sobre el avatar de Google.
  const avatar = fotoElegida || usuario.user_metadata?.avatar_url || usuario.user_metadata?.picture
  if (fotoPerfil) {
    if (avatar) {
      fotoPerfil.src = avatar
      fotoPerfil.alt = 'Foto de ' + nombre
      fotoPerfil.hidden = false
    } else {
      fotoPerfil.hidden = true
    }
  }
}

// Acceder y registrarse ejecutan el MISMO recorrido: Google identifica a la
// persona y Supabase crea la cuenta si es la primera vez o recupera la existente.
// Por eso los dos botones hacen exactamente lo mismo.
async function manejarAcceso() {
  btnAcceder.disabled = true
  btnRegistrarse.disabled = true
  mostrarEstado('Redirigiendo a Google...')

  try {
    await iniciarSesionConGoogle()
  } catch (error) {
    console.error('Error al iniciar el acceso con Google:', error)
    mostrarEstado('No se pudo iniciar el acceso con Google: ' + error.message, true)
    btnAcceder.disabled = false
    btnRegistrarse.disabled = false
  }
}

async function manejarCierreSesion() {
  btnCerrarSesion.disabled = true

  try {
    await cerrarSesion()
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
    mostrarEstado('No se pudo cerrar la sesión: ' + error.message, true)
  } finally {
    btnCerrarSesion.disabled = false
  }
}

function conectarBotones() {
  btnAcceder.addEventListener('click', manejarAcceso)
  btnRegistrarse.addEventListener('click', manejarAcceso)
  btnCerrarSesion.addEventListener('click', manejarCierreSesion)
}

// onAuthStateChange informa los cambios de sesión.
// Este callback SOLO presenta el cambio: sin llamadas a Auth con await dentro.
function presentarCambioDeSesion(evento, session) {
  if (evento === 'SIGNED_IN') {
    yaAvisado = true
    pintarSesion(session?.user)
    mostrarEstado('¡Listo! Iniciaste sesión con Google.')
  } else if (evento === 'SIGNED_OUT') {
    pintarSesion(null)
    mostrarEstado('Cerraste sesión en este navegador. Tu cuenta de Google sigue intacta.')
  } else if (evento === 'TOKEN_REFRESHED') {
    pintarSesion(session?.user)
  } else if (evento === 'INITIAL_SESSION' && session) {
    pintarSesion(session.user)
  }
}

async function iniciar() {
  conectarBotones()

  // 0. La página de perfil avisa cuando la persona elige otra foto.
  //    La escuchamos aquí para que el ícono de la cabecera la muestre al instante.
  window.addEventListener('perfil:actualizado', (evento) => {
    fotoElegida = evento.detail?.foto_url || null
    pintarAvatarActual()
  })

  // 1. Nos suscribimos primero para no perder el aviso SIGNED_IN que llega
  //    cuando la persona regresa de Google.
  try {
    escucharCambiosDeSesion(presentarCambioDeSesion)
  } catch (error) {
    console.error('No se pudo escuchar los cambios de sesión:', error)
    mostrarEstado('No se pudo activar el control de sesión.', true)
    return
  }

  // 2. Si Supabase devuelve un error en la URL (por ejemplo, la persona
  //    canceló el acceso en la pantalla de Google), lo mostramos.
  const errorDeRetorno = leerErrorDeRetorno()
  if (errorDeRetorno) {
    mostrarEstado('No se pudo completar el acceso: ' + errorDeRetorno, true)
  }

  // 3. Al recargar, el SDK puede recuperar una sesión vigente.
  //    getUser() la consulta al servidor de Supabase Auth.
  try {
    const usuario = await obtenerUsuario()
    if (usuario) {
      pintarSesion(usuario)
      if (!yaAvisado) {
        mostrarEstado('Sesión activa: ' + (usuario.email || ''))
      }
    }
  } catch (error) {
    console.error('Error al consultar el usuario:', error)
    mostrarEstado('No se pudo verificar la sesión.', true)
  }
}

iniciar()
