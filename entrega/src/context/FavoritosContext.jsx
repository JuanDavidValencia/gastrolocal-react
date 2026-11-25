import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth.js";
import { leerFavoritos, guardarFavorito, borrarFavorito } from "../services/cuenta.js";
const Contexto = createContext(null);
export function FavoritosProvider({ children }) {
  const { sesion } = useAuth();
  const usuarioId = sesion?.user.id;
  return <FavoritosCuenta key={usuarioId || "sin-sesion"} usuarioId={usuarioId}>{children}</FavoritosCuenta>;
}
function FavoritosCuenta({ usuarioId, children }) {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(Boolean(usuarioId));
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [ocupado, setOcupado] = useState(null);
  const cerrojo = useRef(false);
  useEffect(() => {
    if (!usuarioId) return;
    const controlador = new AbortController(); setCargando(true); setError("");
    leerFavoritos(usuarioId, controlador.signal).then(filas => {
      if (!controlador.signal.aborted) setFavoritos(filas);
    }).catch(fallo => { if (!controlador.signal.aborted) setError(fallo.message); })
      .finally(() => { if (!controlador.signal.aborted) setCargando(false); });
    return () => controlador.abort();
  }, [usuarioId, revision]);
  async function alternar(id) {
    if (!usuarioId) throw new Error("Inicia sesión para guardar tus favoritos.");
    if (cerrojo.current) return;
    cerrojo.current = true; setOcupado(id);
    try {
      if (favoritos.some(f => String(f.restaurante_id) === String(id))) {
        await borrarFavorito(usuarioId, id);
        setFavoritos(prev => prev.filter(f => String(f.restaurante_id) !== String(id)));
      } else {
        const fila = await guardarFavorito(usuarioId, id);
        setFavoritos(prev => [fila, ...prev]);
      }
    } finally { cerrojo.current = false; setOcupado(null); }
  }
  return <Contexto.Provider value={{ favoritos, cargando, error, ocupado, alternar, recargar: () => setRevision(n => n + 1), esFavorito: id => favoritos.some(f => String(f.restaurante_id) === String(id)) }}>{children}</Contexto.Provider>;
}
export function useFavoritos() { return useContext(Contexto); }