/* Plume & Moka — scripts du site */

// ⚠️ Remplacer par le vrai numéro WhatsApp (format international, sans + ni espaces)
var WA_NUMBER = '212600000000';

function waLink(msg) {
  return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
}
var WA_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3.5 20.5l1.3-4.3A8.5 8.5 0 1 1 8 19.4z"></path></svg>';

document.addEventListener('DOMContentLoaded', function () {
  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Liens WhatsApp génériques : <a data-wa="message">
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = waLink(a.getAttribute('data-wa') || 'Bonjour Plume & Moka !');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  initBoutique();
  initWorkshops();
  initGalerie();
});

/* ---------- Boutique ---------- */
var PRODUCTS = [
  { id: 1, cat: 'Papeterie', name: 'Pochette « Tablette time »' },
  { id: 2, cat: 'Papeterie', name: 'Cartes de vœux illustrées' },
  { id: 3, cat: 'Accessoires', name: 'Chouchou imprimé' },
  { id: 4, cat: 'Accessoires', name: 'Bijou de téléphone perlé' },
  { id: 5, cat: 'Accessoires', name: 'Trousse brodée' },
  { id: 6, cat: 'Déco', name: 'Vase céramique mouchetée' },
  { id: 7, cat: 'Déco', name: 'Vide-poche coloré' },
  { id: 8, cat: 'Déco', name: 'Mug émaillé' },
  { id: 9, cat: 'Mode', name: 'Sac bandoulière' },
  { id: 10, cat: 'Mode', name: 'Surchemise oversize' },
  { id: 11, cat: 'Coffee', name: 'Café en grains — maison' },
  { id: 12, cat: 'Déco', name: 'Bougie parfumée' }
];

function productCard(p, withAdd) {
  var add = withAdd ? '<button type="button" class="add" data-id="' + p.id + '">Ajouter</button>' : '';
  return '<article class="product">' +
    '<div class="ph">[Photo produit]</div>' +
    '<div class="cat">' + p.cat + '</div>' +
    '<h3>' + p.name + '</h3>' +
    '<span>[PRIX] DH</span>' +
    '<div class="actions">' + add +
    '<a class="wa" href="' + waLink('Bonjour Plume & Moka ! Je souhaite commander : ' + p.name) + '" target="_blank" rel="noopener" aria-label="Commander « ' + p.name + ' » sur WhatsApp">' + WA_ICON + '</a>' +
    '</div></article>';
}

function initBoutique() {
  // Aperçu sur l'accueil
  var picks = document.getElementById('picks');
  if (picks) {
    picks.innerHTML = [1, 3, 4, 6].map(function (id) {
      return productCard(PRODUCTS.filter(function (p) { return p.id === id; })[0], false);
    }).join('');
  }

  var grid = document.getElementById('products');
  if (!grid) return;
  var filters = document.getElementById('filters');
  var bar = document.getElementById('selbar');
  var cat = 'Tout';
  var sel = {};

  function render() {
    grid.innerHTML = PRODUCTS.filter(function (p) { return cat === 'Tout' || p.cat === cat; })
      .map(function (p) { return productCard(p, true); }).join('');
    grid.querySelectorAll('.add').forEach(function (b) {
      var id = +b.getAttribute('data-id');
      if (sel[id]) { b.classList.add('in'); b.textContent = 'Ajouté ✓'; }
      b.addEventListener('click', function () {
        if (sel[id]) delete sel[id]; else sel[id] = true;
        render();
      });
    });
    var chosen = PRODUCTS.filter(function (p) { return sel[p.id]; });
    bar.classList.toggle('show', chosen.length > 0);
    document.getElementById('selcount').textContent = chosen.length + (chosen.length > 1 ? ' articles' : ' article');
    document.getElementById('selsend').href = waLink('Bonjour Plume & Moka ! Je souhaite commander :\n' +
      chosen.map(function (p) { return '• ' + p.name; }).join('\n'));
  }

  filters.querySelectorAll('.pill').forEach(function (b) {
    b.addEventListener('click', function () {
      cat = b.getAttribute('data-cat');
      filters.querySelectorAll('.pill').forEach(function (x) {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
      });
      render();
    });
  });
  render();
}

/* ---------- Workshops ---------- */
function initWorkshops() {
  var form = document.getElementById('booking');
  if (!form) return;
  var state = { at: 'Peinture sur céramique', date: '', n: 1 };

  function pickGroup(selector, key, label) {
    var els = document.querySelectorAll(selector);
    els.forEach(function (b, i) {
      if (i === 0) { b.classList.add('on'); state[key] = b.getAttribute('data-v'); }
      b.addEventListener('click', function () {
        els.forEach(function (x) { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        state[key] = b.getAttribute('data-v');
        update();
        if (key === 'at') document.getElementById('reserver').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }
  pickGroup('.atelier', 'at');
  pickGroup('.datepill', 'date');

  document.getElementById('dec').addEventListener('click', function () { state.n = Math.max(1, state.n - 1); update(); });
  document.getElementById('inc').addEventListener('click', function () { state.n = Math.min(10, state.n + 1); update(); });
  document.getElementById('fname').addEventListener('input', update);
  document.getElementById('fphone').addEventListener('input', update);

  function update() {
    document.getElementById('count').textContent = state.n;
    document.getElementById('r-at').textContent = state.at;
    document.getElementById('r-date').textContent = state.date;
    document.getElementById('r-n').textContent = state.n;
    var name = document.getElementById('fname').value || '-';
    var phone = document.getElementById('fphone').value || '-';
    document.getElementById('book').href = waLink('Bonjour Plume & Moka ! Je souhaite réserver :\n• Atelier : ' + state.at +
      '\n• Date : ' + state.date + '\n• Participants : ' + state.n + '\n• Nom : ' + name + '\n• Tél : ' + phone);
  }
  update();
}

/* ---------- Galerie ---------- */
function initGalerie() {
  var g = document.getElementById('gallery');
  if (!g) return;
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('img');
  var boxPh = box.querySelector('.ph');
  var boxCap = box.querySelector('.cap');
  var items = g.querySelectorAll('button');

  items.forEach(function (b) {
    b.addEventListener('click', function () {
      var img = b.querySelector('img');
      if (img) { boxImg.src = img.src; boxImg.alt = b.getAttribute('aria-label'); boxImg.hidden = false; boxPh.hidden = true; }
      else { boxImg.hidden = true; boxPh.hidden = false; }
      boxCap.textContent = b.getAttribute('aria-label');
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      box.querySelector('.close').focus();
    });
  });
  function close() { box.classList.remove('open'); document.body.style.overflow = ''; }
  box.querySelector('.close').addEventListener('click', close);
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  document.querySelectorAll('#gfilters .pill').forEach(function (p) {
    p.addEventListener('click', function () {
      var c = p.getAttribute('data-cat');
      document.querySelectorAll('#gfilters .pill').forEach(function (x) { x.classList.toggle('on', x === p); x.setAttribute('aria-pressed', x === p ? 'true' : 'false'); });
      items.forEach(function (b) { b.hidden = !(c === 'Tout' || b.getAttribute('data-cat') === c); });
    });
  });
}
