export default function FiltroCategorias({
  categorias,
  categoriaActiva,
  onSeleccionar,
}) {
  return (
    <section id="categorias" aria-label="Filtrar restaurantes por categoría">
      <div className="chips" role="group" aria-label="Categorías">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className="chip"
            aria-pressed={categoriaActiva === categoria}
            onClick={() => onSeleccionar(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
    </section>
  );
}
