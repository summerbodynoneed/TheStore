// ============================================
// CAROUSEL - AFFICHAGE DES PRODUITS (3 images)
// ============================================

let currentSlide = 0;

function initCarousel() {
  const carouselInner = document.getElementById('carousel-inner');
  if (!carouselInner) return;

  carouselInner.innerHTML = '';

  const homepageProducts = products.slice(0, 3);

  homepageProducts.forEach((product) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.style.cursor = 'pointer';

    slide.innerHTML = `
      <div class="carousel-item">
        <img src="${product.image_url}" alt="${product.name}" onclick="window.location.href='product.html?id=${product.id}'">
        <h3>${product.name}</h3>
        <p>${product.price} €</p>
      </div>
    `;

    carouselInner.appendChild(slide);
  });

  currentSlide = 0;
  updateCarousel();
}

function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');

  slides.forEach((slide, index) => {
    slide.style.display = index === currentSlide ? 'block' : 'none';
  });

  updateDots();
}

function nextSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  currentSlide = (currentSlide + 1) % slides.length;
  updateCarousel();
}

function prevSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateCarousel();
}

function updateDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  if (!dotsContainer) return;

  const slides = document.querySelectorAll('.carousel-slide');

  dotsContainer.innerHTML = '';
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot' + (i === currentSlide ? ' active' : '');
    dot.onclick = () => {
      currentSlide = i;
      updateCarousel();
    };
    dotsContainer.appendChild(dot);
  });
}

document.addEventListener('DOMContentLoaded', initCarousel);