# Migración completa de pestañas · 25 de noviembre de 2026

Referencia: `Clase_C3_01_React_Vite_JSX/Pagina/` en el repositorio de seguimientos. Se revisaron los HTML, los estilos y los módulos de API, restaurantes, favoritos y perfil. Se mantuvo la identidad cálida de GastroLocal: crema, naranja y verde oscuro, fotografías de comida y tarjetas. La cabecera, los formularios y las pantallas comparten un diseño adaptado a móvil y escritorio.

| Pestaña | Versión React | Funciones |
|---|---|---|
| Inicio | `/` | Búsqueda por nombre, descripción o tipo de cocina, recomendaciones reales y acceso al catálogo |
| Restaurantes | `/restaurantes` | Catálogo Supabase, búsqueda, filtro por categoría, estado vacío y reintento |
| Populares | `/populares` | Selección editorial de restaurantes del catálogo real con búsqueda y filtros |
| Favoritos | `/favoritos` | Lista por cuenta; guardar y quitar restaurantes mediante Supabase; mensajes de error |
| Recientes | `/recientes` | Registra detalles abiertos, evita duplicados, ordena por última visita y permite limpiar |
| Reservas | `/reservas` y `/reservas/:id` | Conserva CRUD y detalle; recibe restaurante seleccionado desde su ficha |
| Vista | `/vista` y `/restaurantes/:id` | Selector, imagen, descripción, categoría, favoritos, reserva y sugerencias relacionadas |
| Perfil | `/perfil` | Lectura y guardado del perfil; actualización independiente de foto; opción de usar foto de Google |
| Acceso | `/acceso` | Google PKCE; conserva la ruta privada de destino y la selección del restaurante |

Las páginas antiguas Recientes y Vista eran estáticas. Ahora usan la navegación real: no se inventa un menú ni una compra de platos. El sitio administra reservas, no órdenes de entrega. El historial de consulta guarda únicamente identificadores públicos de restaurantes en sessionStorage durante la visita; los favoritos y perfiles se guardan en Supabase y requieren sesión. RLS sigue siendo responsable de proteger esas tablas en el servidor.

La preferencia del menú compacto permanece en localStorage. En móvil se usa un menú desplegable. El catálogo se consulta una vez por carga y se comparte mediante Context. Los proveedores de favoritos se reinician al cambiar de cuenta. Las peticiones de lectura se cancelan al desmontar y se separan de las escrituras. Se admiten las rutas antiguas principales mediante redirecciones React.

## Validación

- `npm test`: dos pruebas aprobadas.
- `npm run build`: correcto; pantallas separadas en bloques de carga por demanda, sin la advertencia inicial de bloque superior a 500 kB.
- Navegador con Supabase real: catálogo de 22 restaurantes, filtro italiano (4), filtro mexicano (3), búsqueda sin resultados y limpieza de filtros.
- Detalle de Rusticana, historial después de abrir detalles, limpieza del historial y selector Vista comprobados.
- La reserva desde Texas Burguer sin sesión dirige a Acceso y conserva `restaurante=4` en el destino.
- Revisión visual en escritorio de 1440 px y móvil de 390 px. Inicio y catálogo móvil no desbordan el ancho de la página.
- Las escrituras reales de favoritos, perfil y reservas y los permisos entre dos cuentas siguen pendientes de completar el inicio de sesión. No se presentan como pruebas superadas.

Los HTML históricos no se publican dentro de la carpeta `public` de entrega; siguen intactos en sus carpetas originales.