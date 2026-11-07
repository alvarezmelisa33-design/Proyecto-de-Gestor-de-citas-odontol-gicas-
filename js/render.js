/* ==========================================================================
   Oral Group Pro · RENDERIZADO DE LISTAS
   Busca contenedores con  data-render="..."  y los llena con los datos de
   data.js. Así Inicio, Especialidades, Equipo y Testimonios nunca se
   contradicen entre sí.
     data-render="specialty-shortcuts"   accesos directos (Inicio)
     data-render="specialties"           detalle completo (Especialidades)
     data-render="team"                  equipo agrupado (data-limit = vista previa)
     data-render="testimonials"          testimonios (data-limit = vista previa)
   ========================================================================== */
(function () {
  'use strict';
  var D = window.OGP.data;
  var U = window.OGP.ui;

  function bookingLink(specialtyId, professionalId) {
    var q = '?esp=' + encodeURIComponent(specialtyId);
    if (professionalId) { q += '&prof=' + encodeURIComponent(professionalId); }
    return 'agendamiento.html' + q;
  }
})();
