const enlaces = [
  { texto: "Inicio", href: "/segundo-corte/index.html" },
  { texto: "Populares", href: "#/populares", vista: "populares" },
  { texto: "Favoritos", href: "/segundo-corte/Favoritos.html" },
  { texto: "Recientes", href: "/segundo-corte/recientes.html" },
  { texto: "Reservas", href: "#/reservas", vista: "reservas" },
  { texto: "Vista", href: "/segundo-corte/vistaRestaurante.html" },
];

export default function Header({ vistaActiva = "populares" }) {
  return (
    <header className="header-principal">
      <div className="marca">
        <h1>
          <a href="/">GastroLocal</a>
        </h1>
      </div>

      <nav aria-label="Navegación principal">
        {enlaces.map((enlace) => (
          <a
            key={enlace.texto}
            href={enlace.href}
            aria-current={
              enlace.vista === vistaActiva ? "page" : undefined
            }
          >
            {enlace.texto}
          </a>
        ))}
      </nav>
    </header>
  );
}
