import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { AvisoError } from "../components/AvisoError.jsx";
import { useAuth } from "../context/useAuth.js";
import { idValido } from "../services/idReserva.js";
import { leerReserva } from "../services/reservas.js";
import { listarRestaurantes } from "../services/restaurantes.js";
import { formatearFecha } from "../utils/fecha.js";

export function DetalleReserva() {
  const { id } = useParams();
  const { sesion } = useAuth();
  const usuarioId = sesion.user.id;
  const [revision, setRevision] = useState(0);
  const [resultado, setResultado] = useState(null);
  const valido = idValido(id);

  useEffect(() => {
    if (!valido) return;

    const controlador = new AbortController();
    const { signal } = controlador;

    async function cargar() {
      try {
        const reserva = await leerReserva(id, usuarioId, signal);
        if (signal.aborted) return;

        let restauranteNombre;
        if (reserva) {
          const restaurantes = await listarRestaurantes({
            signal,
            restauranteId: reserva.restaurante_id,
          }).catch(() => []);
          restauranteNombre = restaurantes[0]?.nombre;
        }
        if (!signal.aborted) setResultado({ id, usuarioId, revision, reserva, restauranteNombre });
      } catch {
        if (!signal.aborted) setResultado({ id, usuarioId, revision, fallo: true });
      }
    }

    cargar();
    return () => controlador.abort();
  }, [id, usuarioId, revision, valido]);

  const actual = resultado?.id === id &&
    resultado?.usuarioId === usuarioId && resultado?.revision === revision;
  const volver = <Link to="/reservas">Volver a mis reservas</Link>;

  if (!valido) {
    return (
      <section className="seccion-reservas">
        <h1>Identificador de reserva inválido</h1>
        {volver}
      </section>
    );
  }
  if (!actual) {
    return <p className="reservas-cargando" role="status">Consultando la reserva…</p>;
  }
  if (resultado.fallo) {
    return (
      <section className="seccion-reservas">
        <h1>Detalle de la reserva</h1>
        <AvisoError>No se pudo consultar la reserva.</AvisoError>
        <button type="button" className="boton-secundario" onClick={() => setRevision(n => n + 1)}>
          Reintentar
        </button>
        <p>{volver}</p>
      </section>
    );
  }

  const { reserva, restauranteNombre } = resultado;
  if (!reserva) {
    return (
      <section className="seccion-reservas">
        <h1>Reserva no disponible</h1>
        {volver}
      </section>
    );
  }

  const codigo = `GL-${id.padStart(6, "0")}`;

  return (
    <section className="seccion-reservas detalle-reserva" aria-labelledby="titulo-detalle">
      <div className="encabezado-reservas">
        <h1 id="titulo-detalle">Reserva {codigo}</h1>
        <p>{restauranteNombre ?? `Restaurante ${reserva.restaurante_id}`}</p>
      </div>
      <div className="panel-reserva">
        <dl>
          <dt>Estado</dt>
          <dd>{reserva.estado}</dd>
          <dt>Fecha y hora</dt>
          <dd>{formatearFecha(reserva.fecha)} · {String(reserva.hora).slice(0, 5)}</dd>
          <dt>Personas</dt>
          <dd>{reserva.personas}</dd>
          <dt>Titular</dt>
          <dd>{reserva.nombre}</dd>
          <dt>Correo electrónico</dt>
          <dd>{reserva.email}</dd>
          <dt>Teléfono</dt>
          <dd>{reserva.telefono}</dd>
          {reserva.notas && <><dt>Notas</dt><dd>{reserva.notas}</dd></>}
        </dl>
        {volver}
      </div>
    </section>
  );
}
