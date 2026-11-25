import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/useAuth.js";
import { useFavoritos } from "../context/FavoritosContext.jsx";
import { Imagen } from "./Imagen.jsx";
export function CabeceraPagina({ etiqueta, titulo, descripcion, children }) {
  return <div className="gl-page-head"><div><span className="gl-eyebrow">{etiqueta || "GASTROLOCAL"}</span><h1>{titulo}</h1>{descripcion && <p>{descripcion}</p>}</div>{children}</div>;
}
export function EstadoCatalogo({ cargando, error, recargar, children }) {
  if (cargando) return <div className="gl-loading" role="status"><span className="gl-loader" />Buscando buenos lugares…</div>;
  if (error) return <div className="gl-empty" role="alert"><h2>No pudimos cargar esta selección</h2><p>{error}</p><button className="boton-primario" onClick={recargar}>Reintentar</button></div>;
  return children;
}
export function Vacio({ titulo, texto, children }) {
  return <div className="gl-empty"><span className="gl-empty-symbol" aria-hidden="true">✧</span><h2>{titulo}</h2><p>{texto}</p>{children}</div>;
}
export function BotonFavorito({ restaurante, conTexto = false }) {
  const { sesion } = useAuth(); const navegar = useNavigate();
  const { esFavorito, alternar, ocupado, cargando, error } = useFavoritos();
  const [fallo, setFallo] = useState(""); const guardado = esFavorito(restaurante.id);
  async function guardar() {
    if (!sesion) { navegar("/acceso"); return; }
    setFallo(""); try { await alternar(restaurante.id); } catch (e) { setFallo(e.message); }
  }
  return <div className={conTexto ? "gl-favorite-inline" : "gl-favorite-wrap"}><button className={conTexto ? "boton-secundario" : "gl-heart"} type="button" onClick={guardar} aria-pressed={guardado} aria-label={`${guardado ? "Quitar de" : "Guardar en"} favoritos: ${restaurante.nombre}`} disabled={sesion === undefined || (Boolean(sesion) && (ocupado !== null || cargando || Boolean(error)))}><span aria-hidden="true">{guardado ? "♥" : "♡"}</span>{conTexto && (guardado ? " Guardado en favoritos" : " Guardar en favoritos")}</button>{fallo && <p className="gl-card-error" role="alert">{fallo}</p>}</div>;
}
export function RestauranteCard({ restaurante, indice }) {
  return <article className="gl-card"><div className="gl-card-media"><Link to={`/restaurantes/${restaurante.id}`} aria-label={`Ver ${restaurante.nombre}`}><Imagen src={restaurante.imagen} alt={restaurante.nombre} /></Link><BotonFavorito restaurante={restaurante} />{indice && <span className="gl-rank">{String(indice).padStart(2, "0")}</span>}</div><div className="gl-card-body"><span className="gl-category">{restaurante.categoria}</span><h3><Link to={`/restaurantes/${restaurante.id}`}>{restaurante.nombre}</Link></h3><p>{restaurante.descripcion}</p><div className="gl-card-bottom"><span>Armenia · Quindío</span><Link to={`/restaurantes/${restaurante.id}`}>Ver restaurante <span aria-hidden="true">↗</span></Link></div></div></article>;
}
export function GridRestaurantes({ restaurantes, numerado = false }) {
  return <div className="gl-grid">{restaurantes.map((r, i) => <RestauranteCard key={r.id} restaurante={r} indice={numerado ? i + 1 : undefined} />)}</div>;
}