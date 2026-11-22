import { useCallback, useEffect, useState } from "react";
import {
  actualizarReserva,
  crearReserva,
  eliminarReserva,
  listarReservas,
} from "../services/reservas.js";

// Une la lectura remota con las tres escrituras del CRUD.
export function useReservas(usuarioId) {
  const [reservas, setReservas] = useState([]);
  const [estado, setEstado] = useState("todas");
  const [cargando, setCargando] = useState(Boolean(usuarioId));
  const [error, setError] = useState("");
  const [recarga, setRecarga] = useState(0);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!usuarioId) {
      setReservas([]);
      setCargando(false);
      return;
    }

    // Dos protecciones contra lecturas desactualizadas:
    // 1. AbortController cancela la petición anterior.
    // 2. La bandera "vigente" impide aplicar una respuesta que llegó tarde.
    const controlador = new AbortController();
    let vigente = true;

    setCargando(true);
    setError("");

    listarReservas({ usuarioId, estado, signal: controlador.signal })
      .then((filas) => {
        if (!vigente) return;
        setReservas(filas);
      })
      .catch((fallo) => {
        if (!vigente || controlador.signal.aborted) return;
        setError(fallo.message);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [usuarioId, estado, recarga]);

  const recargar = useCallback(() => setRecarga((numero) => numero + 1), []);

  // Después de cada escritura se vuelve a leer la lista. Así la interfaz
  // muestra lo que quedó guardado en el servidor y no una copia optimista.
  const crear = useCallback(
    async (datos) => {
      setGuardando(true);
      try {
        const fila = await crearReserva(datos, usuarioId);
        recargar();
        return fila;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId, recargar],
  );

  const actualizar = useCallback(
    async (id, cambios) => {
      setGuardando(true);
      try {
        const fila = await actualizarReserva(id, cambios, usuarioId);
        recargar();
        return fila;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId, recargar],
  );

  const eliminar = useCallback(
    async (id) => {
      setGuardando(true);
      try {
        const fila = await eliminarReserva(id, usuarioId);
        recargar();
        return fila;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId, recargar],
  );

  return {
    reservas,
    estado,
    setEstado,
    cargando,
    error,
    recargar,
    guardando,
    crear,
    actualizar,
    eliminar,
  };
}
