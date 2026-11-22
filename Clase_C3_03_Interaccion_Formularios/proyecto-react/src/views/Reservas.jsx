import { useId, useMemo, useState } from "react";
import FormularioReserva from "../components/FormularioReserva.jsx";
import TarjetaReserva from "../components/TarjetaReserva.jsx";
import { restaurantes } from "../data/restaurantes.js";
import { reservasIniciales } from "../data/reservas.js";
import { normalizarTexto } from "../utils/normalizar.js";
import "../styles/reservas.css";

function crearId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `reserva-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function crearCodigo() {
  const aleatorio = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `GL-${aleatorio.padEnd(6, "0")}`;
}

export default function Reservas() {
  const [listaReservas, setListaReservas] = useState(reservasIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const busquedaId = useId();

  const hayBusqueda = busqueda.trim() !== "";

  const reservasFiltradas = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    if (texto === "") {
      return listaReservas;
    }

    return listaReservas.filter(
      (reserva) =>
        normalizarTexto(reserva.nombre).includes(texto) ||
        normalizarTexto(reserva.restauranteNombre).includes(texto) ||
        reserva.fecha.includes(texto) ||
        reserva.hora.includes(texto),
    );
  }, [listaReservas, busqueda]);

  function agregarReserva(datos) {
    const restaurante = restaurantes.find(
      (elemento) => elemento.id === datos.restauranteId,
    );

    const nuevaReserva = {
      id: crearId(),
      ...datos,
      restauranteNombre: restaurante?.nombre ?? "Restaurante",
      estado: "confirmada",
      codigo: crearCodigo(),
    };

    setListaReservas((anteriores) => [nuevaReserva, ...anteriores]);
    setBusqueda("");
    setMensaje(
      `Reserva confirmada para ${nuevaReserva.nombre} en ${nuevaReserva.restauranteNombre}. Código ${nuevaReserva.codigo}.`,
    );
  }

  return (
    <section className="seccion-reservas" aria-labelledby="titulo-reservas">
      <div className="encabezado-reservas">
        <h1 id="titulo-reservas">Haz tus reservas</h1>
        <p>
          Elige el restaurante, la fecha y la hora. La reserva se agrega a tu
          lista y puedes consultar sus datos en cualquier momento.
        </p>
      </div>

      <div className="panel-reserva">
        <h2>Nueva reserva</h2>
        <p className="reservas-nota">
          Completa los datos del titular. Los campos marcados con{" "}
          <span aria-hidden="true">*</span> son obligatorios.
        </p>

        <FormularioReserva
          restaurantes={restaurantes}
          onReservar={agregarReserva}
        />
      </div>

      {mensaje && (
        <p className="reservas-aviso-exito" role="status">
          {mensaje}
        </p>
      )}

      <section
        className="seccion-mis-reservas"
        aria-labelledby="titulo-mis-reservas"
      >
        <div className="reservas-lista-encabezado">
          <div>
            <h2 id="titulo-mis-reservas">Mis reservas</h2>
            <p className="reservas-contador" aria-live="polite">
              {reservasFiltradas.length} de {listaReservas.length} reservas
            </p>
          </div>

          {listaReservas.length > 0 && (
            <div className="reservas-buscador">
              <label className="sr-only" htmlFor={busquedaId}>
                Buscar reserva
              </label>
              <input
                id={busquedaId}
                type="search"
                placeholder="Restaurante, nombre o fecha"
                value={busqueda}
                onChange={(evento) => setBusqueda(evento.target.value)}
                autoComplete="off"
              />
              {hayBusqueda && (
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setBusqueda("")}
                >
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>

        {reservasFiltradas.length === 0 ? (
          <div className="vacio" role="status">
            <p>
              {listaReservas.length === 0
                ? "Todavía no tienes reservas registradas. Completa el formulario para crear la primera."
                : "No hay reservas que coincidan con la búsqueda."}
            </p>
            {hayBusqueda && (
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setBusqueda("")}
              >
                Ver todas las reservas
              </button>
            )}
          </div>
        ) : (
          <div className="tarjetas reservas-grid">
            {reservasFiltradas.map((reserva) => (
              <TarjetaReserva key={reserva.id} reserva={reserva} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
