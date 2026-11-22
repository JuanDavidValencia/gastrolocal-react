import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/useAuth.js";

export function RutaPrivada() {
  const { sesion } = useAuth();

  if (sesion === undefined) {
    return <p className="reservas-cargando" role="status">Comprobando tu sesión…</p>;
  }
  if (!sesion) return <Navigate to="/acceso" replace />;
  return <Outlet />;
}
