# GastroLocal · React

Aplicación web de restaurantes migrada a **React + Vite**. Conserva la vista **Populares** del segundo corte y agrega la vista **Reservas**, con formulario controlado, validación, registros en memoria, búsqueda, estado vacío y detalles desplegables.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Estado](https://img.shields.io/badge/estado-funcionando-success)

---

## Tecnologías

| Herramienta | Versión |
|---|---|
| Node.js | 26.13.0 |
| npm | 11.20.0 |
| React | 19.3.1 |
| Vite | 8.3.5 |

---

## Cómo ejecutar

```bash
cd Clase_C3_03_Interaccion_Formularios/proyecto-react
npm install
npm run dev
```

Abre la URL que imprime Vite (por defecto `http://127.0.0.1:5173/`).

| Vista | URL |
|---|---|
| Populares | `http://127.0.0.1:5173/#/populares` |
| Reservas | `http://127.0.0.1:5173/#/reservas` |
| Versión del segundo corte | `http://127.0.0.1:5173/segundo-corte/index.html` |

La navegación entre las dos vistas React usa el hash de la URL (`#/populares` y `#/reservas`). Los enlaces que todavía no tienen vista React conservan las páginas de `public/segundo-corte/`.

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo con recarga en caliente
npm run build     # Compila la versión de producción en dist/
npm run preview   # Sirve la compilación de producción
```

---

## Funcionalidades

### Populares

- **Buscador controlado** por estado (`useState`) que ignora mayúsculas y tildes.
- **Filtro por categorías** con indicador `aria-pressed`.
- **Filtrado combinado** de búsqueda + categoría con `useMemo`.
- **Contador de resultados** (`X de Y registros`) con `aria-live`.
- **Estado vacío** cuando ningún restaurante coincide.
- **Aviso de pedido** al agregar un restaurante (demostración).

### Reservas

- **Formulario controlado** con siete campos: nombre, correo, teléfono, personas, restaurante, fecha y hora.
- **Validación en el envío** con mensajes por campo y `aria-invalid` / `aria-describedby`.
- **Reglas del dominio**: nombre de al menos 3 caracteres, correo válido, teléfono de 7 a 10 dígitos, entre 1 y 12 personas, fecha de hoy en adelante y hora entre 12:00 y 22:00.
- **Registros en memoria** con identificadores estables (`crypto.randomUUID()`), insertados al inicio de la lista.
- **Aviso de confirmación** con el nombre, el restaurante y un código corto de la reserva.
- **Búsqueda** por nombre, restaurante, fecha u hora, con contador `X de Y reservas`.
- **Estado vacío** diferenciado: sin reservas registradas o sin coincidencias.
- **Detalles desplegables** por tarjeta con `aria-expanded` y `aria-controls`; cada tarjeta abre y cierra de forma independiente.
- **`useId`** para relacionar etiquetas, campos y mensajes de error sin duplicar identificadores.
- **Hook personalizado `useToggle`** para la apertura de los detalles.

> Los registros de esta práctica permanecen en memoria y se pierden al recargar la página. La integración con la API corresponde a la siguiente clase.

---

## Componentes

| Componente | Función | Props |
|---|---|---|
| `Header` | Marca y navegación principal con `aria-current`. | `vistaActiva` |
| `BannerBuscador` | Título y buscador controlado de Populares. | `valor`, `onCambio` |
| `FiltroCategorias` | Selección de categoría con `aria-pressed`. | `categorias`, `categoriaActiva`, `onSeleccionar` |
| `ListaRestaurantes` | Recorre la colección con `.map()`, asigna `key` y resuelve el estado vacío. | `restaurantes`, `onOrdenar` |
| `TarjetaRestaurante` | Presenta categoría, nombre, descripción, imagen, precio y reseña. | `restaurante`, `onOrdenar` |
| `FormularioReserva` | Formulario controlado, validación y notificación del alta. | `restaurantes`, `onReservar` |
| `TarjetaReserva` | Presenta una reserva y alterna sus detalles de contacto. | `reserva` |

### ¿Quién administra cada estado?

| Estado | Dónde vive | Por qué |
|---|---|---|
| Texto y categoría de búsqueda (Populares) | `views/Populares.jsx` | Afectan al listado completo. |
| Pedido seleccionado | `views/Populares.jsx` | Es una decisión compartida de la vista. |
| Campos del formulario | `components/FormularioReserva.jsx` | Solo el formulario necesita el valor de cada control. |
| Errores de validación | `components/FormularioReserva.jsx` | Se generan y se muestran en el mismo componente. |
| Lista de reservas, búsqueda y mensaje | `views/Reservas.jsx` | El listado y el aviso dependen de los registros. |
| Detalles abiertos de una tarjeta | `components/TarjetaReserva.jsx` | Cada tarjeta conserva su propia decisión. |

Los resultados filtrados y los contadores se **calculan** con `useMemo` o directamente en el render; no se guardan como estado independiente.

---

## Estructura

```text
proyecto-react/
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

Las capturas de la entrega están en `../evidencias/`.

---

## Comprobaciones realizadas

- [x] `npm run build` compila sin errores (31 módulos transformados).
- [x] Envío vacío: se muestran 7 mensajes y no se agrega ningún registro.
- [x] Envío válido: se agrega la reserva, se limpian los campos y aparece el aviso de confirmación.
- [x] Dos registros consecutivos: la lista pasa de 2 a 4 reservas.
- [x] Búsqueda con coincidencias: el contador y las tarjetas se reducen.
- [x] Búsqueda sin coincidencias: aparece el estado vacío y se puede limpiar el filtro.
- [x] Los detalles de una tarjeta se abren sin afectar a las demás.
- [x] La vista Populares conserva sus tres registros, su buscador y su filtro, sin formularios.
- [x] Navegación entre `#/populares` y `#/reservas` con el título del documento actualizado.
- [x] Sin errores en la consola del navegador.

Evidencias de la vista Reservas:

- `evidencias/reservas-vista.png`
- `evidencias/reservas-validacion.png`
- `evidencias/reservas-registro-creado.png`
- `evidencias/reservas-sin-coincidencias.png`

---

## Notas

- `node_modules/` y `dist/` **no** se incluyen en el repositorio (están en `.gitignore`). Se regeneran con `npm install` y `npm run build`.
- El proyecto no usa frameworks de CSS: los estilos son CSS plano con variables.
- Los nombres `desktop.ini` están ignorados para evitar que los metadatos de Windows rompan la compilación de Vite.

---

## Autor

**Juan David Valencia Ospina**
- GitHub: [@JuanDavidValencia](https://github.com/JuanDavidValencia)
- Correo: juan.valencia.0677@eam.edu.co

**María José Ospina**
- Correo: maria.ospina@eam.edu.co
