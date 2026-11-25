function aISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

export function hoyISO() {
  return aISO(new Date());
}

export function sumarDiasISO(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  return aISO(fecha);
}

export function formatearFecha(fechaISO) {
  if (!fechaISO) {
    return "";
  }

  // La base de datos puede devolver solo la fecha o una marca de tiempo.
  // Tomamos los primeros 10 caracteres y usamos el mediodía local para evitar
  // cambios de día por la zona horaria.
  const soloFecha = String(fechaISO).slice(0, 10);
  const fecha = new Date(`${soloFecha}T12:00:00`);

  return fecha.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
