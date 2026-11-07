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

  function easter(year) { /* algoritmo gregoriano anónimo */
    var a = year % 19, b = Math.floor(year / 100), c = year % 100;
    var d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
    var i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31);
    var day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  }

  function nextMonday(date) {
    var shift = (8 - date.getDay()) % 7; /* lunes se queda; otro día pasa al lunes siguiente */
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + shift);
  }
})();
