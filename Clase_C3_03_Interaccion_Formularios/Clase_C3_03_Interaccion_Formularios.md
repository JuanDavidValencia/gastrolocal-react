---
tipo: bitacora-clase
curso: Desarrollo Web
periodo: EAM-2026II
equipo: Valencia_Ospina
corte: 3
semana: 3
clase: C3_03
fecha: 2026-11-08
estado: completada
tags:
  - desarrollo-web
  - bitacora
  - react
  - formularios
  - reservas
---

# Bitácora — Clase C3_03: Interacción y formularios en React

## 1. Datos de la sesión

| Campo             | Registro                                                                                                                                                                                                    |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tema              | Interacción y formularios en React                                                                                                                                                                          |
| Objetivo          | Incorporar eventos, estado, contenido condicional, un formulario controlado con validación, registros en memoria y un Hook personalizado en la vista Reservas, conservando Populares y el diseño adaptable. |
| Proyecto          | GastroLocal                                                                                                                                                                                                 |
| Entregable        | Avance funcional en `proyecto-react/`, capturas en `evidencias/` y esta bitácora.                                                                                                                           |
| Material de apoyo | Guía de laboratorio C3_03 (26 páginas), presentación HTML de la clase y bitácora C3_02.                                                                                                                     |
| Inicio            | 8:45 p. m.                                                                                                                                                                                                  |
| Cierre            | 9:30 p. m.                                                                                                                                                                                                  |

## 2. Participación y responsabilidades

| Integrante | Asistió | Rol de la clase | Responsabilidad asumida | Aporte verificable |
|---|:---:|---|---|---|
| Juan David Valencia | Sí | Líder | Migrar Reservas a React; implementar el formulario controlado, la validación, la búsqueda, `useId` y el Hook `useToggle`; ejecutar las comprobaciones y documentar. | `src/views/Reservas.jsx`, `src/components/FormularioReserva.jsx`, `src/components/TarjetaReserva.jsx`, `src/hooks/useToggle.js` y capturas en `evidencias/` |
| María José Ospina | Sí | Miembro | Revisar las reglas del dominio de reservas, proponer los casos de prueba y revisar la redacción del README y de la bitácora. | Reglas de validación en `FormularioReserva.jsx`; casos de prueba de la sección 6; `README.md` |

## 3. Reto aplicado al proyecto

### Funcionalidad trabajada

Se migró la vista **Reservas** del segundo corte a React y se adaptó el laboratorio de interacción a su dominio. La vista permite registrar una reserva con nombre, correo, teléfono, número de personas, restaurante, fecha y hora; valida los datos antes de agregarla a una lista en memoria y muestra un aviso de confirmación con un código corto.

La lista se puede filtrar por nombre, restaurante, fecha u hora. Cuando no hay coincidencias se muestra un estado vacío con una acción para limpiar la búsqueda. Cada tarjeta abre y cierra sus detalles de contacto de forma independiente mediante el Hook `useToggle`.

La vista **Populares** se conservó tal como estaba en C3_02: sus tres registros, el buscador, el filtro por categorías y el aviso de pedido, sin formularios agregados. Las reservas son datos de práctica: permanecen mientras la aplicación sigue montada y se pierden al recargar; la integración con la API corresponde a la siguiente clase.

`main.jsx` conserva `StrictMode` y los ejercicios temporales de la guía no se dejaron en `App.jsx`: la aplicación mantiene únicamente las vistas del producto.

### Criterios de aceptación

- [x] Incorporar una interacción con estado y contenido condicional en la vista.
- [x] Construir un formulario controlado con al menos dos campos, reglas y mensajes claros.
- [x] Agregar registros en memoria y presentar una búsqueda o filtro con estado vacío.
- [x] Relacionar etiquetas y campos con `useId` y utilizar un Hook personalizado sencillo.
- [x] Comprobar envíos inválidos y válidos, registros consecutivos y búsquedas sin coincidencias.
- [x] Conservar los componentes y el diseño adaptable del producto.

### Archivos o componentes modificados

