# GastroLocal · React

Aplicación web de restaurantes desarrollada como taller de **React + Vite**. Incluye la vista **Populares** (búsqueda, filtros y tarjetas reutilizables) y la vista **Reservas** (formulario controlado, validación, registros en memoria y búsqueda con estado vacío).

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Data-3FCF8E?logo=supabase&logoColor=white)
![Estado](https://img.shields.io/badge/estado-funcionando-success)

---

## Contenido del repositorio

| Ruta | Descripción |
|---|---|
| `Clase_C3_03_Interaccion_Formularios/proyecto-react/` | Aplicación **React + Vite** actual (Populares + Reservas). |
| `Clase_C3_03_Interaccion_Formularios/evidencias/` | Capturas de la validación, el alta de reservas y el estado vacío. |
| `Clase_C3_03_Interaccion_Formularios/Clase_C3_03_Interaccion_Formularios.md` | Bitácora de la clase de interacción y formularios. |
| `Clase_C3_02_Guia_Componentes_Props/tallerClase/` | Versión anterior de la app React (solo Populares). |
| `Plantilla_Bitacora.md` | Plantilla base de las bitácoras. |

> Todos los comandos de npm se ejecutan desde `Clase_C3_03_Interaccion_Formularios/proyecto-react/`.

---

## Tecnologías

| Herramienta | Versión |
|---|---|
| Node.js | 26.13.0 |
| npm | 11.20.0 |
| React | 19.3.1 |
| Vite | 8.3.5 |
| Supabase | Auth + Data API (versión del segundo corte) |

---

## Cómo ejecutar

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanDavidValencia/gastrolocal-react.git

# 2. Entrar a la app React actual
cd gastrolocal-react/Clase_C3_03_Interaccion_Formularios/proyecto-react

# 3. Instalar dependencias
npm install

# 4. Levantar el servidor de desarrollo
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://localhost:5173/`).

| Vista | URL |
|---|---|
| Populares | `http://localhost:5173/#/populares` |
| Reservas | `http://localhost:5173/#/reservas` |
| Versión del segundo corte | `http://localhost:5173/segundo-corte/index.html` |

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con recarga en caliente
npm run build     # Compila la versión de producción en dist/
npm run preview   # Sirve la compilación de producción
```

---

## Funcionalidades

### Populares

- Buscador controlado que ignora mayúsculas y tildes.
- Filtro por categorías con `aria-pressed`.
- Filtrado combinado con `useMemo` y contador de resultados con `aria-live`.
- Estado vacío cuando no hay coincidencias.
- Tarjeta reutilizable con tres registros recibidos por props.

### Reservas

- Formulario controlado con siete campos y validación por reglas del dominio.
- Mensajes de error asociados con `aria-invalid` y `aria-describedby`.
- Registros en memoria con identificadores estables y aviso de confirmación.
- Búsqueda por nombre, restaurante, fecha u hora, con contador y estado vacío.
- Detalles de contacto desplegables por tarjeta con `useToggle`.
- Identificadores accesibles generados con `useId`.

La navegación entre vistas usa el hash de la URL. Los enlaces que aún no tienen una vista React conservan las páginas de `public/segundo-corte/`.

---

## Componentes

| Componente | Función | Props |
|---|---|---|
| `Header` | Marca y navegación principal con `aria-current`. | `vistaActiva` |
| `BannerBuscador` | Título y buscador controlado de Populares. | `valor`, `onCambio` |
| `FiltroCategorias` | Selección de categoría con `aria-pressed`. | `categorias`, `categoriaActiva`, `onSeleccionar` |
| `ListaRestaurantes` | Recorre la colección, asigna `key` y resuelve el estado vacío. | `restaurantes`, `onOrdenar` |
| `TarjetaRestaurante` | Presenta categoría, nombre, descripción, imagen, precio y reseña. | `restaurante`, `onOrdenar` |
| `FormularioReserva` | Formulario controlado, validación y notificación del alta. | `restaurantes`, `onReservar` |
| `TarjetaReserva` | Presenta una reserva y alterna sus detalles de contacto. | `reserva` |

La vista `Reservas` administra la lista, la búsqueda y el mensaje de confirmación. El formulario conserva sus campos y errores; cada tarjeta conserva de forma independiente si muestra sus detalles.

---

## Estructura del proyecto React

```text
Clase_C3_03_Interaccion_Formularios/proyecto-react/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── imagen-respaldo.svg
│   ├── prueba-anchos.html
│   └── segundo-corte/              # Versión HTML + CSS + JS anterior
├── src/
│   ├── main.jsx
│   ├── App.jsx                     # Navegación por hash y composición
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
│   ├── hooks/
│   │   └── useToggle.js
│   ├── data/
│   │   ├── restaurantes.js
│   │   └── reservas.js
│   ├── utils/
│   │   ├── fecha.js
│   │   └── normalizar.js
│   └── styles/
│       ├── styles.css
│       └── reservas.css
```

---

## Verificación

| Prueba | Resultado |
|---|---|
| `npm run build` | Compila sin errores (31 módulos). |
| Envío vacío del formulario | 7 mensajes de error, sin registro nuevo. |
| Envío válido | Registro agregado, campos limpios y aviso de confirmación. |
| Dos registros consecutivos | La lista pasa de 2 a 4 reservas. |
| Búsqueda con coincidencias | Se filtran las tarjetas y cambia el contador. |
| Búsqueda sin coincidencias | Aparece el estado vacío y la opción de limpiar. |
| Detalles por tarjeta | Se abren y cierran de forma independiente. |
| Vista Populares | Conserva sus tres registros y no muestra formularios. |
| Consola del navegador | Sin errores. |

Evidencias: `Clase_C3_03_Interaccion_Formularios/evidencias/`.

---

## Configuración de Supabase (versión del segundo corte)

La versión anterior usa Supabase para autenticación y datos. La configuración está en:

```text
Clase_C3_03_Interaccion_Formularios/proyecto-react/public/segundo-corte/js/config.js
```

```js
export const SUPABASE_URL = "https://<tu-proyecto>.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_...";
export const REDIRECT_URL = "";
```

> La **publishable key** está diseñada para ser pública. Aun así, asegúrate de tener **RLS (Row Level Security)** activado en todas las tablas de Supabase.

---

## Notas

- `node_modules/` y `dist/` **no** se incluyen en el repositorio; se regeneran con `npm install` y `npm run build`.
- Los estilos son CSS plano con variables, sin frameworks de CSS.
- Las reservas de esta entrega viven en memoria; la integración con la API se trabaja en la siguiente clase.
- Los archivos `desktop.ini` están ignorados para evitar que los metadatos de Windows rompan la compilación de Vite.

---

## Autores

**Juan David Valencia Ospina**
- GitHub: [@JuanDavidValencia](https://github.com/JuanDavidValencia)
- Correo: juan.valencia.0677@eam.edu.co

**María José Ospina**
- Correo: maria.ospina@eam.edu.co
