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

  cart.forEach(id => {
    const product = products.find(p => p.id === Number(id));

    if (product) {
      total += product.price;

      cartContainer.innerHTML += `
        <div class="cart-item">
          <h3>${product.name}</h3>
          <p>${product.price} €</p>
        </div>
      `;
    }
  });

  totalElement.innerText = "Total : " + total + " €";
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