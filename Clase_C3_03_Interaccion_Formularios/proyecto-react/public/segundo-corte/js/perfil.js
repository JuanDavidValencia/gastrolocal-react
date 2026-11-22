import { leerPerfil, editarPerfil, actualizarFotoPerfil } from './api.js'
import { obtenerCliente } from './supabase-client.js'

// -----------------------------------------------------------------------------
// Página de perfil.
//   PUT   -> guardar el perfil completo (crea o reemplaza la fila)
//   PATCH -> cambiar SOLO la foto de perfil
// -----------------------------------------------------------------------------

const seccion = document.querySelector('#mi-perfil')
const avisoSesion = document.querySelector('#perfil-aviso-sesion')
const formulario = document.querySelector('#formulario-perfil')
const campoNombre = document.querySelector('#perfil-nombre')
const campoEmail = document.querySelector('#perfil-email')
const campoTelefono = document.querySelector('#perfil-telefono')
const campoDireccion = document.querySelector('#perfil-direccion')
const campoFoto = document.querySelector('#perfil-foto')
const btnGuardar = document.querySelector('#btn-guardar-perfil')
const btnCambiarFoto = document.querySelector('#btn-cambiar-foto')
const btnUsarFotoGoogle = document.querySelector('#btn-usar-foto-google')
const estado = document.querySelector('#estado-perfil')
const avatarGrande = document.querySelector('#foto-perfil-grande')
const vistaPrevia = document.querySelector('#vista-previa-foto')

const AVATAR_POR_DEFECTO = 'data:image/svg+xml,%3Csvg%20xmlns=\'http://www.w3.org/2000/svg\'%20viewBox=\'0%200%2040%2040\'%3E%3Ccircle%20cx=\'20\'%20cy=\'16\'%20r=\'7\'%20fill=\'%23E67E22\'/%3E%3Cpath%20d=\'M7%2038a13%2013%200%200%201%2026%200z\'%20fill=\'%23E67E22\'/%3E%3C/svg%3E'

// Modo actual del formulario: "crear" o "editar".
// Es el estado que decide el texto del botón y qué operación enviamos.
let modo = 'crear'
let usuarioActual = null

function mostrarEstado(texto, esError = false) {
  estado.textContent = texto
  estado.classList.toggle('error', esError)
}

// Muestra u oculta la página según haya sesión.
function mostrarPanel(visible) {
  seccion.hidden = !visible
  avisoSesion.hidden = visible
}

// Rellena el formulario con los datos que ya tenemos.
function llenarFormulario(datos) {
  campoNombre.value = datos.nombre ?? ''
  campoEmail.value = datos.email ?? ''
  campoTelefono.value = datos.telefono ?? ''
  campoDireccion.value = datos.direccion ?? ''
  campoFoto.value = datos.foto_url ?? ''
  actualizarVistaPrevia()
}

// Precargamos con lo que Google ya autorizó: nombre, correo y avatar.
function datosDeGoogle(usuario) {
  const metadatos = usuario.user_metadata ?? {}
  return {
    nombre: metadatos.full_name ?? metadatos.name ?? (usuario.email ?? '').split('@')[0],
    email: usuario.email ?? '',
    telefono: '',
    direccion: '',
    foto_url: metadatos.avatar_url ?? metadatos.picture ?? ''
  }
}

// Actualiza los avatares con la URL que hay en el campo.
// Si la imagen no carga, se deja la silueta por defecto.
function actualizarVistaPrevia() {
  const url = campoFoto.value.trim()
  const destino = url || AVATAR_POR_DEFECTO

  for (const imagen of [avatarGrande, vistaPrevia]) {
    imagen.onerror = () => { imagen.src = AVATAR_POR_DEFECTO }
    imagen.src = destino
  }
}

// Avisa a la cabecera para que el ícono de la cabecera use la foto elegida.
// La cabecera escucha este evento en auth-ui.js.
function avisarFotoElegida(foto_url) {
  window.dispatchEvent(new CustomEvent('perfil:actualizado', { detail: { foto_url: foto_url || null } }))
}

// El formulario está en modo creación mientras no exista fila en la base.
function aplicarModo(nuevoModo) {
  modo = nuevoModo
  if (modo === 'crear') {
    btnGuardar.textContent = 'Crear mi perfil'
  } else {
    btnGuardar.textContent = 'Guardar cambios'
  }
}

