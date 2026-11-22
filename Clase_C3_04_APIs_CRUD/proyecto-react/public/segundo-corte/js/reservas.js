import { consultarRestaurantes, crearReserva, listarReservas } from './api.js'
import { obtenerCliente } from './supabase-client.js'

// -----------------------------------------------------------------------------
// Reservas.
//   POST -> crear una reserva
//   GET  -> listar las reservas de la persona
// -----------------------------------------------------------------------------

const formulario = document.querySelector('.form-reservas')
const seleccionRestaurante = document.querySelector('#restaurante')
const estado = document.querySelector('#estado-reservas')
const lista = document.querySelector('#mis-reservas')
const avisoSesion = document.querySelector('#reservas-aviso-sesion')

let usuarioActual = null
let restaurantes = []

function mostrarEstado(texto, esError = false) {
  estado.textContent = texto
  estado.classList.toggle('error', esError)
}

// Rellena el desplegable con los restaurantes reales de la base de datos.
// Antes venían valores de relleno (restaurante1, restaurante2...).
function llenarSelectRestaurantes() {
  seleccionRestaurante.innerHTML = '<option value="">Selecciona un restaurante</option>'
  for (const restaurante of restaurantes) {
    const opcion = document.createElement('option')
    opcion.value = restaurante.id
    opcion.textContent = restaurante.nombre
    seleccionRestaurante.appendChild(opcion)
  }
}

// Pinta la lista de reservas de la persona.
function pintarReservas(reservas) {
  lista.innerHTML = ''

  if (reservas.length === 0) {
    lista.innerHTML = '<p class="vacio">Todavía no tienes reservas registradas.</p>'
    return
  }

  for (const reserva of reservas) {
    const restaurante = restaurantes.find(r => r.id === reserva.restaurante_id)
    const articulo = document.createElement('article')
    articulo.className = 'tarjeta reserva'
    articulo.innerHTML = `
      <div>
        <h3>${restaurante ? restaurante.nombre : 'Restaurante ' + reserva.restaurante_id}</h3>
        <p class="reserva-datos">${reserva.fecha} a las ${reserva.hora} · ${reserva.personas} persona(s)</p>
        <p class="reserva-datos">A nombre de ${reserva.nombre}</p>
        <p class="reserva-estado estado-${reserva.estado}">${reserva.estado}</p>
      </div>
    `
    lista.appendChild(articulo)
  }
}

// Carga y muestra las reservas de la persona.
async function cargarReservas() {
  try {
    const reservas = await listarReservas(usuarioActual.id)
    pintarReservas(reservas)
  } catch (error) {
    console.error('Error al listar las reservas:', error)
    mostrarEstado('No se pudieron cargar tus reservas: ' + error.message, true)
  }
}

// Valida los datos antes de enviar. Es la última barrera en el navegador,
// pero la base de datos sigue siendo la que manda (check constraints).
function validar(datos) {
  if (!datos.restaurante_id) return 'Debes elegir un restaurante.'
  if (!datos.nombre.trim()) return 'Escribe tu nombre.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email.trim())) return 'Escribe un correo válido.'
  if (!datos.telefono.trim()) return 'Escribe un teléfono.'
  if (!Number.isInteger(datos.personas) || datos.personas < 1) return 'Indica cuántas personas serán.'
  if (!datos.fecha) return 'Elige la fecha de la reserva.'

  const hoy = new Date().toISOString().slice(0, 10)
  if (datos.fecha < hoy) return 'No se puede reservar en una fecha que ya pasó.'

  if (!datos.hora) return 'Elige la hora de la reserva.'
  return null
}

// ---------------------------------------------------------------------------
//  POST — Crear la reserva
// ---------------------------------------------------------------------------
async function enviarReserva(evento) {
  evento.preventDefault()

  if (!usuarioActual) {
    mostrarEstado('Debes iniciar sesión para reservar.', true)
    return
  }

  const datos = {
    usuario_id: usuarioActual.id,
    restaurante_id: Number(seleccionRestaurante.value),
    nombre: formulario.querySelector('#nombre').value,
    email: formulario.querySelector('#email').value,
    telefono: formulario.querySelector('#telefono').value,
    personas: Number(formulario.querySelector('#personas').value),
    fecha: formulario.querySelector('#fecha').value,
    hora: formulario.querySelector('#hora').value
  }

  const errorDeValidacion = validar(datos)
  if (errorDeValidacion) {
    mostrarEstado(errorDeValidacion, true)
    return
  }

  const boton = formulario.querySelector('button[type="submit"]')
  boton.disabled = true
  mostrarEstado('Enviando tu reserva...')

  try {
    const reserva = await crearReserva(datos)

    // El formulario se limpia solo cuando el guardado quedó confirmado.
    formulario.reset()
    mostrarEstado('¡Reserva confirmada! Código ' + reserva.id + '.')
    await cargarReservas()
  } catch (error) {
    console.error('Error al crear la reserva:', error)
    // Si falló el guardado, conservamos lo que la persona escribió.
    mostrarEstado('No se pudo crear la reserva: ' + error.message, true)
  } finally {
    boton.disabled = false
  }
}

// ---------------------------------------------------------------------------
//  Arranque
// ---------------------------------------------------------------------------
async function iniciar() {
  formulario.addEventListener('submit', enviarReserva)

  try {
    restaurantes = await consultarRestaurantes()
    llenarSelectRestaurantes()
  } catch (error) {
    console.error('Error al cargar los restaurantes:', error)
    mostrarEstado('No se pudo cargar el catálogo de restaurantes.', true)
  }

  try {
    const { data, error } = await obtenerCliente().auth.getSession()
    if (error) throw error

    if (data.session?.user) {
      usuarioActual = data.session.user
      avisoSesion.hidden = true
      formulario.hidden = false
      await cargarReservas()
    } else {
      avisoSesion.hidden = false
      formulario.hidden = true
      lista.innerHTML = ''
    }
  } catch (error) {
    console.error('Error al iniciar el módulo de reservas:', error)
    avisoSesion.hidden = false
    formulario.hidden = true
  }

  obtenerCliente().auth.onAuthStateChange((evento) => {
    // Solo presenta el cambio: sin llamadas a Auth con await dentro.
    if (evento === 'SIGNED_OUT') {
      usuarioActual = null
      avisoSesion.hidden = false
      formulario.hidden = true
      lista.innerHTML = ''
    }
  })
}

iniciar()
