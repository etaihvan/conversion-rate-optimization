// Mobile menu
(function () {
  var btn = document.querySelector('.p-menu-btn');
  var menu = document.getElementById('p-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
  });
})();

// Use-case filters
(function () {
  var buttons = document.querySelectorAll('.p-filter');
  var items = document.querySelectorAll('.p-use');
  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.getAttribute('data-filter');
      buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      items.forEach(function (it) { it.hidden = !(f === 'all' || it.getAttribute('data-cat') === f); });
    });
  });
})();

// dataLayer events for GTM + footer year
(function () {
  window.dataLayer = window.dataLayer || [];
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    form.addEventListener('submit', function () {
      window.dataLayer.push({ event: 'form_submit', form_name: form.getAttribute('name') });
    });
  });
  document.querySelectorAll('a[href^="/work/"]').forEach(function (a) {
    a.addEventListener('click', function () {
      window.dataLayer.push({ event: 'case_study_click', case_study: a.getAttribute('href') });
    });
  });
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
