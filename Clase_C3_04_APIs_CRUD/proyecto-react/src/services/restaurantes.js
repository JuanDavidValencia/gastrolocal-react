import { urlSupabase, clavePublicable } from "../lib/supabase.js";

// El catálogo de restaurantes es público: la tabla solo concede SELECT al rol
// "anon". Por eso se consulta con fetch y sin el token de la sesión; si se
// hiciera con el cliente autenticado, la petición podría responder 403.
export async function listarRestaurantes({ signal } = {}) {
  if (!urlSupabase || !clavePublicable) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env.local.",
    );
  }

  const url = new URL("/rest/v1/restaurantes", urlSupabase);
  url.searchParams.set("select", "id,nombre");
  url.searchParams.set("order", "nombre.asc");
  url.searchParams.set("limit", "100");

  const respuesta = await fetch(url, {
    method: "GET",
    headers: {
      apikey: clavePublicable,
      Accept: "application/json",
    },
    signal,
  });

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo cargar el catálogo de restaurantes (HTTP ${respuesta.status}).`,
    );
  }

  const datos = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("El catálogo de restaurantes no tiene el formato esperado.");
  }

  return datos
    .filter((fila) => fila !== null && typeof fila === "object")
    .map((fila) => ({ id: fila.id, nombre: fila.nombre ?? `Restaurante ${fila.id}` }));
}
