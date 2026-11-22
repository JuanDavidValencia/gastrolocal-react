---
tipo: bitacora-clase
curso: Desarrollo Web
periodo: EAM-2026II
equipo: Valencia Ospina
corte: 3
semana: 11
clase: 4
fecha: 2026-11-11
estado: en-progreso
tags:
  - desarrollo-web
  - bitacora
---

# Bitácora — Clase 4

## 1. Datos de la sesión

| Campo    | Registro                                                                                       |
| -------- | ---------------------------------------------------------------------------------------------- |
| Tema     | Efectos, APIs y  <br>datos persistentes                                                        |
| Objetivo | Conectar la interfaz de React con datos externos y completar un CRUD que conserve los cambios. |
| Proyecto | GastroLocal                                                                                    |
| Inicio   | 8:00am                                                                                         |
| Cierre   | 7:00pm                                                                                         |

## 2. Participación y responsabilidades

| Integrante | Asistió | Rol de la clase | Responsabilidad asumida | Aporte verificable |
|---|:---:|---|---|---|
| Juan David Valencia | Sí | Líder de desarrollo | Implementó la conexión con Supabase, el CRUD de reservas y la corrección de los problemas del entorno | `src/lib/supabase.js`, `src/services/reservas.js`, `src/hooks/useReservas.js`, `src/views/Reservas.jsx` |
| María José Ospina | Sí | Pruebas y documentación | Revisó la guía, definió los casos de prueba, verificó las políticas RLS y organizó la bitácora | Secciones 3, 4, 5 y 6 de esta bitácora; `evidencias/reservas-sesion.png` |

## 3. Reto aplicado al proyecto

### Funcionalidad trabajada

Se conectó la vista de Reservas con la tabla `reservas` de Supabase. La persona inicia sesión con Google, crea reservas que quedan guardadas en su cuenta, las consulta con estados de carga, error, vacío y resultados, las filtra por estado en el servidor, las busca por texto sobre las filas descargadas, las edita y las elimina. Cada operación respeta las políticas RLS mediante `usuario_id = auth.uid()`.

### Criterios de aceptación

- [x] Consultar la entidad propia desde React con estados de carga, error, vacío y resultados.
- [x] Conectar un filtro que viaja al servidor (`estado`) y proteger la lectura contra respuestas desactualizadas con `AbortController` y una bandera de vigencia.
- [x] Crear, editar y eliminar con validación, confirmación antes de borrar e identificadores estables de la base de datos.
- [x] Usar la sesión autorizada del proyecto (Google Auth con PKCE) y RLS por `usuario_id`.
- [x] Mostrar mensajes de éxito y de error, y conservar el diseño y los componentes existentes.
- [x] Compilar sin errores (`npm run build`) y arrancar Vite sin los fallos de caché de Google Drive.
- [ ] Comprobar la persistencia recargando la página y probar el aislamiento con dos cuentas. Requiere una URL de proyecto Supabase activa: la configurada no existe en DNS.

### Archivos o componentes modificados

- `src/App.jsx`: efecto de cambio de vista que actualiza el título, mantiene el scroll y restaura el título anterior en la limpieza.
- `src/lib/supabase.js`: cliente único con sesión persistente y flujo PKCE; avisa si faltan las variables de entorno.
- `src/services/reservas.js`: lectura por usuario y estado, creación siempre en `pendiente`, actualización y eliminación con doble filtro por `id` y `usuario_id`.
- `src/services/restaurantes.js`: catálogo público de restaurantes leído con `fetch` y la clave publishable, sin el token de la sesión.
- `src/hooks/useSesion.js`: sesión de Supabase, inicio con Google y cierre local.
- `src/hooks/useReservas.js`: lista remota, filtro por estado, recarga y las tres escrituras.
- `src/views/Reservas.jsx`: puerta de sesión, catálogo, formulario de crear/editar, filtros, estados de la lista y mensajes.
- `src/components/FormularioReserva.jsx`: validación, notas, estado en edición y modo crear/editar.
- `src/components/TarjetaReserva.jsx`: identificador estable, acciones de editar y eliminar con confirmación.
- `src/utils/fecha.js`: acepta fecha o marca de tiempo de la base de datos.
- `src/styles/reservas.css`: estilos de sesión, filtros, estados, acciones y avisos, con la misma paleta.
- `vite.config.js`: caché de Vite fuera de Google Drive, sondeo del watcher y limpieza de `desktop.ini` antes del build.
- `.env.local` y `.env.example`: URL y clave publishable del proyecto, y plantilla sin credenciales.

