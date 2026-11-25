// Normaliza textos para comparar sin distinguir mayúsculas ni tildes.
export function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
