# Recorrido de verificación y sustentación

No marcar como superadas pruebas que solo se hayan simulado. Usar datos ficticios y registrar fecha, dominio, commit y resultado sin tokens ni datos personales.

| Paso | Acción | Resultado esperado | Estado real |
|---|---|---|---|
| 1 | Abrir producción en ventana privada | Inicio público usable | Pendiente |
| 2 | Abrir `/reservas` y `/reservas/1` sin sesión | Acceso sin exponer reservas | Pendiente |
| 3 | Iniciar con Google, cuenta A | Sesión restaurada y listado privado | Pendiente |
| 4 | Enviar formulario vacío | Mensajes vinculados a los campos | Pendiente |
| 5 | Crear reserva ficticia y recargar | Registro persistente con ID real | Pendiente |
| 6 | Filtrar por estado | Petición a la API con filtro de estado | Pendiente |
| 7 | Editar personas, fecha, notas o estado | Cambio conservado tras recargar | Pendiente |
| 8 | Abrir y recargar `/reservas/ID_REAL` | Detalle consultado por identificador | Pendiente |
| 9 | Interrumpir red y reintentar | Error y recuperación de consulta | Pendiente |
| 10 | Cerrar sesión desde el detalle | Acceso; Atrás no expone contenido privado | Pendiente |
| 11 | Entrar con cuenta B y abrir el ID de A | Reserva no disponible | Pendiente |
| 12 | Consultar/editar/eliminar la fila de A por API con token B y sin filtro de propietario | Sin acceso ni cambios por RLS | Pendiente |
| 13 | Intentar insertar como B asignando usuario_id de A | Rechazado por RLS | Pendiente |
| 14 | Volver a A y eliminar su reserva | Desaparece tras recarga y detalle no disponible | Pendiente |
| 15 | Probar móvil y escritorio | Menú, formulario y resultados usables | Pendiente |
| 16 | Cambiar menú compacto y recargar | Preferencia conservada | Pendiente |
| 17 | Permitir/denegar ubicación y elegir zona manual | Mensajes y alternativa funcionales | Pendiente |
| 18 | Abrir ruta desconocida | Página no encontrada y retorno | Pendiente |

Durante la sustentación mostrar un componente reutilizado con datos distintos, explicar props, estado, Hook propio y efectos. Explicar la diferencia entre guardia de ruta y RLS. Cada integrante debe explicar sus aportes confirmados.

Las peticiones directas con cuentas reales se ejecutan en un entorno privado. No incluir JWT, claves secretas, contraseñas ni datos reales en capturas o documentos.