## 4. Decisiones técnicas

| Decisión | Razón | Alternativa descartada |
|---|---|---|
| Calcular la lista filtrada y el contador durante el renderizado | La lista y el contador dependen de las reservas y de la búsqueda; son datos derivados. `useMemo` evita recalcular sin necesidad y no requiere otro estado. | Guardar la lista filtrada en un estado aparte y sincronizarla con un efecto. |
| Crear la reserva en el manejador del envío del formulario | Existe una acción identificable de la persona. La escritura pertenece al evento y no debe dispararse desde un efecto que observe los campos. | Crear la reserva desde un efecto que reaccione a los cambios del formulario o de la lista. |
| Sincronizar el título de la pestaña y el scroll con la vista actual mediante un efecto | El título y el scroll pertenecen al documento y al navegador, fuera de la vista de React. El efecto declara la vista como dependencia. | Copiar el título a otro estado o actualizarlo durante el renderizado. |
| Restaurar el título anterior en la limpieza del efecto | Mantiene la simetría del efecto y evita dejar un título de una vista que ya no está activa cuando el componente se retira. | Dejar el título modificado sin limpieza. |
| Declarar únicamente `vista` como dependencia del efecto del título | El efecto lee `vista`; `TITULOS` es una constante del módulo y `document` es un global del navegador, no valores reactivos. `tituloAnterior` es local de cada ejecución. | Agregar `TITULOS`, `document` o la función de limpieza a la lista para silenciar advertencias. |
| Usar `@supabase/supabase-js` en lugar de `fetch` manual | El SDK conserva y renueva la sesión, y adjunta el token a cada consulta. En este laboratorio la parte más delicada es la autenticación, no armar la URL. | Escribir las peticiones REST con `fetch` y renovar el token a mano, como en `public/segundo-corte/js/api.js`. |
| Usar el flujo PKCE para el acceso con Google | La aplicación navega con el hash `#/reservas`; PKCE intercambia un código en la cadena de consulta y evita que los tokens viajen en el fragmento. | Flujo implícito, que puede chocar con el enrutamiento por hash. |
| Leer el catálogo de restaurantes con `fetch` y solo la clave publishable | La tabla `restaurantes` únicamente concede SELECT al rol `anon`; enviar el token de la sesión puede responder 403. | Consultar el catálogo con el cliente autenticado. |
| Filtrar por estado en el servidor y buscar texto en memoria | `estado` es una columna filtrable y el conjunto está limitado a 100 filas; la búsqueda libre recorre esas filas sin una petición por cada tecla. | Enviar cada búsqueda al servidor o descargar la tabla sin límite. |
| Cancelar la lectura anterior con `AbortController` y comprobar una bandera de vigencia | Al cambiar de filtro o recargar pueden cruzarse respuestas; solo la última petición debe actualizar la lista. | Ignorar el orden de llegada de las respuestas. |
| Releer la lista después de cada escritura | Lo que se muestra debe ser lo que quedó en el servidor, no una copia optimista que podría diferir por RLS o por el filtro activo. | Insertar o modificar el arreglo local y suponer que coincide con la base. |
| Usar el `id` numérico de la base de datos como identificador estable | Es la clave primaria y no cambia; sirve para las `key`, para editar y para eliminar. | Generar un id con `crypto.randomUUID()` o reutilizar el código visual. |
| No permitir editar los datos del titular ni el restaurante | Esos campos identifican la reserva; cambiarlos complica la validación sin aportar al objetivo del laboratorio. | Habilitar todos los campos durante la edición. |
| Crear siempre con estado `pendiente` | Es la regla del contrato de la tabla y evita que la persona confirme su propia reserva. | Enviar `confirmada` desde el formulario de creación. |

Referencias verificables:

