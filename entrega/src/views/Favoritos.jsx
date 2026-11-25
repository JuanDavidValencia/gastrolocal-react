import { useState } from "react";
import { Link } from "react-router";
import { useCatalogo } from "../context/CatalogoContext.jsx";
import { useFavoritos } from "../context/FavoritosContext.jsx";
import { CabeceraPagina, EstadoCatalogo, GridRestaurantes, Vacio } from "../components/CatalogoUI.jsx";
import { normalizarTexto } from "../utils/normalizar.js";
export default function Favoritos() {
  const catalogo = useCatalogo(); const favoritos = useFavoritos(); const [texto, setTexto] = useState("");
  const lista = favoritos.favoritos.map(f => catalogo.restaurantes.find(r => String(r.id) === String(f.restaurante_id))).filter(Boolean).filter(r => normalizarTexto(r.nombre).includes(normalizarTexto(texto)));
  return <><CabeceraPagina etiqueta="TU PROPIA SELECCIÓN" titulo="Lugares para volver" descripcion="Los restaurantes que guardaste, reunidos para tu próxima salida."><span className="gl-count">{favoritos.favoritos.length} guardados ♡</span></CabeceraPagina><div className="gl-filterbar"><div className="gl-input-search"><label htmlFor="buscar-favoritos" className="sr-only">Buscar en favoritos</label><span aria-hidden="true">⌕</span><input id="buscar-favoritos" type="search" placeholder="Busca entre tus favoritos…" value={texto} onChange={e => setTexto(e.target.value)} /></div><Link className="boton-secundario" to="/restaurantes">Explorar restaurantes ↗</Link></div><EstadoCatalogo cargando={catalogo.cargando || favoritos.cargando} error={catalogo.error || favoritos.error} recargar={() => { catalogo.recargar(); favoritos.recargar(); }}>{lista.length ? <GridRestaurantes restaurantes={lista} /> : <Vacio titulo={texto ? "No hay favoritos con ese nombre" : "Tu próxima buena idea empieza aquí"} texto={texto ? "Prueba otra búsqueda." : "Pulsa el corazón en un restaurante para guardarlo en tu cuenta."}><Link className="boton-primario" to="/restaurantes">Descubrir restaurantes</Link></Vacio>}</EstadoCatalogo></>;
}