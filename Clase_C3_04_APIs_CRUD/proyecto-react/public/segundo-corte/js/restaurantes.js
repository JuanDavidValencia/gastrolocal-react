import { consultarRestaurantes, agregarFavorito } from './api.js'
import { obtenerCliente } from './supabase-client.js'

// Seleccionamos el contenedor de tarjetas, el filtro y el aviso de estado
const contenedor = document.querySelector(".tarjetas")
const categoria = document.querySelector("#restaurante")
const botonFiltrar = document.querySelector("#boton-filtrar")
const estado = document.querySelector("#estado")

// Copia temporal de lo que descargamos de Supabase
let restaurantesCargados = []

function mostrarEstado(texto, esError = false) {
    estado.textContent = texto
    estado.classList.toggle('error', esError)
}

// Inserta las tarjetas (igual que antes, pero recibe la lista a mostrar)
function mostrarRestaurantes(tarjetas) {
    contenedor.innerHTML = ""

    for (let tarjeta of tarjetas) {

    contenedor.innerHTML += `

    <section class="tarjeta">
        <div>
            <h3>${tarjeta.nombre}</h3>
            <p>${tarjeta.descripcion}</p>

            <a href="${tarjeta.enlace}">
                <img src="${tarjeta.imagen}">
            </a>

            <div class="tarjeta-accion">
                <span>Información del restaurante</span>
                <button>Ver detalles</button>
            </div>

            <button type="button" class="btn-favorito" data-restaurante-id="${tarjeta.id}" data-nombre="${tarjeta.nombre}">
                Guardar en favoritos
            </button>
        </div>
    </section>
    
    `
    }
}

// Filtra la colección descargada por la categoría elegida
function filtrar() {

    if (categoria.value === "") {
        mostrarEstado("Debes elegir una opción para filtrar", true)
        return
    }

    const filtrados = restaurantesCargados.filter(function (restaurante) {
        return restaurante.categoria === categoria.value
    })

    mostrarRestaurantes(filtrados)

    if (filtrados.length === 0) {
        mostrarEstado("No hay restaurantes en esa categoría.", false)
    } else {
        mostrarEstado("Mostrando " + filtrados.length + " restaurantes.", false)
    }
}

// Controla el ciclo completo de la consulta: cargando, éxito y error
async function cargarRestaurantes() {
    botonFiltrar.disabled = true
    contenedor.innerHTML = ""
    mostrarEstado("Cargando restaurantes...", false)

    try {
        restaurantesCargados = await consultarRestaurantes()
        mostrarRestaurantes(restaurantesCargados)

        if (restaurantesCargados.length === 0) {
            mostrarEstado("La consulta no devolvió registros visibles.", false)
        } else {
            mostrarEstado("Mostrando " + restaurantesCargados.length + " restaurantes.", false)
        }
    } catch (error) {
        console.error("Error al consultar los restaurantes:", error)
        mostrarEstado("No se pudo cargar el catálogo. Revisa la configuración o la conexión.", true)
    } finally {
        botonFiltrar.disabled = false
    }
}

// ---------------------------------------------------------------------------
//  POST — Guardar un restaurante en favoritos
//  Solo se habilita con sesión iniciada: sin token, la API rechaza la escritura.
// ---------------------------------------------------------------------------
async function guardarEnFavoritos(evento) {
  const boton = evento.target.closest('.btn-favorito')
  if (!boton) return

  const id = boton.dataset.restauranteId
  const nombre = boton.dataset.nombre

  try {
    const usuario = await usuarioActual()
    if (!usuario) {
      mostrarEstado('Inicia sesión con Google para guardar favoritos.', true)
      return
    }

    boton.disabled = true
    await agregarFavorito(usuario.id, id)

    boton.textContent = 'Guardado ✓'
    mostrarEstado('"' + nombre + '" se guardó en tus favoritos.')
  } catch (error) {
    console.error('Error al guardar el favorito:', error)
    boton.disabled = false
    mostrarEstado('No se pudo guardar el favorito: ' + error.message, true)
  }
}

// Devuelve el usuario de la sesión actual, o null si no hay sesión.
async function usuarioActual() {
  const { data, error } = await obtenerCliente().auth.getSession()
  if (error) throw error
  return data.session?.user ?? null
}

// Conectamos las acciones e iniciamos la primera consulta
botonFiltrar.addEventListener("click", filtrar)
contenedor.addEventListener("click", guardarEnFavoritos)
cargarRestaurantes()