- `src/services/reservas.js`: lectura por `usuario_id` y `estado`, y escrituras con filtro doble.
- `src/hooks/useReservas.js`: `AbortController`, bandera de vigencia y recarga tras cada escritura.
- `src/hooks/useSesion.js`: `getSession`, `onAuthStateChange`, Google con PKCE y cierre local.
- `src/views/Reservas.jsx`: puerta de sesión, filtros, estados de carga, error, vacío y resultados.
- `src/components/FormularioReserva.jsx`: validación y modo crear/editar.
- `src/components/TarjetaReserva.jsx`: identificador estable y confirmación de borrado.
- `src/App.jsx`: efecto que actualiza `document.title` y el scroll al cambiar de vista, y restaura el título anterior en la limpieza.

## 5. Problemas y soluciones

| Problema encontrado | Causa identificada | Solución aplicada | ¿Cómo se verificó? |
|---|---|---|---|
| `npm install` dejaba `@supabase/supabase-js` con archivos de 0 bytes y errores `TAR_ENTRY_ERROR` / `EBADF` | Google Drive File Stream no puede escribir la extracción de npm en `G:` | Se instaló el SDK en una carpeta local (`%LOCALAPPDATA%\GastroLocal\sdk-install`) y se copió al proyecto con `robocopy` en un solo hilo | `node -e "import('@supabase/supabase-js')"` respondió `OK function` y no quedaron archivos vacíos |
| Vite no podía crear `.vite/deps_temp_*` y el watcher fallaba con `UNKNOWN` y `EINVAL` | La caché y la vigilancia de archivos no funcionan sobre la unidad de Google Drive | `cacheDir` en la carpeta temporal del sistema y `server.watch.usePolling` | Vite arrancó en 1.6 s sin errores de caché ni de watcher |
| El build fallaba al copiar `public/segundo-corte/js/desktop.ini` | Google Drive regenera esos archivos ocultos y los bloquea durante la copia | Complemento de Vite que elimina `desktop.ini` antes de copiar `public/` | `npm run build` terminó con 78 módulos transformados |
| El build fallaba con `ENOTEMPTY` al vaciar `dist/` | Google Drive no libera a tiempo los directorios | Se elimina `dist/` antes de compilar | La compilación siguiente terminó correctamente |
| El escaneo de dependencias fallaba por `node_modules_failed2/tslib/package.json` vacío | Quedó una copia fallida de una instalación anterior | Se eliminó la carpeta con `robocopy /MIR` desde una carpeta vacía | Vite arrancó sin errores de escaneo |
| La consulta del catálogo con el token de la sesión podía responder 403 | La tabla `restaurantes` solo concede SELECT al rol `anon` | El catálogo se consulta con `fetch`, la clave publishable y sin `Authorization` | `src/services/restaurantes.js` no envía el token de la sesión |
| El dominio `ormancmdscgxvnrslomw.supabase.co` no resuelve en DNS (NXDOMAIN) | El proyecto de Supabase fue eliminado, está pausado de forma definitiva o la referencia cambió; la red del entorno sí funciona (`example.com` responde 200) | Se comprobó con DNS-over-HTTPS de Cloudflare y de Google, y con un dominio inexistente como control | Ambos resolutores devuelven `Status: 3` (NXDOMAIN) y el control devuelve lo mismo; `Invoke-WebRequest` falla con “no se puede resolver el nombre remoto” |

## 6. Evidencias

| Tipo | Descripción | Enlace o ruta |
|---|---|---|
| Código | Cliente único de Supabase con PKCE | `proyecto-react/src/lib/supabase.js` |
| Código | Lectura y escrituras de reservas | `proyecto-react/src/services/reservas.js` |
| Código | Lista remota, filtro y recarga | `proyecto-react/src/hooks/useReservas.js` |
| Código | Sesión con Google y cierre local | `proyecto-react/src/hooks/useSesion.js` |
| Código | Vista con carga, error, vacío y resultados | `proyecto-react/src/views/Reservas.jsx` |
| Captura | Puerta de sesión de Reservas, sin errores de consola | `evidencias/reservas-sesion.png` |
| Build | `npm run build`: 78 módulos, `dist/assets/index-*.js` de 463.50 kB | Salida de la terminal |
| Demo | Aplicación en desarrollo | `http://127.0.0.1:5173/#/reservas` |
| Commit | Pendiente: el proyecto no está en un repositorio Git local | — |

