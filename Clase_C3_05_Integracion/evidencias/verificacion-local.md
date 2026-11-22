# Verificación local de la integración

Ejecutada el 22 de noviembre de 2026 con Node.js 26.13.0, npm 11.20.0 y Vite 8.3.5.

| Comprobación | Resultado observado |
|---|---|
| Instalación con `npm ci` y el lockfile | 60 paquetes instalados desde una caché local. |
| Prueba unitaria con `npm test` | Dos pruebas aprobadas. Al invertir una expectativa en una copia de control, el ejecutor informó un fallo. Las dos expectativas originales pasaron al repetir la prueba. |
| Compilación con `npm run build` | Compilación exitosa. |
| Rutas de acceso público | Inicio y Populares abrieron, Atrás regresó a Inicio y una dirección desconocida mostró el enlace de retorno. |
| Acceso privado y URL directa | Abrir un detalle sin sesión llevó a Acceso. Con la API simulada, el código PKCE regresó a `/acceso` y la sesión llevó a Mis reservas. |
| Formulario y consulta | El envío vacío mostró siete validaciones. El envío con datos ficticios creó la fila `9007199254740993`. El detalle se abrió por enlace y recuperó la fila al recargar. |
| Edición y eliminación | El detalle mostró el estado confirmado y tres personas tras editar. Después de eliminar la fila desde el listado, el enlace recuperó el mensaje de reserva no disponible. |
| ID inválido, error y reintento | `/reservas/01` mostró el mensaje de ID inválido. Con la API local apagada apareció la alerta visual. Al restablecerla, Reintentar volvió a consultar. |
| Cambio de cuenta | El cierre desde el detalle llevó a Acceso. La segunda cuenta ficticia abrió un formulario vacío y el enlace de la primera mostró que la reserva no estaba disponible. |
| Preferencia y adaptación | Menú compacto persistió al recargar y al cerrar sesión. El Inicio se ajustó a un viewport de 390 px sin desborde horizontal. |
| Localización | La zona manual se pudo elegir. Al agotarse el tiempo de geolocalización, la interfaz indicó que se podía elegir una zona manualmente. |

El recorrido autenticado usa respuestas y datos simulados en un servidor local. La prueba de Google sobre la configuración real recibió `ERR_NAME_NOT_RESOLVED` antes de llegar al proveedor. Quedan pendientes la comprobación de RLS en Supabase con dos cuentas reales de prueba y la validación en el dominio publicado.

[Volver a la bitácora](../Clase_C3_05_Integracion.md)
