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

/* Aquí se guardan las citas de esta ejecución (no hay base de datos) */
const citasAgendadas = [];

/* ---------------------------------------------------------------------
   FUNCIONES AUXILIARES
   --------------------------------------------------------------------- */
function dosDigitos(n) {
  return n < 10 ? '0' + n : String(n);
}

function formatoFecha(fecha) {
  return fecha.getFullYear() + '-' + dosDigitos(fecha.getMonth() + 1) + '-' + dosDigitos(fecha.getDate());
}

function fechaLarga(fecha) {
  return DIAS_SEMANA[fecha.getDay()] + ' ' + fecha.getDate() + ' de ' + MESES[fecha.getMonth()] + ' de ' + fecha.getFullYear();
}

/* Devuelve true si TODOS los caracteres del texto están en "permitidos" */
function soloCaracteres(texto, permitidos) {
  for (let i = 0; i < texto.length; i++) {
    if (!permitidos.includes(texto.charAt(i))) {
      return false;
    }
  }
  return true;
}

function todosIguales(texto) {
  for (let i = 1; i < texto.length; i++) {
    if (texto.charAt(i) !== texto.charAt(0)) {
      return false;
    }
  }
  return true;
}

/* Lee un entero entre min y max; repite la pregunta hasta que sea válido */
async function leerEntero(pregunta, min, max) {
  while (true) {
    const texto = await leer(pregunta);
    const numero = Number(texto);
    if (texto !== '' && Number.isInteger(numero) && numero >= min && numero <= max) {
      return numero;
    }
    console.log('  ✗ Escribe un número entre ' + min + ' y ' + max + '.');
  }
}

async function leerSiNo(pregunta) {
  while (true) {
    const texto = (await leer(pregunta + ' (s/n): ')).toLowerCase();
    if (texto === 's' || texto === 'n') {
      return texto === 's';
    }
    console.log('  ✗ Responde "s" o "n".');
  }
}

/* ---------------------------------------------------------------------
   DISPONIBILIDAD (se calcula con la fecha y hora reales del computador)
   --------------------------------------------------------------------- */

/* Devuelve la lista de horarios de un día: [{ hora, libre }, ...]
   Lista vacía = ese día no hay atención. */
function horariosDelDia(indiceProf, fecha) {
  const resultado = [];

  if (!DIAS_ATENCION[indiceProf].includes(fecha.getDay())) {
    return resultado;
  }
  if (FESTIVOS.includes(formatoFecha(fecha))) {
    return resultado;
  }

  /* Sábados solo hay turno de la mañana */
  const turnos = fecha.getDay() === 6 ? [HORAS_MANANA] : [HORAS_MANANA, HORAS_TARDE];
  const limite = new Date(Date.now() + 60 * 60 * 1000); /* mínimo 1 hora de anticipación */
  let contador = 0;

  for (let t = 0; t < turnos.length; t++) {
    for (let h = 0; h < turnos[t].length; h++) {
      const partes = turnos[t][h].split(':');
      const momento = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), Number(partes[0]), Number(partes[1]));
      const yaPaso = momento <= limite;
      /* Ocupación simulada: una de cada cinco horas ya está tomada */
      const ocupada = (fecha.getDate() * 7 + contador * 3 + indiceProf) % 5 === 0;
      resultado.push({ hora: turnos[t][h], libre: !yaPaso && !ocupada, turno: t });
      contador++;
    }
  }
  return resultado;
}

function diaDisponible(indiceProf, fecha) {
  const horarios = horariosDelDia(indiceProf, fecha);
  for (let i = 0; i < horarios.length; i++) {
    if (horarios[i].libre) {
      return true;
    }
  }
  return false;
}

/* ---------------------------------------------------------------------
   CICLOS ANIDADOS #1: calendario del mes
   Ciclo externo = semanas (filas), ciclo interno = días (columnas)
   --------------------------------------------------------------------- */
function mostrarCalendario(indiceProf, anio, mes) {
  const primerDia = new Date(anio, mes, 1).getDay(); /* 0 = domingo */
  const totalDias = new Date(anio, mes + 1, 0).getDate();

  console.log('\n   ' + MESES[mes].toUpperCase() + ' ' + anio);
  console.log('   ' + DIAS_SEMANA.map(function (d) { return d.padEnd(5); }).join(''));

  for (let semana = 0; semana < 6; semana++) {
    let fila = '   ';
    for (let columna = 0; columna < 7; columna++) {
      const dia = semana * 7 + columna - primerDia + 1;
      if (dia < 1 || dia > totalDias) {
        fila += '     ';
      } else {
        const hoy = new Date();
        const fecha = new Date(anio, mes, dia);
        const esPasado = fecha < new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
        if (!esPasado && diaDisponible(indiceProf, fecha)) {
          fila += ('[' + dosDigitos(dia) + ']').padEnd(5);
        } else {
          fila += (' -- ').padEnd(5);
        }
      }
    }
    if (fila.trim() !== '') {
      console.log(fila);
    }
  }
  console.log('   [dd] = disponible    -- = no disponible\n');
}

