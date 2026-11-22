import { useState } from "react";

export function Ubicacion() {
  const [mensaje, setMensaje] = useState("");
  const [pendiente, setPendiente] = useState(false);
  const [zona, setZona] = useState("");

  function ubicar() {
    if (!window.isSecureContext || !navigator.geolocation) {
      setMensaje("La ubicación automática no está disponible. Elige una zona manualmente.");
      return;
    }

    setPendiente(true);
    setMensaje("Solicitando ubicación…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude, longitude } = coords;
        setMensaje(`Ubicación aproximada: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}.`);
        setPendiente(false);
      },
      ({ code }) => {
        const causa = code === 1 ? "Permiso denegado." :
          code === 3 ? "Se agotó el tiempo." : "Ubicación no disponible.";
        setMensaje(causa + " Elige una zona manualmente.");
        setPendiente(false);
      },
      { timeout: 8000 },
    );
  }

  return (
    <section className="panel-reserva" aria-labelledby="titulo-ubicacion">
      <h2 id="titulo-ubicacion">Tu zona de referencia</h2>
      <p>Consulta tu ubicación aproximada para orientarte. Las coordenadas se muestran aquí durante la visita.</p>
      <div className="campo">
        <label htmlFor="zona-manual">Elegir una zona manualmente</label>
        <select id="zona-manual" value={zona} onChange={(evento) => setZona(evento.target.value)}>
          <option value="">Selecciona una zona</option>
          <option>Armenia</option>
          <option>Calarcá</option>
          <option>Circasia</option>
        </select>
      </div>
      <div className="acciones-formulario">
        <button type="button" className="boton-secundario" onClick={ubicar} disabled={pendiente}>
          Usar mi ubicación
        </button>
      </div>
      <div role="status">
        {zona && <p>Zona elegida: {zona}.</p>}
        {mensaje && <p>{mensaje}</p>}
      </div>
    </section>
  );
}
