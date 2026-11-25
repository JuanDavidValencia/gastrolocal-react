# Publicación de GastroLocal

1. Desde `entrega/`, ejecutar `npm ci`, `npm test`, `npm run build` y `npm run preview`.
2. Importar el repositorio React en Vercel. Root Directory: `entrega`; framework: Vite; comando: `npm run build`; directorio de salida: `dist`.
3. Agregar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` (o `VITE_SUPABASE_ANON_KEY`). Volver a desplegar después de cambiar variables.
4. En el proyecto Supabase existente, comprobar que esté activo y habilitar Google en Authentication. Configurar el proveedor con los datos del proyecto original sin trasladar sus secretos al frontend.
5. En Authentication → URL Configuration, establecer el dominio de producción y autorizar la dirección exacta `https://DOMINIO/acceso`; conservar el retorno de desarrollo `http://localhost:5173/acceso`. Si se usa preview con autenticación, autorizar también `http://localhost:4173/acceso`.
6. Comprobar la política RLS de la tabla existente `reservas`. No crear otra base. [auditoria-rls.sql](supabase/auditoria-rls.sql) permite inspeccionar la configuración sin modificar datos. Las políticas deben cubrir SELECT, INSERT, UPDATE y DELETE por `auth.uid() = usuario_id`; UPDATE e INSERT deben impedir asignar la fila a otra cuenta. Revisar también políticas permisivas adicionales.
7. Ejecutar el [recorrido](verificacion.md) desde una ventana privada y una segunda cuenta. La prueba de permisos debe incluir peticiones directas con la identidad de la segunda cuenta, porque el filtro del frontend por sí solo no demuestra RLS.
8. Registrar el dominio estable en README, el commit final y las evidencias reales en la bitácora. Entregar juntos proyecto, integrantes, repositorio, commit, producción y bitácora.

Si el alojamiento no importa el repositorio privado de una organización, la guía permite Cloudflare Pages con autorización de la organización: raíz `entrega`, salida `dist` y mismas variables. Autorizar el nuevo retorno en Supabase.

Estado: instrucciones preparadas; publicación y configuración externa pendientes de acceso y datos del equipo.