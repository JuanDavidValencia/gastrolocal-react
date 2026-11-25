import { sumarDiasISO } from "../utils/fecha.js";

// Reservas de práctica. En la siguiente clase se reemplazarán por la API.
export const reservasIniciales = [
  {
    id: "reserva-demo-01",
    nombre: "Juan David Valencia",
    email: "juan.valencia.0677@eam.edu.co",
    telefono: "300 123 4567",
    personas: 2,
    restauranteId: "pizza-combo",
    restauranteNombre: "Pizza Combo",
    fecha: sumarDiasISO(6),
    hora: "18:30",
    estado: "confirmada",
    codigo: "GL-DEMO01",
  },
  {
    id: "reserva-demo-02",
    nombre: "María José Ospina",
    email: "maria.ospina@eam.edu.co",
    telefono: "311 987 6543",
    personas: 4,
    restauranteId: "sushi",
    restauranteNombre: "Sushi",
    fecha: sumarDiasISO(12),
    hora: "20:00",
    estado: "confirmada",
    codigo: "GL-DEMO02",
  },
];
