# Taller de componentes · GastroLocal

Vista **Populares** del proyecto GastroLocal migrada a **React + Vite**, dividida en componentes reutilizables y con la versión del segundo corte conservada.

## Entorno

| Herramienta | Versión |
|---|---|
| Node.js | 26.13.0 |
| npm | 11.20.0 |
| React | 19.3.1 |
| Vite | 8.3.5 |

## Cómo ejecutar

```bash
cd tallerClase
npm install
npm run dev
```

Abrir la URL que muestra Vite (por defecto `http://127.0.0.1:5173/`).

Otros comandos:

```bash
npm run build     # compila la versión de producción en dist/
npm run preview   # sirve la compilación
```

## Versión del segundo corte

La carpeta `public/segundo-corte/` es una copia intacta de `Parcial 2/Pagina`. Vite la sirve como contenido estático, así que se puede comparar la versión anterior con la nueva:

- Versión React: `http://127.0.0.1:5173/`
- Versión del segundo corte: `http://127.0.0.1:5173/segundo-corte/index.html`
- Vista original de Populares: `http://127.0.0.1:5173/segundo-corte/populares.html`

## Componentes

| Componente | Función | Props |
|---|---|---|
| `Header` | Presenta la marca y la navegación principal. | — |
| `BannerBuscador` | Muestra el título y un buscador controlado; solo notifica el texto. | `valor`, `onCambio` |
| `FiltroCategorias` | Permite elegir una categoría y marca la activa con `aria-pressed`. | `categorias`, `categoriaActiva`, `onSeleccionar` |
| `ListaRestaurantes` | Recorre la colección con `.map()`, asigna `key` y resuelve el estado vacío. | `restaurantes`, `onOrdenar` |
| `TarjetaRestaurante` | Presenta un registro: categoría, nombre, descripción, imagen, precio y reseña. | `restaurante`, `onOrdenar` |

La misma tarjeta se reutiliza con **tres registros** (`Pizza Combo`, `Chicharrón` y `Sushi`) que llegan mediante props desde `src/data/restaurantes.js`.

`App.jsx` compone la sección, mantiene el estado de búsqueda y categoría, filtra con `useMemo` y muestra el aviso de pedido.

## Estilos adaptados

`src/styles/styles.css` parte de `styles.css` y `populares-styles.css` del segundo corte. Se conservaron la paleta, las variables, la tipografía, el banner y las tarjetas; se adaptaron la cuadrícula de tres columnas, los filtros como botones, los estados vacío/pedido y el comportamiento responsive.

## Verificación en dos anchos

La página `http://127.0.0.1:5173/prueba-anchos.html` carga la aplicación en dos iframes con viewports distintos y muestra las medidas obtenidas.

| Ancho | Columnas | Ancho de tarjeta | Desborde horizontal |
|---:|---:|---:|---|
| 1024 px | 3 | 310 px | No |
| 390 px | 1 | 343 px | No |

Evidencia: `evidencias/prueba-dos-anchos.png`.

## Estructura

```text
tallerClase/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── imagen-respaldo.svg
│   ├── prueba-anchos.html
│   └── segundo-corte/          # copia intacta de Parcial 2/Pagina
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── BannerBuscador.jsx
│   │   ├── FiltroCategorias.jsx
│   │   ├── ListaRestaurantes.jsx
│   │   └── TarjetaRestaurante.jsx
│   ├── data/
│   │   └── restaurantes.js
│   └── styles/
│       └── styles.css
└── evidencias/
    └── prueba-dos-anchos.png
```

## Comprobaciones realizadas

- [x] Entorno Node + React + Vite instalado y compilando (`npm run build`).
- [x] Versión del segundo corte conservada y accesible desde `/segundo-corte/`.
- [x] Vista propia dividida en cinco componentes con responsabilidad clara.
- [x] Tarjeta reutilizada con tres registros recibidos mediante props.
- [x] Sección compuesta y estilos adaptados.
- [x] Dos anchos comprobados (1024 px y 390 px) sin desborde horizontal.
- [x] Búsqueda, filtro por categoría y estado vacío funcionando.
- [x] Sin errores en consola.
