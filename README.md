# Oral Group Pro · Gestor de Citas Odontológicas

Proyecto integrador del programa de **Desarrollo de Software** · CESDE.

- Integrantes: Nelson Andrés Cadena Orozco, Melisa Agudelo Álvarez, Sebastián Correa Valencia
- Docente: Jaime Zapata

## Descripción

Sitio web de agendamiento de citas para una clínica odontológica. Siete módulos:
Inicio, Navegación, Especialidades, Equipo Odontológico, Agendamiento, Testimonios y Contacto.
No tiene backend ni base de datos: los datos son de ejemplo y las citas no se guardan.

## Estructura

```
index.html · especialidades.html · equipo.html · agendamiento.html · testimonios.html · contacto.html
img/                    fotos del sitio (una sola carpeta; logo.png en el inicio)
css/styles.css          hoja de estilos única
js/data.js              contenido del sitio (fuente única de datos)
js/ui.js                menú, pie de página, iconos y utilidades
js/render.js            pinta las listas a partir de data.js
js/booking.js           agendamiento: calendario, horarios, validaciones y comprobante
consola/agendar-citas.js  programa de citas por consola (independiente de la página)
```

## Cómo ejecutarlo

**Sitio web** — abrirlo con un servidor local (no con doble clic):

```bash
python -m http.server 8080
```

y entrar a `http://localhost:8080/index.html`.

**Programa de consola** (Node.js):

```bash
node consola/agendar-citas.js
```

## Cómo se construyó (control de versiones)

El proyecto se desarrolló por etapas, cada una en su propia rama unida a `main`:

| Etapa | Rama | Qué incluye |
|---|---|---|
| 1 | `feature/html-basico` | Estructura HTML semántica de las 6 páginas |
| 2 | `feature/contenido` | Textos y contenido de cada sección |
| 3 | `feature/css` | Estilos: paleta, tipografía, componentes y diseño responsive |
| 4 | `feature/js` | Integración de JavaScript: contenido desde `data.js`, menú único, agendamiento con validaciones |
| 5 | `feature/consola-citas` | Programa de citas por consola con `Scanner` y ciclos anidados |

Etiquetas del sitio: `v0.1.0` (maqueta HTML + CSS), `v1.0.0` (con JavaScript) y `v1.1.0` (con programa de consola).

**Una versión por página:** cada página tiene su propio commit en cada etapa (nunca dos páginas juntas) y una
etiqueta con la versión en que quedó lista con JavaScript: `index-v1.0.0`, `especialidades-v1.0.0`,
`equipo-v1.0.0`, `agendamiento-v1.0.0`, `testimonios-v1.0.0` y `contacto-v1.0.0`.

```bash
git log --oneline -- equipo.html      # historia de una sola página
git show equipo-v1.0.0:equipo.html    # cómo era esa página en su versión 1.0.0
```

```bash
git log --oneline --graph --decorate
```

## Documentos

- `Informe_Requisitos_Plantilla.docx` — requisitos funcionales, no funcionales e historias de usuario
- `Backlog_del_Producto.xlsx` — backlog del producto
- `CLAUDE.md` — reglas técnicas, de diseño y de layout del proyecto
