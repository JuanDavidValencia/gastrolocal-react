import { supabase } from "../lib/supabase.js";
function comprobar(error) {
  if (!error) return;
  if (error.code === "23505") throw new Error("Este restaurante ya está en tus favoritos.");
  if (error.code === "42501") throw new Error("Tu cuenta no tiene permiso para realizar esta operación.");
  throw new Error("No pudimos completar la operación. Comprueba tu conexión e intenta de nuevo.");
}
export async function leerFavoritos(usuarioId, signal) {
  const { data, error } = await supabase.from("favoritos").select("restaurante_id,creado_en").eq("usuario_id", usuarioId).order("creado_en", { ascending: false }).abortSignal(signal);
  comprobar(error); return data ?? [];
}
export async function guardarFavorito(usuarioId, restauranteId) {
  const { data, error } = await supabase.from("favoritos").insert({ usuario_id: usuarioId, restaurante_id: restauranteId }).select("restaurante_id,creado_en").single();
  comprobar(error); return data;
}
export async function borrarFavorito(usuarioId, restauranteId) {
  const { data, error } = await supabase.from("favoritos").delete().eq("usuario_id", usuarioId).eq("restaurante_id", restauranteId).select("restaurante_id");
  comprobar(error); if (!data?.length) throw new Error("El favorito ya no está disponible.");
}
const CAMPOS = "id,nombre,email,telefono,direccion,foto_url,actualizado_en";
export async function leerPerfil(usuarioId, signal) {
  const { data, error } = await supabase.from("perfiles").select(CAMPOS).eq("id", usuarioId).abortSignal(signal).maybeSingle();
  comprobar(error); return data;
}
export async function guardarPerfil(usuarioId, campos) {
  const { data, error } = await supabase.from("perfiles").upsert({ id: usuarioId, ...campos }, { onConflict: "id" }).select(CAMPOS).single();
  comprobar(error); return data;
}
export async function guardarFoto(usuarioId, foto_url) {
  const { data, error } = await supabase.from("perfiles").update({ foto_url: foto_url || null }).eq("id", usuarioId).select(CAMPOS).maybeSingle();
  comprobar(error); if (!data) throw new Error("Primero guarda tus datos personales."); return data;
}