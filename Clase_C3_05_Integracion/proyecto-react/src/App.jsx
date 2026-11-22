import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router";
import Header from "./components/Header.jsx";
import { RutaPrivada } from "./components/RutaPrivada.jsx";
import { useAuth } from "./context/useAuth.js";
import { Acceso } from "./views/Acceso.jsx";
import { DetalleReserva } from "./views/DetalleReserva.jsx";
import { Inicio } from "./views/Inicio.jsx";
import Populares from "./views/Populares.jsx";
import Reservas from "./views/Reservas.jsx";

const TITULOS = {
  "/": "Inicio",
  "/populares": "Populares",
  "/acceso": "Acceso",
  "/reservas": "Reservas",
};

function Marco({ children }) {
  const { pathname } = useLocation();
  const esPopulares = pathname === "/populares";

  useEffect(() => {
    const titulo = TITULOS[pathname] ??
      (/^\/reservas\/[^/]+\/?$/.test(pathname)
        ? "Detalle de la reserva"
        : "Página no encontrada");
    document.title = `GastroLocal · ${titulo}`;
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a className="salto-contenido" href={esPopulares ? "#populares" : "#contenido"}>
        {esPopulares ? "Saltar a los restaurantes" : "Saltar al contenido"}
      </a>
      <Header />
      <main id="contenido" tabIndex={-1}>{children}</main>
    </>
  );
}

function Panel() {
  const { sesion } = useAuth();
  return <Reservas key={sesion.user.id} usuario={sesion.user} />;
}

function NoEncontrada() {
  return (
    <section className="seccion-reservas">
      <h1>Página no encontrada</h1>
      <Link to="/">Volver a inicio</Link>
    </section>
  );
}

export default function App() {
  return (
    <Marco>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/populares" element={<Populares />} />
        <Route path="/acceso" element={<Acceso />} />
        <Route element={<RutaPrivada />}>
          <Route path="/reservas" element={<Panel />} />
          <Route path="/reservas/:id" element={<DetalleReserva />} />
        </Route>
        <Route path="*" element={<NoEncontrada />} />
      </Routes>
    </Marco>
  );
}
