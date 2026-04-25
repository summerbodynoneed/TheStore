// ============================================
// PANIER - AFFICHAGE ET GESTION
// ============================================

const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");

// Afficher les articles du panier
function displayCart() {
  cartContainer.innerHTML = "";
  const cart = getCart();

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Votre panier est vide.</p>";
    totalElement.innerText = "Total : 0 €";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const product = products.find(p => p.id === item.id);

    if (product) {
      const itemTotal = product.price * (item.quantity || 1);
      total += itemTotal;

      const sizeText = item.size ? ` (Taille: ${item.size})` : "";
      const quantity = item.quantity || 1;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <div class="cart-item-details">
            <h3>${product.name}${sizeText}</h3>
            <p>${product.price} € x ${quantity} = <strong>${itemTotal} €</strong></p>
          </div>
          <div class="cart-item-actions">
            <button onclick="updateQuantity(${index}, ${quantity - 1})">−</button>
            <span>${quantity}</span>
            <button onclick="updateQuantity(${index}, ${quantity + 1})">+</button>
            <button onclick="removeFromCart(${index})">Supprimer</button>
          </div>
        </div>
      `;
    }
  });

  totalElement.innerText = "Total : " + total + " €";
  updateCartBadge();
}

// Mettre à jour la quantité d'un article
function updateQuantity(index, newQuantity) {
  const cart = getCart();
  
  if (newQuantity <= 0) {
    removeFromCart(index);
    return;
  }
  
  cart[index].quantity = newQuantity;
  saveCart(cart);
  displayCart();
}

// Supprimer un article du panier
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  displayCart();
}

// Vider le panier
function clearCart() {
  localStorage.removeItem("cart");
  displayCart();
}

// Valider la commande
function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }
  alert("Commande validée ! Merci pour votre achat.");
  clearCart();
}

// Afficher le panier au chargement
document.addEventListener('DOMContentLoaded', displayCart);