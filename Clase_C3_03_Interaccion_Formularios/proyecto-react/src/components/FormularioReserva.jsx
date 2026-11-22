import { useId, useState } from "react";
import { hoyISO } from "../utils/fecha.js";

const CAMPOS_INICIALES = {
  nombre: "",
  email: "",
  telefono: "",
  personas: "",
  restauranteId: "",
  fecha: "",
  hora: "",
};

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function FormularioReserva({ restaurantes, onReservar }) {
  const baseId = useId();
  const [campos, setCampos] = useState(CAMPOS_INICIALES);
  const [errores, setErrores] = useState({});
  const fechaMinima = hoyISO();

  function manejarCambio(event) {
    const { name, value } = event.target;

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
    } else if (campos.fecha < fechaMinima) {
      erroresEncontrados.fecha = "La fecha no puede ser anterior a hoy.";
    }

    if (!campos.hora) {
      erroresEncontrados.hora = "Elige una hora para la reserva.";
    } else if (campos.hora < "12:00" || campos.hora > "22:00") {
      erroresEncontrados.hora =
        "Atendemos entre las 12:00 p. m. y las 10:00 p. m.";
    }

    return erroresEncontrados;
  }

  function manejarEnvio(event) {
    event.preventDefault();

    const erroresEncontrados = validar();
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    onReservar({
      nombre: campos.nombre.trim(),
      email: campos.email.trim(),
      telefono: campos.telefono.trim(),
      personas: Number(campos.personas),
      restauranteId: campos.restauranteId,
      fecha: campos.fecha,
      hora: campos.hora,
    });

    setCampos(CAMPOS_INICIALES);
  }

  const ayudaError = (campo) =>
    errores[campo] ? `${baseId}-${campo}-error` : undefined;

  return (
    <form
      className="form-reservas"
      onSubmit={manejarEnvio}
      aria-label="Formulario de reserva"
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
          aria-invalid={Boolean(errores.restauranteId)}
          aria-describedby={ayudaError("restauranteId")}
          required
        >
          <option value="">Selecciona un restaurante</option>
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
          min={fechaMinima}
          value={campos.fecha}
          onChange={manejarCambio}
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

      <div className="acciones-formulario campo-completo">
        <button type="submit" className="boton-primario">
          Realizar reserva
        </button>
      </div>
    </form>
  );
}
