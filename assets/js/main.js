/* Interattività del sito in JavaScript vanilla.
   Replica il comportamento dei componenti React dell'originale:
   reveal allo scroll, contatori, header, menu mobile, torna su,
   banner cookie, lightbox galleria, FAQ (accordion) e newsletter. */
(function () {
  'use strict';

  var CONTACT = {
    phone: '+244 953 675 657',
    phoneHref: '+244953675657',
    whatsappUrl: 'https://wa.me/244953675657',
    email: 'caelus.dentaria@gmail.com',
    address: 'Vila do Gamek, Luanda, Angola',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Vila%20do%20Gamek%2C%20Luanda%2C%20Angola',
    hours: 'Segunda – Sábado · 08h00 – 18h00'
  };

  var BTN_BASE = 'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer ' +
    'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ' +
    'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed';
  var BTN_PRIMARY = 'bg-primary text-primary-foreground shadow hover:bg-primary/90';

  var ICONS = {
    menu: '<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>',
    x: '<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>'
  };

  function icon(name, cls) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="' +
      (cls || '') + '" aria-hidden="true">' + ICONS[name] + '</svg>';
  }

  function storage(fn) {
    try { return fn(window.localStorage); } catch (e) { return null; }
  }

  function swap(el, from, to) {
    from.split(' ').forEach(function (c) { if (c) el.classList.remove(c); });
    to.split(' ').forEach(function (c) { if (c) el.classList.add(c); });
  }

  function onScroll(fn) {
    fn();
    window.addEventListener('scroll', fn, { passive: true });
  }

  /* ---- Reveal allo scroll --------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    var show = function (el) { swap(el, 'translate-y-8 opacity-0', 'translate-y-0 opacity-100'); };
    if (!('IntersectionObserver' in window)) { items.forEach(show); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Contatori -------------------------------------------------------- */
  function initCounters() {
    var items = document.querySelectorAll('[data-count]');
    var render = function (el, n) {
      el.textContent = n.toLocaleString('pt-PT') + (el.getAttribute('data-suffix') || '');
    };
    var run = function (el) {
      var target = Number(el.getAttribute('data-count'));
      var start = performance.now();
      var tick = function (now) {
        var p = Math.min((now - start) / 1600, 1);
        render(el, Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { render(el, Number(el.getAttribute('data-count'))); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---- Header: compatto dopo lo scroll --------------------------------- */
  function initHeader() {
    var bar = document.querySelector('header > div.border-b');
    if (!bar) return;
    var idle = 'bg-background/60 py-4 backdrop-blur-md';
    var scrolled = 'bg-background/85 py-2 shadow-soft backdrop-blur-xl';
    var state = null;
    onScroll(function () {
      var s = window.scrollY > 24;
      if (s === state) return;
      state = s;
      if (s) swap(bar, idle, scrolled); else swap(bar, scrolled, idle);
    });
  }

  /* ---- Menu mobile ------------------------------------------------------ */
  function initMobileMenu() {
    var toggle = document.querySelector('header button[aria-label="Abrir menu"]');
    var bar = document.querySelector('header > div.border-b');
    var desktopNav = document.querySelector('header nav[aria-label="Navegação principal"]');
    if (!toggle || !bar || !desktopNav) return;

    // Le icone del pannello contatti vengono riusate dalla barra superiore.
    var topIcon = function (sel) {
      var svg = document.querySelector('header ' + sel + ' svg');
      if (!svg) return '';
      var clone = svg.cloneNode(true);
      clone.setAttribute('class', clone.getAttribute('class').replace(/\bh-\S+|\bw-\S+|shrink-0|text-accent/g, '') +
        ' h-3.5 w-3.5 shrink-0 text-accent');
      return clone.outerHTML;
    };
    var clockSvg = document.querySelector('header .lg\\:flex > div > span svg');
    var icons = {
      phone: topIcon('a[href^="tel:"]'),
      whatsapp: topIcon('a[href^="https://wa.me"][aria-label]'),
      mail: topIcon('a[href^="mailto:"]'),
      map: topIcon('a[href*="google.com/maps"]'),
      clock: clockSvg ? clockSvg.outerHTML.replace(/class="([^"]*)"/, 'class="$1 h-3.5 w-3.5 shrink-0 text-accent"') : ''
    };
    var row = 'flex items-center gap-2 rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary';

    var links = Array.prototype.map.call(desktopNav.querySelectorAll('a'), function (a) {
      return '<li><a href="' + a.getAttribute('href') + '" class="block rounded-2xl px-4 py-3 text-sm tracking-wide transition-colors hover:bg-secondary"' +
        (a.hasAttribute('aria-current') ? ' aria-current="page"' : '') + '>' + a.textContent + '</a></li>';
    }).join('');

    var nav = document.createElement('nav');
    nav.className = 'animate-lux-in mx-6 mt-3 rounded-3xl border border-border bg-card p-5 shadow-lift lg:hidden';
    nav.setAttribute('aria-label', 'Navegação móvel');
    nav.id = 'mobile-nav';
    nav.hidden = true;
    nav.innerHTML =
      '<ul class="grid gap-1">' + links + '</ul>' +
      '<a href="' + CONTACT.whatsappUrl + '" target="_blank" rel="noreferrer" class="' + BTN_BASE + ' ' + BTN_PRIMARY +
        ' text-sm h-10 px-8 mt-3 w-full rounded-full">Marcar Consulta</a>' +
      '<div class="mt-4 border-t border-border pt-4">' +
        '<p class="mb-3 text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">Contacto</p>' +
        '<div class="grid gap-2 text-xs">' +
          '<a href="tel:' + CONTACT.phoneHref + '" class="' + row + '">' + icons.phone + '<span>' + CONTACT.phone + '</span></a>' +
          '<a href="' + CONTACT.whatsappUrl + '" target="_blank" rel="noreferrer" class="' + row + '">' + icons.whatsapp + '<span>WhatsApp</span></a>' +
          '<a href="mailto:' + CONTACT.email + '" class="' + row + '">' + icons.mail + '<span class="truncate">' + CONTACT.email + '</span></a>' +
          '<a href="' + CONTACT.mapUrl + '" target="_blank" rel="noreferrer" class="' + row + '">' + icons.map + '<span class="truncate">' + CONTACT.address + '</span></a>' +
          '<div class="flex items-center gap-2 rounded-xl px-3 py-2.5 text-muted-foreground">' + icons.clock + '<span>' + CONTACT.hours + '</span></div>' +
        '</div>' +
      '</div>';
    bar.appendChild(nav);

    toggle.setAttribute('aria-controls', 'mobile-nav');
    toggle.setAttribute('aria-expanded', 'false');

    var setOpen = function (open) {
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      toggle.innerHTML = icon(open ? 'x' : 'menu', 'h-5 w-5');
    };
    toggle.addEventListener('click', function () { setOpen(nav.hidden); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 64rem)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  /* ---- Torna su --------------------------------------------------------- */
  function initBackToTop() {
    var btn = document.querySelector('button[aria-label="Voltar ao topo"]');
    if (!btn) return;
    var hidden = 'pointer-events-none translate-y-3 opacity-0';
    var shown = 'translate-y-0 opacity-100';
    btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    onScroll(function () {
      if (window.scrollY > 600) swap(btn, hidden, shown); else swap(btn, shown, hidden);
    });
  }

  /* ---- Banner cookie ---------------------------------------------------- */
  function initCookies() {
    if (storage(function (s) { return s.getItem('dpk-cookies'); }) === 'ok') return;
    var sm = BTN_BASE + ' h-8 px-3 text-xs rounded-full';
    var box = document.createElement('div');
    box.className = 'animate-lux-in fixed bottom-5 left-5 z-50 max-w-sm rounded-3xl border border-border bg-card/95 p-5 shadow-lift backdrop-blur-xl';
    box.setAttribute('role', 'region');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p class="text-sm leading-relaxed text-muted-foreground">Utilizamos cookies para melhorar a sua experiência de navegação e compreender como o site é utilizado.</p>' +
      '<div class="mt-4 flex gap-2">' +
        '<button type="button" data-cookie="accept" class="' + sm + ' ' + BTN_PRIMARY + '">Aceitar</button>' +
        '<button type="button" data-cookie="later" class="' + sm + ' hover:bg-accent hover:text-accent-foreground">Mais tarde</button>' +
      '</div>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cookie]');
      if (!b) return;
      if (b.getAttribute('data-cookie') === 'accept') {
        storage(function (s) { s.setItem('dpk-cookies', 'ok'); });
      }
      box.remove();
    });
    document.body.appendChild(box);
  }

  /* ---- Lightbox galleria ------------------------------------------------ */
  function initLightbox() {
    var triggers = document.querySelectorAll('button[aria-label^="Ampliar imagem"]');
    if (!triggers.length || typeof HTMLDialogElement === 'undefined') return;
    var dialog = document.createElement('dialog');
    dialog.className = 'lightbox';
    dialog.innerHTML = '<img alt=""><button type="button" class="lightbox__close" aria-label="Fechar">' + icon('x') + '</button>';
    document.body.appendChild(dialog);
    var img = dialog.querySelector('img');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.querySelector('img');
        img.src = src.getAttribute('src');
        img.alt = src.getAttribute('alt') || '';
        dialog.setAttribute('aria-label', btn.getAttribute('aria-label').replace('Ampliar imagem: ', ''));
        dialog.showModal();
      });
    });
    dialog.addEventListener('click', function (e) {
      // clic sul backdrop (fuori dall'immagine) o sul pulsante di chiusura
      if (e.target === dialog || e.target.closest('.lightbox__close')) dialog.close();
    });
  }

  /* ---- FAQ (accordion singolo, richiudibile) --------------------------- */
  function initAccordion() {
    var regions = document.querySelectorAll('[role="region"][aria-labelledby]');
    if (!regions.length) return;
    var items = Array.prototype.map.call(regions, function (region) {
      return {
        region: region,
        button: document.getElementById(region.getAttribute('aria-labelledby')),
        root: region.parentElement
      };
    }).filter(function (it) { return it.button; });

    var setState = function (it, open) {
      var state = open ? 'open' : 'closed';
      [it.root, it.button.parentElement, it.button, it.region].forEach(function (el) {
        el.setAttribute('data-state', state);
      });
      it.button.setAttribute('aria-expanded', String(open));
      if (open) {
        it.region.hidden = false;
        it.region.style.setProperty('--radix-accordion-content-height', it.region.scrollHeight + 'px');
      } else {
        it.region.style.setProperty('--radix-accordion-content-height', it.region.scrollHeight + 'px');
        var done = function () {
          if (it.region.getAttribute('data-state') === 'closed') it.region.hidden = true;
        };
        it.region.addEventListener('animationend', done, { once: true });
        setTimeout(done, 400);
      }
    };

    items.forEach(function (it) {
      it.button.setAttribute('aria-controls', it.region.id);
      it.button.addEventListener('click', function () {
        var wasOpen = it.button.getAttribute('data-state') === 'open';
        items.forEach(function (other) {
          if (other !== it && other.button.getAttribute('data-state') === 'open') setState(other, false);
        });
        setState(it, !wasOpen);
      });
    });
  }

  /* ---- Newsletter + toast ---------------------------------------------- */
  function toast(message) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('role', 'status');
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-leaving');
      setTimeout(function () { el.remove(); }, 300);
    }, 4000);
  }

  function initNewsletter() {
    var input = document.getElementById('newsletter');
    var form = input && input.closest('form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!input.value) return;
      input.value = '';
      toast('Obrigado! Subscrição confirmada.');
    });
  }

  /* ---- Anno nel footer -------------------------------------------------- */
  function initYear() {
    var p = document.querySelector('footer p.mt-14 + div > p');
    if (p) p.textContent = p.textContent.replace(/\d{4}/, String(new Date().getFullYear()));
  }

  document.documentElement.classList.add('js');
  initReveal();
  initCounters();
  initHeader();
  initMobileMenu();
  initBackToTop();
  initCookies();
  initLightbox();
  initAccordion();
  initNewsletter();
  initYear();
})();