/* ---------------------------------------------------------------------
   CICLOS ANIDADOS #2: tabla de horas x próximos 7 días
   Ciclo externo = las 8 horas, ciclo interno = los 7 días
   --------------------------------------------------------------------- */
function mostrarSemana(indiceProf) {
  const todasLasHoras = HORAS_MANANA.concat(HORAS_TARDE);
  const hoy = new Date();

  console.log('\n   Próximos 7 días (✓ libre   ✗ no disponible)');
  let encabezado = '   Hora  ';
  for (let d = 0; d < 7; d++) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + d);
    encabezado += (DIAS_SEMANA[fecha.getDay()] + ' ' + dosDigitos(fecha.getDate())).padEnd(8);
  }
  console.log(encabezado);

  for (let h = 0; h < todasLasHoras.length; h++) {
    let fila = '   ' + todasLasHoras[h] + ' ';
    for (let d = 0; d < 7; d++) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + d);
      const horarios = horariosDelDia(indiceProf, fecha);
      let simbolo = '✗';
      for (let k = 0; k < horarios.length; k++) {
        if (horarios[k].hora === todasLasHoras[h] && horarios[k].libre) {
          simbolo = '✓';
        }
      }
      fila += ('  ' + simbolo).padEnd(8);
    }
    console.log(fila);
  }
  console.log('');
}

/* ---------------------------------------------------------------------
   PEDIR Y VALIDAR LOS DATOS DEL PACIENTE (ciclos while)
   --------------------------------------------------------------------- */
async function pedirDocumento() {
  console.log('\n  Tipo de documento:');
  for (let i = 0; i < TIPOS_DOC.length; i++) {
    console.log('    ' + (i + 1) + '. ' + TIPOS_DOC[i]);
  }
  const tipo = (await leerEntero('  Elige el tipo: ', 1, TIPOS_DOC.length)) - 1;

  while (true) {
    let numero = await leer('  Número de documento: ');
    if (SIGLAS_DOC[tipo] === 'PA') {
      numero = numero.toUpperCase();
      if (!soloCaracteres(numero, DIGITOS + LETRAS.slice(0, 26).toUpperCase())) {
        console.log('  ✗ El pasaporte solo lleva letras (sin tildes) y números.');
        continue;
      }
    } else if (!soloCaracteres(numero, DIGITOS) || numero === '') {
      console.log('  ✗ Solo se permiten números, sin puntos ni espacios.');
      continue;
    }
    if (numero.length < DOC_MIN[tipo] || numero.length > DOC_MAX[tipo]) {
      console.log('  ✗ El ' + SIGLAS_DOC[tipo] + ' debe tener entre ' + DOC_MIN[tipo] + ' y ' + DOC_MAX[tipo] + ' caracteres (escribiste ' + numero.length + ').');
      continue;
    }
    if (SIGLAS_DOC[tipo] !== 'PA' && (numero.charAt(0) === '0' || todosIguales(numero))) {
      console.log('  ✗ Revisa el número: no parece un documento válido.');
      continue;
    }
    return { tipo: SIGLAS_DOC[tipo], numero: numero };
  }
}

async function pedirNombre() {
  while (true) {
    const nombre = (await leer('  Nombre completo (nombre y apellido): ')).replace(/\s+/g, ' ');
    const palabras = nombre.split(' ');
    if (nombre === '' || palabras.length < 2) {
      console.log('  ✗ Escribe al menos tu nombre y un apellido.');
    } else if (!soloCaracteres(nombre, LETRAS + ' ')) {
      console.log('  ✗ Usa solo letras.');
    } else if (nombre.length > 60) {
      console.log('  ✗ Máximo 60 caracteres.');
    } else {
      return nombre;
    }
  }
}

async function pedirCelular() {
  while (true) {
    const celular = (await leer('  Celular (10 dígitos): ')).replace(/\s/g, '');
    if (!soloCaracteres(celular, DIGITOS) || celular === '') {
      console.log('  ✗ Solo números.');
    } else if (celular.length !== 10) {
      console.log('  ✗ Debe tener 10 dígitos (escribiste ' + celular.length + ').');
    } else if (celular.charAt(0) !== '3') {
      console.log('  ✗ Los celulares en Colombia empiezan por 3.');
    } else {
      return celular;
    }
  }
}

async function pedirMotivo() {
  while (true) {
    const motivo = (await leer('  Motivo de consulta (10 a 250 caracteres): ')).replace(/\s+/g, ' ');
    if (motivo.length < 10) {
      console.log('  ✗ Describe un poco más (mínimo 10 caracteres, escribiste ' + motivo.length + ').');
    } else if (motivo.length > 250) {
      console.log('  ✗ Es muy largo (máximo 250 caracteres, escribiste ' + motivo.length + ').');
    } else {
      return motivo;
    }
  }
}

/* ---------------------------------------------------------------------
   AGENDAR UNA CITA (flujo completo)
   --------------------------------------------------------------------- */