### Estado de los entregables de la guía

| Entregable | Estado | Qué falta o dónde está |
|---|:---:|---|
| Repositorio React con el commit del laboratorio | Pendiente | No existe `.git` en el proyecto. Falta iniciar el repositorio y subir el avance a GitHub. |
| README con instalación, Vite, variables de ejemplo sin secretos, tabla, campos y prerrequisitos | Cumple | `proyecto-react/README.md` actualizado con la tabla `reservas`, `.env.example`, RLS y OAuth. |
| Lectura con carga, error, vacío y resultados | Cumple en código | `src/views/Reservas.jsx` y `src/hooks/useReservas.js`. Falta la captura de los cuatro estados con datos reales. |
| Filtro remoto verificable en Network | Cumple en código | `.eq("estado", estado)` en `src/services/reservas.js`. Falta la captura de la petición con el criterio. |
| Límite de filas explicado | Cumple | `.limit(100)` en `reservas.js`, justificado en la sección 4. |
| CRUD con id y persistencia tras recargar | Pendiente de ejecución | Implementado en servicios y formularios; no se pudo ejecutar porque el dominio del proyecto configurado no existe en DNS. |
| Pruebas con dos cuentas y RLS | Pendiente de ejecución | El SQL de las políticas está en `proyecto-react/README.md`; falta correrlas con las cuentas A y B y guardar la captura. |
| Bitácora con decisiones, tareas, dificultad, solución y cinco preguntas | Cumple | Secciones 2 a 8 de este documento. |
| Evidencias relacionadas con el commit | Pendiente | Se relacionan cuando exista el commit. |
| StrictMode, linter de dependencias y RLS activos | Cumple | `src/main.jsx` conserva `StrictMode`; no se desactivó ninguna política. |

## 7. Uso de inteligencia artificial

> [!important] Registrar la IA no reemplaza la explicación técnica. El equipo debe verificar, adaptar y comprender cualquier resultado utilizado.

| Herramienta | Objetivo o pregunta | Qué se utilizó | Cómo se verificó | Qué se modificó |
| ----------- | ------------------- | -------------- | ---------------- | --------------- |
| OpenCode (DeepSeek V4.1 Flash Free) | Implementar el CRUD de reservas con Supabase, revisar la guía y resolver los fallos del entorno | Estructura de servicios, hooks y formularios; diagnóstico de los errores de Google Drive; redacción de esta bitácora | `npm run build` sin errores, Vite sin fallos de caché, navegación sin errores de consola y revisión manual de cada archivo | Mensajes en español, nombres y clases alineados con GastroLocal, validaciones y estados adaptados al contrato real de la tabla |

Si no se utilizó IA, escribir: **No se utilizó inteligencia artificial en esta sesión.**

## 8. Defensa técnica y retroalimentación

| Campo                     | Registro                                                                                                                                                                                                                                                          |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integrante que defendió   | Juan David Valencia                                                                                                                                                                                                                                               |
| Pregunta recibida         | ¿Por qué el filtro por estado se resuelve en el servidor y la búsqueda por texto en el cliente?                                                                                                                                                                   |
| Respuesta resumida        | El estado es una columna acotada y filtrable, así que PostgREST reduce las filas antes de enviarlas. La búsqueda libre recorre las filas ya descargadas, limitadas a 100, para no lanzar una petición por cada tecla ni depender de un índice de texto que la tabla no tiene. |
| Retroalimentación docente | La explicación fue clara y coincidió con el código. Recomendó dejar explícito el límite de 100 filas y documentar las políticas RLS que protegen las escrituras.                                                                                                  |
| Mejora acordada           | Registrar en la bitácora el motivo del límite y el SQL de las cuatro políticas de acceso.                                                                                                                                                                         |

### Preguntas de defensa y respuestas

**1. ¿Por qué esta lectura necesita un efecto y qué valores utiliza?**

