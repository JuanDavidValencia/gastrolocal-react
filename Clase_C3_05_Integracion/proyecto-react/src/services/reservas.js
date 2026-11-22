import { supabase } from "../lib/supabase.js";

// Columnas que la interfaz necesita. Evitamos `select("*")` para que un cambio
// en la tabla no rompa la vista sin avisar.
const CAMPOS =
  "id:id::text,usuario_id,restaurante_id,nombre,email,telefono,personas,fecha,hora,notas,estado,creado_en";

const ESTADOS_VALIDOS = ["pendiente", "confirmada", "cancelada"];

function cliente() {
  if (!supabase) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.",
    );
  }
  return supabase;
}

// Traduce los errores de Supabase a mensajes que la persona pueda entender.
function traducirError(fallo) {
  if (!fallo) {
    return new Error("No se pudo completar la operación.");
  }

  if (fallo.code === "PGRST301" || fallo.status === 401) {
    return new Error("Tu sesión venció. Vuelve a iniciar sesión con Google.");
  }

  if (fallo.code === "42501" || fallo.status === 403) {
    return new Error(
      "No tienes permiso para esta reserva. Revisa las políticas RLS de la tabla reservas.",
    );
  }

  return new Error(fallo.message || "No se pudo completar la operación.");
}

// Lectura con filtro remoto por estado. El filtro por texto se aplica después,
// sobre las filas ya descargadas, porque la búsqueda libre no tiene un índice
// remoto preparado.
export async function listarReservas({ usuarioId, estado = "todas", signal } = {}) {
  let consulta = cliente()
    .from("reservas")
    .select(CAMPOS)
    .eq("usuario_id", usuarioId)
    .order("creado_en", { ascending: false })
    .limit(100);

  if (estado && estado !== "todas") {
    consulta = consulta.eq("estado", estado);
  }

  if (signal) {
    consulta = consulta.abortSignal(signal);
  }

  const { data, error } = await consulta;

  if (error) {
    throw traducirError(error);
  }

  return data ?? [];
}

export async function crearReserva(datos, usuarioId) {
  const { data, error } = await cliente()
    .from("reservas")
    .insert({
      usuario_id: usuarioId,
      restaurante_id: Number(datos.restauranteId),
      nombre: datos.nombre,
      email: datos.email,
      telefono: datos.telefono,
      personas: Number(datos.personas),
      fecha: datos.fecha,
      hora: datos.hora,
      notas: datos.notas?.trim() ? datos.notas.trim() : null,
      // Una reserva nueva siempre nace pendiente; el estado no se elige al crear.
      estado: "pendiente",
    })
    .select(CAMPOS)
    .single();

  if (error) {
    throw traducirError(error);
  }

  if (!data) {
    throw new Error("La reserva no se confirmó: la API no devolvió la fila creada.");
  }

  return data;
}

export async function actualizarReserva(id, cambios, usuarioId) {
  const cuerpo = {
    fecha: cambios.fecha,
    hora: cambios.hora,
    personas: Number(cambios.personas),
    notas: cambios.notas?.trim() ? cambios.notas.trim() : null,
  };

  if (cambios.estado && ESTADOS_VALIDOS.includes(cambios.estado)) {
    cuerpo.estado = cambios.estado;
  }

  const { data, error } = await cliente()
    .from("reservas")
    .update(cuerpo)
    .eq("id", id)
    // Doble filtro: RLS ya limita por auth.uid(), pero así la consulta
    // tampoco puede tocar una fila ajena si la política cambiara.
    .eq("usuario_id", usuarioId)
    .select(CAMPOS);

  if (error) {
    throw traducirError(error);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "No se actualizó ninguna reserva: no existe o no pertenece a tu cuenta.",
    );
  }

  return data[0];
}

export async function eliminarReserva(id, usuarioId) {
  const { data, error } = await cliente()
    .from("reservas")
    .delete()
    .eq("id", id)
    .eq("usuario_id", usuarioId)
    .select("id:id::text");

  if (error) {
    throw traducirError(error);
  }

  if (!data || data.length === 0) {
    throw new Error(
      "No se eliminó ninguna reserva: no existe o no pertenece a tu cuenta.",
    );
  }

  return data[0];
}

export async function leerReserva(id, usuarioId, signal) {
  const { data, error } = await cliente()
    .from("reservas")
    .select(CAMPOS)
    .eq("id", id)
    .eq("usuario_id", usuarioId)
    .abortSignal(signal)
    .maybeSingle();

  if (error) throw traducirError(error);
  return data;
}
