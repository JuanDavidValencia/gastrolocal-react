# GastroLocal · React

Aplicación web de restaurantes migrada a **React + Vite**. Conserva la vista **Populares** del segundo corte y la vista **Reservas**, ahora conectada a **Supabase**: la persona inicia sesión con Google y crea, consulta, edita y elimina sus reservas, que quedan guardadas en la base de datos y protegidas con RLS.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase&logoColor=white)
![Estado](https://img.shields.io/badge/estado-funcionando-success)

---

## Tecnologías

| Herramienta | Versión |
|---|---|
| Node.js | 20 o superior |
| npm | 10 o superior |
| React | 19.3.1 |
| Vite | 8.3.5 |
| @supabase/supabase-js | 2.119.0 |

---

## Prerrequisitos

1. Un proyecto de Supabase con la tabla `restaurantes` (solo lectura pública) y la tabla `reservas`.
2. El proveedor **Google** habilitado en Supabase: `Authentication → Providers → Google`.
3. Las URLs de retorno registradas en `Authentication → URL Configuration`:
   - **Site URL:** `http://localhost:5173`
   - **Redirect URLs:** `http://localhost:5173/**`
4. La tabla `reservas` con RLS activo y las políticas de la sección [Políticas RLS](#políticas-rls).

### Contrato esperado de `reservas`

| Columna | Tipo | Nota |
|---|---|---|
| `id` | `int8` / `bigint` | Clave primaria generada por la base. Es el identificador estable. |
| `usuario_id` | `uuid` | Dueño de la fila; debe coincidir con `auth.uid()`. |
| `restaurante_id` | `int8` / `bigint` | Referencia a `restaurantes.id`. |
| `nombre` | `text` | Titular de la reserva. |
| `email` | `text` | Correo del titular. |
| `telefono` | `text` | Teléfono de contacto. |
| `personas` | `int4` / `integer` | Cantidad de personas. |
| `fecha` | `date` | Día de la reserva. |
| `hora` | `time` | Hora de la reserva. |
| `notas` | `text` | Opcional. |
| `estado` | `text` | `pendiente`, `confirmada` o `cancelada`. |
| `creado_en` | `timestamptz` | Valor por defecto `now()`; se usa para ordenar. |

La vista pública de restaurantes solo necesita `id` y `nombre`.

---

## Cómo ejecutar

```bash
cd Clase_C3_04_APIs_CRUD/proyecto-react
npm install
```

Copia el archivo de ejemplo y completa tus valores:

```bash
copy .env.example .env.local
```

```dotenv
# .env.local — no se sube al repositorio
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLISHABLE
```

> Usa únicamente la clave **publishable**/`anon`. Nunca escribas la `service_role` en el frontend ni en el repositorio. `.env.local` está cubierto por `*.local` en `.gitignore`.

Después:

```bash
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://127.0.0.1:5173/`). Si cambiaste `.env.local`, reinicia el servidor.

| Vista | URL |
|---|---|
| Populares | `http://127.0.0.1:5173/#/populares` |
| Reservas | `http://127.0.0.1:5173/#/reservas` |
| Versión del segundo corte | `http://127.0.0.1:5173/segundo-corte/index.html` |

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con recarga en caliente
npm run build     # Compila la versión de producción en dist/
npm run preview   # Sirve la compilación de producción
```

---

## Políticas RLS

Ejecuta esto en el **SQL Editor** de Supabase si la tabla no las tiene. Sin ellas, la aplicación no puede leer ni escribir reservas.

```sql
alter table public.reservas enable row level security;

drop policy if exists "reservas_select_propias" on public.reservas;
drop policy if exists "reservas_insert_propias" on public.reservas;
drop policy if exists "reservas_update_propias" on public.reservas;
drop policy if exists "reservas_delete_propias" on public.reservas;

create policy "reservas_select_propias" on public.reservas
  for select using (auth.uid() = usuario_id);

create policy "reservas_insert_propias" on public.reservas
  for insert with check (auth.uid() = usuario_id);

create policy "reservas_update_propias" on public.reservas
  for update using (auth.uid() = usuario_id)
  with check (auth.uid() = usuario_id);

create policy "reservas_delete_propias" on public.reservas
  for delete using (auth.uid() = usuario_id);
```

El `with check` del UPDATE impide trasladar una fila a otra cuenta. El servicio además filtra por `usuario_id` en cada operación, como segunda barrera.

---

## Funcionalidades

### Populares

- Buscador controlado que ignora mayúsculas y tildes.
- Filtro por categorías con `aria-pressed`.
- Filtrado combinado con `useMemo`, contador `aria-live` y estado vacío.
- Aviso de pedido (demostración, sin persistencia).

### Reservas

- **Puerta de sesión:** sin cuenta muestra el botón de Google; con sesión muestra el correo y el panel.
- **Catálogo remoto** de restaurantes leído con `fetch` y la clave publishable (sin el token de la sesión).
- **Lectura remota** de las reservas del usuario con estados de **carga, error con reintento, vacío y resultados**.
- **Filtro remoto por `estado`** (viaja a PostgREST) y **búsqueda local** sobre las filas descargadas.
- **Límite de 100 filas** sin paginación, documentado en la interfaz y en la bitácora.
- **Crear** con validación por campo, bloqueo mientras guarda y confirmación con el `id` devuelto por la base.
- **Editar** fecha, hora, personas, notas y estado de una fila concreta, identificada por su `id`.
- **Eliminar** con confirmación previa y nueva lectura de la lista.
- **Relectura después de cada escritura:** la interfaz muestra lo que quedó en el servidor, no una copia optimista.
- **Cancelación de lecturas anteriores** con `AbortController` y una bandera de vigencia.
- **Accesibilidad:** `useId`, `aria-invalid`, `aria-describedby`, mensajes con `role="alert"` y `aria-live`.

---

## Estructura

```text
proyecto-react/
├── index.html
├── package.json
├── vite.config.js
├── .env.example
├── public/
│   ├── imagen-respaldo.svg
│   ├── prueba-anchos.html
│   └── segundo-corte/              # Versión HTML + CSS + JS del segundo corte
├── src/
│   ├── main.jsx                    # StrictMode
│   ├── App.jsx                     # Navegación por hash y título del documento
│   ├── lib/
│   │   └── supabase.js             # Cliente único, PKCE y guardia de variables
│   ├── services/
│   │   ├── reservas.js             # SELECT, INSERT, UPDATE, DELETE
│   │   └── restaurantes.js         # Catálogo público con fetch
│   ├── hooks/
│   │   ├── useSesion.js            # Sesión, Google y cierre local
│   │   ├── useReservas.js          # Lectura, filtro, recarga y escrituras
│   │   └── useToggle.js
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BannerBuscador.jsx
│   │   ├── FiltroCategorias.jsx
│   │   ├── ListaRestaurantes.jsx
│   │   ├── TarjetaRestaurante.jsx
│   │   ├── FormularioReserva.jsx
│   │   └── TarjetaReserva.jsx
│   ├── views/
│   │   ├── Populares.jsx
│   │   └── Reservas.jsx
│   ├── data/
│   │   └── restaurantes.js         # Datos de Populares
│   ├── utils/
│   │   ├── fecha.js
│   │   └── normalizar.js
│   └── styles/
│       ├── styles.css
│       └── reservas.css
└── evidencias/                     # Capturas de la entrega (../evidencias)
```

---

## Pruebas manuales

Marca cada casilla después de verla en el navegador. No las des por cumplidas solo porque el código existe.

### Lectura y filtros

- [ ] Sin sesión, `/#/reservas` muestra el botón **Iniciar sesión con Google**.
- [ ] Con sesión y cero reservas, aparece el estado vacío.
- [ ] Mientras carga, se ve **Cargando reservas…**.
- [ ] Con datos, aparece el contador `X de Y reservas` y las tarjetas.
- [ ] Al cambiar el filtro de estado, en **Network** la petición a `reservas` incluye `estado=eq.<valor>`.
- [ ] Un filtro sin coincidencias muestra el mensaje de ausencia, no un error.
- [ ] Al cambiar rápido entre filtros, una respuesta anterior no reemplaza la lista actual.
- [ ] El botón **Reintentar** aparece ante un error de lectura (por ejemplo, sin red).

### CRUD y persistencia

- [ ] Crear una reserva ficticia; el mensaje muestra el `id` generado.
- [ ] Recargar la página: la reserva sigue allí.
- [ ] Cambiar el filtro antes de editar y editar la fila correcta; el `id` no cambia.
- [ ] Recargar: el cambio se conserva.
- [ ] Eliminar una reserva ficticia y confirmar; recargar y comprobar que no reaparece.
- [ ] Con el formulario inválido, no se crea ninguna fila y el contenido no se pierde.
- [ ] Mientras guarda, el botón queda bloqueado y no se puede enviar dos veces.

### Permisos (dos cuentas)

- [ ] La cuenta B no ve las reservas de la cuenta A.
- [ ] La cuenta B no puede editar ni eliminar una fila de A, aunque conozca el `id`.
- [ ] Ninguna captura incluye tokens ni credenciales.

### Compilación

- [ ] `npm run build` termina sin errores.
- [ ] La consola del navegador no muestra errores.

---

## Evidencias

Las capturas están en `../evidencias/`:

- `reservas-sesion.png`: puerta de sesión de Reservas, sin errores de consola.

Pendientes de capturar con red y sesión real: carga, error, vacío, resultados, filtro remoto en Network, creación, edición, eliminación, persistencia tras recargar y prueba con dos cuentas.

---

## Notas

- `node_modules/` y `dist/` no se incluyen en el repositorio; se regeneran con `npm install` y `npm run build`.
- El proyecto vive en una unidad de Google Drive. Vite usa una caché temporal, `watch.usePolling` y un complemento que retira `desktop.ini`, porque ese sistema de archivos rompe la caché y bloquea archivos ocultos durante el build.
- Si `npm install` falla dentro de Google Drive con `TAR_ENTRY_ERROR` o archivos de 0 bytes, instala en una carpeta local y copia con `robocopy`.
- El proyecto no usa frameworks de CSS: los estilos son CSS plano con variables.
- La versión HTML + CSS + JS del segundo corte se conserva en `public/segundo-corte/` como referencia y no se sobrescribe.

---

## Autor

**Juan David Valencia Ospina**
- GitHub: [@JuanDavidValencia](https://github.com/JuanDavidValencia)
- Correo: juan.valencia.0677@eam.edu.co

**María José Ospina**
- Correo: maria.ospina@eam.edu.co
