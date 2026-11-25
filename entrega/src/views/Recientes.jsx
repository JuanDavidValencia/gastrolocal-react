import { Link } from "react-router";
import { useCatalogo } from "../context/CatalogoContext.jsx";
import { useRecientes } from "../context/RecientesContext.jsx";
import { CabeceraPagina, EstadoCatalogo, GridRestaurantes, Vacio } from "../components/CatalogoUI.jsx";
export default function Recientes() {
  const catalogo = useCatalogo(); const { ids, limpiar } = useRecientes();
  const lista = ids.map(id => catalogo.restaurantes.find(r => String(r.id) === id)).filter(Boolean);
  return <><CabeceraPagina etiqueta="SIGUE EXPLORANDO" titulo="Por si te quedaste con ganas" descripcion="Los últimos restaurantes que abriste durante esta visita, del más reciente al más antiguo.">{ids.length > 0 && <button className="boton-secundario" onClick={limpiar}>Limpiar historial</button>}</CabeceraPagina><EstadoCatalogo {...catalogo}>{lista.length ? <GridRestaurantes restaurantes={lista} /> : <Vacio titulo="Todavía hay mucho por descubrir" texto="Abre un restaurante y lo encontrarás aquí durante esta visita."><Link className="boton-primario" to="/restaurantes">Explorar restaurantes</Link></Vacio>}</EstadoCatalogo></>;
}