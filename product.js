// ============================================
// BASE DE DONNEES - PRODUITS
// ============================================
const products = [
  {
    id: 1,
    name: "Basket",
    price: 60,
    attribute: "Vêtement",
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
    name: "Veste Serpent",
    price: 50,
    attribute: "Vêtement",
    description: "La mue de la veste en jean",
    long_description: "Veste en jean classique avec une coupe ajustée, parfaite pour un look décontracté.",
    image_url: "images/IMG_4968.png",
    stock: 5,
    sizes: ["M", "L"],
    colors: ["Noir"]
  },
  {
    id: 3,
    name: "Veste Tennis",
    price: 30,
    attribute: "Vêtement",
    description: "Confortable et durable",
    long_description: "Veste de tennis pré-match, parfaite pour les échauffements et les moments de détente avant le match.",
    image_url: "images/proto.png",
    stock: 10,
    sizes: ["S", "M", "L"],
    colors: ["Blanc"]
  },
  {
    id: 4,
    name: "Ensemble SBEUNEUNEUH",
    price: 40,
    attribute: "Vêtement",
    description: "Ensemble pour jogging, quick dry",
    long_description: "Ensemble confortable et stylé, parfait pour courir et être classe en même temps.",
    image_url: "images/ensemble.jpeg",
    stock: 10,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gris"]
  },
  {
    id: 5,
    name: "Veste sans manches",
    price: 20,
    attribute: "Vêtement",
    description: "Parfaite pour mi-saison",
    long_description: "Veste imperméable légère inspirée des années 90, mais très moderne.",
    image_url: "images/veste sm.png",
    stock: 6,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Bleu"]
  },
  {
    id: 6,
    name: "Chaussures",
    price: 65,
    attribute: "Chaussures",
    description: "Inspirées de l'association sandales + chaussettes",
    long_description: "Paire de chaussures inspirée du style sandales + chaussettes, offrant un look audacieux et confortable pour les amateurs de mode.",
    image_url: "images/ChatGPT Image 25. 4. 2026, 20_29_23.png",
    stock: 50,
    sizes: ["40", "41", "42", "43", "44"],
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