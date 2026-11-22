import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import Populares from "./views/Populares.jsx";
import Reservas from "./views/Reservas.jsx";

const TITULOS = {
  populares: "GastroLocal · Populares",
  reservas: "GastroLocal · Reservas",
};

function vistaDesdeHash() {
  return window.location.hash === "#/reservas" ? "reservas" : "populares";
}

export default function App() {
  const [vista, setVista] = useState(vistaDesdeHash);

  useEffect(() => {
    const alCambiarHash = () => setVista(vistaDesdeHash());

    window.addEventListener("hashchange", alCambiarHash);
    return () => window.removeEventListener("hashchange", alCambiarHash);
  }, []);

  useEffect(() => {
    document.title = TITULOS[vista];
    window.scrollTo(0, 0);
  }, [vista]);

  return (
    <>
      {vista === "populares" && (
        <a className="salto-contenido" href="#populares">
          Saltar a los restaurantes
        </a>
      )}

      <Header vistaActiva={vista} />

      <main>{vista === "reservas" ? <Reservas /> : <Populares />}</main>
    </>
  );
}
