import { useId, useState } from "react";
import { useToggle } from "../hooks/useToggle.js";
import { formatearFecha } from "../utils/fecha.js";

export default function TarjetaReserva({
  reserva,
  restauranteNombre,
  onEditar,
  onEliminar,
  eliminando = false,
}) {
  const detallesId = useId();
  const { value: verDetalles, toggle } = useToggle(false);
  const [confirmando, setConfirmando] = useState(false);

  // El identificador viene de la base de datos (numérico). No se reemplaza
  // ni se corta con métodos de cadena para que siga siendo estable.
  const codigo = `GL-${String(reserva.id).padStart(6, "0")}`;
  const estado = reserva.estado ?? "pendiente";
  const nombreRestaurante =
    restauranteNombre ?? `Restaurante ${reserva.restaurante_id}`;

  async function confirmarEliminacion() {
    await onEliminar(reserva);
    setConfirmando(false);
  }

  return (
    <article className="tarjeta reserva">
      <div className="reserva-encabezado">
        <h3>{nombreRestaurante}</h3>
        <span className={`reserva-estado estado-${estado}`}>{estado}</span>
      </div>

      <p className="reserva-datos">
        {formatearFecha(reserva.fecha)} · {String(reserva.hora).slice(0, 5)} ·{" "}
        {reserva.personas} {reserva.personas === 1 ? "persona" : "personas"}
      </p>
      <p className="reserva-datos">A nombre de {reserva.nombre}</p>

      {reserva.notas && (
        <p className="reserva-datos reserva-notas">
          <strong>Notas:</strong> {reserva.notas}
        </p>
      )}

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
          <p>
            <strong>Registrada:</strong>{" "}
            {reserva.creado_en
              ? new Date(reserva.creado_en).toLocaleString("es-CO")
              : "Sin fecha de registro"}
          </p>
        </div>
      )}

      <div className="reserva-acciones">
        <button
          type="button"
          className="boton-secundario"
          onClick={() => onEditar(reserva)}
          disabled={eliminando}
        >
          Editar
        </button>

        {confirmando ? (
          <>
            <button
              type="button"
              className="boton-peligro"
              onClick={confirmarEliminacion}
              disabled={eliminando}
            >
              {eliminando ? "Eliminando…" : "Sí, eliminar"}
            </button>
            <button
              type="button"
              className="boton-secundario"
              onClick={() => setConfirmando(false)}
              disabled={eliminando}
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            type="button"
            className="boton-peligro-suave"
            onClick={() => setConfirmando(true)}
            disabled={eliminando}
          >
            Eliminar
          </button>
        )}
      </div>
    </article>
  );
}
