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

// Afficher le formulaire de paiement par email
function showPaymentForm() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Votre panier est vide !");
    return;
  }

  document.getElementById("checkout-button").style.display = "none";
  document.getElementById("clear-button").style.display = "none";

  const formContainer = document.getElementById("payment-form-container");
  formContainer.style.display = "block";
  formContainer.innerHTML = `
    <h2>Finaliser votre commande</h2>
    <form id="email-form">
      <label for="customer-email">Adresse e-mail :</label><br>
      <input type="email" id="customer-email" name="email" required style="width: 100%; max-width: 300px; padding: 8px; margin: 10px 0;">
      <div style="margin-top: 15px;">
        <button type="submit" style="background: #0070ba; color: white; padding: 10px 16px; border: none; border-radius: 4px; cursor: pointer;">Payer</button>
      </div>
    </form>
    <p id="payment-message" style="margin-top: 15px;"></p>
  `;

  document.getElementById("email-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("customer-email").value;
    handlePaymentSubmission(email);
  });
}

async function handlePaymentSubmission(email) {
  try {
    const response = await fetch('http://localhost:3001/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!response.ok) throw new Error('Erreur lors de l\'envoi');
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la sauvegarde de l\'email');
    return;
  }
  
  document.getElementById("email-form").style.display = "none";
  const messageEl = document.getElementById("payment-message");
  messageEl.textContent = `✓ Une facture et un lien de paiement ont été envoyés à ${email}. Merci !`;
  messageEl.style.color = "green";
  messageEl.style.fontWeight = "bold";
  
  // Vider le panier
  clearCart();
  
  // Afficher la question post-paiement après 2 secondes
  setTimeout(function() {
    showPostPaymentQuestion();
  }, 2000);
}

// Valider la commande (ancienne fonction, garde pour déboguer si nécessaire)
function checkout() {
  showPaymentForm();
}

function showPostPaymentQuestion() {
  const questionContainer = document.getElementById("post-payment-question");
  if (!questionContainer) return;

  document.getElementById("checkout-button").style.display = "none";
  document.getElementById("clear-button").style.display = "none";

  questionContainer.style.display = "block";
  questionContainer.innerHTML = `
    <h2>Que voulez-vous qu'on fasse avec les bénéfices ?</h2>
    <form id="benefit-form">
      <label><input type="radio" name="benefit" value="Soutenir un club"> Soutenir un club</label><br>
      <label><input type="radio" name="benefit" value="Soutenir un athlète"> Soutenir un athlète</label><br>
      <label><input type="radio" name="benefit" value="Financer notre prochaine course"> Financer notre prochaine course</label><br>
      <label><input type="radio" name="benefit" value="Autres (ex: financer projets, jeux vidéos, podcasts)"> Autres (ex: financer projets, jeux vidéos, podcasts)</label>
      <div style="margin-top: 15px;">
        <button id="benefit-submit" style="background: #0070ba; color: white; padding: 10px 16px; border: none; border-radius: 4px; cursor: pointer;">Envoyer</button>
      </div>
    </form>
    <p id="benefit-message" style="margin-top: 15px;"></p>
  `;

  document.getElementById("benefit-submit").addEventListener("click", async function(event) {
    event.preventDefault();
    const choice = document.querySelector('input[name="benefit"]:checked');
    if (!choice) {
      alert("Veuillez choisir une option.");
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: choice.value })
      });
      if (!response.ok) throw new Error('Erreur lors de l\'envoi');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde de la réponse');
      return;
    }
    document.getElementById("benefit-message").textContent = `Merci ! Vous avez choisi : ${choice.value}.`;
  });
}

// Afficher le panier au chargement
document.addEventListener('DOMContentLoaded', displayCart);