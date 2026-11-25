import { createContext, useContext, useEffect, useState } from "react";
import { consultarCatalogo } from "../services/catalogo.js";
const Contexto = createContext(null);
export function CatalogoProvider({ children }) {
  const [restaurantes, setRestaurantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const controlador = new AbortController();
    setCargando(true); setError("");
    consultarCatalogo(controlador.signal).then(filas => {
      if (!controlador.signal.aborted) setRestaurantes(filas);
    }).catch(fallo => {
      if (!controlador.signal.aborted) setError(fallo.message);
    }).finally(() => { if (!controlador.signal.aborted) setCargando(false); });
    return () => controlador.abort();
  }, [revision]);
  return <Contexto.Provider value={{ restaurantes, cargando, error, recargar: () => setRevision(n => n + 1) }}>{children}</Contexto.Provider>;
}
export function useCatalogo() { return useContext(Contexto); }