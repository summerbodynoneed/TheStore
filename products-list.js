// ============================================
// LISTE PRODUITS - AFFICHAGE GRILLE
// ============================================

// Afficher tous les produits dans une grille
function displayProductsList() {
  const productList = document.getElementById('product-list');
  
  if (!productList) return;
  
  productList.innerHTML = '';

  products.forEach(product => {
    const productTile = document.createElement('div');
    productTile.className = 'product-tile';
    
    productTile.innerHTML = `
      <div class="product-image-container">
        <img src="${product.image_url}" alt="${product.name}" style="max-width: 100%; max-height: 150px;">
      </div>
      <h3>${product.name}</h3>
      <p><strong>${product.price} €</strong></p>
      <p>${product.description}</p>
      <div class="details-button" onclick="window.location.href='product.html?id=${product.id}'">Voir les détails</div>
    `;
    
    productList.appendChild(productTile);
  });
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', displayProductsList);
