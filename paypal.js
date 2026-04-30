/* ============================================================
   PAYPAL.JS — Intégration du bouton de paiement PayPal
   ⚠️  CONFIGURATION REQUISE :
       Remplacez YOUR_CLIENT_ID par votre identifiant PayPal
       (disponible sur https://developer.paypal.com/)
   ============================================================ */

// ── Configuration ────────────────────────────────────────────
const PAYPAL_CONFIG = {
  clientId:    'AVNbu24V1NZ5vQe9DuB3Jfvw_gxfxq3Z3ArZ5IZb-z_m65xQ3KykZ2elLpW4otoDjJPJx_myP1EcYmJY',   // ← À remplacer
  currency:    'EUR',
  fraisPort:   5.00,               // Frais de livraison par défaut
  seuilGratuit: 50.00              // Seuil livraison gratuite
};

// ── Calcul du montant total ──────────────────────────────────
function calculerMontantPayPal() {
  const sousTotal = typeof calculerTotal === 'function' ? calculerTotal() : 0;
  const livraison = sousTotal >= PAYPAL_CONFIG.seuilGratuit
                    ? 0
                    : PAYPAL_CONFIG.fraisPort;
  return {
    sousTotal:   parseFloat(sousTotal.toFixed(2)),
    livraison:   parseFloat(livraison.toFixed(2)),
    total:       parseFloat((sousTotal + livraison).toFixed(2))
  };
}

// ── Construire les lignes articles pour PayPal ───────────────
function construireArticlesPayPal() {
  const items = typeof obtenirPanier === 'function' ? obtenirPanier() : [];
  return items.map(function (item) {
    return {
      name:      item.nom + (item.taille && item.taille !== 'unique' ? ' (' + item.taille + ')' : ''),
      unit_amount: {
        currency_code: PAYPAL_CONFIG.currency,
        value:         item.prix.toFixed(2)
      },
      quantity:  String(item.quantite)
    };
  });
}

// ── Charger dynamiquement le SDK PayPal ─────────────────────
function chargerSDKPayPal(callback) {
  // Éviter de charger deux fois
  if (document.getElementById('paypal-sdk')) {
    callback();
    return;
  }

  const script   = document.createElement('script');
  script.id      = 'paypal-sdk';
  script.src     = 'https://www.paypal.com/sdk/js'
                 + '?client-id=' + PAYPAL_CONFIG.clientId
                 + '&currency=' + PAYPAL_CONFIG.currency
                 + '&locale=fr_FR';
  script.onload  = callback;
  script.onerror = function () {
    console.error('Impossible de charger le SDK PayPal.');
    alert('Erreur de chargement PayPal. Veuillez réessayer ou contacter notre support.');
  };
  document.head.appendChild(script);
}

// ── Afficher le bouton PayPal dans un conteneur ──────────────
function afficherBoutonPayPal(containerId) {
  if (!window.paypal) {
    console.error('SDK PayPal non disponible.');
    return;
  }

  const montants = calculerMontantPayPal();
  const articles = construireArticlesPayPal();

  window.paypal.Buttons({

    // Style du bouton
    style: {
      layout: 'vertical',
      color:  'gold',
      shape:  'rect',
      label:  'pay'
    },

    // Création de la commande côté PayPal
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: 'Order sbnn.store',
          amount: {
            currency_code: PAYPAL_CONFIG.currency,
            value:         String(montants.total),
            breakdown: {
              item_total: {
                currency_code: PAYPAL_CONFIG.currency,
                value:         String(montants.sousTotal)
              },
              shipping: {
                currency_code: PAYPAL_CONFIG.currency,
                value:         String(montants.livraison)
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
        // Vider le panier
        if (typeof sauvegarderPanier === 'function') sauvegarderPanier([]);
        if (typeof mettreAJourCompteur === 'function') mettreAJourCompteur();

        // Afficher confirmation
        const nom = details.payer && details.payer.name
                    ? details.payer.name.given_name
                    : 'client';

        alert(
          '✅ Payment confirmed, Big thank you ' + nom + ' !\n\n'
          + 'Order ID : ' + details.id + '\n'
          + 'Amount : ' + montants.total.toFixed(2) + ' €\n\n'
          + 'You will receive a confirmation email.'
        );

        window.location.href = 'index.html';
      });
    },

    // Annulation
    onCancel: function () {
      console.info('Payment PayPal cancelled by the user.');
      window.location.href = 'panier.html';
    },

    // Erreur
    onError: function (err) {
      console.error('Erreur PayPal :', err);
      alert(
        'An error occurred during the payment.\n'
        + 'Please try again or contact our support at summerbodynoneed@gmail.com'
      );
    }

  }).render('#' + containerId);
}

// ── Fonction globale appelée par questionnaire.js ────────────
// Redirige vers la page de paiement qui contient le bouton PayPal
window.lancerPayPal = function () {
  window.location.href = 'paiement.html';
};

// ── Init : si on est déjà sur la page paiement.html ──────────
document.addEventListener('DOMContentLoaded', function () {
  const conteneur = document.getElementById('paypal-button-container');
  if (!conteneur) return; // Pas sur la page paiement

  // Afficher le récapitulatif
  const montants = calculerMontantPayPal();
  const recapEl  = document.getElementById('recap-total');
  if (recapEl) {
    recapEl.textContent = montants.total.toFixed(2).replace('.', ',') + ' €';
  }

  // Charger le SDK puis afficher le bouton
  chargerSDKPayPal(function () {
    afficherBoutonPayPal('paypal-button-container');
  });
});