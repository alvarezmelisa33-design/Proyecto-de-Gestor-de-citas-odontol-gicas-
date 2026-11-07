/* ==========================================================================
   Oral Group Pro · AGENDAMIENTO
   Flujo: 1) especialidad + fecha + horario  ->  2) datos del paciente
          3) comprobante en pantalla.
   No hay servidor: la disponibilidad se calcula con los datos de data.js
   y nada se guarda entre sesiones (RNF-05).
   ========================================================================== */
(function () {
  'use strict';
  var D = window.OGP.data;
  var U = window.OGP.ui;
  var $ = function (id) { return document.getElementById(id); };

  var state = { specialtyId: '', proId: '', date: null, time: '', view: null };

  /* ======================================================================
     Disponibilidad simulada
     ====================================================================== */
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }

  function hash(text) {
    var h = 0;
    for (var i = 0; i < text.length; i++) { h = (h * 31 + text.charCodeAt(i)) % 100003; }
    return h;
  }

  /* Festivos de Colombia calculados para cualquier año (Ley 51 de 1983):
     - Fijos: 1 ene, 1 may, 20 jul, 7 ago, 8 dic, 25 dic
     - Trasladados al lunes siguiente: 6 ene, 19 mar, 29 jun, 15 ago, 12 oct, 1 nov, 11 nov
     - Según Pascua: Jue/Vie Santo (fijos) y Ascensión, Corpus Christi y Sagrado Corazón (lunes) */
  var holidayCache = {};
})();
