---
tipo: bitacora-clase
curso: Desarrollo Web
periodo: EAM-2026II
equipo: Equipo_XX
corte: 1
semana:
clase:
fecha: AAAA-MM-DD
estado: en-progreso
tags:
  - desarrollo-web
  - bitacora
---

# Bitácora — Clase [número]

> [!tip] Cómo usar esta plantilla
> Duplica esta nota al finalizar cada clase y nómbrala `C3_02_Guia_Componentes_Props`. Completa los campos entre corchetes y conserva enlaces verificables.

## 1. Datos de la sesión

| Campo    | Registro                                       |
| -------- | ---------------------------------------------- |
| Tema     | React + Vite                                   |
| Objetivo | Implementar una interfaz del proyecto en react |
| Proyecto | GastroLocal                                    |
| Inicio   | [Hora]                                         |
| Cierre   | [Hora]                                         |

## 2. Participación y responsabilidades

| Integrante          | Asistió | Rol de la clase | Responsabilidad asumida       | Aporte verificable            |
| ------------------- | :-----: | --------------- | ----------------------------- | ----------------------------- |
| Juan David Valencia |   Sí    | Lider           | Creación de código y obsidian | [Commit, archivo o evidencia] |
| Maria Jose Ospina   |   Sí    | Miembro         | Creación de código y obsidian | [Commit, archivo o evidencia] |

## 3. Reto aplicado al proyecto

### Funcionalidad trabajada

	Se implemento lo desarrollado en la guia, es decir una interfaz con sus modulos separados en el lenguaje de Programacion React junto con vite; la implementacion se realizo en la pestaña de favoritos, tomando en cuenta lo solicitado y corrigiendo errores pasados en el proyecto.
### Criterios de aceptación

- [x] Implementación de componentes (mínimo 3).
- [x] Preparen el entorno y conserven la versión del segundo corte.
- [x] Reutilicen una tarjeta con tres registros recibidos mediante props.
- [x] Compongan la sección, adapten los estilos y comprueben dos anchos.

### Archivos o componentes modificados

- `[ruta/al/archivo]`: [cambio realizado]
- `[ruta/al/archivo]`: [cambio realizado]

## 4. Decisiones técnicas

| Decisión                                                                                                              | Razón                                                                                                                  | Alternativa descartada                                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Se crearon los siguientes componentes, bannerBuscador, FiltroCategorias, Header, ListaRestaurante, TarjetaRestaurante | Al seguir la idea del proyecto anterior nos dimos cuenta que estos, son componentes mas usados en todas las interfaces | La implementación de únicamente 3 módulos, donde existirían estos diferentes componentes pero se descarto ya que aunque sean usados en múltiples paginas en algunas no se llega a ver uso de algunos |

## 5. Problemas y soluciones

| Problema encontrado                                                                                          | Causa identificada                                                    | Solución aplicada                                                                                                                  | ¿Cómo se verificó?                   |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| En el prototipo anterio fallaba el diseño de intefaz en telefono amontonando los iconos de la parte superior | Fue debido a una mala decisión en el diseño priorizando la vita en PC | Se organizaron de manera correcta, haciendo que al momento de usar la vista para teléfono este no se vea de manera tan desordenada | ![[Pasted image 20261104224303.png]] |

## 6. Evidencias

| Tipo    | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Enlace o ruta   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Commit  | La migración de html+Js+Css a react+ vite                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | [URL o hash]    |
| Captura | ![[Pasted image 20261104224337.png\|193]]![[Pasted image 20261104224400.png\|185]]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | [Ruta relativa] |
| Demo    | Banner                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | [URL]           |
| Código  | export default function BannerBuscador({ valor, onCambio }) {<br><br>  return (<br><br>    <section id="banner-inicio" aria-labelledby="titulo-populares"><br><br>      <p className="banner-etiqueta">Sección migrada a componentes</p><br><br>      <h1 id="titulo-populares">Los favoritos de la comunidad</h1><br><br>      <p className="banner-texto"><br><br>        Busca por nombre o descripción y descubre qué están pidiendo los demás.<br><br>      </p><br><br>  <br><br>      <label className="sr-only" htmlFor="buscador"><br><br>        Buscar restaurante<br><br>      </label><br><br>      <input<br><br>        id="buscador"<br><br>        type="search"<br><br>        placeholder="Buscar restaurante..."<br><br>        value={valor}<br><br>        onChange={(evento) => onCambio(evento.target.value)}<br><br>        autoComplete="off"<br><br>      /><br><br>    </section><br><br>  );<br><br>} | [Ruta y líneas] |

## 7. Uso de inteligencia artificial

> [!important] Registrar la IA no reemplaza la explicación técnica. El equipo debe verificar, adaptar y comprender cualquier resultado utilizado.

| Herramienta   | Objetivo o pregunta                      | Qué se utilizó                                                                                                                         | Cómo se verificó  | Qué se modificó                                                                                                     |
| ------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Herramienta] | Explicaciones sobre el uso de react+vite | Se tomaron múltiples explicaciones de la aplicación para realizar la interfaz además de partes de código para la corrección de errores | [Prueba o fuente] | Se modifico de manera que el modelo encajara con lo buscado es decir funcionara con el diseño de nuestra pagina web |

Si no se utilizó IA, escribir: **No se utilizó inteligencia artificial en esta sesión.**

## 8. Defensa técnica y retroalimentación

| Campo                     | Registro          |
| ------------------------- | ----------------- |
| Integrante que defendió   | [Nombre]          |
| Pregunta recibida         | [Pregunta]        |
| Respuesta resumida        | [Respuesta]       |
| Retroalimentación docente | [Observación]     |
| Mejora acordada           | [Acción concreta] |

## 9. Aprendizajes

- **Concepto comprendido:** [Aprendizaje principal]
- **Algo que aún genera duda:** [Duda pendiente]
- **Qué haríamos diferente:** [Mejora del proceso]

## 10. Revisión antes de entregar

- [x] Todos los integrantes registraron un aporte verificable.
- [x] Los enlaces y rutas de evidencia funcionan.
- [x] Los criterios de aceptación están actualizados.
- [x] El uso de IA fue declarado y verificado.
- [x] El equipo puede explicar las decisiones registradas.

