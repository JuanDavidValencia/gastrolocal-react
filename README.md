# GastroLocal · React

Aplicación de restaurantes desarrollada con React y Vite. Populares conserva la búsqueda y los filtros por categoría. Cada cuenta de Google puede crear, consultar, editar y eliminar sus reservas en Supabase. El listado y el detalle comparten la sesión.

## Contenido del repositorio

| Clase | Contenido |
|---|---|
| [02 · Componentes y props](Clase_C3_02_Guia_Componentes_Props/) | Catálogo Populares con tarjetas reutilizables. |
| [03 · Interacción y formularios](Clase_C3_03_Interaccion_Formularios/) | Formulario controlado y reservas en memoria. |
| [04 · API y CRUD](Clase_C3_04_APIs_CRUD/) | Google y reservas conectadas a Supabase. |
| [05 · Integración final](Clase_C3_05_Integracion/) | Rutas, sesión compartida, detalle de reservas y pruebas. |

Para la entrega final, ejecuta los comandos de npm desde [`Clase_C3_05_Integracion/proyecto-react`](Clase_C3_05_Integracion/proyecto-react/).

## Inicio local

Requiere Node.js 22.12 o superior y npm. La aplicación usa React 19, Vite 8, React Router 7 y Supabase JS 2.

```bash
git clone https://github.com/JuanDavidValencia/gastrolocal-react.git
cd gastrolocal-react/Clase_C3_05_Integracion/proyecto-react
npm ci
```

Copia `.env.example` a `.env.local` y completa las variables del proyecto de Supabase.

```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_ANON_KEY=TU_CLAVE_PUBLISHABLE
```

Usa la clave pública `publishable` o `anon`. Mantén `.env.local`, las claves administrativas y las credenciales de prueba fuera del repositorio.

```bash
npm run dev
npm test
npm run build
npm run preview
```

Abre el origen que imprime Vite. Para probar el retorno de Google en desarrollo y en vista previa, autoriza en **Supabase → Authentication → URL Configuration → Redirect URLs** las URL exactas que uses, por ejemplo `http://localhost:5173/acceso` y `http://localhost:4173/acceso`. Usa el mismo origen durante todo el acceso.

La integración reutiliza Google, las tablas `reservas` y `restaurantes`, y las políticas de la clase 04. `reservas.usuario_id` corresponde a `auth.uid()`. La lectura del catálogo utiliza el acceso público del proyecto. [Contrato de datos y políticas de la clase 04](Clase_C3_04_APIs_CRUD/proyecto-react/README.md#políticas-rls)

## Rutas principales

| Ruta | Acceso | Vista |
|---|---|---|
| `/` | Público | Inicio y selección de zona. |
| `/populares` | Público | Catálogo, búsqueda y filtro. |
| `/acceso` | Público | Acceso con Google. Una sesión activa lleva al listado. |
| `/reservas` | Privado | Formulario, listado, filtros, edición y eliminación. |
| `/reservas/:id` | Privado | Detalle de una reserva. El ID de la fila llega como texto. |
| Dirección desconocida | Público | Página no encontrada con enlace a Inicio. |

La versión HTML del segundo corte está disponible en `/segundo-corte/index.html`.

## Despliegue

1. Importa `JuanDavidValencia/gastrolocal-react` en Vercel. Selecciona `Clase_C3_05_Integracion/proyecto-react` como **Root Directory**, Vite como preset, `npm run build` y `dist`.
2. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables del frontend. `vercel.json` envía las rutas internas a `index.html` para que React muestre la vista correspondiente.
3. Agrega `https://TU_DOMINIO/acceso` a las redirecciones permitidas en Supabase. Configura **Site URL** con el dominio principal si será el origen predeterminado del equipo.

Consulta el estado del enlace público en la [bitácora de integración](Clase_C3_05_Integracion/Clase_C3_05_Integracion.md#6-evidencias).

## Recorrido de verificación

1. Abre la aplicación en una ventana privada. Entra directamente a `/reservas/1` y comprueba que aparece `/acceso`.
2. Entra con una cuenta de Google de prueba. Intenta guardar el formulario incompleto. Después crea una reserva con un nombre y contacto ficticios y una fecha futura.
3. Abre **Ver detalle** desde la tarjeta. Comprueba el ID en la dirección, usa **Atrás**, abre el detalle otra vez y recarga esa ruta en una pestaña con sesión activa.
4. Edita la reserva y verifica el cambio tras recargar el detalle. Prueba `/reservas/01`, un ID válido sin fila visible y una consulta con la red desactivada. Al restablecer la red, usa **Reintentar**.
5. Activa **Menú compacto** y recarga. Cierra sesión desde un detalle. Inicia sesión con una segunda cuenta autorizada y abre la URL de la primera reserva. Comprueba que la fila y el borrador quedan fuera de la vista. Con la cuenta propietaria elimina el dato ficticio y verifica que el detalle queda indisponible.
6. En Inicio, elige una zona manualmente. Pulsa **Usar mi ubicación** y prueba el mensaje de permiso denegado. La zona manual sigue disponible.
7. Ejecuta `npm test` para verificar la regla de los identificadores positivos `bigint`.

Usa datos ficticios en las evidencias y oculta credenciales, correos reales y datos de terceros.

## Autores

- Juan David Valencia Ospina. [@JuanDavidValencia](https://github.com/JuanDavidValencia)
- María José Ospina.
