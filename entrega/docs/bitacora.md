# Bitácora principal · GastroLocal

## Proyecto y equipo

GastroLocal ayuda a explorar restaurantes y administrar reservas personales. Equipo: Juan David Valencia Ospina y María José Ospina. Versión final preparada en `entrega/`; repositorio React: https://github.com/JuanDavidValencia/gastrolocal-react.

## Historial y evidencias

- [Clase 02: componentes y props](../../Clase_C3_02_Guia_Componentes_Props/Clase_C3_02_Guia_Componentes_Props.md).
- [Clase 03: interacción y formularios](../../Clase_C3_03_Interaccion_Formularios/Clase_C3_03_Interaccion_Formularios.md).
- [Clase 04: APIs y CRUD](../../Clase_C3_04_APIs_CRUD/Clase_C3_04_APIs_CRUD.md).
- [Clase 05: integración](../../Clase_C3_05_Integracion/Clase_C3_05_Integracion.md).
- [Verificación local anterior](../../Clase_C3_05_Integracion/evidencias/verificacion-local.md): autenticación y CRUD con API simulada; no acredita permisos reales.
- [Captura anterior de detalle](../../Clase_C3_05_Integracion/evidencias/detalle-recargado.jpg).
- [Captura anterior móvil](../../Clase_C3_05_Integracion/evidencias/inicio-movil.jpg).
- Bitácoras de los cortes 1 y 2 y repositorio anterior: pendientes de enlace confirmado.

Estos enlaces son relativos a la carpeta `entrega/` dentro del repositorio actual. Si se exporta únicamente esta carpeta a otro repositorio, trasladar las bitácoras y evidencias y actualizar los enlaces antes de entregar.

## Migración y decisiones

Se reutiliza la integración de la clase 05: vistas React, componentes mediante props, formulario controlado, CRUD de `reservas`, filtro remoto, Context para sesión y React Router para listado y detalle privados. Las reservas, los favoritos, el perfil y el catálogo usan las tablas existentes de Supabase. Populares selecciona restaurantes reales. Los HTML históricos se conservan en sus carpetas originales y ya no se publican como parte de entrega.

`useReservas` encapsula lecturas y escrituras; los efectos cancelan consultas anteriores. El detalle usa el identificador real como texto para no perder precisión bigint. La cabecera usa CSS Modules, el detalle integra Alert de React Bootstrap, y el menú compacto guarda una preferencia no sensible en localStorage. La geolocalización es voluntaria; debe confirmarse la modalidad acordada con el docente.

## Correcciones para la entrega · 25 de noviembre de 2026

- Creada una carpeta independiente con el código fuente y lockfile, sin copiar dependencias ni configuración privada.
- Sustituido el README que apuntaba a un archivo inexistente por instrucciones completas de ejecución, datos, rutas, permisos y publicación.
- Añadida esta documentación principal y enlaces al historial existente.
- Preparados el recorrido de sustentación y una auditoría SQL de solo lectura para el proyecto real.
- Admitida la clave pública publishable y mantenida compatibilidad con anon.
- Reforzado `.gitignore` para excluir archivos de entorno salvo `.env.example`.
- Retiradas las entradas HTML históricas del menú React y mejorado el mensaje de permiso de reservas.
- Resultados de las comprobaciones de esta copia: consultar [verificacion-entrega.md](verificacion-entrega.md).

## Participación

| Integrante | Aporte | Estado |
|---|---|---|
| Juan David Valencia Ospina | Por confirmar con el integrante y vincular a commits/evidencias | Pendiente |
| María José Ospina | Por confirmar con la integrante y vincular a commits/evidencias | Pendiente |

No se atribuyen automáticamente a los integrantes los cambios preparados con IA ni se inventan asistencia u horarios.

## Uso de inteligencia artificial

| Herramienta | Objetivo | Aporte utilizado | Verificación y adaptación |
|---|---|---|---|
| Codex | Contrastar la guía con la clase 05 y preparar `entrega/` | Documentación de entrega, ajustes de navegación, configuración pública y exclusión de entornos | Lectura del código y ejecución de comprobaciones; resultados en verificacion-entrega.md. El equipo debe revisar y comprender los cambios antes de sustentar. |

## Problemas y trabajo pendiente

La clase 05 registra `ERR_NAME_NOT_RESOLVED` al contactar el Supabase configurado. La causa real sigue por comprobar; la simulación no resuelve la configuración externa.

- Confirmar Supabase activo, esquema y RLS con dos cuentas reales.
- Publicar y comprobar Google, CRUD y recarga directa en el dominio final.
- Incorporar la URL de producción y SHA de entrega en README y mensaje final de envío.
- Confirmar aportes y enlaces de los cortes anteriores.
- Registrar la localización acordada y la retroalimentación docente después de la sustentación.

## Migración del resto de pestañas

Se migraron Inicio, Restaurantes, Populares, Favoritos, Recientes, Vista y Perfil a React, con diseño común y navegación responsive. [Funciones y comprobaciones](migracion-pestanas.md). Se amplió el uso de IA registrado en esta bitácora a esa implementación; los aportes individuales del equipo siguen por confirmar.
