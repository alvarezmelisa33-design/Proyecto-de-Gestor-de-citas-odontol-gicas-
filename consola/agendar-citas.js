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

/* ---------------------------------------------------------------------
   DATOS (arreglos paralelos: la posición i de cada arreglo es la misma
   especialidad / profesional)
   --------------------------------------------------------------------- */
const ESPECIALIDADES = ['Ortodoncia', 'Estética y Blanqueamiento', 'Rehabilitación Oral', 'Odontopediatría'];
const PROFESIONALES = ['Dr. Alejandro Valencia', 'Dra. Paula Ibañez', 'Dra. Lina Salazar', 'Dra. Natalia Carrillo'];

/* Días que atiende cada profesional (0 = domingo, 1 = lunes ... 6 = sábado) */
const DIAS_ATENCION = [
  [1, 2, 3, 4, 5],
  [2, 4, 6],
  [1, 3, 5],
  [1, 2, 3, 4, 5, 6]
];

const HORAS_MANANA = ['08:30', '09:15', '10:00', '11:30'];
const HORAS_TARDE = ['14:00', '15:15', '16:30', '17:45'];
