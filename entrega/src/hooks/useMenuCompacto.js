import { useState } from "react";

const CLAVE = "gastrolocal:menu-compacto:v1";

function leerPreferencia() {
  try {
    return window.localStorage.getItem(CLAVE) === "1";
  } catch {
    return false;
  }
}

export function useMenuCompacto() {
  const [compacto, setCompacto] = useState(leerPreferencia);

  function alternar() {
    const siguiente = !compacto;
    setCompacto(siguiente);
    try {
      window.localStorage.setItem(CLAVE, siguiente ? "1" : "0");
    } catch {
      // La preferencia se mantiene en memoria si el almacenamiento está bloqueado.
    }
  }

  return { compacto, alternar };
}
