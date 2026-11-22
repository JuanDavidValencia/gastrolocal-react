import { useState } from "react";
import { Link, NavLink } from "react-router";
import { useAuth } from "../context/useAuth.js";
import { useMenuCompacto } from "../hooks/useMenuCompacto.js";
import styles from "./Header.module.css";

const enlacesHistoricos = [
  { texto: "Favoritos", href: "/segundo-corte/Favoritos.html" },
  { texto: "Recientes", href: "/segundo-corte/recientes.html" },
  { texto: "Vista", href: "/segundo-corte/vistaRestaurante.html" },
];

export default function Header() {
  const { sesion, salir } = useAuth();
  const { compacto, alternar } = useMenuCompacto();
  const [pendiente, setPendiente] = useState(false);
  const [error, setError] = useState("");

  const clase = ({ isActive }) => isActive
    ? `${styles.enlace} ${styles.activo}`
    : styles.enlace;

  async function cerrar() {
    setError("");
    setPendiente(true);
    try {
      await salir();
    } catch {
      setError("No se pudo cerrar la sesión. Vuelve a intentar.");
    } finally {
      setPendiente(false);
    }
  }

  return (
    <header className="header-principal">
      <div className="marca">
        <Link to="/">GastroLocal</Link>
      </div>

      <nav aria-label="Navegación principal" className={compacto ? styles.compacto : styles.menu}>
        <NavLink to="/" end className={clase}>Inicio</NavLink>
        <NavLink to="/populares" end className={clase}>Populares</NavLink>
        {enlacesHistoricos.map((enlace) => (
          <a key={enlace.texto} href={enlace.href} className={styles.enlace}>
            {enlace.texto}
          </a>
        ))}
        {sesion && <NavLink to="/reservas" className={clase}>Reservas</NavLink>}
        {sesion === null && <NavLink to="/acceso" end className={clase}>Acceso</NavLink>}
      </nav>

      <div className={styles.controles}>
        <button type="button" className="boton-secundario" aria-pressed={compacto} onClick={alternar}>
          Menú compacto
        </button>
        {sesion && (
          <button type="button" className="boton-secundario" disabled={pendiente} onClick={cerrar}>
            {pendiente ? "Cerrando…" : "Cerrar sesión"}
          </button>
        )}
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </header>
  );
}
