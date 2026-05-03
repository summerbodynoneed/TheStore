/* ============================================================
   PAYPAL.JS — SBNN store
   MODE SANDBOX — pour tester sans vrai argent
   ⚠️  Pour passer en production :
       1. Remplace clientId par ton Live Client ID
       2. Change "sandbox" en "production" dans les commentaires
   ============================================================ */

// ── Configuration ─────────────────────────────────────────────
const PAYPAL_CONFIG = {
  clientId:     'AWqRYC5b3_wWLHLGJlcBfu02uujZR4Ib5een583i1oGl4OXDQ2l9R7GNbm_B9y6drq_Rj1anRMmgCWDy',  // ← Remplace par ton Sandbox Client ID
  currency:     'EUR',
  shippingFee:  5.00,
  freeShipping: 50.00
};

// ── Calcul du montant total ────────────────────────────────────
function calculerMontantPayPal() {
  const subtotal = typeof calculerTotal === 'function' ? calculerTotal() : 0;
  const shipping = subtotal >= PAYPAL_CONFIG.freeShipping ? 0 : PAYPAL_CONFIG.shippingFee;
  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    shipping: parseFloat(shipping.toFixed(2)),
    total:    parseFloat((subtotal + shipping).toFixed(2))
  };
}

// ── Construire les articles pour PayPal ───────────────────────
function construireArticlesPayPal() {
  const items = typeof obtenirPanier === 'function' ? obtenirPanier() : [];
  return items.map(function (item) {
    return {
      name: item.nom + (item.taille && item.taille !== 'unique' ? ' (' + item.taille + ')' : ''),
      unit_amount: {
        currency_code: PAYPAL_CONFIG.currency,
        value:         item.prix.toFixed(2)
      },
      quantity: String(item.quantite)
    };
  });
}

// ── Charger le SDK PayPal Sandbox ─────────────────────────────
function chargerSDKPayPal(callback) {
  if (document.getElementById('paypal-sdk')) {
    callback();
    return;
  }

  const script  = document.createElement('script');
  script.id     = 'paypal-sdk';
  // URL Sandbox — remplace par https://www.paypal.com/sdk/js en production
  script.src    = 'https://www.paypal.com/sdk/js'
                + '?client-id=' + PAYPAL_CONFIG.clientId
                + '&currency=' + PAYPAL_CONFIG.currency;
  script.onload = callback;
  script.onerror = function () {
    console.error('PayPal SDK failed to load.');
    const container = document.getElementById('paypal-button-container');
    if (container) {
      container.innerHTML =
        '<div class="msg-box msg-error">' +
        '<span class="msg-box-icon">⚠️</span>' +
        '<span>Unable to load PayPal. Please check your Client ID or try again later.</span>' +
        '</div>';
    }
  };
  document.head.appendChild(script);
}

// ── Afficher le bouton PayPal ──────────────────────────────────
function afficherBoutonPayPal(containerId) {
  if (!window.paypal) {
    console.error('PayPal SDK not available.');
    return;
  }

  const amounts  = calculerMontantPayPal();
  const articles = construireArticlesPayPal();

  window.paypal.Buttons({

    style: {
      layout: 'vertical',
      color:  'gold',
      shape:  'rect',
      label:  'pay'
    },

    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: 'SBNN store order',
          amount: {
            currency_code: PAYPAL_CONFIG.currency,
            value:         String(amounts.total),
            breakdown: {
              item_total: {
                currency_code: PAYPAL_CONFIG.currency,
                value:         String(amounts.subtotal)
              },
              shipping: {
                currency_code: PAYPAL_CONFIG.currency,
                value:         String(amounts.shipping)
              }
            }
          },
          items: articles
        }]
      });
    },

    // Paiement approuvé
    onApprove: function (data, actions) {
      return actions.order.capture().then(function (details) {
        if (typeof sauvegarderPanier === 'function') sauvegarderPanier([]);
        if (typeof mettreAJourCompteur === 'function') mettreAJourCompteur();

        const name = details.payer && details.payer.name
                     ? details.payer.name.given_name
                     : 'customer';

        alert(
          '✅ Payment confirmed, thank you ' + name + '!\n\n'
          + 'Order ID: ' + details.id + '\n'
          + 'Amount charged: ' + amounts.total.toFixed(2) + ' €\n\n'
          + 'You will receive a confirmation email shortly.\n\n'
          + '⚠️ SANDBOX MODE — no real money was charged.'
        );

        window.location.href = 'index.html';
      });
    },

    // Annulation
    onCancel: function () {
      window.location.href = 'panier.html';
    },

    // Erreur
    onError: function (err) {
      console.error('PayPal error:', err);
      alert('A payment error occurred. Please try again or contact us at summerbodynoneed@gmail.com.');
    }

  }).render('#' + containerId);
}

// ── Redirection depuis questionnaire.js ───────────────────────
window.lancerPayPal = function () {
  window.location.href = 'paiement.html';
};

// ── Init sur paiement.html ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('paypal-button-container');
  if (!container) return;

  const amounts = calculerMontantPayPal();
  const recapEl = document.getElementById('recap-total');
  if (recapEl) recapEl.textContent = amounts.total.toFixed(2).replace('.', ',') + ' €';

  chargerSDKPayPal(function () {
    afficherBoutonPayPal('paypal-button-container');
  });
});