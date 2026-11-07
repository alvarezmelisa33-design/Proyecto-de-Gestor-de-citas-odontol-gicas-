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
})();
