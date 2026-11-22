import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js'
import { obtenerTokenSesion } from './supabase-client.js'

// Consulta la tabla restaurantes y devuelve un arreglo de objetos.
export async function consultarRestaurantes() {
  // Evitamos una petición que sabemos que aún no está configurada.
  if (SUPABASE_URL.includes('TU_PROYECTO') ||
      SUPABASE_PUBLISHABLE_KEY.includes('REEMPLAZAR')) {
    throw new Error('Configura tu URL y tu clave publishable en config.js.')
  }

  // PASO 1. Preparamos el recurso y sus parámetros.
  const url = new URL('/rest/v1/restaurantes', SUPABASE_URL)
  url.searchParams.set('select', 'id,nombre,categoria,descripcion,imagen,enlace')
  url.searchParams.set('order', 'id.asc')
  url.searchParams.set('limit', '50')

  // PASO 2. Esperamos la respuesta HTTP. Todavía no entrega el arreglo.
  const respuesta = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json'
    }
  })

  // Un HTTP 4xx o 5xx no hace que fetch lance un error automáticamente.
  if (!respuesta.ok) {
    throw new Error('La API respondió con estado HTTP ' + respuesta.status)
  }

  // PASO 3. Leemos y convertimos el cuerpo JSON.
  const datos = await respuesta.json()

  if (!Array.isArray(datos)) {
    throw new Error('Se esperaba una colección de restaurantes.')
  }
  const estructuraValida = datos.every(function (r) {
    return r !== null && typeof r === 'object' &&
      Number.isInteger(r.id) &&
      typeof r.nombre === 'string' &&
      typeof r.categoria === 'string' &&
      typeof r.descripcion === 'string' &&
      typeof r.imagen === 'string'
  })
  if (!estructuraValida) {
    throw new Error('Los campos recibidos no coinciden con el catálogo esperado.')
  }

  return datos
}

// ============================================================================
//  OPERACIONES DE ESCRITURA (Clase 10: POST, PUT, PATCH y DELETE)
// ============================================================================

// Una escritura necesita el token de la sesión: sin sesión activa,
// Supabase rechaza la operación (el rol "anon" no tiene permisos de escritura).
async function cabeceraDeEscritura() {
  const token = await obtenerTokenSesion()
  if (!token) {
    throw new Error('Debes iniciar sesión para realizar esta operación.')
  }
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    // Pedimos las filas afectadas: así podemos confirmar que la operación
    // afectó una fila y no una colección vacía.
    Prefer: 'return=representation'
  }
}

// Ejecuta una escritura (POST, PUT, PATCH o DELETE) y devuelve las filas afectadas.
async function escribir(method, url, cuerpo) {
  const opciones = {
    method: method,
    headers: await cabeceraDeEscritura()
  }
  if (cuerpo !== null && cuerpo !== undefined) {
    opciones.body = JSON.stringify(cuerpo)
  }

  const respuesta = await fetch(url, opciones)

  if (!respuesta.ok) {
    const detalle = (await respuesta.text()).slice(0, 300)
    throw new Error('La API respondió con estado HTTP ' + respuesta.status + ': ' + detalle)
  }

  // 204 = la operación se hizo pero el servidor no devolvió cuerpo.
  if (respuesta.status === 204) return []

  const datos = await respuesta.json()
  return Array.isArray(datos) ? datos : [datos]
}

// Consulta autenticada (GET). Devuelve las filas visibles para la sesión.
async function consultar(ruta, parametros = {}) {
  const token = await obtenerTokenSesion()
  if (!token) {
    throw new Error('Debes iniciar sesión para ver esta información.')
  }

  const url = new URL(ruta, SUPABASE_URL)
  for (const [clave, valor] of Object.entries(parametros)) {
    url.searchParams.set(clave, valor)
  }

  const respuesta = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: 'Bearer ' + token,
      Accept: 'application/json'
    }
  })

  if (!respuesta.ok) {
    const detalle = (await respuesta.text()).slice(0, 300)
    throw new Error('La API respondió con estado HTTP ' + respuesta.status + ': ' + detalle)
  }

  const datos = await respuesta.json()
  return Array.isArray(datos) ? datos : [datos]
}

// El catálogo de restaurantes es público: se lee sin sesión (rol "anon").
// Importante: la tabla "restaurantes" solo tiene permiso SELECT para el rol
// "anon", así que consultarla con el token de sesión devolvería 403.
export async function consultarCatalogo(parametros = {}) {
  const url = new URL('/rest/v1/restaurantes', SUPABASE_URL)
  for (const [clave, valor] of Object.entries(parametros)) {
    url.searchParams.set(clave, valor)
  }

  const respuesta = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Accept: 'application/json'
    }
  })

  if (!respuesta.ok) {
    const detalle = (await respuesta.text()).slice(0, 300)
    throw new Error('La API respondió con estado HTTP ' + respuesta.status + ': ' + detalle)
  }

  const datos = await respuesta.json()
  return Array.isArray(datos) ? datos : [datos]
}

