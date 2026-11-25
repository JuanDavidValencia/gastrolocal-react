export default function TarjetaRestaurante({ restaurante, onOrdenar }) {
  const { nombre, descripcion, imagen, precio, resena, categoria } = restaurante;

  return (
    <article className="tarjeta">
      <div className="tarjeta-contenido">
        <span className="tarjeta-categoria">{categoria}</span>
        <h3>{nombre}</h3>
        <p className="tarjeta-descripcion">{descripcion}</p>

        <img
          src={imagen}
          alt={`${nombre}, restaurante popular de GastroLocal`}
          loading="lazy"
          onError={(evento) => {
            evento.currentTarget.onerror = null;
            evento.currentTarget.src = "/imagen-respaldo.svg";
          }}
        />

        <dl className="tarjeta-datos">
          <div>
            <dt>Precio</dt>
            <dd>{precio}</dd>
          </div>
          <div>
            <dt>Reseña</dt>
            <dd>{resena}</dd>
          </div>
        </dl>

        <div className="tarjeta-accion">
          <span>¡Pídelo ya!</span>
          <button type="button" onClick={() => onOrdenar(nombre)}>
            Ordenar
          </button>
        </div>
      </div>
    </article>
  );
}
