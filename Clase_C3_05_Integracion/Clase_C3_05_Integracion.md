---
tipo: bitacora-clase
curso: Desarrollo Web
periodo: EAM-2026II
equipo: GastroLocal
corte: 3
clase: 5
fecha: 2026-11-22
estado: en-progreso
tags:
  - desarrollo-web
  - bitacora
---

# Bitácora · Clase 05 de integración

## 1. Datos de la sesión

| Campo | Registro |
|---|---|
| Tema | Navegación e integración final en React. |
| Objetivo | Aplicar rutas y sesión compartida al CRUD de reservas, comprobar el recorrido y preparar la publicación. |
| Proyecto | GastroLocal. |
| Inicio y cierre de la clase | Horarios por registrar. |

## 2. Participación y responsabilidades

| Integrante | Asistió | Rol de la clase | Responsabilidad asumida | Aporte verificable |
|---|:---:|---|---|---|
| Juan David Valencia Ospina | Por confirmar | Por registrar | En la clase 04 implementó la conexión y el CRUD que usa esta entrega. | [Participación en la clase 04](../Clase_C3_04_APIs_CRUD/Clase_C3_04_APIs_CRUD.md#2-participación-y-responsabilidades) |
| María José Ospina | Por confirmar | Por registrar | En la clase 04 preparó pruebas, revisó las políticas RLS y organizó la bitácora. | [Participación en la clase 04](../Clase_C3_04_APIs_CRUD/Clase_C3_04_APIs_CRUD.md#2-participación-y-responsabilidades) |

Queda pendiente confirmar los aportes individuales de la clase 05 antes de la sustentación.

## 3. Reto aplicado al proyecto

### Funcionalidad trabajada

GastroLocal usa React Router para separar Inicio, Populares, Acceso, Mis reservas y Detalle de reserva. La sesión de Google se comparte en Context. El CRUD de la clase 04 mantiene la validación del formulario, el filtro remoto, la búsqueda local y la lectura después de cada escritura.

### Criterios de aceptación

- [x] Inicio, Populares y Acceso son públicos. El listado y el detalle pasan por `RutaPrivada`.
- [x] La tarjeta enlaza a `/reservas/:id`. El detalle consulta por ID y propietario y distingue carga, ID inválido, reserva no disponible y error con reintento.
- [x] El encabezado marca la ruta activa con subrayado y conserva el foco visible. El menú compacto se guarda en este navegador.
- [x] React Bootstrap muestra una alerta si falla la consulta. Inicio incorpora geolocalización voluntaria y selección manual.
- [x] Las dos pruebas unitarias de la regla del ID pasaron.
- [x] El recorrido de integración local pasó con una API simulada y dos cuentas ficticias.
- [ ] Verificar en el dominio público el acceso con Google, la recarga directa, el CRUD y la separación entre cuentas de prueba.

### Archivos o componentes modificados

- [Punto de entrada y rutas](proyecto-react/src/App.jsx). Se reemplazó la selección por hash y se protegieron las rutas de reservas.
- [Proveedor de autenticación](proyecto-react/src/context/AuthProvider.jsx). Escucha la sesión del cliente compartido y mantiene Google con PKCE y cierre local.
- [CSS Module de la cabecera](proyecto-react/src/components/Header.module.css). El estado activo incluye el detalle y el modo compacto se guarda por origen.
- [Servicio de reservas](proyecto-react/src/services/reservas.js) y [detalle](proyecto-react/src/views/DetalleReserva.jsx). El ID viaja como texto y se cancela la consulta al cambiar de fila o cuenta.
- [Ubicación](proyecto-react/src/components/Ubicacion.jsx). El navegador pide permiso al pulsar el botón. Las coordenadas aproximadas se muestran durante la visita y se puede elegir una zona manualmente.
- [Prueba del ID](proyecto-react/src/services/idReserva.test.js). Verifica claves positivas `bigint` de PostgreSQL.
- [Configuración de Vercel](proyecto-react/vercel.json) y [README principal](../README.md). Documentan la ejecución y la publicación.

## 4. Decisiones técnicas

| Decisión | Razón | Alternativa descartada |
|---|---|---|
| Usar `BrowserRouter` y un marco compartido | El detalle se puede enlazar, recargar y recorrer con el historial. | Mantener la selección de vista por hash y estado de React. |
| Conservar un único cliente de Supabase con PKCE | La restauración y el cierre de sesión llegan al mismo proveedor. La API aplica las políticas RLS sobre las filas. | Mantener una suscripción de autenticación por página. |
| Pedir a la API el ID de reserva como texto | Un `bigint` puede superar el entero seguro de JavaScript. El enlace conserva el identificador completo. | Convertir el parámetro de la ruta con `Number`. |
| Guardar el menú compacto como preferencia del navegador | El valor puede persistir al salir. El panel privado se desmonta al cerrar sesión y se reinicia con la nueva cuenta. | Guardar datos del formulario junto a la preferencia. |
| Aplicar geolocalización como referencia | La cercanía es pertinente para una app de restaurantes. La confirmación del docente queda por registrar. | Calcular distancias sin coordenadas verificadas del catálogo. |

## 5. Problemas y soluciones

| Problema encontrado | Causa identificada | Solución aplicada | ¿Cómo se verificó? |
|---|---|---|---|
| El detalle de una reserva carecía de una URL propia | La vista se elegía con un hash y la tarjeta mostraba detalles desplegables. | Ruta con el ID de la fila y lectura independiente del listado. | Pruebas unitarias de la regla del ID. |
| La sesión se manejaba dentro de la vista del CRUD | El encabezado y las demás vistas carecían de un estado compartido. | Un proveedor de Context refleja los eventos del SDK. | El guardián espera la restauración y redirige si la sesión es nula. |
| La aplicación quedaba en blanco con `npm run dev` | La ruta temporal de esta máquina contenía `#`. La URL de dependencias optimizadas se cortaba. | Vite usa su caché predeterminada cuando la ruta temporal contiene `#` o `?`. | El portal de acceso y el panel abrieron con `npm run dev`. |
| El acceso real quedó detenido al contactar Supabase | El navegador recibió `ERR_NAME_NOT_RESOLVED` al abrir el servidor de autenticación configurado. | Queda pendiente verificar el proyecto de Supabase y agregar el retorno exacto del dominio publicado. | Se ejecutó el flujo PKCE con una API local simulada. |

## 6. Evidencias

| Tipo | Descripción | Enlace o ruta |
|---|---|---|
| Historial remoto | Último commit visible en `main` al comprobar la publicación. | [`dde9a75`](https://github.com/JuanDavidValencia/gastrolocal-react/commit/dde9a75e3c8ca3a0cf20144d24a7f3098c981017) |
| Commit base | Clases del equipo antes de cambiar el punto de entrada de la 05. | `49f6c24` |
| Commit de integración | Implementación de las rutas, sesión, detalle y pruebas de reservas. | `50b78cb` en el historial local. |
| Repositorio | Historial de GastroLocal. | [GitHub](https://github.com/JuanDavidValencia/gastrolocal-react) |
| Pruebas | Instalación reproducible, compilación, dos pruebas de ID y recorrido local. | [Resultados de verificación](evidencias/verificacion-local.md) |
| Captura | Detalle recargado con sesión ficticia e ID mayor que el entero seguro de JavaScript. | [Detalle de reserva](evidencias/detalle-recargado.jpg) |
| Captura | Alerta visual ante la interrupción de la API local. | [Alerta de consulta](evidencias/alerta-de-consulta.jpg) |
| Captura | Inicio a 390 px con el modo compacto y la selección de zona. | [Inicio en móvil](evidencias/inicio-movil.jpg) |
| Demo | URL pública y recorrido con Supabase real. | Pendiente de publicación y verificación. |

El `push` quedó pendiente porque esta sesión no pudo autenticar la escritura en GitHub. El despliegue requiere acceso al alojamiento y un proyecto de Supabase que responda. Falta agregar y verificar el retorno HTTPS a `/acceso`.

## 7. Uso de inteligencia artificial

## 8. Defensa técnica y retroalimentación

| Campo | Registro |
|---|---|
| Integrante que defendió | Pendiente de sustentación. |
| Pregunta técnica para preparar | ¿Cómo selecciona la URL la reserva y quién controla el acceso a la fila? |
| Respuesta resumida | `useParams` lee el ID. El guardián controla el acceso a la vista según la sesión. Supabase aplica la política por propietario de la fila. |
| Retroalimentación docente | Por registrar. |
| Mejora acordada | Por registrar después de la revisión. |

## 9. Aprendizajes

- La URL define la vista y la fila. El servicio valida el permiso sobre los datos.
- El detalle recupera sus datos directamente de la API y puede abrirse sin haber cargado el listado.
- Las preferencias del dispositivo y los borradores de una cuenta tienen ciclos de vida diferentes.

## 10. Revisión antes de entregar

- [ ] Aportes de los integrantes confirmados y asociados a evidencias.
- [ ] Enlace público y commit remoto verificados.
- [x] Criterios de aceptación y decisiones de integración registrados.
- [ ] Recorrido del CRUD y prueba con dos cuentas ejecutados en producción.
