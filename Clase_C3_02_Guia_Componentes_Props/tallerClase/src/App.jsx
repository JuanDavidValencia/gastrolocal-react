import { useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import BannerBuscador from "./components/BannerBuscador.jsx";
import FiltroCategorias from "./components/FiltroCategorias.jsx";
import ListaRestaurantes from "./components/ListaRestaurantes.jsx";
import { categorias, restaurantes } from "./data/restaurantes.js";

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function App() {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [pedido, setPedido] = useState("");

  const restaurantesFiltrados = useMemo(() => {
    const busqueda = normalizar(textoBusqueda);

    return restaurantes.filter((restaurante) => {
      const coincideCategoria =
        categoriaActiva === "Todos" ||
        restaurante.categoria === categoriaActiva;

      const coincideTexto =
        busqueda === "" ||
        normalizar(restaurante.nombre).includes(busqueda) ||
        normalizar(restaurante.descripcion).includes(busqueda);

      return coincideCategoria && coincideTexto;
    });
  }, [textoBusqueda, categoriaActiva]);

  function manejarOrden(nombre) {
    setPedido(`Agregaste ${nombre} a tu pedido (demostración).`);
  }

  return (
    <>
      <a className="salto-contenido" href="#populares">
        Saltar a los restaurantes
      </a>

      <Header />

      <main>
        <BannerBuscador
          valor={textoBusqueda}
          onCambio={setTextoBusqueda}
        />

        <FiltroCategorias
          categorias={categorias}
          categoriaActiva={categoriaActiva}
          onSeleccionar={setCategoriaActiva}
        />

        <section id="populares" aria-labelledby="titulo-seccion">
          <div className="seccion-encabezado">
            <div>
              <h2 id="titulo-seccion">Restaurantes populares</h2>
            </div>
            <p className="seccion-contador" aria-live="polite">
              {restaurantesFiltrados.length} de {restaurantes.length} registros
            </p>
          </div>

          <ListaRestaurantes
            restaurantes={restaurantesFiltrados}
            onOrdenar={manejarOrden}
          />
        </section>

        {pedido && (
          <p className="aviso-pedido" role="status">
            {pedido}
          </p>
        )}
      </main>

      <footer className="pie">
        <p>
          Versión del segundo corte conservada en{" "}
          <a href="/segundo-corte/index.html">/segundo-corte</a>.
        </p>
      </footer>
    </>
  );
}
