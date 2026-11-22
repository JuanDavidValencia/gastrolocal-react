export default function BannerBuscador({ valor, onCambio }) {
  return (
    <section id="banner-inicio" aria-labelledby="titulo-populares">
      <h1 id="titulo-populares">Los favoritos de la comunidad</h1>
      <p className="banner-texto">
        Busca por nombre o descripción y descubre qué están pidiendo los demás.
      </p>

      <label className="sr-only" htmlFor="buscador">
        Buscar restaurante
      </label>
      <input
        id="buscador"
        type="search"
        placeholder="Buscar restaurante..."
        value={valor}
        onChange={(evento) => onCambio(evento.target.value)}
        autoComplete="off"
      />
    </section>
  );
}
