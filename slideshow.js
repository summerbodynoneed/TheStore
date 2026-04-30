/* ============================================================
   SLIDESHOW.JS — Défilement automatique des slides
   Utilise les classes .slide et .slide.active du CSS
   Fonctions globales : nextSlide(), prevSlide(), goToSlide(n)
   ============================================================ */

(function () {
  const INTERVALLE_MS = 4000; // 4 secondes entre chaque slide
  let indexActuel    = 0;
  let timer          = null;
  let slides         = [];
  let dots           = [];

  // ── Initialisation après chargement du DOM ─────────────────
  document.addEventListener('DOMContentLoaded', function () {
    slides = document.querySelectorAll('.slide');
    dots   = document.querySelectorAll('.slide-dot');

    if (slides.length === 0) return;

    // S'assurer que seul le premier est actif au départ
    slides.forEach((s, i) => s.classList.toggle('active', i === 0));
    dots.forEach((d, i)   => d.classList.toggle('active',  i === 0));

    demarrerAuto();

    // Pause au survol du slideshow
    const container = document.getElementById('slideshow');
    if (container) {
      container.addEventListener('mouseenter', arreterAuto);
      container.addEventListener('mouseleave', demarrerAuto);
    }
  });

  // ── Aller à un slide précis ─────────────────────────────────
  function allerA(index) {
    if (slides.length === 0) return;

    // Retour cyclique
    if (index >= slides.length) index = 0;
    if (index < 0)              index = slides.length - 1;

    slides[indexActuel].classList.remove('active');
    if (dots[indexActuel]) dots[indexActuel].classList.remove('active');

    indexActuel = index;

    slides[indexActuel].classList.add('active');
    if (dots[indexActuel]) dots[indexActuel].classList.add('active');
  }

  // ── Défilement automatique ──────────────────────────────────
  function demarrerAuto() {
    arreterAuto();
    timer = setInterval(function () {
      allerA(indexActuel + 1);
    }, INTERVALLE_MS);
  }

  function arreterAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // ── Fonctions exposées globalement (appelées depuis le HTML) ─
  window.nextSlide = function () {
    arreterAuto();
    allerA(indexActuel + 1);
    demarrerAuto();
  };

  window.prevSlide = function () {
    arreterAuto();
    allerA(indexActuel - 1);
    demarrerAuto();
  };

  window.goToSlide = function (n) {
    arreterAuto();
    allerA(n);
    demarrerAuto();
  };

})();