import { listarFavoritos, quitarFavorito } from './api.js'
import { obtenerCliente } from './supabase-client.js'

// -----------------------------------------------------------------------------
// Favoritos.
//   GET    -> listar los favoritos de la persona
//   DELETE -> quitar un restaurante de favoritos
// -----------------------------------------------------------------------------

const lista = document.querySelector('#lista-favoritos')
const estado = document.querySelector('#estado-favoritos')
const avisoSesion = document.querySelector('#favoritos-aviso-sesion')

let usuarioActual = null

function mostrarEstado(texto, esError = false) {
  estado.textContent = texto
  estado.classList.toggle('error', esError)
}

// Pinta la lista de favoritos con su botón de quitar.
function pintarFavoritos(favoritos) {
  lista.innerHTML = ''

  if (favoritos.length === 0) {
    lista.innerHTML = `
      <p class="vacio">
        Todavía no has guardado restaurantes. Busca uno en
        <a href="restaurantes.html">el catálogo</a> y pulsa el corazón para guardarlo.
      </p>`
    return
  }

  for (const favorito of favoritos) {
    const restaurante = favorito.restaurante
    const articulo = document.createElement('article')
    articulo.className = 'tarjeta favorito'
    articulo.innerHTML = `
      <div>
        <h3>${restaurante.nombre}</h3>
        <p class="favorito-categoria">${restaurante.categoria}</p>
        <p>${restaurante.descripcion}</p>
        <a href="${restaurante.enlace}"><img src="${restaurante.imagen}" alt="${restaurante.nombre}"></a>
      </div>
    `

    const boton = document.createElement('button')
    boton.type = 'button'
    boton.className = 'btn-quitar-favorito'
    boton.textContent = 'Quitar de favoritos'
    boton.addEventListener('click', () => confirmarQuitar(restaurante, boton))

    articulo.querySelector('div').appendChild(boton)
    lista.appendChild(articulo)
  }
}

// ---------------------------------------------------------------------------
//  DELETE — Quitar un favorito, previa confirmación
// ---------------------------------------------------------------------------
async function confirmarQuitar(restaurante, boton) {
  // Antes de enviar el DELETE confirmamos sobre la fila concreta.
  const acepta = window.confirm(
    '¿Quitar "' + restaurante.nombre + '" de tus favoritos?\n\nEsta acción solo afecta a tu cuenta.'
  )
  if (!acepta) return

  boton.disabled = true
  mostrarEstado('Quitando "' + restaurante.nombre + '" de tus favoritos...')

  try {
    await quitarFavorito(usuarioActual.id, restaurante.id)
    mostrarEstado('"' + restaurante.nombre + '" se quitó de tus favoritos.')
    await cargarFavoritos()
  } catch (error) {
    console.error('Error al quitar el favorito:', error)
    mostrarEstado('No se pudo quitar el favorito: ' + error.message, true)
    boton.disabled = false
  }
}

// Carga y muestra los favoritos de la persona.
async function cargarFavoritos() {
  try {
    const favoritos = await listarFavoritos(usuarioActual.id)
    pintarFavoritos(favoritos)
    if (favoritos.length > 0) {
      mostrarEstado('Mostrando ' + favoritos.length + ' favorito(s).')
    }
  } catch (error) {
    console.error('Error al listar los favoritos:', error)
    mostrarEstado('No se pudieron cargar tus favoritos: ' + error.message, true)
  }
}

// ---------------------------------------------------------------------------
//  Arranque
// ---------------------------------------------------------------------------
async function iniciar() {
  try {
    const { data, error } = await obtenerCliente().auth.getSession()
    if (error) throw error

    if (data.session?.user) {
      usuarioActual = data.session.user
      avisoSesion.hidden = true
      await cargarFavoritos()
    } else {
      avisoSesion.hidden = false
      lista.innerHTML = ''
    }
  } catch (error) {
    console.error('Error al iniciar el módulo de favoritos:', error)
    avisoSesion.hidden = false
  }

  obtenerCliente().auth.onAuthStateChange((evento) => {
    // Solo presenta el cambio: sin llamadas a Auth con await dentro.
    if (evento === 'SIGNED_OUT') {
      usuarioActual = null
      avisoSesion.hidden = false
      lista.innerHTML = ''
    }
  })
}

iniciar()
