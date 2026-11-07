/* =====================================================================
   ORAL GROUP PRO · AGENDAMIENTO DE CITAS POR CONSOLA
   Programa independiente: NO está conectado a la página web.
   Mismo estilo de los ejercicios de clase: lectura con "Scanner",
   menús con do...while, validaciones con while y CICLOS ANIDADOS
   (calendario de semanas x días, y tablas de horas x días).

   Cómo ejecutarlo (necesita Node.js):
       node consola/agendar-citas.js
   ===================================================================== */

const readline = require('readline');

/* ---------------------------------------------------------------------
   "SCANNER": lee lo que el usuario escribe en la consola.
   En Java sería  Scanner sc = new Scanner(System.in);  sc.nextLine();
   Aquí leer("pregunta") hace lo mismo, y "await" espera la respuesta.
   --------------------------------------------------------------------- */
const rl = readline.createInterface({ input: process.stdin });
const lineasPendientes = [];
let quienEspera = null;
