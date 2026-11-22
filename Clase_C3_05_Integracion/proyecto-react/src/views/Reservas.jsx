import { useEffect, useId, useMemo, useState } from "react";
import FormularioReserva from "../components/FormularioReserva.jsx";
import TarjetaReserva from "../components/TarjetaReserva.jsx";
import { useReservas } from "../hooks/useReservas.js";
import { listarRestaurantes } from "../services/restaurantes.js";
import { normalizarTexto } from "../utils/normalizar.js";

const OPCIONES_ESTADO = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "pendiente", etiqueta: "Pendientes" },
  { valor: "confirmada", etiqueta: "Confirmadas" },
  { valor: "cancelada", etiqueta: "Canceladas" },
];

export default function Reservas({ usuario }) {
  const {
    reservas,
    estado,
    setEstado,
    cargando,
    error,
    recargar,
    guardando,
    crear,
    actualizar,
    eliminar,
  } = useReservas(usuario.id);

  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [errorAccion, setErrorAccion] = useState("");
  const [reservaEnEdicion, setReservaEnEdicion] = useState(null);

  const [restaurantes, setRestaurantes] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState("");
  const [recargaCatalogo, setRecargaCatalogo] = useState(0);

  const busquedaId = useId();
  const filtroId = useId();

  // Catálogo público de restaurantes: se necesita el id numérico de la base
  // de datos para guardar reservas válidas.
  useEffect(() => {
    const controlador = new AbortController();
    let vigente = true;

    setCargandoCatalogo(true);
    setErrorCatalogo("");

    listarRestaurantes({ signal: controlador.signal })
      .then((lista) => {
        if (!vigente) return;
        setRestaurantes(lista);
      })
      .catch((fallo) => {
        if (!vigente || controlador.signal.aborted) return;
        setErrorCatalogo(fallo.message);
      })
      .finally(() => {
        if (vigente) setCargandoCatalogo(false);
      });

    return () => {
      vigente = false;
      controlador.abort();
    };
  }, [recargaCatalogo]);

  const nombresPorId = useMemo(
    () => new Map(restaurantes.map((restaurante) => [restaurante.id, restaurante.nombre])),
    [restaurantes],
  );

  // La búsqueda por texto se aplica sobre las filas ya descargadas.
  // El filtro por estado sí viaja al servidor.
  const reservasFiltradas = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    if (texto === "") {
      return reservas;
    }

    return reservas.filter((reserva) => {
      const nombreRestaurante = nombresPorId.get(reserva.restaurante_id) ?? "";

      return (
        normalizarTexto(reserva.nombre).includes(texto) ||
        normalizarTexto(nombreRestaurante).includes(texto) ||
        String(reserva.fecha).includes(texto) ||
        String(reserva.hora).includes(texto) ||
        normalizarTexto(reserva.estado).includes(texto) ||
        normalizarTexto(reserva.notas ?? "").includes(texto)
      );
    });
  }, [reservas, busqueda, nombresPorId]);

  const hayBusqueda = busqueda.trim() !== "";
  const hayFiltroEstado = estado !== "todas";

  async function manejarGuardar(datos) {
    setErrorAccion("");
    setMensaje("");

    try {
      if (reservaEnEdicion) {
        await actualizar(reservaEnEdicion.id, {
          fecha: datos.fecha,
          hora: datos.hora,
          personas: datos.personas,
          notas: datos.notas,
          estado: datos.estado,
        });
        setReservaEnEdicion(null);
        setMensaje(`Reserva #${reservaEnEdicion.id} actualizada.`);
      } else {
        const fila = await crear(datos);
        const nombreRestaurante =
          nombresPorId.get(Number(datos.restauranteId)) ?? "el restaurante";
        setBusqueda("");
        setMensaje(
          `Reserva #${fila.id} creada en ${nombreRestaurante}. Queda pendiente de confirmación.`,
        );
      }

      return true;
    } catch (fallo) {
      setErrorAccion(fallo.message);
      return false;
    }
  }

  async function manejarEliminar(reserva) {
    setErrorAccion("");
    setMensaje("");

    try {
      await eliminar(reserva.id);
      if (reservaEnEdicion?.id === reserva.id) {
        setReservaEnEdicion(null);
      }
      setMensaje(`Reserva #${reserva.id} eliminada.`);
    } catch (fallo) {
      setErrorAccion(fallo.message);
    }
  }

  function editarReserva(reserva) {
    setErrorAccion("");
    setMensaje("");
    setReservaEnEdicion(reserva);

    // Llevamos la vista al formulario para que el cambio sea evidente.
    document
      .getElementById("panel-reserva")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section className="seccion-reservas" aria-labelledby="titulo-reservas">
      <div className="encabezado-reservas">
        <h1 id="titulo-reservas">Haz tus reservas</h1>
        <p>
          Elige el restaurante, la fecha y la hora. La reserva queda guardada en
          tu cuenta y puedes consultarla en cualquier momento.
        </p>
      </div>

      <div className="reservas-sesion">
        <p>
          Sesión iniciada como <strong>{usuario.email ?? usuario.id}</strong>
        </p>
      </div>

      <div className="panel-reserva" id="panel-reserva">
        <h2>{reservaEnEdicion ? "Editar reserva" : "Nueva reserva"}</h2>
        <p className="reservas-nota">
          {reservaEnEdicion
            ? "Puedes cambiar la fecha, la hora, el número de personas, las notas y el estado. Los datos del titular no se modifican."
            : "Completa los datos del titular. Los campos marcados con * son obligatorios."}
        </p>

        {errorCatalogo ? (
          <div className="reservas-aviso-error" role="alert">
            <p>{errorCatalogo}</p>
            <button
              type="button"
              className="boton-secundario"
              onClick={() => setRecargaCatalogo((numero) => numero + 1)}
            >
              Reintentar
            </button>
          </div>
        ) : cargandoCatalogo ? (
          <p className="reservas-cargando" role="status">
            Cargando restaurantes…
          </p>
        ) : (
          <FormularioReserva
            restaurantes={restaurantes}
            onGuardar={manejarGuardar}
            reservaEnEdicion={reservaEnEdicion}
            onCancelarEdicion={() => setReservaEnEdicion(null)}
            ocupado={guardando}
          />
        )}
      </div>

      {mensaje && (
        <p className="reservas-aviso-exito" role="status">
          {mensaje}
        </p>
      )}

      {errorAccion && (
        <p className="reservas-aviso-error" role="alert">
          {errorAccion}
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
              {cargando
                ? "Cargando reservas…"
                : `${reservasFiltradas.length} de ${reservas.length} reservas`}
            </p>
          </div>

          <div className="reservas-controles">
            <div className="reservas-filtro">
              <label htmlFor={filtroId}>Estado</label>
              <select
                id={filtroId}
                value={estado}
                onChange={(evento) => setEstado(evento.target.value)}
              >
                {OPCIONES_ESTADO.map((opcion) => (
                  <option key={opcion.valor} value={opcion.valor}>
                    {opcion.etiqueta}
                  </option>
                ))}
              </select>
            </div>

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

            <button
              type="button"
              className="boton-secundario"
              onClick={recargar}
              disabled={cargando}
            >
              Actualizar
            </button>
          </div>
        </div>

        <p className="reservas-nota reservas-nota-filtros">
          El estado se filtra en el servidor. La búsqueda por texto recorre solo
          las reservas descargadas.
        </p>

        {cargando ? (
          <p className="reservas-cargando" role="status">
            Cargando reservas…
          </p>
        ) : error ? (
          <div className="vacio" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="boton-secundario"
              onClick={recargar}
            >
              Reintentar
            </button>
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <div className="vacio" role="status">
            <p>
              {reservas.length === 0 && !hayFiltroEstado
                ? "Todavía no tienes reservas registradas. Completa el formulario para crear la primera."
                : hayBusqueda
                  ? "No hay reservas que coincidan con la búsqueda."
                  : "No hay reservas con ese estado."}
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
            {hayFiltroEstado && (
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setEstado("todas")}
              >
                Quitar filtro de estado
              </button>
            )}
          </div>
        ) : (
          <div className="tarjetas reservas-grid">
            {reservasFiltradas.map((reserva) => (
              <TarjetaReserva
                key={reserva.id}
                reserva={reserva}
                restauranteNombre={nombresPorId.get(reserva.restaurante_id)}
                onEditar={editarReserva}
                onEliminar={manejarEliminar}
                eliminando={guardando}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