- `src/App.jsx`: navegación por hash entre `#/populares` y `#/reservas`, título del documento por vista y composición del contenido principal.
- `src/components/Header.jsx`: enlaces a las vistas React y `aria-current` para la vista activa.
- `src/views/Populares.jsx`: se extrajo la lógica original de Populares para conservarla sin cambios.
- `src/views/Reservas.jsx`: estado de la lista, la búsqueda y el mensaje; alta de reservas, filtrado y estado vacío.
- `src/components/FormularioReserva.jsx`: formulario controlado de siete campos, validación, mensajes y `useId`.
- `src/components/TarjetaReserva.jsx`: presentación de una reserva y detalles desplegables con `useToggle`.
- `src/hooks/useToggle.js`: Hook personalizado para abrir, cerrar y alternar un panel.
- `src/data/reservas.js`: dos reservas de demostración con fechas futuras dinámicas.
- `src/utils/fecha.js`: fechas ISO, suma de días y formato en español.
- `src/utils/normalizar.js`: comparación de textos sin mayúsculas ni tildes.
- `src/styles/reservas.css`: estilos propios de Reservas, separados de los de Populares.
- `README.md` y `proyecto-react/README.md`: documentación de las dos vistas y de las comprobaciones.
- `evidencias/`: capturas de la vista, la validación, el alta y el estado vacío.

### Reglas de validación del formulario

| Campo          | Regla aplicada                                                        | Mensaje o comportamiento                                                                        |
| -------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Nombre         | Se retiran los espacios exteriores; debe tener al menos 3 caracteres. | «Escribe el nombre del titular con al menos 3 caracteres.»                                      |
| Correo         | Debe cumplir el patrón `^[^\s@]+@[^\s@]+\.[^\s@]+$`.                  | «Escribe un correo válido, por ejemplo nombre@correo.com.»                                      |
| Teléfono       | Se cuentan solo los dígitos; debe tener entre 7 y 10.                 | «Escribe un teléfono de entre 7 y 10 dígitos.»                                                  |
| Personas       | Entero mayor o igual a 1; más de 12 se deriva a contacto telefónico.  | «Indica al menos una persona.» / «Para grupos de más de 12 personas, contáctanos por teléfono.» |
| Restaurante    | Selección obligatoria de la lista.                                    | «Selecciona un restaurante.»                                                                    |
| Fecha          | Obligatoria y no anterior a hoy.                                      | «Elige una fecha para la reserva.» / «La fecha no puede ser anterior a hoy.»                    |
| Hora           | Obligatoria y entre 12:00 y 22:00.                                    | «Elige una hora para la reserva.» / «Atendemos entre las 12:00 p. m. y las 10:00 p. m.»         |
| Envío inválido | No se agrega el registro ni se limpian los campos.                    | Los errores se muestran con `role="alert"` y `aria-describedby`; `onReservar` no se ejecuta.    |

### Fundamentos de la guía aplicados al proyecto

| Fundamento de la guía | Aplicación en GastroLocal |
|---|---|
| Eventos y manejadores | `onSubmit` en el formulario, `onChange` en los campos y `onClick` en los botones. Las funciones se entregan, no se ejecutan durante el renderizado. |
| Estado y actualizaciones | `useState` para los campos, los errores, la lista, la búsqueda, el mensaje y los detalles. Las listas y los objetos se actualizan con funciones y copias. |
| Resultados derivados | La lista filtrada se calcula con `useMemo`; el contador y la visibilidad del botón Limpiar se derivan de los datos. No se guardan como estado independiente. |
| Renderizado condicional | Aviso de confirmación, estado vacío, botón Limpiar y panel de detalles. Cada condición tiene un significado distinto. |
| Campos controlados y validación | Siete campos con `value` y `onChange`; validación al enviar; `noValidate`; mensajes por campo y atributos `aria-invalid` / `aria-describedby`. |
| `useId` | Prefijo `baseId` en el formulario, `busquedaId` en el buscador y `detallesId` en cada tarjeta. No se usa para las claves de la lista ni para los identificadores de las reservas. |
| Registros en memoria | Arreglo de estado con identificadores estables; la nueva reserva se inserta al inicio sin modificar el arreglo anterior. |
| Búsqueda y filtro | Comparación normalizada por nombre, restaurante, fecha y hora, sin borrar los registros originales. |
| Hook personalizado | `useToggle` reúne la apertura y el cierre de los detalles; cada tarjeta conserva su propio estado. |

## 4. Decisiones técnicas

