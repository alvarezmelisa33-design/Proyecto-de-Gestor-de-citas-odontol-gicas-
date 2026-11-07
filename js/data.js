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
};
