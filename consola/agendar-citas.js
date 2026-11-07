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

const DIAS_SEMANA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/* Festivos de Colombia (la clínica no atiende). Formato AAAA-MM-DD */
const FESTIVOS = [
  '2026-11-02', '2026-11-16', '2026-12-08', '2026-12-25',
  '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01',
  '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-20', '2027-08-07',
  '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25'
];

/* Tipos de documento y su longitud permitida (misma regla que la página) */
const TIPOS_DOC = ['CC - Cédula de ciudadanía', 'TI - Tarjeta de identidad', 'CE - Cédula de extranjería', 'PA - Pasaporte'];
const SIGLAS_DOC = ['CC', 'TI', 'CE', 'PA'];
const DOC_MIN = [6, 10, 6, 6];
const DOC_MAX = [10, 11, 7, 12];

const LETRAS = 'abcdefghijklmnopqrstuvwxyzáéíóúüñABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÜÑ';
const DIGITOS = '0123456789';
