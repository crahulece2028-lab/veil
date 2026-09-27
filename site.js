// Veil landing page — theme toggle only. Kept deliberately small: the page
// has no interactive behaviour beyond switching colour scheme, and the theme
// is applied before first paint by the inline script in index.html.

(function () {
  var btn = document.getElementById('themeBtn');
  if (!btn) return;

  var root = document.documentElement;

  function label() {
    btn.textContent = root.dataset.theme === 'dark' ? 'Light' : 'Dark';
    btn.setAttribute('aria-label',
      root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
  }

  label();

  btn.addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('veil-theme', next); } catch (e) { /* private mode */ }
    label();
  });
})();