| Decisión                                                                                           | Razón                                                                                                                            | Alternativa descartada                                                                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Navegar entre vistas con el hash de la URL (`#/populares`, `#/reservas`)                           | Solo hay dos vistas y no se agrega una dependencia de enrutamiento; el enlace se puede compartir y el botón Atrás funciona.      | Instalar React Router para dos rutas simples.                                                            |
| Mantener los siete campos en un solo objeto de estado (`campos`) y los errores en otro (`errores`) | Reduce declaraciones repetidas, permite reiniciar el formulario con un solo valor y conserva los errores separados de los datos. | Un `useState` por campo, que dificulta la limpieza y el mantenimiento.                                   |
| Usar campos controlados y leer el estado al enviar                                                 | Permite validar por campo, mostrar mensajes junto al control y limpiar el formulario después del alta.                           | Leer los valores con `FormData` al enviar; se conserva como alternativa para formularios no controlados. |
| Validar al enviar y retirar el error de un campo cuando la persona vuelve a escribir               | Evita mensajes prematuros mientras se escribe y deja un recorrido claro para corregir.                                           | Validar en cada pulsación, que genera ruido desde el primer carácter.                                    |
| Usar `noValidate` y mensajes propios en español                                                    | Los mensajes del navegador cambian de idioma y no siempre explican la regla del dominio.                                         | Dejar toda la validación a los atributos HTML nativos.                                                   |
| Guardar las reservas en un arreglo de estado en memoria                                            | Es lo solicitado para esta práctica; la API se integra en la siguiente clase.                                                    | `localStorage`, que ocultaría la necesidad de integrar el servicio.                                      |
| Generar el identificador con `crypto.randomUUID()` y un respaldo para navegadores sin esa función  | Cada reserva conserva una identidad estable para `key`, el código visible y futuras operaciones.                                 | Usar el índice del arreglo como `key`.                                                                   |
| Usar `useToggle` dentro de cada `TarjetaReserva`                                                   | Cada tarjeta conserva su propia decisión de abrir o cerrar; el Hook reúne la lógica repetida.                                    | Un único estado en la vista para saber qué tarjeta está abierta.                                         |
| Generar los identificadores de accesibilidad con `useId`                                           | Evita duplicar `id` entre etiquetas, campos, mensajes y paneles si el componente se reutiliza.                                   | Identificadores fijos como `nombre` o `detalles`.                                                        |
| Calcular la lista filtrada con `useMemo`                                                           | El resultado depende de la lista y de la búsqueda; guardarlo como estado obligaría a sincronizar dos versiones.                  | Un estado `reservasFiltradas` actualizado en cada cambio.                                                |

### ¿Quién administra cada estado?

| Estado | Componente responsable | Resultado derivado |
|---|---|---|
| Campos del formulario y errores | `FormularioReserva` | Mensajes por campo y atributos `aria-invalid` / `aria-describedby`. |
| Lista de reservas, búsqueda y mensaje de éxito | `Reservas` | Arreglo filtrado, contador `X de Y reservas` y estado vacío. |
| Detalles abiertos de una tarjeta | `TarjetaReserva` | Panel de contacto visible u oculto. |

El Hook `useToggle` no comparte estado entre tarjetas: cada llamada crea su propio `useState`. Esa es la razón por la que abrir una reserva no abre las demás. La lista filtrada, el contador y la decisión de mostrar el botón Limpiar se calculan en el render; no se guardan como estado.

### Flujo de props, callbacks y resultados

| Relación | Datos que bajan (props) | Acción que sube (callback) | Resultado |
|---|---|---|---|
| `App` → `Header` | `vistaActiva` | — | Enlace activo con `aria-current="page"`. |
| `Reservas` → `FormularioReserva` | `restaurantes` | `onReservar(datos)` | Solo se comunican datos válidos; `Reservas` crea el registro. |
| `Reservas` → `TarjetaReserva` | `reserva` | — | Tarjeta con datos y detalles propios. |
| `TarjetaReserva` → `useToggle` | Valor inicial | `toggle`, `setTrue`, `setFalse` | Apertura independiente de los detalles. |
| `Populares` → `BannerBuscador` | `valor` | `onCambio` | Texto de búsqueda controlado. |
| `Populares` → `FiltroCategorias` | `categorias`, `categoriaActiva` | `onSeleccionar` | Categoría activa y filtrado combinado. |
| `Populares` → `ListaRestaurantes` | `restaurantes` | `onOrdenar` | Tarjetas y aviso de pedido. |

El formulario no conoce la lista ni decide cómo se agrega una reserva: valida, comunica los datos y `Reservas` actualiza el arreglo. Esa separación permite reutilizar el formulario y explicar con claridad qué componente administra cada decisión.

## 5. Problemas y soluciones

