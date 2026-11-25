# Verificación de la carpeta entrega

Fecha: 25 de noviembre de 2026.

| Comprobación | Resultado |
|---|---|
| Pruebas unitarias sobre `entrega/src/services/idReserva.test.js` | 2 aprobadas, 0 fallidas |
| Instalación reproducible con `npm ci --no-audit --no-fund` | Correcta en copia temporal local con el mismo package-lock.json |
| `npm test` en la copia temporal | 2 aprobadas, 0 fallidas |
| `npm run build` en la copia temporal | Correcta: Vite 8.3.5, 158 módulos transformados |
| Configuración real de Supabase, Google y RLS | Pendiente de datos del equipo |
| Publicación y recorrido en dominio final | Pendiente |
| Comprobación visual nueva en navegador | No ejecutada en esta revisión |

Se probó una copia del código de entrega en una carpeta temporal local porque la instalación directamente en H: produjo errores de escritura de Google Drive. El primer intento offline también encontró un paquete ausente en la caché; la instalación normal posterior terminó correctamente. No se modificó el lockfile para resolverlo.

Para desarrollar si H: vuelve a fallar, copiar la aplicación a una carpeta local, ejecutar `npm ci` y conservar los cambios de fuente en el repositorio. Los compilados y dependencias se excluyen de Git.

La compilación se realizó sin variables de entorno privadas; comprueba el empaquetado y el manejo de configuración ausente, no la conexión al servidor real. Las evidencias de API simulada de la clase 05 conservan su condición de pruebas anteriores.
## Conexión real configurada

El 25 de noviembre de 2026 se guardaron la URL base y la clave pública suministradas por el equipo en `.env.local`, excluido de Git. El endpoint de configuración de autenticación respondió HTTP 200 y reportó Google habilitado. La consulta pública a `restaurantes` con `select=id,nombre&limit=0` respondió HTTP 200 sin descargar filas. No se modificaron registros.

Siguen pendientes el inicio de sesión interactivo, la comprobación de CRUD/RLS con dos cuentas y los retornos del dominio publicado. Estas respuestas HTTP no acreditan esas pruebas.
## Ampliación de pestañas

La migración posterior sustituyó el catálogo editorial local por consultas reales y añadió Favoritos, Perfil, Restaurantes, Recientes y Vista en React. Se ejecutaron de nuevo las pruebas (2 aprobadas) y la compilación (167 módulos, bloques por ruta). Se verificaron visualmente Inicio, catálogo y detalle en escritorio y móvil, con consultas reales a Supabase. Se probaron filtros, búsqueda vacía, historial y acceso protegido desde una reserva. Ver [registro de migración](migracion-pestanas.md).

La fila anterior que indica ausencia de revisión visual corresponde a la primera preparación; esta ampliación sí tiene revisión visual de las pantallas públicas. Las escrituras reales siguen pendientes de sesión.