/* Jude's Justice PMLD: "My file" storage shared by every page.
   Everything is kept in this browser only (localStorage). Nothing is sent anywhere. */
(function () {
  var KEY = 'jj-myfile-v1';

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && typeof d === 'object') { d.details = d.details || {}; d.records = d.records || []; d.training = d.training || []; return d; }
    } catch (e) {}
    return { details: {}, records: [], training: [] };
  }
  function save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); return true; } catch (e) { return false; }
  }
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  // Fill any element marked data-fill="field" with the saved value, if there is one.
  function fill(root) {
    var d = load().details;
    (root || document).querySelectorAll('[data-fill]').forEach(function (el) {
      var v = d[el.getAttribute('data-fill')];
      if (v) { el.textContent = v; el.classList.add('filled'); }
    });
  }

  // Show how much is saved next to the "My file" menu link.
  function badge() {
    var d = load();
    var n = Object.keys(d.details).filter(function (k) { return d.details[k]; }).length;
    var r = d.records.length;
    document.querySelectorAll('[data-myfile-count]').forEach(function (el) {
      el.textContent = (n || r) ? (r ? r + (r === 1 ? ' record' : ' records') : 'saved') : '';
      el.hidden = !(n || r);
    });
  }

  window.MyFile = { load: load, save: save, clear: clear, fill: fill, badge: badge };
  document.addEventListener('DOMContentLoaded', function () { fill(); badge(); });
})();

/* Menu: only one group open at a time; close when clicking elsewhere */
document.addEventListener('DOMContentLoaded', function () {
  var groups = document.querySelectorAll('.navgroup');
  groups.forEach(function (g) {
    g.addEventListener('toggle', function () { if (g.open) groups.forEach(function (o) { if (o !== g) o.open = false; }); });
  });
  document.addEventListener('click', function (e) { groups.forEach(function (g) { if (!g.contains(e.target)) g.open = false; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') groups.forEach(function (g) { g.open = false; }); });
});
