// ============================================
// DETAIL PRODUIT - AFFICHAGE ET ACHAT
// ============================================

let currentProduct = null;

// Charger les détails du produit
function loadProductDetails() {
  // Récupérer l'ID du produit depuis l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get('id')) || 1;

  // Trouver le produit
  currentProduct = products.find(p => p.id === productId);
  
  if (!currentProduct) {
    document.getElementById('message').innerText = "Produit non trouvé";
    document.getElementById('message').style.color = "red";
    return;
  }

  // Afficher les détails
  document.getElementById('title').innerText = currentProduct.name;
  document.getElementById('image').src = currentProduct.image_url;
  document.getElementById('price').innerText = `Prix : ${currentProduct.price} €`;
  document.getElementById('desc').innerText = currentProduct.long_description || currentProduct.description;

  // Remplir le sélecteur de taille
  const sizeSelect = document.getElementById('size');
  if (currentProduct.sizes && currentProduct.sizes.length > 0) {
    currentProduct.sizes.forEach(size => {
      const option = document.createElement('option');
      option.value = size;
      option.innerText = size;
      sizeSelect.appendChild(option);
    });
  } else {
    document.getElementById('size-selector').style.display = 'none';
  }
}

// Gérer l'ajout au panier
function handleAddToCart() {
  const sizeSelect = document.getElementById('size');
  const quantityInput = document.getElementById('quantity');
  const selectedSize = sizeSelect.value;
  const quantity = parseInt(quantityInput.value) || 1;

  // Valider la saise de taille
  if (currentProduct.sizes && currentProduct.sizes.length > 0 && !selectedSize) {
    showMessage("Veuillez choisir une taille !", "red");
    return;
  }

  // Valider la quantité
  if (quantity < 1) {
    showMessage("La quantité doit être au moins 1", "red");
    return;
  }

  // Ajouter au panier
  const success = addToCart(currentProduct.id, selectedSize || null, quantity);
  
  if (success) {
    showMessage(`${currentProduct.name} (quantité: ${quantity}) ajouté au panier !`, "green");
    // Réinitialiser le formulaire
    sizeSelect.value = '';
    quantityInput.value = 1;
  } else {
    showMessage("Erreur lors de l'ajout au panier", "red");
  }
}

// Afficher un message
function showMessage(text, color) {
  const messageElement = document.getElementById('message');
  messageElement.innerText = text;
  messageElement.style.color = color;
}

// Initialiser au chargement
document.addEventListener('DOMContentLoaded', function() {
  loadProductDetails();
  
  // Ajouter l'événement du bouton
  document.getElementById('add-to-cart-btn').addEventListener('click', handleAddToCart);
});
