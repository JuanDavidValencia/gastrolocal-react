# GastroLocal · Entrega del tercer corte

Aplicación React para explorar restaurantes y administrar reservas personales. Migra la interfaz del proyecto del semestre a componentes, rutas y estado de React; conserva Supabase como base de datos y autenticación.

## Identificación y enlaces

- Integrantes: Juan David Valencia Ospina y María José Ospina.
- Repositorio React: https://github.com/JuanDavidValencia/gastrolocal-react
- Carpeta de la versión final: `entrega/`.
- Documentación principal: [docs/bitacora.md](docs/bitacora.md).
- Repositorio del segundo corte: pendiente de confirmar con el equipo.
- URL de producción: pendiente de publicación.
- Commit de entrega: pendiente de crear después de validar esta versión. Obtener el SHA con `git rev-parse HEAD` desde el repositorio y registrarlo al enviar los enlaces.

## Instalación y ejecución

Requiere Node.js 22.12 o superior compatible con Vite y npm. Abrir una terminal dentro de `entrega/`.

```sh
npm ci
```

Copiar `.env.example` a `.env.local` y completar la URL del proyecto Supabase activo y su clave pública publishable. También se admite `VITE_SUPABASE_ANON_KEY` para la clave pública anon anterior. Si existen ambas claves se usa publishable. No usar `service_role` ni claves secretas: las variables `VITE_` llegan al navegador.

```sh
npm run dev
npm test
npm run build
npm run preview
```

`npm test` ejecuta las pruebas de la regla que acepta únicamente identificadores positivos dentro del rango bigint de PostgreSQL. El archivo de bloqueo se conserva para que `npm ci` reproduzca la instalación.

## Rutas y datos

| Ruta | Acceso | Función |
|---|---|---|
| `/` | Público | Presentación y ubicación opcional |
| `/populares` | Público | Selección editorial de restaurantes reales |
| `/restaurantes` | Público | Catálogo real, búsqueda y filtro por cocina |
| `/restaurantes/:id` | Público | Detalle, favoritos y acceso a reserva |
| `/vista` | Público | Selector de restaurante y su detalle |
| `/recientes` | Público | Historial de restaurantes vistos durante la visita |
| `/favoritos` | Con sesión | Guardar, consultar y quitar favoritos |
| `/perfil` | Con sesión | Consultar y editar perfil y foto |
| `/acceso` | Público | Inicio de sesión con Google |
| `/reservas` | Con sesión | Crear, consultar, editar y eliminar reservas propias |
| `/reservas/:id` | Con sesión | Consulta independiente de una reserva por su ID real |
| Cualquier otra | Público | Página no encontrada |

La entidad principal es `reservas`: `id`, `usuario_id`, `restaurante_id`, `nombre`, `email`, `telefono`, `personas`, `fecha`, `hora`, `notas`, `estado` y `creado_en`. Se usa el catálogo de la tabla existente `restaurantes` (`id`, `nombre`) para el formulario. Inicio, catálogo, detalle y Populares consultan los restaurantes reales. Populares es una selección editorial, no una clasificación de ventas ni valoraciones. Los botones abren el restaurante y permiten reservar; no se ofrece una compra ficticia. Favoritos usa la tabla `favoritos` (`usuario_id`, `restaurante_id`, `creado_en`) y Perfil la tabla `perfiles` (`id`, `nombre`, `email`, `telefono`, `direccion`, `foto_url`, `actualizado_en`).

Cada cuenta debe poder consultar, crear, editar y eliminar únicamente sus reservas. La aplicación filtra por propietario, pero la autorización real debe imponerse mediante RLS en Supabase. React Router protege las pantallas y Context comparte la sesión; no se muestra el panel privado durante su restauración. Los identificadores de reserva se transportan como texto para conservar la precisión de bigint.

El filtro de estado se aplica en la API. La búsqueda libre se aplica a las últimas 100 reservas descargadas. Se muestran carga, errores con reintento y ausencia de resultados. Después de cada escritura se consulta de nuevo el servidor.

## Organización y decisiones

- `src/views`: pantallas de las rutas.
- `src/components`: componentes con props, formulario controlado y cabecera con CSS Modules.
- `src/context`: sesión compartida de Supabase.
- `src/hooks`: lógica reutilizada de consultas y preferencia del menú.
- `src/services`: acceso a datos y regla del identificador.
- `src/lib/supabase.js`: único cliente Supabase con PKCE.

`useReservas` separa las consultas y escrituras del renderizado. Sus efectos sincronizan con la API y cancelan lecturas anteriores. `TarjetaReserva` se reutiliza con distintas filas. React Bootstrap aporta la alerta de error del detalle de reservas. Las vistas se cargan por demanda con lazy y Suspense para reducir la descarga inicial. `localStorage` guarda únicamente la preferencia no sensible del menú compacto. La geolocalización se solicita al pulsar un botón y ofrece selección manual; queda por confirmar con el docente que esta sea la localización acordada.

El menú final recorre las pantallas React. Los HTML históricos se conservan en las carpetas originales de las clases. Se retiraron de `public/` en la entrega para publicar una única aplicación React. [Detalle de la migración](docs/migracion-pestanas.md).

## Publicación y sustentación

Consultar [publicación](docs/publicacion.md) y [recorrido de verificación](docs/verificacion.md). En Vercel seleccionar `entrega` como Root Directory, Vite como framework, `npm run build` y salida `dist`. `vercel.json` contiene la regla para recargar rutas internas.

Para que el docente pruebe el acceso, acordar por un canal privado las dos cuentas Google autorizadas y habilitarlas en el proveedor si sigue en modo de prueba. No publicar contraseñas ni tokens. Probar el dominio desde una ventana privada antes de entregar.

## Estado comprobado y pendientes

La versión original documentó pruebas locales con API simulada; eso no demuestra el funcionamiento de Google ni de RLS en el servidor real. Consultar la bitácora para distinguir las comprobaciones nuevas y las heredadas. Faltan el dominio de producción, la configuración real activa de Supabase, la prueba con dos cuentas reales, los aportes confirmados y el enlace al repositorio anterior.