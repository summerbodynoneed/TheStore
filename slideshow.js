/* ============================================================
   SLIDESHOW.JS — Défilement automatique des slides
   initSlideshow() est appelé par index.html après le fetch
   Fonctions globales : nextSlide(), prevSlide(), goToSlide(n)
   ============================================================ */

(function () {
  const INTERVALLE_MS = 4000;
  let indexActuel = 0;
  let timer       = null;
  let slides      = [];
  let dots        = [];

  // ── Initialisation (appelée depuis index.html après le fetch) ──
  window.initSlideshow = function () {
    slides = document.querySelectorAll('.slide');
    dots   = document.querySelectorAll('.slide-dot');

    if (slides.length === 0) return;

    slides.forEach(function (s, i) { s.classList.toggle('active', i === 0); });
    dots.forEach(function (d, i)   { d.classList.toggle('active',  i === 0); });

    indexActuel = 0;
    demarrerAuto();

    const container = document.getElementById('slideshow');
    if (container) {
      container.addEventListener('mouseenter', arreterAuto);
      container.addEventListener('mouseleave', demarrerAuto);
    }
  };

  // ── Aller à un slide précis ───────────────────────────────────
  function allerA(index) {
    if (slides.length === 0) return;
    if (index >= slides.length) index = 0;
    if (index < 0)             index = slides.length - 1;

    slides[indexActuel].classList.remove('active');
    if (dots[indexActuel]) dots[indexActuel].classList.remove('active');

    indexActuel = index;

    slides[indexActuel].classList.add('active');
    if (dots[indexActuel]) dots[indexActuel].classList.add('active');
  }

  // ── Auto-play ─────────────────────────────────────────────────
  function demarrerAuto() {
    arreterAuto();
    timer = setInterval(function () { allerA(indexActuel + 1); }, INTERVALLE_MS);
  }

  function arreterAuto() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  // ── Fonctions globales pour les boutons HTML ──────────────────
  window.nextSlide = function () { arreterAuto(); allerA(indexActuel + 1); demarrerAuto(); };
  window.prevSlide = function () { arreterAuto(); allerA(indexActuel - 1); demarrerAuto(); };
  window.goToSlide = function (n) { arreterAuto(); allerA(n); demarrerAuto(); };

})();