async function agendarCita() {
  console.log('\n===== AGENDAR CITA =====');

  /* 1. Especialidad */
  console.log('\nEspecialidades:');
  for (let i = 0; i < ESPECIALIDADES.length; i++) {
    console.log('  ' + (i + 1) + '. ' + ESPECIALIDADES[i] + '  (' + PROFESIONALES[i] + ')');
  }
  const indice = (await leerEntero('Elige la especialidad: ', 1, ESPECIALIDADES.length)) - 1;

  mostrarSemana(indice);

  /* 2. Mes y día */
  const hoy = new Date();
  const siguiente = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 1);
  console.log('Meses:  1. ' + MESES[hoy.getMonth()] + '   2. ' + MESES[siguiente.getMonth()]);
  const eleccionMes = await leerEntero('Elige el mes: ', 1, 2);
  const anio = eleccionMes === 1 ? hoy.getFullYear() : siguiente.getFullYear();
  const mes = eleccionMes === 1 ? hoy.getMonth() : siguiente.getMonth();

  mostrarCalendario(indice, anio, mes);

  let fecha = null;
  while (fecha === null) {
    const dia = await leerEntero('Elige el día del mes (0 para cancelar): ', 0, 31);
    if (dia === 0) {
      console.log('Agendamiento cancelado.');
      return;
    }
    const candidata = new Date(anio, mes, dia);
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (candidata.getMonth() !== mes || candidata < inicioHoy || !diaDisponible(indice, candidata)) {
      console.log('  ✗ Ese día no está disponible. Elige uno marcado con [dd].');
    } else {
      fecha = candidata;
    }
  }

  /* 3. Horario: ciclo anidado turno x hora */
  const horarios = horariosDelDia(indice, fecha);
  const nombresTurno = ['Mañana', 'Tarde'];
  console.log('\nHorarios para ' + fechaLarga(fecha) + ':');
  for (let t = 0; t < 2; t++) {
    let hayTurno = false;
    for (let h = 0; h < horarios.length; h++) {
      if (horarios[h].turno === t) {
        if (!hayTurno) {
          console.log('  ' + nombresTurno[t] + ':');
          hayTurno = true;
        }
        const estado = horarios[h].libre ? 'libre' : 'no disponible';
        console.log('    ' + (h + 1) + '. ' + horarios[h].hora + '  ' + estado);
      }
    }
  }

  let elegido = null;
  while (elegido === null) {
    const opcion = await leerEntero('Elige el horario por su número: ', 1, horarios.length);
    if (horarios[opcion - 1].libre) {
      elegido = horarios[opcion - 1].hora;
    } else {
      console.log('  ✗ Ese horario no está disponible.');
    }
  }

  /* 4. Datos del paciente */
  console.log('\n--- Tus datos (todos son obligatorios) ---');
  const documento = await pedirDocumento();
  const nombre = await pedirNombre();
  const celular = await pedirCelular();
  const motivo = await pedirMotivo();
  const acepta = await leerSiNo('¿Autorizas el tratamiento de tus datos personales (Ley 1581 de 2012)?');
  if (!acepta) {
    console.log('Sin autorización no podemos registrar la cita. Agendamiento cancelado.');
    return;
  }

  /* 5. Resumen y confirmación */
  console.log('\n--- Resumen ---');
  console.log('  Especialidad : ' + ESPECIALIDADES[indice] + ' · ' + PROFESIONALES[indice]);
  console.log('  Fecha y hora : ' + fechaLarga(fecha) + ' · ' + elegido);
  console.log('  Paciente     : ' + nombre + ' (' + documento.tipo + ' ' + documento.numero + ')');
  console.log('  Celular      : ' + celular);
  console.log('  Motivo       : ' + motivo);
  if (!(await leerSiNo('¿Confirmas la cita?'))) {
    console.log('Cita no confirmada.');
    return;
  }

  const codigo = 'ORAL-' + hoy.getFullYear() + '-' + String(1000 + Math.floor(Math.random() * 9000));
  citasAgendadas.push({ codigo, especialidad: ESPECIALIDADES[indice], profesional: PROFESIONALES[indice], fecha: fechaLarga(fecha), hora: elegido, nombre });

  console.log('\n╔══════════════════════════════════════╗');
  console.log('║        ¡TU CITA ESTÁ CONFIRMADA!     ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('  Código: ' + codigo);
  console.log('  ' + fechaLarga(fecha) + ' a las ' + elegido + ' con ' + PROFESIONALES[indice]);
  console.log('  Preséntate 10 minutos antes. Para reagendar avisa con 4 horas de anticipación.');
}

function verCitas() {
  console.log('\n===== CITAS AGENDADAS EN ESTA SESIÓN =====');
  if (citasAgendadas.length === 0) {
    console.log('  Aún no hay citas.');
    return;
  }
  for (let i = 0; i < citasAgendadas.length; i++) {
    const c = citasAgendadas[i];
    console.log('  ' + (i + 1) + '. ' + c.codigo + ' · ' + c.especialidad + ' · ' + c.fecha + ' ' + c.hora + ' · ' + c.nombre);
  }
}
