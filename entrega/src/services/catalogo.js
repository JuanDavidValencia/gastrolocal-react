import { urlSupabase, clavePublicable } from "../lib/supabase.js";
export async function consultarCatalogo(signal) {
  if (!urlSupabase || !clavePublicable) throw new Error("No se ha configurado la conexión al catálogo.");
  const url = new URL("/rest/v1/restaurantes", urlSupabase);
  url.searchParams.set("select", "id,nombre,categoria,descripcion,imagen,enlace");
  url.searchParams.set("order", "id.asc");
  url.searchParams.set("limit", "100");
  const respuesta = await fetch(url, { headers: { apikey: clavePublicable, Accept: "application/json" }, signal });
  if (!respuesta.ok) throw new Error("No pudimos cargar los restaurantes. Intenta de nuevo.");
  const filas = await respuesta.json();
  if (!Array.isArray(filas)) throw new Error("El catálogo no está disponible.");
  return filas;
}