/* ==========================================================================
   Oral Group Pro · UI COMPARTIDA
   - Menú único y pie de página (se escriben UNA sola vez, aquí)
   - Iconos SVG, marcador de imagen (montaña) y utilidades de formato
   Se carga en TODAS las páginas después de data.js.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.OGP.data;

  /* ---------- Iconos (SVG de trazo, 24x24) ---------- */
  var PATHS = {
    image: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
    tooth: '<path d="M12 2C8.5 2 6 4 6 7.5c0 2.5 1 5.5 2 10 .8 3.5 2.5 4.5 4 4.5s3.2-1 4-4.5c1-4.5 2-7.5 2-10C18 4 15.5 2 12 2z"/><path d="M9.5 9c.7 1.2 1.6 1.8 2.5 1.8s1.8-.6 2.5-1.8"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    idcard: '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.5-1.5 1.7-2 3-2s2.5.5 3 2"/><line x1="14" y1="10" x2="19" y2="10"/><line x1="14" y1="14" x2="19" y2="14"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>',
    pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
    chat: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/>',
    check: '<polyline points="20 6 9 17 4 12"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="3"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><circle cx="12" cy="16" r="1.5"/>',
    star: '<polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/>',
    heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
    menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    print: '<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
    refresh: '<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>',
    alert: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    left: '<polyline points="15 18 9 12 15 6"/>',
    right: '<polyline points="9 18 15 12 9 6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>'
  };

  function icon(name, size) {
    var s = size || 20;
    return '<svg class="icon" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' + (PATHS[name] || '') + '</svg>';
  }

  /* ---------- Utilidades ---------- */
  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  }

  function capitalize(text) { return text.charAt(0).toUpperCase() + text.slice(1); }

  /* '2026-09-12' -> '12 de septiembre de 2026' (sin desfase de zona horaria) */
  function parseISO(iso) {
    var p = iso.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function formatLong(date, withWeekday) {
    var opts = { day: 'numeric', month: 'long', year: 'numeric' };
    if (withWeekday) { opts.weekday = 'long'; }
    return capitalize(new Intl.DateTimeFormat('es-CO', opts).format(date));
  }

  /* '14:00' -> '2:00 p. m.' */
  function formatTime(hhmm) {
    var p = hhmm.split(':');
    var h = Number(p[0]);
    var suffix = h >= 12 ? 'p. m.' : 'a. m.';
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ':' + p[1] + ' ' + suffix;
  }

  /* ---------- Marcador de imagen (icono de montaña) ----------
     Si "src" viene vacío se muestra el marcador; si trae ruta, la imagen real. */
  function mediaHTML(label, src) {
    if (src) {
      return '<img src="' + esc(src) + '" alt="' + esc(label) + '" loading="lazy">';
    }
    return '<div class="media-empty" role="img" aria-label="Espacio para imagen: ' + esc(label) + '">' +
      icon('image', 44) + '<span>' + esc(label) + '</span></div>';
  }

  function fillStaticMedia() {
    var nodes = document.querySelectorAll('[data-media]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = mediaHTML(nodes[i].getAttribute('data-media'), nodes[i].getAttribute('data-src') || '');
    }
  }

  /* Elementos con data-icon="nombre" reciben su SVG (data-size opcional) */
  function fillIcons() {
    var nodes = document.querySelectorAll('[data-icon]');
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].innerHTML = icon(nodes[i].getAttribute('data-icon'), Number(nodes[i].getAttribute('data-size')) || 20);
    }
  }

  /* ---------- Menú único + pie de página ---------- */
  var NAV = [
    { id: 'inicio', label: 'Inicio', href: 'index.html' },
    { id: 'especialidades', label: 'Especialidades', href: 'especialidades.html' },
    { id: 'equipo', label: 'Equipo Odontológico', href: 'equipo.html' },
    { id: 'agendamiento', label: 'Agendamiento', href: 'agendamiento.html' },
    { id: 'testimonios', label: 'Testimonios', href: 'testimonios.html' },
    { id: 'contacto', label: 'Contacto', href: 'contacto.html' }
  ];

  function renderHeader() {
    var mount = document.getElementById('site-header');
    if (!mount) { return; }
    var current = document.body.getAttribute('data-page');
    var links = NAV.map(function (item) {
      var active = item.id === current;
      return '<li><a href="' + item.href + '"' + (active ? ' class="is-active" aria-current="page"' : '') + '>' +
        esc(item.label) + '</a></li>';
    }).join('');

    mount.className = 'site-header';
    mount.innerHTML =
      '<div class="container header-inner">' +
        '<a class="brand" href="index.html" aria-label="' + esc(D.clinic.name) + ' – ir al inicio">' +
          '<span class="brand-mark">' + icon('tooth', 26) + '</span>' +
          '<span class="brand-text"><strong>' + esc(D.clinic.name) + '</strong><small>' + esc(D.clinic.tagline) + '</small></span>' +
        '</a>' +
        '<button class="nav-toggle" id="nav-toggle" type="button" aria-expanded="false" aria-controls="main-nav" aria-label="Abrir menú">' +
          icon('menu', 24) +
        '</button>' +
        '<nav class="main-nav" id="main-nav" aria-label="Menú principal"><ul>' + links + '</ul></nav>' +
      '</div>';

    var toggle = document.getElementById('nav-toggle');
    var nav = document.getElementById('main-nav');
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      toggle.innerHTML = icon(open ? 'close' : 'menu', 24);
    });
  }

  function renderFooter() {
    var mount = document.getElementById('site-footer');
    if (!mount) { return; }
    mount.className = 'site-footer';
    mount.innerHTML =
      '<div class="container footer-inner">' +
        '<div><strong>' + esc(D.clinic.name) + '</strong><p>' + esc(D.clinic.tagline) + '</p></div>' +
        '<div><p>' + icon('pin', 16) + ' ' + esc(D.clinic.address) + '</p>' +
        '<p>' + icon('phone', 16) + ' ' + esc(D.clinic.phone) + '</p></div>' +
        '<p class="footer-note">© 2026 ' + esc(D.clinic.name) + ' · Proyecto integrador CESDE · Datos de ejemplo</p>' +
      '</div>';
  }

  window.OGP.ui = {
    icon: icon, esc: esc, byId: byId, capitalize: capitalize,
    parseISO: parseISO, formatLong: formatLong, formatTime: formatTime,
    mediaHTML: mediaHTML
  };

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderFooter();
    fillStaticMedia();
    fillIcons();
  });
})();
