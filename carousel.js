// ============================================
// CAROUSEL - AFFICHAGE DES PRODUITS
// ============================================

let currentSlide = 0;
const itemsPerView = 3;

// Initialiser le carousel avec tous les produits
function initCarousel() {
  const carouselInner = document.getElementById('carousel-inner');
  if (!carouselInner) return;
  
  carouselInner.innerHTML = '';

  // Limiter à 3 produits pour la page d'accueil
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

  updateCarousel();
}

// Mettre à jour l'affichage du carousel
function updateCarousel() {
  const slides = document.querySelectorAll('.carousel-slide');
  slides.forEach((slide, index) => {
    if (index >= currentSlide && index < currentSlide + itemsPerView) {
      slide.style.display = 'block';
    } else {
      slide.style.display = 'none';
    }
  });

  updateDots();
}

// Aller à la slide suivante
function nextSlide() {
  const slides = document.querySelectorAll('.carousel-slide');
  if (currentSlide < slides.length - itemsPerView) {
    currentSlide++;
  } else {
    currentSlide = 0;
  }
  updateCarousel();
}

// Aller à la slide précédente
function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
  } else {
    currentSlide = Math.max(0, document.querySelectorAll('.carousel-slide').length - itemsPerView);
  }
  updateCarousel();
}

// Mettre à jour les points de pagination
function updateDots() {
  const dotsContainer = document.getElementById('carousel-dots');
  if (!dotsContainer) return;
  
  const slides = document.querySelectorAll('.carousel-slide');
  const numDots = Math.ceil(slides.length / itemsPerView);
  
  dotsContainer.innerHTML = '';
  for (let i = 0; i < numDots; i++) {
    const dot = document.createElement('span');
    dot.className = 'carousel-dot' + (i === Math.floor(currentSlide / itemsPerView) ? ' active' : '');
    dot.onclick = () => {
      currentSlide = i * itemsPerView;
      updateCarousel();
    };
    dotsContainer.appendChild(dot);
  }
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', initCarousel);
