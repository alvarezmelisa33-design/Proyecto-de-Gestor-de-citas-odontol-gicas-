# Proyecto Integrador CESDE — Gestor de Citas Odontológicas (Oral Group Pro)

## Estado

Fase 2: sitio completo con HTML + CSS + JavaScript (vanilla, sin librerías ni build). La fase 1
(maqueta solo HTML/CSS) quedó superada. Documentos de referencia en esta carpeta:
`Informe_Requisitos_Plantilla.docx` (35 RF, 6 RNF, 35 HU) y `Backlog_del_Producto.xlsx` (9 HU).
Los IDs de historias NO coinciden entre ambos documentos — pendiente definir cuál es el oficial.

## Reglas técnicas

- HTML semántico, CSS moderno (variables, Grid, flex, media queries) y JS vanilla (ES5 compatible, en IIFE).
- Sin frameworks ni librerías. Único recurso externo permitido: Google Fonts (CESDE lo permite si se
  carga bien: `preconnect`, `display=swap`, solo pesos usados, un único `<link>` por página).
- Rutas siempre **relativas** (el sitio vive en una subcarpeta de Hostinger: `kdnastudio.com/Proyecto-integrador/`).
- Sin backend: todo es dato simulado en `js/data.js`, sin persistencia (RNF-05).
- Contenido dinámico: usar `textContent` o `U.esc()` — nunca insertar texto del usuario con `innerHTML` sin escapar.

## Diseño

- **Paleta (PROVISIONAL):** Azul marino `#1A365D` (estructura/texto), Lila `#805AD5` (botones/acentos),
  Azul clínico claro `#EAF3FB` (fondos; antes lila pastel `#F3E8FF`), Blanco `#FFFFFF`. Lila oscuro `#6B46C1`
  solo para texto/enlaces (contraste AA). **Pendiente:** el proyecto original de Melisa (`index (2).html`) usaba
  "azul médico" y su CSS (`src/css/style.css`) no se tiene; los colores deben respetar ese CSS en cuanto
  se reciba. Todos los colores están como variables en `:root` de `css/styles.css` (sección 1), así que
  el cambio se hace en un solo lugar.
- **Tipografía:** títulos Albert Sans 700, cuerpo Plus Jakarta Sans (400–700).
- **Imágenes:** marcador con icono de montaña. Para poner una real: rellenar `image` en `js/data.js`
  (especialidades/profesionales) o `data-src` en los `data-media` de los HTML.

## Estructura

```
index.html · especialidades.html · equipo.html · agendamiento.html · testimonios.html · contacto.html
css/styles.css        única hoja de estilos (índice numerado al inicio)
js/data.js            ÚNICA fuente de datos (clínica, especialidades, equipo, testimonios, festivos, reglas de documento)
js/ui.js              menú único + pie + iconos + utilidades (se carga en todas las páginas)
js/render.js          pinta listas en contenedores [data-render="..."]
js/booking.js         agendamiento: calendario, horarios, validaciones, comprobante
consola/agendar-citas.js   programa de citas por consola (independiente de la página)
```

Cada página activa su opción de menú con `<body data-page="...">`. Preselección desde otras páginas:
`agendamiento.html?esp=<id>` y `?prof=<id>`.

## Reglas de cajas (layout) — no romper

- Todas las rejillas usan `minmax(0, 1fr)`, nunca `1fr` a secas (si no, el contenido ensancha la columna y desborda a 320 px).
- Tarjetas hermanas deben medir lo mismo: `.card` es flex en columna, el texto largo lleva `flex: 1` y el botón queda abajo.
- Si un grupo impar (3 tarjetas) cae en 2 columnas, la última ocupa toda la fila (`.grid-3 > :last-child:nth-child(odd)`).
- Horarios: siempre 4 por fila o 2×2 en móvil (los grupos son de 4, nunca 3).
- Zonas táctiles ≥ 36–44 px en móvil. Tarjetas del equipo compactas (foto 150 px, bio a 3 líneas).
- Verificado con auditoría automática: 6 páginas × 9 anchos (1440→320 px), 0 desbordes/huérfanas/recortes.
- El equipo incluye 2 profesionales de ejemplo (Restrepo, Mejía) para completar 6 = 3 columnas × 2 filas.

## Tiempo real en Agendamiento

Usa el reloj del dispositivo (`Date`): marca hoy, bloquea días y horas pasadas, exige 1 h de anticipación,
no ofrece domingos, y los sábados solo turno de mañana. Los festivos de Colombia se CALCULAN para cualquier
año (Ley Emiliani + Semana Santa, en `booking.js`); cierres extra de la clínica van en `closedDates` de `data.js`.
La ocupación de horarios es simulada (determinista, ~20 %). Las reservas no se guardan.

## Testimonios

Inicio: tarjetas cortas (campo `text`). Página Testimonios: historias completas (`story`, `treatment`, `duration`,
`result`) con espacios Antes/Después (`beforeAfter`, `before`, `after`, `photo`). Usar fotos reales solo con
consentimiento escrito del paciente.

## Validaciones del formulario (js/booking.js)

Documento por tipo (CC 6–10, TI 10–11, CE 6–7 dígitos; PA 6–12 alfanumérico; reglas en `data.js`),
nombre (≥2 palabras, solo letras), celular colombiano (10 dígitos, empieza por 3; admite +57),
motivo (10–250 caracteres) y consentimiento de datos. Se limpia mientras se escribe y se valida en `blur` y al enviar.

## Control de versiones (git)

Simula un trabajo hecho a mano, por etapas, cada una en su rama unida a `main` con `--no-ff`:
`feature/html-basico` → `feature/contenido` → `feature/css` → `feature/js` → `feature/consola-citas`.
Etiquetas: `v0.1.0` (maqueta HTML+CSS), `v1.0.0` (con JS), `v1.1.0` (con consola) y una por página
(`index-v1.0.0`, `especialidades-v1.0.0`, `equipo-v1.0.0`, `agendamiento-v1.0.0`, `testimonios-v1.0.0`,
`contacto-v1.0.0`). **Una versión por página:** cada página va en su propio commit, nunca dos juntas
(`git log --oneline -- equipo.html` muestra la historia de una sola página). Commits pequeños con
mensajes tipo `feat(html):`, `style:`, `feat(js):`, `docs:`. Cambios nuevos: rama `feature/...` o `fix/...`,
commit y merge; no commitear directo a `main` salvo documentación. `.claude/` está en `.gitignore`.

## Programa de consola (`consola/agendar-citas.js`)

Parte de citas, INDEPENDIENTE de la página (no se enlaza desde el HTML). Estilo de los ejercicios de clase:
lectura con "Scanner" (readline), menú `do...while`, validaciones con `while` y **ciclos anidados**
(calendario semanas × días; tabla horas × próximos 7 días; turnos × horas). Ejecutar: `node consola/agendar-citas.js`.
Usa fecha y hora reales, festivos 2026–2027 en un arreglo y las mismas reglas de validación que la página.

## Despliegue (Hostinger)

Subir TODO: los 6 `.html` y las carpetas `css/` y `js/` completas (si falta una carpeta, la página se ve
sin estilos o sin funciones). Probar en local con un servidor (`python -m http.server`), no con doble clic:
algunas vistas previas de archivos no ejecutan JS.

## Gestión de contexto

Este archivo es la memoria del proyecto. Actualizarlo al cerrar cada tarea. El `CLAUDE.md` de
`Downloads/` define el patrón orquestador (no activado en este repo: no existe `.claude/agents/orquestador.md`).
