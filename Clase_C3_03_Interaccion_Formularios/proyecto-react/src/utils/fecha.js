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

  // Usamos el mediodía local para evitar cambios de día por la zona horaria.
  const fecha = new Date(`${fechaISO}T12:00:00`);

  return fecha.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
