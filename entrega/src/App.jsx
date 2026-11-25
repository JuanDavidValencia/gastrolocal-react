import { lazy, Suspense, useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router";
import Header from "./components/Header.jsx";
import { RutaPrivada } from "./components/RutaPrivada.jsx";
import { CatalogoProvider } from "./context/CatalogoContext.jsx";
import { FavoritosProvider } from "./context/FavoritosContext.jsx";
import { RecientesProvider } from "./context/RecientesContext.jsx";
import { useAuth } from "./context/useAuth.js";
const Acceso = lazy(() => import("./views/Acceso.jsx").then(m => ({ default: m.Acceso })));
const DetalleReserva = lazy(() => import("./views/DetalleReserva.jsx").then(m => ({ default: m.DetalleReserva })));
import { Inicio } from "./views/Inicio.jsx";
const Populares = lazy(() => import("./views/Populares.jsx"));
const Reservas = lazy(() => import("./views/Reservas.jsx"));
const Restaurantes = lazy(() => import("./views/Restaurantes.jsx"));
const Favoritos = lazy(() => import("./views/Favoritos.jsx"));
const Recientes = lazy(() => import("./views/Recientes.jsx"));
const DetalleRestaurante = lazy(() => import("./views/DetalleRestaurante.jsx"));
const Perfil = lazy(() => import("./views/Perfil.jsx"));
const TITULOS = { "/": "Inicio", "/restaurantes": "Restaurantes", "/populares": "Populares", "/favoritos": "Favoritos", "/recientes": "Recientes", "/vista": "Vista del restaurante", "/perfil": "Mi perfil", "/acceso": "Acceso", "/reservas": "Reservas" };
function Marco({ children }) {
  const { pathname } = useLocation();
  useEffect(() => { document.title = `GastroLocal · ${TITULOS[pathname] || (pathname.startsWith("/reservas/") ? "Detalle de reserva" : pathname.startsWith("/restaurantes/") ? "Restaurante" : "Página no encontrada")}`; window.scrollTo(0, 0); }, [pathname]);
  return <><a className="salto-contenido" href="#contenido">Saltar al contenido</a><Header /><main id="contenido" tabIndex={-1}>{children}</main><footer className="gl-footer"><Link className="gl-footer-brand" to="/">Gastro<span>Local</span><small>Buenos lugares, mejores momentos.</small></Link><div><Link to="/restaurantes">Explorar restaurantes</Link><Link to="/reservas">Mis reservas</Link><span>Armenia, Quindío · Colombia</span></div><p>Hecho para disfrutar lo que está cerca.</p></footer></>;
}
function Panel() { const { sesion } = useAuth(); return <Reservas key={sesion.user.id} usuario={sesion.user} />; }
function CuentaPerfil() { const { sesion } = useAuth(); return <Perfil key={sesion.user.id} />; }
function NoEncontrada() { return <div className="gl-empty"><span className="gl-eyebrow">404</span><h1>Este camino no lleva a la mesa</h1><p>No encontramos la página que buscas.</p><Link className="boton-primario" to="/">Volver al inicio</Link></div>; }
export default function App() {
  return <CatalogoProvider><RecientesProvider><FavoritosProvider><Marco><Suspense fallback={<p className="gl-loading" role="status">Preparando tu próxima visita…</p>}><Routes>
    <Route path="/" element={<Inicio />} />
    <Route path="/restaurantes" element={<Restaurantes />} />
    <Route path="/restaurantes/:id" element={<DetalleRestaurante />} />
    <Route path="/populares" element={<Populares />} />
    <Route path="/recientes" element={<Recientes />} />
    <Route path="/vista" element={<DetalleRestaurante selector />} />
    <Route path="/acceso" element={<Acceso />} />
    <Route element={<RutaPrivada />}>
      <Route path="/reservas" element={<Panel />} />
      <Route path="/reservas/:id" element={<DetalleReserva />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/perfil" element={<CuentaPerfil />} />
    </Route>
    {[["/index.html", "/"], ["/restaurantes.html", "/restaurantes"], ["/populares.html", "/populares"], ["/Favoritos.html", "/favoritos"], ["/recientes.html", "/recientes"], ["/reservas.html", "/reservas"], ["/perfil.html", "/perfil"], ["/vistaRestaurante.html", "/vista"]].map(([path, to]) => <Route key={path} path={path} element={<Navigate to={to} replace />} />)}
    <Route path="*" element={<NoEncontrada />} />
  </Routes></Suspense></Marco></FavoritosProvider></RecientesProvider></CatalogoProvider>;
}