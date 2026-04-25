let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const totalElement = document.getElementById("total");

function displayCart() {
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Votre panier est vide.</p>";
    totalElement.innerText = "Total : 0 €";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const productId = item.id || item;
    const product = products.find(p => p.id === Number(productId));

    if (product) {
      total += product.price;

      const sizeText = item.size ? ` (Taille: ${item.size})` : "";

      cartContainer.innerHTML += `
        <div class="cart-item">
          <h3>${product.name}${sizeText}</h3>
          <p>${product.price} €</p>
          <button onclick="removeFromCart(${index})">Supprimer</button>
        </div>
      `;
    }
  });

  totalElement.innerText = "Total : " + total + " €";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

function clearCart() {
  localStorage.removeItem("cart");
  cart = [];
  displayCart();
}

function checkout() {
  alert("Commande validée !");
}

displayCart();