Porque la lista no se calcula a partir de otros datos de React: se trae de Supabase, que está fuera de la interfaz. El efecto de `useReservas` sincroniza esa lectura externa con tres valores: `usuarioId` (de quién son las reservas), `estado` (el filtro que viaja al servidor) y `recarga` (contador que se incrementa después de cada escritura y con el botón “Actualizar”). Esos tres forman su lista de dependencias; el `AbortController` y la bandera `vigente` son locales de cada ejecución y no se declaran.

**2. ¿Qué retira su limpieza y cómo evita una respuesta desactualizada?**

La limpieza pone `vigente = false` y llama a `controlador.abort()`. Con eso cancela la petición anterior cuando cambia el usuario, el filtro o la recarga, y además impide que una respuesta que llegue tarde ejecute `setReservas`. El `.catch` también ignora el error de cancelación. Así, si se pasa de “Todas” a “Confirmadas”, la respuesta vieja de “Todas” no puede sobrescribir la lista nueva.

**3. ¿Dónde se valida y qué confirma que el registro se guardó?**

La validación está en `validar()` de `FormularioReserva.jsx`: revisa nombre, correo, teléfono, personas, restaurante, fecha, hora, notas y estado antes de llamar a `onGuardar`, marca cada campo con `aria-invalid` y muestra el mensaje junto al campo. La confirmación del guardado está en `crearReserva()` de `src/services/reservas.js`: el `insert` lleva `.select(CAMPOS).single()`, de modo que Supabase devuelve la fila creada con el `id` que generó la base. Si hay `error` o no llega la fila, la función lanza una excepción y el formulario no se limpia; si llega, la interfaz muestra `Reserva #<id> creada...` y vuelve a leer la lista.

**4. ¿Cómo identifica la edición una fila después de filtrar?**

Por la clave primaria `id` de la base de datos, que viaja dentro del objeto de la reserva. `TarjetaReserva` entrega ese objeto a `onEditar`, la vista lo guarda en `reservaEnEdicion` y la actualización se hace con `.eq("id", reservaEnEdicion.id).eq("usuario_id", usuario.id)`. El filtro o la búsqueda solo cambian qué filas se ven, no la identidad de la fila; por eso la edición funciona aunque la reserva ya no esté visible en el filtro actual. Ese mismo `id` se usa como `key` en el listado y nunca se genera en el cliente.

**5. ¿Qué impide que otra cuenta cambie datos que no le pertenecen?**

Las políticas RLS de la tabla `reservas`, que comparan `usuario_id` con `auth.uid()` en SELECT, INSERT, UPDATE y DELETE. En UPDATE la política usa `using` para la fila existente y `with check` para la fila resultante, así que tampoco se puede “mover” una reserva a otro usuario. Como refuerzo, el servicio agrega `.eq("usuario_id", usuarioId)` en lectura, actualización y borrado. Si otra cuenta adivina un `id`, la operación afecta cero filas y el servicio responde “No se actualizó ninguna reserva: no existe o no pertenece a tu cuenta”.

## 9. Aprendizajes

- **Concepto comprendido:** La limpieza de un efecto se ejecuta antes de la siguiente ejecución y al desmontar; sirve para retirar o restaurar lo que el efecto cambió fuera de React. Las dependencias se deducen de los valores reactivos que lee el efecto, no se eligen para ajustar el número de ejecuciones. En una lectura remota, cancelar la petición anterior y comprobar una bandera de vigencia evita que una respuesta lenta sobrescriba el filtro actual.
- **Algo que aún genera duda:** Confirmar el retorno de Google cuando la URL incluye el hash `#/reservas`; hay que probarlo con las Redirect URLs reales del proyecto.
- **Qué haríamos diferente:** Sacar el proyecto de Google Drive desde el inicio. El sistema de archivos de la unidad sincronizada fue la causa de casi todos los problemas de instalación y compilación, no el código.

## 10. Revisión antes de entregar

- [x] Todos los integrantes registraron un aporte verificable.
- [x] Los enlaces y rutas de evidencia funcionan.
- [x] Los criterios de aceptación están actualizados.
- [x] El uso de IA fue declarado y verificado.
- [x] El equipo puede explicar las decisiones registradas.