| Problema encontrado | Causa identificada | Solución aplicada | ¿Cómo se verificó? |
|---|---|---|---|
| El primer intento agregó un formulario de restaurantes a Populares y cambiaba el alcance de C3_02. | Se confundió la vista donde debía vivir el laboratorio. | Se extrajo Populares a `views/Populares.jsx`, se restauraron sus componentes y el formulario se movió al dominio de Reservas. | Populares muestra 3 tarjetas, buscador y filtro, y ningún formulario. |
| El servidor de desarrollo respondió 500 al recargar después de mover y eliminar `FormularioRestaurante.jsx`. | Vite conservaba en memoria un módulo eliminado y el HMR intentaba recargarlo. | Se detuvo el proceso del puerto 5183 y se reinició el servidor. | La vista Reservas cargó y la consola quedó sin errores. |
| La compilación falló con `ENOENT` por un archivo `desktop.ini` dentro de `public/`. | Es un metadato de Windows y Vite intenta copiarlo como contenido estático. El archivo puede reaparecer al sincronizar la carpeta. | Se retiró de `public/` antes de compilar y se mantiene `desktop.ini` en el `.gitignore`. | `npm run build` terminó con 31 módulos transformados después de retirarlo. |
| La fecha podía mostrarse un día antes por la zona horaria. | `new Date("AAAA-MM-DD")` interpreta la fecha como UTC. | Se formateó la fecha ISO añadiendo `T12:00:00` antes de crear el `Date`, para usar el mediodía local. | Las fechas de las tarjetas coinciden con las elegidas en el formulario. |
| Los estilos del formulario y de los botones alteraban la vista Populares. | Se habían agregado reglas generales en `styles.css`. | Se trasladaron a `styles/reservas.css` y se restauró `styles.css`. | Populares conserva su apariencia y sus tarjetas. |

## 6. Evidencias

| Tipo    | Descripción                                                                       | Enlace o ruta                                                                                                                                                                                                                                                                                                                                                                                         |
| ------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Captura | Vista Reservas con el formulario, las dos reservas de demostración y el buscador. | `evidencias/reservas-vista.png`                                                                                                                                                                                                                                                                                                                                                                       |
| Captura | Envío vacío: siete mensajes de error y ningún registro nuevo.                     | `evidencias/reservas-validacion.png`                                                                                                                                                                                                                                                                                                                                                                  |
| Captura | Alta válida: aviso de confirmación, código y detalles de la reserva creada.       | `evidencias/reservas-registro-creado.png`                                                                                                                                                                                                                                                                                                                                                             |
| Captura | Búsqueda sin coincidencias y acción para ver todas las reservas.                  | `evidencias/reservas-sin-coincidencias.png`                                                                                                                                                                                                                                                                                                                                                           |
| Demo    | Recorrido funcional en el servidor de desarrollo.                                 | `http://127.0.0.1:5173/#/reservas` (el puerto puede variar según Vite).                                                                                                                                                                                                                                                                                                                               |
| Código  | Estado de la lista, la búsqueda y el mensaje; alta de reservas.                   | `src/views/Reservas.jsx`, líneas 23-25, 30-64 y 66-159                                                                                                                                                                                                                                                                                                                                                |
| Código  | Campos, errores, validación y envío del formulario.                               | `src/components/FormularioReserva.jsx`, líneas 17-19, 39-115                                                                                                                                                                                                                                                                                                                                          |
| Código  | Detalles independientes con `useToggle` y `useId`.                                | `src/components/TarjetaReserva.jsx`, líneas 6-8 y 25-47                                                                                                                                                                                                                                                                                                                                               |
| Código  | Hook personalizado.                                                               | `src/hooks/useToggle.js`, líneas 5-13                                                                                                                                                                                                                                                                                                                                                                 |

**Vista inicial.** Formulario de siete campos, contador `2 de 2` y las dos reservas de demostración.

![[reservas-vista.png|720]]

**Envío vacío.** Los siete campos muestran su mensaje, el contador sigue en `2 de 2` y no se agrega ningún registro.

![[reservas-validacion.png|720]]

**Alta válida.** Se creó la reserva de Camila Restrepo en Chicharrón, el contador pasó a `3 de 3` y el aviso muestra el código `GL-QD1LZP`.

![[reservas-registro-creado.png|720]]

**Búsqueda sin coincidencias.** El contador queda en `0 de 2`, aparece el mensaje de lista vacía y las acciones para limpiar o ver todas las reservas.

![[reservas-sin-coincidencias.png|720]]

### Cómo repetir el recorrido