// Carga el perfil y deja el formulario listo.
async function cargarPerfil(usuario) {
  usuarioActual = usuario
  mostrarPanel(true)

  try {
    const perfil = await leerPerfil(usuario.id)

    if (perfil) {
      llenarFormulario(perfil)
      aplicarModo('editar')
      // La cabecera debe mostrar la foto guardada, no la de Google.
      avisarFotoElegida(perfil.foto_url)
      mostrarEstado('Perfil cargado. Pulsa "Guardar cambios" para actualizarlo.')
    } else {
      // No hay fila todavía: modo creación, con los datos de Google de salida.
      llenarFormulario(datosDeGoogle(usuario))
      aplicarModo('crear')
      mostrarEstado('Aún no has guardado tu perfil. Completa los datos y guárdalos.')
    }
  } catch (error) {
    console.error('Error al leer el perfil:', error)
    mostrarEstado('No se pudo cargar tu perfil: ' + error.message, true)
  }
}

// ---------------------------------------------------------------------------
//  PUT — Guardar el perfil completo
// ---------------------------------------------------------------------------
async function guardarPerfil(evento) {
  evento.preventDefault()

  if (!usuarioActual) {
    mostrarEstado('Debes iniciar sesión para guardar tu perfil.', true)
    return
  }

  btnGuardar.disabled = true
  mostrarEstado('Guardando tu perfil...')

  try {
    // El PUT lleva TODAS las columnas, incluida la clave primaria.
    // En PostgREST eso hace UPSERT: crea la fila si no existe, la reemplaza si existe.
    const perfil = await editarPerfil({
      id: usuarioActual.id,
      nombre: campoNombre.value.trim(),
      email: campoEmail.value.trim(),
      telefono: campoTelefono.value.trim() || null,
      direccion: campoDireccion.value.trim() || null,
      foto_url: campoFoto.value.trim() || null
    })

    llenarFormulario(perfil)
    aplicarModo('editar')
    avisarFotoElegida(perfil.foto_url)
    mostrarEstado('Perfil guardado correctamente.')
  } catch (error) {
    console.error('Error al guardar el perfil:', error)
    mostrarEstado('No se pudo guardar el perfil: ' + error.message, true)
  } finally {
    btnGuardar.disabled = false
  }
}

// ---------------------------------------------------------------------------
//  PATCH — Cambiar solo la foto de perfil
// ---------------------------------------------------------------------------
async function cambiarFoto() {
  if (!usuarioActual) {
    mostrarEstado('Debes iniciar sesión para cambiar tu foto.', true)
    return
  }

  btnCambiarFoto.disabled = true
  mostrarEstado('Actualizando tu foto...')

  try {
    // El PATCH solo viaja el campo que cambia: el resto conserva su valor.
    const perfil = await actualizarFotoPerfil(usuarioActual.id, campoFoto.value.trim())

    campoFoto.value = perfil.foto_url ?? ''
    actualizarVistaPrevia()
    avisarFotoElegida(perfil.foto_url)
    mostrarEstado('Foto de perfil actualizada.')
  } catch (error) {
    console.error('Error al actualizar la foto:', error)
    mostrarEstado('No se pudo actualizar la foto: ' + error.message, true)
  } finally {
    btnCambiarFoto.disabled = false
  }
}

// Rellena el campo de la foto con el avatar que ya tenemos en Google.
function usarFotoDeGoogle() {
  if (!usuarioActual) return
  const metadatos = usuarioActual.user_metadata ?? {}
  const avatar = metadatos.avatar_url ?? metadatos.picture
  if (avatar) {
    campoFoto.value = avatar
    actualizarVistaPrevia()
    mostrarEstado('Foto de Google cargada. Pulsa "Cambiar solo la foto" para guardarla.')
  } else {
    mostrarEstado('Esta cuenta de Google no tiene una foto de perfil.', true)
  }
}

// ---------------------------------------------------------------------------
//  Arranque
// ---------------------------------------------------------------------------
async function iniciar() {
  formulario.addEventListener('submit', guardarPerfil)
  btnCambiarFoto.addEventListener('click', cambiarFoto)
  btnUsarFotoGoogle.addEventListener('click', usarFotoDeGoogle)
  campoFoto.addEventListener('input', actualizarVistaPrevia)

  // Al cerrar sesión, el panel se oculta.
  obtenerCliente().auth.onAuthStateChange((evento) => {
    // Este callback SOLO presenta el cambio: sin llamadas a Auth con await dentro.
    if (evento === 'SIGNED_OUT') {
      usuarioActual = null
      mostrarPanel(false)
    }
  })

  try {
    const { data, error } = await obtenerCliente().auth.getSession()
    if (error) throw error

    if (data.session?.user) {
      await cargarPerfil(data.session.user)
    } else {
      mostrarPanel(false)
    }
  } catch (error) {
    console.error('Error al iniciar el módulo de perfil:', error)
    mostrarPanel(false)
  }
}

iniciar()
