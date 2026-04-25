// ============================================
// BASE DE DONNEES - PRODUITS
// ============================================
const products = [
  {
    id: 1,
    name: "Veste coupe-vent",
    price: 49,
    attribute: "gilet",
    description: "Parfait pour le sport",
    long_description: "Gilet crocheté léger et respirant, idéal pour les activités sportives et les journées fraîches.",
    image_url: "images/ChatGPT Image 25 avr. 2026, 10_48_41.png",
    gallery: ["images/ChatGPT Image 25 avr. 2026, 10_48_41.png", "images/ChatGPT Image 25 avr. 2026, 10_48_41.png"],
    stock: 10,
    sizes: ["S", "M", "L"],
    colors: ["Blanc"]
  },
  {
    id: 2,
    name: "Pantalon sport",
    price: 39,
    attribute: "Confort",
    description: "Léger et respirant",
    long_description: "Pantalon idéal pour le sport et le quotidien.",
    image_url: "images/pantalon.jpg",
    stock: 5,
    sizes: ["M", "L"],
    colors: ["Noir"]
  }
];

// ============================================
// GESTION DU PANIER
// ============================================

// Récupérer le panier depuis localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Sauvegarder le panier dans localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Ajouter un produit au panier
function addToCart(productId, size = null, quantity = 1) {
  const cart = getCart();
  const product = products.find(p => p.id === parseInt(productId));
  
  if (!product) {
    console.error("Produit non trouvé");
    return false;
  }

  // Chercher si le produit est déjà dans le panier (avec la même taille)
  const existingItem = cart.find(item => item.id === product.id && item.size === size);
  
  if (existingItem) {
    existingItem.quantity = (existingItem.quantity || 1) + quantity;
  } else {
    cart.push({
      id: product.id,
      size: size,
      quantity: quantity
    });
  }
  
  saveCart(cart);
  return true;
}

// Obtenir le nombre total d'articles dans le panier
function getCartCount() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.quantity || 1), 0);
}

// Mettre à jour le compteur du panier dans la navbar
function updateCartBadge() {
  const cartCount = getCartCount();
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.display = cartCount > 0 ? 'inline-block' : 'none';
  }
}

// Initialiser le compteur au chargement
document.addEventListener('DOMContentLoaded', updateCartBadge);