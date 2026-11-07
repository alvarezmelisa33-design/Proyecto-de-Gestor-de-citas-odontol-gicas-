/* ==========================================================================
   Oral Group Pro · DATOS DEL SITIO (única fuente de verdad)
   Todo lo que se muestra (especialidades, equipo, testimonios, horarios)
   sale de aquí. No hay base de datos: son datos simulados (RNF-05).

   Para poner una imagen real: escribe la ruta en el campo "image" de la
   especialidad o del profesional (ej. image: 'img/ortodoncia.jpg').
   Mientras esté vacío se muestra el icono de montaña como marcador.
   ========================================================================== */
window.OGP = window.OGP || {};

window.OGP.data = {
  clinic: {
    name: 'Oral Group Pro',
    tagline: 'Centro Odontológico & Estética de Sonrisas',
    address: 'Carrera 43A # 10-25, Medellín, Antioquia',
    schedule: [
      ['Lunes a viernes', '8:00 a. m. – 6:00 p. m.'],
      ['Sábados', '8:00 a. m. – 2:00 p. m.'],
      ['Domingos y festivos', 'Cerrado']
    ],
    phone: '(604) 555 01 23',
    phoneLink: 'tel:+576045550123',
    whatsappLink: 'https://wa.me/573000000000?text=Hola%2C%20quiero%20agendar%20una%20cita%20en%20Oral%20Group%20Pro',
    email: 'contacto@oralgrouppro.com'
  },

  specialties: [
    {
      id: 'ortodoncia',
      name: 'Ortodoncia',
      short: 'Alineamos tus dientes con brackets y alineadores.',
      description: 'Corregimos la posición de los dientes y la mordida con brackets metálicos, estéticos o alineadores transparentes. Iniciamos con un estudio completo (fotos, radiografías y escáner) y un plan personalizado con controles periódicos.',
      treatments: ['Brackets metálicos y estéticos', 'Alineadores transparentes', 'Retenedores', 'Control y ajustes mensuales'],
      image: ''
    },
    {
      id: 'estetica',
      name: 'Estética y Blanqueamiento',
      short: 'Recupera el tono y la armonía de tu sonrisa.',
      description: 'Aclaramos el color de tus dientes de forma segura y diseñamos sonrisas armónicas. Incluye limpieza previa, valoración de sensibilidad y kit de mantenimiento para casa.',
      treatments: ['Blanqueamiento en consultorio', 'Diseño de sonrisa', 'Carillas y resinas estéticas', 'Limpieza profiláctica'],
      image: ''
    },
    {
      id: 'rehabilitacion',
      name: 'Rehabilitación Oral',
      short: 'Devolvemos función y estética a tu boca.',
      description: 'Restauramos la capacidad de masticar y sonreír con coronas, puentes, prótesis e implantes, buscando resultados naturales y duraderos, con un plan por etapas claro y transparente.',
      treatments: ['Coronas y puentes', 'Prótesis removibles y fijas', 'Implantes dentales', 'Rehabilitación de la mordida'],
      image: ''
    },
    {
      id: 'odontopediatria',
      name: 'Odontopediatría',
      short: 'Atención amable para los más pequeños.',
      description: 'Cuidamos la salud oral de bebés, niños y adolescentes en un ambiente tranquilo y didáctico. Prevención, sellantes, fluorización y seguimiento del crecimiento, siempre con paciencia y cariño.',
      treatments: ['Primera visita del bebé', 'Sellantes y fluorización', 'Control del crecimiento dental', 'Manejo de la ansiedad dental'],
      image: ''
    }
  ],

  /* days: días de atención (0 = domingo … 6 = sábado).
     morning / afternoon: turnos en formato 24 h. Los sábados solo hay turno de la mañana. */
  professionals: [
    {
      id: 'valencia',
      name: 'Dr. Alejandro Valencia',
      role: 'Ortodoncista',
      specialtyId: 'ortodoncia',
      bio: 'Ortodoncista con más de 10 años de experiencia en alineadores invisibles y brackets estéticos. Le apasiona acompañar cada caso hasta lograr una sonrisa de la que te sientas orgulloso.',
      availability: 'Lunes a viernes, 8:30 a. m. – 6:00 p. m.',
      days: [1, 2, 3, 4, 5],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    },
    {
      id: 'ibanez',
      name: 'Dra. Paula Ibañez',
      role: 'Odontóloga estética',
      specialtyId: 'estetica',
      bio: 'Odontóloga estética especializada en blanqueamiento y diseño de sonrisa. Combina técnica y sensibilidad artística para lograr resultados naturales.',
      availability: 'Martes, jueves y sábados, 8:30 a. m. – 6:00 p. m.',
      days: [2, 4, 6],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    },
    {
      id: 'salazar',
      name: 'Dra. Lina Salazar',
      role: 'Rehabilitadora oral',
      specialtyId: 'rehabilitacion',
      bio: 'Rehabilitadora oral con experiencia en prótesis, coronas e implantes. Explica cada etapa del tratamiento con claridad para que decidas con tranquilidad.',
      availability: 'Lunes, miércoles y viernes, 8:30 a. m. – 6:00 p. m.',
      days: [1, 3, 5],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    },
    {
      id: 'carrillo',
      name: 'Dra. Natalia Carrillo',
      role: 'Odontopediatra',
      specialtyId: 'odontopediatria',
      bio: 'Odontopediatra que convierte la consulta en una experiencia amable para los niños. Trabaja de la mano con las familias para crear buenos hábitos desde temprano.',
      availability: 'Lunes a sábado, 8:30 a. m. – 6:00 p. m.',
      days: [1, 2, 3, 4, 5, 6],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    },
    {
      id: 'restrepo',
      name: 'Dra. Camila Restrepo',
      role: 'Ortodoncista',
      specialtyId: 'ortodoncia',
      bio: 'Ortodoncista con enfoque en niños y adolescentes. Acompaña a las familias con un trato cercano y planes de tratamiento claros desde la primera cita.',
      availability: 'Lunes, miércoles y viernes, 8:30 a. m. – 6:00 p. m.',
      days: [1, 3, 5],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    },
    {
      id: 'mejia',
      name: 'Dr. Andrés Mejía',
      role: 'Odontólogo estético',
      specialtyId: 'estetica',
      bio: 'Odontólogo estético especializado en blanqueamiento y carillas. Prioriza resultados naturales y el cuidado del esmalte en cada procedimiento.',
      availability: 'Lunes, miércoles y viernes, 8:30 a. m. – 6:00 p. m.',
      days: [1, 3, 5],
      morning: ['08:30', '09:15', '10:00', '11:30'],
      afternoon: ['14:00', '15:15', '16:30', '17:45'],
      image: ''
    }
  ],

  /* Testimonios. "text" = frase corta (tarjetas del Inicio).
     "story" + treatment/duration/result = historia completa (página Testimonios).
     beforeAfter: true muestra dos espacios de imagen (antes / después); en before, after y photo
     se escribe la ruta de la foto real (con consentimiento escrito del paciente). */
  testimonials: [
    {
      name: 'María Fernanda López',
      specialtyId: 'ortodoncia',
      rating: 5,
      date: '2026-09-12',
      text: 'Me atendieron con mucha paciencia y hoy tengo la sonrisa que siempre quise.',
      story: 'Durante años evité sonreír en las fotos porque mis dientes estaban muy apiñados. En la primera cita me explicaron todo el plan con imágenes y me dieron una fecha estimada de finalización. Cada control fue puntual y me sentí acompañada. Hoy sonrío sin pensarlo y mis amigas lo notaron desde el primer mes.',
      treatment: 'Alineadores transparentes',
      duration: '14 meses',
      result: 'Apiñamiento corregido y mordida alineada',
      beforeAfter: true, before: '', after: '', photo: ''
    },
    {
      name: 'Carlos Andrés Ruiz',
      specialtyId: 'odontopediatria',
      rating: 5,
      date: '2026-08-28',
      text: 'Mi hijo ya no le tiene miedo al odontólogo. La doctora le explicó todo con juegos.',
      story: 'Mi hijo de 6 años lloraba solo de escuchar la palabra "dentista". La doctora le mostró los instrumentos como si fueran juguetes, le explicó cada paso con calma y le dejó escoger el sabor de la pasta. Salió feliz con su sticker y pidió volver. Como papá, ver eso no tiene precio.',
      treatment: 'Primera valoración y sellantes',
      duration: '2 sesiones',
      result: 'Cero miedo en la consulta y molares protegidos',
      beforeAfter: false, before: '', after: '', photo: ''
    },
    {
      name: 'Juliana Torres',
      specialtyId: 'estetica',
      rating: 4,
      date: '2026-08-03',
      text: 'El blanqueamiento quedó natural y sin sensibilidad. Muy profesionales.',
      story: 'Quería aclarar mis dientes sin que se vieran artificiales. Me hicieron una limpieza previa, revisaron mi sensibilidad y me explicaron qué tono era realista para mí. El resultado quedó natural y casi no sentí molestia. Me llevé un kit para mantenerlo en casa y funciona muy bien.',
      treatment: 'Blanqueamiento en consultorio',
      duration: '1 sesión + kit de mantenimiento',
      result: 'Varios tonos más claros, sin sensibilidad',
      beforeAfter: true, before: '', after: '', photo: ''
    }
  ],
};
