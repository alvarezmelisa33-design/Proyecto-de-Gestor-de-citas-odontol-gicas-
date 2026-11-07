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

rl.on('line', function (linea) {
  if (quienEspera !== null) {
    const entregar = quienEspera;
    quienEspera = null;
    entregar(linea);
  } else {
    lineasPendientes.push(linea);
  }
});
rl.on('close', function () {
  if (quienEspera !== null) {
    quienEspera(null);
  }
});

function leer(pregunta) {
  process.stdout.write(pregunta);
  return new Promise(function (resolver) {
    if (lineasPendientes.length > 0) {
      resolver(lineasPendientes.shift());
    } else {
      quienEspera = resolver;
    }
  }).then(function (texto) {
    if (texto === null) {
      console.log('\nSe cerró la entrada. Hasta pronto.');
      process.exit(0);
    }
    return texto.trim();
  });
}
