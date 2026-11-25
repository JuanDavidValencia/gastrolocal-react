import { useEffect, useId, useState } from "react";
import { hoyISO } from "../utils/fecha.js";

const CAMPOS_INICIALES = {
  nombre: "",
  email: "",
  telefono: "",
  personas: "",
  restauranteId: "",
  fecha: "",
  hora: "",
  notas: "",
  estado: "pendiente",
};

const ESTADOS = ["pendiente", "confirmada", "cancelada"];
const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NOTAS = 200;

export default function FormularioReserva({
  restaurantes,
  restauranteInicial = "",
  onGuardar,
  reservaEnEdicion = null,
  onCancelarEdicion,
  ocupado = false,
}) {
  const baseId = useId();
  const [campos, setCampos] = useState(() => ({ ...CAMPOS_INICIALES, restauranteId: restauranteInicial }));
  const [errores, setErrores] = useState({});
  const fechaMinima = hoyISO();
  const editando = Boolean(reservaEnEdicion);

  // Al editar una reserva antigua se permite conservar su fecha original:
  // la persona puede necesitar cambiar el estado o las notas.
  const fechaOriginal = String(reservaEnEdicion?.fecha ?? "").slice(0, 10);
  const fechaMinimaFormulario =
    editando && fechaOriginal && fechaOriginal < fechaMinima
      ? fechaOriginal
      : fechaMinima;

  // Al entrar o salir del modo edición, el formulario se llena o se limpia.
  useEffect(() => {
    if (!reservaEnEdicion) {
      setCampos({ ...CAMPOS_INICIALES, restauranteId: restauranteInicial });
      setErrores({});
      return;
    }

    setCampos({
      nombre: reservaEnEdicion.nombre ?? "",
      email: reservaEnEdicion.email ?? "",
      telefono: reservaEnEdicion.telefono ?? "",
      personas: String(reservaEnEdicion.personas ?? ""),
      restauranteId: String(reservaEnEdicion.restaurante_id ?? ""),
      fecha: String(reservaEnEdicion.fecha ?? "").slice(0, 10),
      hora: String(reservaEnEdicion.hora ?? "").slice(0, 5),
      notas: reservaEnEdicion.notas ?? "",
      estado: reservaEnEdicion.estado ?? "pendiente",
    });
    setErrores({});
  }, [reservaEnEdicion, restauranteInicial]);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setCampos((anteriores) => ({ ...anteriores, [name]: value }));

    // El error del campo se retira cuando la persona vuelve a escribir.
    setErrores((anteriores) => {
      if (!anteriores[name]) {
        return anteriores;
      }

      const copia = { ...anteriores };
      delete copia[name];
      return copia;
    });
  }

  function validar() {
    const erroresEncontrados = {};
    const nombre = campos.nombre.trim();
    const email = campos.email.trim();
    const telefono = campos.telefono.trim();
    const digitosTelefono = telefono.replace(/\D/g, "");
    const personas = Number(campos.personas);

    if (nombre.length < 3) {
      erroresEncontrados.nombre =
        "Escribe el nombre del titular con al menos 3 caracteres.";
    }

    if (!CORREO_VALIDO.test(email)) {
      erroresEncontrados.email =
        "Escribe un correo válido, por ejemplo nombre@correo.com.";
    }

    if (digitosTelefono.length < 7 || digitosTelefono.length > 10) {
      erroresEncontrados.telefono =
        "Escribe un teléfono de entre 7 y 10 dígitos.";
    }

    if (!Number.isInteger(personas) || personas < 1) {
      erroresEncontrados.personas = "Indica al menos una persona.";
    } else if (personas > 12) {
      erroresEncontrados.personas =
        "Para grupos de más de 12 personas, contáctanos por teléfono.";
    }

    if (!campos.restauranteId) {
      erroresEncontrados.restauranteId = "Selecciona un restaurante.";
    }

    if (!campos.fecha) {
      erroresEncontrados.fecha = "Elige una fecha para la reserva.";
    } else if (campos.fecha < fechaMinimaFormulario) {
      erroresEncontrados.fecha = "La fecha no puede ser anterior a hoy.";
    }

    if (!campos.hora) {
      erroresEncontrados.hora = "Elige una hora para la reserva.";
    } else if (campos.hora < "12:00" || campos.hora > "22:00") {
      erroresEncontrados.hora =
        "Atendemos entre las 12:00 p. m. y las 10:00 p. m.";
    }

    if (campos.notas.length > MAX_NOTAS) {
      erroresEncontrados.notas = `Las notas no pueden superar ${MAX_NOTAS} caracteres.`;
    }

    if (!ESTADOS.includes(campos.estado)) {
      erroresEncontrados.estado = "Selecciona un estado válido.";
    }

    return erroresEncontrados;
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    if (ocupado) return;

    const erroresEncontrados = validar();
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    const guardado = await onGuardar({
      nombre: campos.nombre.trim(),
      email: campos.email.trim(),
      telefono: campos.telefono.trim(),
      personas: Number(campos.personas),
      restauranteId: campos.restauranteId,
      fecha: campos.fecha,
      hora: campos.hora,
      notas: campos.notas.trim(),
      estado: campos.estado,
    });

    // Solo se limpia el formulario si la escritura se confirmó.
    if (guardado && !editando) {
      setCampos({ ...CAMPOS_INICIALES, restauranteId: restauranteInicial });
    }
  }

  const ayudaError = (campo) =>
    errores[campo] ? `${baseId}-${campo}-error` : undefined;

  return (
    <form
      className="form-reservas"
      onSubmit={manejarEnvio}
      aria-label={editando ? "Formulario para editar la reserva" : "Formulario de reserva"}
      aria-busy={ocupado}
      noValidate
    >
      <div className="campo">
        <label htmlFor={`${baseId}-nombre`}>Nombre del titular *</label>
        <input
          id={`${baseId}-nombre`}
          name="nombre"
          type="text"
          autoComplete="name"
          value={campos.nombre}
          onChange={manejarCambio}
          disabled={ocupado || editando}
          aria-invalid={Boolean(errores.nombre)}
          aria-describedby={ayudaError("nombre")}
          required
        />
        {errores.nombre && (
          <p className="campo-error" id={`${baseId}-nombre-error`} role="alert">
            {errores.nombre}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-email`}>Correo electrónico *</label>
        <input
          id={`${baseId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          value={campos.email}
          onChange={manejarCambio}
          disabled={ocupado || editando}
          aria-invalid={Boolean(errores.email)}
          aria-describedby={ayudaError("email")}
          required
        />
        {errores.email && (
          <p className="campo-error" id={`${baseId}-email-error`} role="alert">
            {errores.email}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-telefono`}>Teléfono *</label>
        <input
          id={`${baseId}-telefono`}
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={campos.telefono}
          onChange={manejarCambio}
          disabled={ocupado || editando}
          aria-invalid={Boolean(errores.telefono)}
          aria-describedby={ayudaError("telefono")}
          required
        />
        {errores.telefono && (
          <p className="campo-error" id={`${baseId}-telefono-error`} role="alert">
            {errores.telefono}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-personas`}>Número de personas *</label>
        <input
          id={`${baseId}-personas`}
          name="personas"
          type="number"
          min="1"
          max="12"
          value={campos.personas}
          onChange={manejarCambio}
          disabled={ocupado}
          aria-invalid={Boolean(errores.personas)}
          aria-describedby={ayudaError("personas")}
          required
        />
        {errores.personas && (
          <p className="campo-error" id={`${baseId}-personas-error`} role="alert">
            {errores.personas}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-restaurante`}>Restaurante *</label>
        <select
          id={`${baseId}-restaurante`}
          name="restauranteId"
          value={campos.restauranteId}
          onChange={manejarCambio}
          disabled={ocupado || editando || restaurantes.length === 0}
          aria-invalid={Boolean(errores.restauranteId)}
          aria-describedby={ayudaError("restauranteId")}
          required
        >
          <option value="">
            {restaurantes.length === 0
              ? "No hay restaurantes disponibles"
              : "Selecciona un restaurante"}
          </option>
          {restaurantes.map((restaurante) => (
            <option key={restaurante.id} value={restaurante.id}>
              {restaurante.nombre}
            </option>
          ))}
        </select>
        {errores.restauranteId && (
          <p
            className="campo-error"
            id={`${baseId}-restauranteId-error`}
            role="alert"
          >
            {errores.restauranteId}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-fecha`}>Fecha de la reserva *</label>
        <input
          id={`${baseId}-fecha`}
          name="fecha"
          type="date"
          min={fechaMinimaFormulario}
          value={campos.fecha}
          onChange={manejarCambio}
          disabled={ocupado}
          aria-invalid={Boolean(errores.fecha)}
          aria-describedby={ayudaError("fecha")}
          required
        />
        {errores.fecha && (
          <p className="campo-error" id={`${baseId}-fecha-error`} role="alert">
            {errores.fecha}
          </p>
        )}
      </div>

      <div className="campo">
        <label htmlFor={`${baseId}-hora`}>Hora de la reserva *</label>
        <input
          id={`${baseId}-hora`}
          name="hora"
          type="time"
          min="12:00"
          max="22:00"
          value={campos.hora}
          onChange={manejarCambio}
          disabled={ocupado}
          aria-invalid={Boolean(errores.hora)}
          aria-describedby={ayudaError("hora")}
          required
        />
        {errores.hora && (
          <p className="campo-error" id={`${baseId}-hora-error`} role="alert">
            {errores.hora}
          </p>
        )}
      </div>

      {editando && (
        <div className="campo">
          <label htmlFor={`${baseId}-estado`}>Estado de la reserva *</label>
          <select
            id={`${baseId}-estado`}
            name="estado"
            value={campos.estado}
            onChange={manejarCambio}
            disabled={ocupado}
            aria-invalid={Boolean(errores.estado)}
            aria-describedby={ayudaError("estado")}
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
          {errores.estado && (
            <p className="campo-error" id={`${baseId}-estado-error`} role="alert">
              {errores.estado}
            </p>
          )}
        </div>
      )}

      <div className="campo campo-completo">
        <label htmlFor={`${baseId}-notas`}>Notas (opcional)</label>
        <textarea
          id={`${baseId}-notas`}
          name="notas"
          rows="3"
          maxLength={MAX_NOTAS + 20}
          value={campos.notas}
          onChange={manejarCambio}
          disabled={ocupado}
          aria-invalid={Boolean(errores.notas)}
          aria-describedby={ayudaError("notas")}
          placeholder="Alergias, celebración o alguna indicación para el restaurante."
        />
        {errores.notas && (
          <p className="campo-error" id={`${baseId}-notas-error`} role="alert">
            {errores.notas}
          </p>
        )}
      </div>

      <div className="acciones-formulario campo-completo">
        <button type="submit" className="boton-primario" disabled={ocupado}>
          {ocupado
            ? "Guardando…"
            : editando
              ? "Guardar cambios"
              : "Realizar reserva"}
        </button>

        {editando && (
          <button
            type="button"
            className="boton-secundario"
            onClick={onCancelarEdicion}
            disabled={ocupado}
          >
            Cancelar edición
          </button>
        )}
      </div>
    </form>
  );
}