1. Abrir una terminal en `proyecto-react/`.
2. Ejecutar `npm run dev` (en este equipo, `npm.cmd run dev`, porque PowerShell bloquea `npm.ps1`).
3. Abrir `http://127.0.0.1:5173/#/reservas`.
4. Enviar el formulario vacío; después registrar una reserva válida y repetir el alta con otra.
5. Buscar un restaurante con coincidencias y luego un texto inexistente; usar Limpiar y Ver todas las reservas.
6. Abrir los detalles de dos tarjetas y volver a `#/populares`.
7. Compilar con `npm run build`; si aparece `ENOENT` por `public/desktop.ini`, retirar ese archivo antes de repetir la compilación.

### Pruebas ejecutadas

| Prueba | Resultado observado |
|---|---|
| Enviar el formulario vacío | 7 mensajes de error, 7 campos con `aria-invalid="true"` y ninguna reserva nueva. |
| Registrar una reserva válida | La lista pasó de 2 a 3 reservas, los campos quedaron vacíos y apareció el aviso con el código. |
| Registrar una segunda reserva | La lista llegó a 4 reservas y el contador mostró `4 de 4 reservas`. |
| Buscar `sushi` | `2 de 4 reservas`, solo las tarjetas de ese restaurante. |
| Buscar `zzzz` | `0 de 4 reservas` y el mensaje «No hay reservas que coincidan con la búsqueda». La captura se tomó con las dos reservas iniciales, por eso muestra `0 de 2`. |
| Limpiar la búsqueda | Volvieron todas las tarjetas y el campo quedó vacío. |
| Abrir detalles de dos tarjetas | Cada tarjeta cambió su `aria-expanded` sin afectar a las demás. |
| Volver a Populares | 3 registros, buscador y filtro; sin formularios. |
| Consola del navegador | Sin errores después de reiniciar el servidor. |
| `npm run build` | Compilación correcta: 31 módulos transformados en 3,36 s, con `desktop.ini` fuera de `public/`. |
| Revisión adaptable | `src/styles/reservas.css` cambia el formulario y la cuadrícula a una columna con `@media (max-width: 820px)`; la captura principal es de escritorio. |

## 7. Uso de inteligencia artificial

> [!important] Registrar la IA no reemplaza la explicación técnica. El equipo debe verificar, adaptar y comprender cualquier resultado utilizado.

| Herramienta   | Objetivo o pregunta  | Qué se utilizó       | Cómo se verificó  | Qué se modificó     |
| ------------- | -------------------- | -------------------- | ----------------- | ------------------- |
| [Herramienta] | [Solicitud resumida] | [Aporte aprovechado] | [Prueba o fuente] | [Adaptación propia] |


## 8. Defensa técnica y retroalimentación

| Campo | Registro |
|---|---|
| Integrante que defendió | Juan David Valencia |
| Pregunta recibida | ¿Quién administra el estado del formulario y por qué el Hook no comparte el estado entre tarjetas? ¿Qué datos se calculan? |
| Respuesta resumida | El formulario administra sus campos y errores porque solo él los necesita; la vista Reservas administra la lista, la búsqueda y el mensaje porque afectan a todo el listado. Cada `TarjetaReserva` llama a `useToggle` y recibe su propio `useState`, así que abrir una tarjeta no cambia las demás. Los resultados filtrados, el contador y la visibilidad del botón Limpiar se calculan, no se guardan como estado. `useId` genera identificadores de accesibilidad, no las claves de la lista ni los identificadores de las reservas. |
| Retroalimentación docente | Pendiente de la revisión de la entrega. |
| Mejora acordada | Integrar la API de reservas y validar también en el servicio en la siguiente clase; agregar una captura móvil de la vista Reservas. |

## 9. Aprendizajes

- **Concepto comprendido:** un campo controlado se define por el estado; la vista no debe guardar resultados que puede calcular. `useId` resuelve las relaciones de accesibilidad y un Hook personalizado reúne lógica reutilizable sin compartir estado.
- **Algo que aún genera duda:** cómo manejar los errores que devuelve la API y cómo conservar las reservas entre sesiones sin duplicar la validación del formulario.
- **Qué haríamos diferente:** definir primero las reglas del dominio y los casos de prueba antes de escribir la interfaz, para evitar mover el laboratorio de una vista a otra.

## 10. Revisión antes de entregar

- [x] Todos los integrantes registraron un aporte verificable.
- [x] Los enlaces y rutas de evidencia funcionan.
- [x] Los criterios de aceptación están actualizados.
- [x] El uso de IA fue declarado y verificado.
- [x] El equipo puede explicar las decisiones registradas.
- [x] `npm run build` compila sin errores (31 módulos) con `desktop.ini` fuera de `public/`.
- [x] El commit está publicado en GitHub con su enlace en la sección de evidencias.

