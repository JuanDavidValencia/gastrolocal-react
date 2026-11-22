import { Link } from "react-router";
import { Ubicacion } from "../components/Ubicacion.jsx";

export function Inicio() {
  return (
    <section className="seccion-reservas" aria-labelledby="titulo-inicio">
      <div className="encabezado-reservas">
        <h1 id="titulo-inicio">Encuentra tu próxima mesa</h1>
        <p>Explora los restaurantes populares y administra tus reservas en GastroLocal.</p>
      </div>
      <p className="acciones-formulario">
        <Link className="boton-primario" to="/populares">Explorar restaurantes</Link>
        <Link className="boton-secundario" to="/reservas">Mis reservas</Link>
      </p>
      <Ubicacion />
    </section>
  );
}
