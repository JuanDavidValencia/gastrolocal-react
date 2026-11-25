import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/useAuth.js";
export function RutaPrivada() {
  const { sesion } = useAuth(); const { pathname, search } = useLocation();
  if (sesion === undefined) return <p className="reservas-cargando" role="status">Comprobando tu sesión…</p>;
  if (!sesion) return <Navigate to={`/acceso?volver=${encodeURIComponent(pathname + search)}`} replace />;
  return <Outlet />;
}