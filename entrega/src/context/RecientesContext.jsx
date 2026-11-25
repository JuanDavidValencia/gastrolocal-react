import { createContext, useContext, useState, useCallback } from "react";
const CLAVE = "gastrolocal:recientes:v1";
const Contexto = createContext(null);
function leer() {
  try { const lista = JSON.parse(sessionStorage.getItem(CLAVE) || "[]"); return Array.isArray(lista) ? lista.filter(id => /^[1-9]\d*$/.test(id)).slice(0, 20) : []; }
  catch { return []; }
}
export function RecientesProvider({ children }) {
  const [ids, setIds] = useState(leer);
  function actualizar(nuevos) { setIds(nuevos); try { sessionStorage.setItem(CLAVE, JSON.stringify(nuevos)); } catch { /* Se conserva en memoria. */ } }
  const visitar = useCallback((id) => { setIds(prev => { const nuevos = [String(id), ...prev.filter(actual => actual !== String(id))].slice(0, 20); try { sessionStorage.setItem(CLAVE, JSON.stringify(nuevos)); } catch { /* Sin almacenamiento. */ } return nuevos; }); }, []);
  return <Contexto.Provider value={{ ids, visitar, limpiar: () => actualizar([]) }}>{children}</Contexto.Provider>;
}
export function useRecientes() { return useContext(Contexto); }