(function () {
  'use strict';
  // Set your Cloudflare Turnstile *site key* here (public). Leave empty to disable the widget.
  var TURNSTILE_SITE_KEY = '';
  var MAILTO = 'samairansh@gmail.com';

  document.documentElement.classList.remove('no-js');

  // Mobile menu
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (btn && nav) {
    var set = function (open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
    };
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else { items.forEach(function (el) { el.classList.add('in'); }); }

  // Forms: post to /api/contact (Cloudflare Pages Function). Falls back to the visitor's email app.
  var form = document.querySelector('form[data-form]');
  if (!form) return;
  var status = form.querySelector('.status');
  var holder = form.querySelector('.cf-turnstile');
  if (TURNSTILE_SITE_KEY && holder) {
    holder.setAttribute('data-sitekey', TURNSTILE_SITE_KEY);
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'; s.async = true; s.defer = true;
    document.head.appendChild(s);
  }
  function say(msg, ok) { status.textContent = msg; status.className = 'status ' + (ok ? 'ok' : 'err'); }
  function fallback(data) {
    var body = Object.keys(data).filter(function (k) { return k !== 'website' && k.indexOf('cf-') !== 0; })
      .map(function (k) { return k + ': ' + data[k]; }).join('\n');
    window.location.href = 'mailto:' + MAILTO + '?subject=' + encodeURIComponent('Website enquiry') + '&body=' + encodeURIComponent(body);
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var data = {}; new FormData(form).forEach(function (v, k) { data[k] = v; });
    var submit = form.querySelector('button[type=submit]'); submit.disabled = true; say('Sending…', true);
    fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) { form.reset(); say('Thank you. Your message has been sent and we will reply soon.', true); }
        else { say(res.j && res.j.error ? res.j.error : 'Something went wrong.', false); }
      })
      .catch(function () { say('Opening your email app instead…', false); fallback(data); })
      .then(function () { submit.disabled = false; });
  });
})();
