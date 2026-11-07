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
    }
  ],
};