// ---------------------------------------------------------------------------
//  POST — Crear una reserva
// ---------------------------------------------------------------------------
export async function crearReserva(datos) {
  const url = new URL('/rest/v1/reservas', SUPABASE_URL)

  // El identificador lo genera el servidor (identity), no lo mandamos nosotros.
  const filas = await escribir('POST', url, {
    usuario_id: datos.usuario_id,
    restaurante_id: Number(datos.restaurante_id),
    nombre: datos.nombre,
    email: datos.email,
    telefono: datos.telefono,
    personas: Number(datos.personas),
    fecha: datos.fecha,
    hora: datos.hora,
    notas: datos.notas || null,
    estado: 'pendiente'
  })

  // Una colección vacía significa que NO se confirmó la creación.
  if (filas.length !== 1) {
    throw new Error('La reserva no se confirmó: la API no devolvió ninguna fila.')
  }
  return filas[0]
}

// ---------------------------------------------------------------------------
//  GET — Listar las reservas de la persona
// ---------------------------------------------------------------------------
export async function listarReservas(usuario_id) {
  return consultar('/rest/v1/reservas', {
    usuario_id: 'eq.' + usuario_id,
    select: 'id,restaurante_id,nombre,email,telefono,personas,fecha,hora,estado,notas,creado_en',
    order: 'creado_en.desc'
  })
}

// ---------------------------------------------------------------------------
//  GET — Leer el perfil de la persona (devuelve null si aún no existe)
// ---------------------------------------------------------------------------
export async function leerPerfil(usuario_id) {
  const filas = await consultar('/rest/v1/perfiles', {
    id: 'eq.' + usuario_id,
    select: 'id,nombre,email,telefono,direccion,foto_url,actualizado_en',
    limit: '1'
  })
  return filas.length ? filas[0] : null
}

// ---------------------------------------------------------------------------
//  PUT — Reemplazar el perfil completo
//  En PostgREST, PUT con el filtro sobre la clave primaria hace UPSERT:
//  si la fila no existe la crea, y si existe la reemplaza por completo.
//  Por eso el cuerpo debe traer TODAS las columnas, incluida la clave.
// ---------------------------------------------------------------------------
export async function editarPerfil(perfil) {
  const url = new URL('/rest/v1/perfiles', SUPABASE_URL)
  url.searchParams.set('id', 'eq.' + perfil.id)

  const filas = await escribir('PUT', url, {
    id: perfil.id,
    nombre: perfil.nombre ?? '',
    email: perfil.email ?? '',
    telefono: perfil.telefono ?? null,
    direccion: perfil.direccion ?? null,
    foto_url: perfil.foto_url ?? null
  })

  if (filas.length !== 1) {
    throw new Error('El perfil no se confirmó: la API no devolvió ninguna fila.')
  }
  return filas[0]
}

// ---------------------------------------------------------------------------
//  PATCH — Cambiar SOLO la foto de perfil
//  Solo viajan los campos que cambian; el resto conserva su valor.
// ---------------------------------------------------------------------------
export async function actualizarFotoPerfil(usuario_id, foto_url) {
  const url = new URL('/rest/v1/perfiles', SUPABASE_URL)
  url.searchParams.set('id', 'eq.' + usuario_id)

  const filas = await escribir('PATCH', url, { foto_url: foto_url || null })

  if (filas.length !== 1) {
    throw new Error('No se pudo cambiar la foto: todavía no has guardado tu perfil.')
  }
  return filas[0]
}

// ---------------------------------------------------------------------------
//  POST — Guardar un restaurante en favoritos
// ---------------------------------------------------------------------------
export async function agregarFavorito(usuario_id, restaurante_id) {
  const url = new URL('/rest/v1/favoritos', SUPABASE_URL)

  const filas = await escribir('POST', url, {
    usuario_id: usuario_id,
    restaurante_id: Number(restaurante_id)
  })

  // La restricción UNIQUE (usuario_id, restaurante_id) impide duplicados:
  // si ya estaba, la API devuelve 409 y lo reportamos como aviso.
  if (filas.length !== 1) {
    throw new Error('No se pudo guardar el favorito.')
  }
  return filas[0]
}

// ---------------------------------------------------------------------------
//  GET — Listar los favoritos con los datos del restaurante
// ---------------------------------------------------------------------------
export async function listarFavoritos(usuario_id) {
  const favoritos = await consultar('/rest/v1/favoritos', {
    usuario_id: 'eq.' + usuario_id,
    select: 'id,restaurante_id,creado_en',
    order: 'creado_en.desc'
  })

  if (favoritos.length === 0) return []

  // Traemos los restaurantes en una segunda consulta y los cruzamos en memoria.
  // El catálogo se lee sin token: es un recurso público.
  const ids = favoritos.map(f => f.restaurante_id)
  const restaurantes = await consultarCatalogo({
    id: 'in.(' + ids.join(',') + ')',
    select: 'id,nombre,categoria,descripcion,imagen,enlace'
  })

  const porId = new Map(restaurantes.map(r => [r.id, r]))
  return favoritos
    .map(f => ({ ...f, restaurante: porId.get(f.restaurante_id) || null }))
    .filter(f => f.restaurante !== null)
}

// ---------------------------------------------------------------------------
//  DELETE — Quitar un restaurante de favoritos
// ---------------------------------------------------------------------------
export async function quitarFavorito(usuario_id, restaurante_id) {
  const url = new URL('/rest/v1/favoritos', SUPABASE_URL)
  url.searchParams.set('usuario_id', 'eq.' + usuario_id)
  url.searchParams.set('restaurante_id', 'eq.' + Number(restaurante_id))

  const filas = await escribir('DELETE', url, null)

  if (filas.length !== 1) {
    throw new Error('No se encontró ese favorito para quitar.')
  }
  return filas[0]
}
