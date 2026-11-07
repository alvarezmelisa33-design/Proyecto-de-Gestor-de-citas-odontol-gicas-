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

  function professionalsOf(specialtyId) {
    return D.professionals.filter(function (p) { return p.specialtyId === specialtyId; });
  }

  /* ---------- Inicio: accesos directos ---------- */
  function specialtyShortcuts(mount) {
    mount.innerHTML = D.specialties.map(function (s) {
      return '<a class="card shortcut" href="especialidades.html#' + U.esc(s.id) + '">' +
        '<span class="shortcut-icon">' + U.icon('tooth', 26) + '</span>' +
        '<h3>' + U.esc(s.name) + '</h3>' +
        '<p>' + U.esc(s.short) + '</p>' +
        '<span class="shortcut-more">Ver detalle ' + U.icon('arrow', 16) + '</span>' +
        '</a>';
    }).join('');
  }

  /* ---------- Especialidades: detalle ---------- */
  function specialties(mount) {
    mount.innerHTML = D.specialties.map(function (s) {
      var pros = professionalsOf(s.id).map(function (p) {
        return '<span class="tag">' + U.esc(p.name) + '</span>';
      }).join('');
      var treatments = s.treatments.map(function (t) {
        return '<li>' + U.icon('check', 18) + '<span>' + U.esc(t) + '</span></li>';
      }).join('');
      return '<article class="card specialty-item" id="' + U.esc(s.id) + '">' +
        '<div class="media">' + U.mediaHTML(s.name, s.image) + '</div>' +
        '<div class="specialty-body">' +
          '<h2>' + U.esc(s.name) + '</h2>' +
          '<p>' + U.esc(s.description) + '</p>' +
          '<ul>' + treatments + '</ul>' +
          '<div class="pro-line"><strong>Profesional:</strong> ' + pros + '</div>' +
          '<a class="btn" href="' + bookingLink(s.id) + '">Agendar cita en ' + U.esc(s.name) + '</a>' +
        '</div></article>';
    }).join('');
  }

  /* ---------- Equipo ---------- */
  var DAY_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  /* [1,2,3,4,5] -> "Lun – Vie"   [2,4,6] -> "Mar · Jue · Sáb" */
  function daysShort(days) {
    var consecutive = days.length >= 3 && days.every(function (d, i) { return i === 0 || d === days[i - 1] + 1; });
    if (consecutive) { return DAY_SHORT[days[0]] + ' – ' + DAY_SHORT[days[days.length - 1]]; }
    return days.map(function (d) { return DAY_SHORT[d]; }).join(' · ');
  }

  /* El horario es lo que va después de la última coma de p.availability */
  function availabilityHTML(p) {
    var cut = p.availability.lastIndexOf(',');
    var hours = cut === -1 ? '' : p.availability.slice(cut + 1).trim();
    return '<div class="pro-avail">' +
      '<p>' + U.icon('calendar', 16) + '<span>' + U.esc(daysShort(p.days)) + '</span></p>' +
      (hours ? '<p>' + U.icon('clock', 16) + '<span>' + U.esc(hours) + '</span></p>' : '') +
      '</div>';
  }

  function proCard(p) {
    return '<article class="card pro-card" data-specialty="' + U.esc(p.specialtyId) + '">' +
      '<div class="media">' + U.mediaHTML(p.name, p.image) + '</div>' +
      '<div class="pro-body">' +
        '<h3>' + U.esc(p.name) + '</h3>' +
        '<p class="pro-role">' + U.esc(p.role) + '</p>' +
        '<p class="pro-bio">' + U.esc(p.bio) + '</p>' +
        availabilityHTML(p) +
        '<a class="btn btn-sm" href="' + bookingLink(p.specialtyId, p.id) + '" aria-label="Agendar cita con ' + U.esc(p.name) + '">Agendar cita</a>' +
      '</div></article>';
  }
})();
