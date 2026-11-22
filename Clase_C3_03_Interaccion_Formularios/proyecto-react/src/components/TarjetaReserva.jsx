import { useId } from "react";
import { useToggle } from "../hooks/useToggle.js";
import { formatearFecha } from "../utils/fecha.js";

export default function TarjetaReserva({ reserva }) {
  const detallesId = useId();
  const { value: verDetalles, toggle } = useToggle(false);
  const codigo = reserva.codigo ?? reserva.id.replace(/-/g, "").slice(0, 8).toUpperCase();

  return (
    <article className="tarjeta reserva">
      <div className="reserva-encabezado">
        <h3>{reserva.restauranteNombre}</h3>
        <span className={`reserva-estado estado-${reserva.estado}`}>
          {reserva.estado}
        </span>
      </div>

      <p className="reserva-datos">
        {formatearFecha(reserva.fecha)} · {reserva.hora} · {reserva.personas}{" "}
        {reserva.personas === 1 ? "persona" : "personas"}
      </p>
      <p className="reserva-datos">A nombre de {reserva.nombre}</p>

      <button
        type="button"
        className="boton-detalles"
        aria-expanded={verDetalles}
        aria-controls={detallesId}
        onClick={toggle}
      >
        {verDetalles ? "Ocultar detalles" : "Ver detalles"}
      </button>

      {verDetalles && (
        <div className="reserva-detalles" id={detallesId}>
          <p>
            <strong>Correo:</strong> {reserva.email}
          </p>
          <p>
            <strong>Teléfono:</strong> {reserva.telefono}
          </p>
          <p>
            <strong>Código:</strong> {codigo}
          </p>
        </div>
      )}
    </article>
  );
}
