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

  function holidaysOf(year) {
    if (holidayCache[year]) { return holidayCache[year]; }
    var list = [];
    [[0, 1], [4, 1], [6, 20], [7, 7], [11, 8], [11, 25]].forEach(function (md) { list.push(new Date(year, md[0], md[1])); });
    [[0, 6], [2, 19], [5, 29], [7, 15], [9, 12], [10, 1], [10, 11]].forEach(function (md) { list.push(nextMonday(new Date(year, md[0], md[1]))); });
    var pascua = easter(year);
    [-3, -2].forEach(function (n) { list.push(new Date(year, pascua.getMonth(), pascua.getDate() + n)); });
    [39, 60, 68].forEach(function (n) { list.push(nextMonday(new Date(year, pascua.getMonth(), pascua.getDate() + n))); });
    holidayCache[year] = list.map(ymd);
    return holidayCache[year];
  }

  function isHoliday(date) {
    return holidaysOf(date.getFullYear()).indexOf(ymd(date)) !== -1 || D.closedDates.indexOf(ymd(date)) !== -1;
  }

  function professionalsOf(specialtyId) {
    return D.professionals.filter(function (p) { return p.specialtyId === specialtyId; });
  }
  function currentPro() { return U.byId(D.professionals, state.proId); }

  /* Franjas de un día para un profesional: [{time, group, free}] */
  function slotsFor(pro, date) {
    if (!pro || pro.days.indexOf(date.getDay()) === -1) { return []; }
    if (isHoliday(date)) { return []; }

    var times = pro.morning.map(function (t) { return { time: t, group: 'morning' }; });
    if (date.getDay() !== 6) {
      times = times.concat(pro.afternoon.map(function (t) { return { time: t, group: 'afternoon' }; }));
    }
    var limit = new Date(Date.now() + 60 * 60 * 1000); /* mínimo 1 h de anticipación */

    return times.map(function (s) {
      var hm = s.time.split(':');
      var at = new Date(date.getFullYear(), date.getMonth(), date.getDate(), Number(hm[0]), Number(hm[1]));
      var taken = hash(pro.id + ymd(date) + s.time) % 5 === 0; /* ~20 % ocupadas */
      s.free = at > limit && !taken;
      return s;
    });
  }

  function dayHasFree(pro, date) {
    return slotsFor(pro, date).some(function (s) { return s.free; });
  }

  /* ======================================================================
     Paso 1: especialidad, calendario y horarios
     ====================================================================== */
  function renderSpecialtySelect() {
    $('specialty').innerHTML = D.specialties.map(function (s) {
      var pro = professionalsOf(s.id)[0];
      return '<option value="' + U.esc(s.id) + '">' + U.esc(s.name) + (pro ? ' • ' + U.esc(pro.name) : '') + '</option>';
    }).join('');
    $('specialty').value = state.specialtyId;
  }

  function renderProfessionalSelect() {
    $('professional').innerHTML = professionalsOf(state.specialtyId).map(function (p) {
      return '<option value="' + U.esc(p.id) + '">' + U.esc(p.name) + '</option>';
    }).join('');
    $('professional').value = state.proId;
  }

  function renderProMini() {
    var p = currentPro();
    if (!p) { $('pro-mini').innerHTML = ''; return; }
    $('pro-mini').innerHTML =
      '<div class="media">' + U.mediaHTML(p.name, p.image) + '</div>' +
      '<div><strong>' + U.esc(p.name) + '</strong>' +
      '<p>' + U.esc(p.role) + '</p>' +
      '<p>' + U.icon('clock', 14) + ' ' + U.esc(p.availability) + '</p></div>';
  }

  function renderCalendar() {
    var pro = currentPro();
    var view = state.view;
    var title = U.capitalize(new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' })
      .format(new Date(view.y, view.m, 1)));
    $('cal-title').textContent = title;

    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var cur = { y: now.getFullYear(), m: now.getMonth() };
    var monthsAhead = (view.y - cur.y) * 12 + (view.m - cur.m);
    $('cal-prev').disabled = monthsAhead <= 0;
    $('cal-next').disabled = monthsAhead >= 2;

    var html = ['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(function (d) {
      return '<div class="cal-dow" aria-hidden="true">' + d + '</div>';
    }).join('');

    var first = new Date(view.y, view.m, 1);
    var offset = (first.getDay() + 6) % 7; /* semana empieza en lunes */
    for (var b = 0; b < offset; b++) { html += '<span class="cal-blank"></span>'; }

    var daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    for (var d = 1; d <= daysInMonth; d++) {
      var date = new Date(view.y, view.m, d);
      var isPast = date < startOfToday;
      var available = !isPast && dayHasFree(pro, date);
      var cls = 'cal-day';
      if (date.getTime() === startOfToday.getTime()) { cls += ' is-today'; }
      var selected = state.date && ymd(state.date) === ymd(date);
      if (selected) { cls += ' is-selected'; }
      html += '<button type="button" class="' + cls + '" data-date="' + ymd(date) + '"' +
        (available ? '' : ' disabled') + ' aria-pressed="' + (selected ? 'true' : 'false') + '"' +
        ' aria-label="' + U.formatLong(date, true) + (available ? ', disponible' : ', no disponible') + '">' + d + '</button>';
    }
    $('cal-grid').innerHTML = html;
  }

  function renderSlots() {
    var box = $('slots');
    if (!state.date) {
      box.innerHTML = '<p class="slots-empty">Elige un día disponible en el calendario para ver los horarios.</p>';
      return;
    }
    var slots = slotsFor(currentPro(), state.date);
    var groups = [
      { id: 'morning', label: 'Turno mañana', icon: 'clock' },
      { id: 'afternoon', label: 'Turno tarde', icon: 'clock' }
    ];
    var html = '';
    groups.forEach(function (g) {
      var list = slots.filter(function (s) { return s.group === g.id; });
      if (!list.length) { return; }
      html += '<div class="slot-group-title">' + U.icon(g.icon, 16) + '<span>' + g.label + '</span></div>' +
        '<div class="slots" role="group" aria-label="Horarios ' + g.label.toLowerCase() + '">' +
        list.map(function (s) {
          var sel = state.time === s.time;
          return '<button type="button" class="slot' + (sel ? ' is-selected' : '') + '" data-time="' + s.time + '"' +
            (s.free ? '' : ' disabled') + ' aria-pressed="' + (sel ? 'true' : 'false') + '">' + U.formatTime(s.time) + '</button>';
        }).join('') + '</div>';
    });
    box.innerHTML = html;
  }

  function renderAssigned() {
    var banner = $('assigned');
    if (!state.time) { banner.classList.remove('is-visible'); return; }
    $('assigned-text').innerHTML = '<strong>Horario asignado:</strong> ' + U.esc(U.formatLong(state.date, true)) +
      ' a las ' + U.esc(U.formatTime(state.time)) + ' con ' + U.esc(currentPro().name) + '.';
    banner.classList.add('is-visible');
  }

  function setStep(n) {
    for (var i = 1; i <= 3; i++) {
      var item = $('step-' + i);
      item.classList.toggle('is-active', i === n);
      item.classList.toggle('is-done', i < n);
      if (i === n) { item.setAttribute('aria-current', 'step'); } else { item.removeAttribute('aria-current'); }
    }
  }

  function setFormLocked(locked) {
    var panel = $('form-panel');
    panel.classList.toggle('is-unlocked', !locked);
    var controls = $('appointment-form').querySelectorAll('input, select, textarea, button');
    for (var i = 0; i < controls.length; i++) { controls[i].disabled = locked; }
    $('form-lock').setAttribute('aria-hidden', String(!locked));
  }

  function resetSelection() {
    state.date = null;
    state.time = '';
    renderSlots();
    renderAssigned();
    setFormLocked(true);
    setStep(1);
  }

  /* Mes del primer día con cupo (busca hasta 90 días); si no hay, el mes actual */
  function firstAvailableView() {
    var now = new Date();
    var pro = currentPro();
    for (var i = 0; i < 90; i++) {
      var d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      if (dayHasFree(pro, d)) { return { y: d.getFullYear(), m: d.getMonth() }; }
    }
    return { y: now.getFullYear(), m: now.getMonth() };
  }

  function onSpecialtyChange(id) {
    state.specialtyId = id;
    state.proId = professionalsOf(id)[0].id;
    state.view = firstAvailableView();
    renderProfessionalSelect();
    renderProMini();
    resetSelection();
    renderCalendar();
  }

  function onProfessionalChange(id) {
    state.proId = id;
    state.view = firstAvailableView();
    renderProMini();
    resetSelection();
    renderCalendar();
  }

  function bindSchedule() {
    $('specialty').addEventListener('change', function (e) { onSpecialtyChange(e.target.value); });
    $('professional').addEventListener('change', function (e) { onProfessionalChange(e.target.value); });

    $('cal-prev').addEventListener('click', function () {
      state.view = { y: state.view.m === 0 ? state.view.y - 1 : state.view.y, m: (state.view.m + 11) % 12 };
      renderCalendar();
    });
    $('cal-next').addEventListener('click', function () {
      state.view = { y: state.view.m === 11 ? state.view.y + 1 : state.view.y, m: (state.view.m + 1) % 12 };
      renderCalendar();
    });

    $('cal-grid').addEventListener('click', function (e) {
      var btn = e.target.closest('.cal-day');
      if (!btn || btn.disabled) { return; }
      state.date = U.parseISO(btn.getAttribute('data-date'));
      state.time = '';
      renderCalendar();
      renderSlots();
      renderAssigned();
      setFormLocked(true);
      setStep(1);
    });

    $('slots').addEventListener('click', function (e) {
      var btn = e.target.closest('.slot');
      if (!btn || btn.disabled) { return; }
      state.time = btn.getAttribute('data-time');
      renderSlots();
      renderAssigned();
      setFormLocked(false);
      setStep(2);
      $('full-name').focus({ preventScroll: window.innerWidth > 960 });
    });
  }

  /* ======================================================================
     Paso 2: formulario con validaciones
     ====================================================================== */
  var LETTERS = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';
  var WORD_RE = new RegExp('^[' + LETTERS + ']+(?:[\'’-][' + LETTERS + ']+)*$');

  function collapse(v) { return v.replace(/\s+/g, ' ').trim(); }
  function docRule() { return U.byId(D.documentTypes, $('doc-type').value) || D.documentTypes[0]; }

  /* Cada campo: sanitize (limpia mientras se escribe) y validate (devuelve el mensaje de error o '') */
  var FIELDS = {
    docNumber: {
      el: 'doc-number',
      sanitize: function (v) {
        var rule = docRule();
        v = rule.id === 'PA' ? v.replace(/[^A-Za-z0-9]/g, '').toUpperCase() : v.replace(/\D/g, '');
        return v.slice(0, rule.max);
      },
      validate: function (v) {
        var rule = docRule();
        if (!v) { return 'Ingresa tu número de documento.'; }
        if (!rule.pattern.test(v)) { return rule.hint; }
        if (v.length < rule.min || v.length > rule.max) {
          return rule.min === rule.max
            ? 'El documento debe tener ' + rule.min + ' caracteres.'
            : 'El documento debe tener entre ' + rule.min + ' y ' + rule.max + ' caracteres (llevas ' + v.length + ').';
        }
        if (rule.id !== 'PA' && (/^0/.test(v) || /^(\d)\1+$/.test(v))) { return 'Revisa el número: no parece un documento válido.'; }
        return '';
      }
    },
    fullName: {
      el: 'full-name',
      sanitize: function (v) {
        return v.replace(new RegExp('[^' + LETTERS + '\\s\'’-]', 'g'), '').replace(/^\s+/, '').replace(/\s{2,}/g, ' ').slice(0, 60);
      },
      validate: function (v) {
        v = collapse(v);
        if (!v) { return 'Ingresa tu nombre completo.'; }
        var words = v.split(' ');
        if (words.length < 2) { return 'Escribe al menos tu nombre y un apellido.'; }
        if (!words.every(function (w) { return WORD_RE.test(w); })) { return 'Usa solo letras (se permite guion y apóstrofo).'; }
        if (v.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '').length < 5) { return 'El nombre es demasiado corto.'; }
        return '';
      }
    },
    phone: {
      el: 'phone',
      sanitize: function (v) {
        var digits = v.replace(/\D/g, '');
        if (digits.length > 10 && digits.indexOf('57') === 0) { digits = digits.slice(2); } /* admite +57 */
        return digits.slice(0, 10);
      },
      validate: function (v) {
        v = v.replace(/\s/g, ''); /* el campo se muestra formateado: 312 456 7890 */
        if (!v) { return 'Ingresa tu número de celular.'; }
        if (v.length !== 10) { return 'El celular debe tener 10 dígitos (llevas ' + v.length + ').'; }
        if (v.charAt(0) !== '3') { return 'Los celulares en Colombia empiezan por 3.'; }
        return '';
      }
    },
    reason: {
      el: 'reason',
      sanitize: function (v) { return v.replace(/[\u0000-\u001F\u007F<>]/g, ' ').replace(/\s{2,}/g, ' ').replace(/^\s+/, '').slice(0, 250); },
      validate: function (v) {
        v = collapse(v);
        if (!v) { return 'Cuéntanos brevemente el motivo de tu consulta.'; }
        if (v.length < 10) { return 'Describe un poco más el motivo (mínimo 10 caracteres).'; }
        if (!new RegExp('[' + LETTERS + ']{3,}').test(v)) { return 'Escribe el motivo con palabras.'; }
        return '';
      }
    },
    consent: {
      el: 'consent',
      sanitize: null,
      validate: function () { return $('consent').checked ? '' : 'Debes aceptar el tratamiento de tus datos para continuar.'; }
    }
  };

  function wrapperOf(input) { return input.closest('.field'); }

  function showResult(field, message) {
    var input = $(field.el);
    var wrap = wrapperOf(input);
    wrap.classList.toggle('has-error', !!message);
    wrap.classList.toggle('is-valid', !message && !!input.value);
    wrap.querySelector('.msg').textContent = message;
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function checkField(field) {
    var input = $(field.el);
    var value = input.type === 'checkbox' ? '' : input.value;
    var message = field.validate(value);
    showResult(field, message);
    return !message;
  }

  function bindForm() {
    Object.keys(FIELDS).forEach(function (key) {
      var field = FIELDS[key];
      var input = $(field.el);
      var touched = false;

      if (field.sanitize) {
        input.addEventListener('input', function () {
          var clean = field.sanitize(input.value);
          if (clean !== input.value) { input.value = clean; }
          if (key === 'reason') { $('reason-counter').textContent = input.value.length + ' / 250'; }
          if (touched) { checkField(field); }
        });
      }
      input.addEventListener(input.type === 'checkbox' ? 'change' : 'blur', function () {
        touched = true;
        if (key === 'fullName' || key === 'reason') { input.value = collapse(input.value); }
        if (key === 'phone' && input.value.length === 10) {
          input.value = input.value.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
        }
        checkField(field);
      });
      if (key === 'phone') {
        input.addEventListener('focus', function () { input.value = input.value.replace(/\s/g, ''); });
      }
    });

    /* Cambio de tipo de documento: ajusta largo máximo y vuelve a validar */
    $('doc-type').addEventListener('change', function () {
      var rule = docRule();
      var num = $('doc-number');
      num.maxLength = rule.max;
      num.inputMode = rule.id === 'PA' ? 'text' : 'numeric';
      num.value = FIELDS.docNumber.sanitize(num.value);
      $('doc-help').textContent = rule.hint;
      if (num.value) { checkField(FIELDS.docNumber); }
    });

    /* Sugerencias rápidas de motivo */
    $('reason-chips').addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || chip.disabled) { return; }
      var reason = $('reason');
      reason.value = chip.getAttribute('data-reason');
      $('reason-counter').textContent = reason.value.length + ' / 250';
      checkField(FIELDS.reason);
      reason.focus();
    });

    $('appointment-form').addEventListener('submit', onSubmit);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!state.time) { return; }

    var firstInvalid = null;
    Object.keys(FIELDS).forEach(function (key) {
      if (!checkField(FIELDS[key]) && !firstInvalid) { firstInvalid = $(FIELDS[key].el); }
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    var btn = $('submit-btn');
    btn.disabled = true;
    btn.classList.add('is-loading');
    setTimeout(function () {
      btn.classList.remove('is-loading');
      showConfirmation();
    }, 900);
  }
})();
