import TarjetaRestaurante from "./TarjetaRestaurante.jsx";

export default function ListaRestaurantes({ restaurantes, onOrdenar }) {
  if (restaurantes.length === 0) {
    return (
      <p className="vacio" role="status">
        No hay restaurantes que coincidan con la búsqueda. Prueba con otro
        nombre o cambia la categoría.
      </p>
    );
  }

  return (
    <div className="tarjetas">
      {restaurantes.map((restaurante) => (
        <TarjetaRestaurante
          key={restaurante.id}
          restaurante={restaurante}
          onOrdenar={onOrdenar}
        />
      ))}
    </div>
  );
}
