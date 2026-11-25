export function Imagen({ src, alt, className = "", eager = false }) {
  return <img className={className} src={src || "/imagen-respaldo.svg"} alt={alt} loading={eager ? "eager" : "lazy"} onError={evento => { if (!evento.currentTarget.src.endsWith("/imagen-respaldo.svg")) evento.currentTarget.src = "/imagen-respaldo.svg"; }} />;
}