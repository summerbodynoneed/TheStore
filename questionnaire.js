/* ============================================================
   QUESTIONNAIRE.JS — Gestion du formulaire pré-paiement
   - Suivi de progression en temps réel
   - Validation de l'e-mail
   - Stockage des réponses dans localStorage
   - Redirection vers PayPal avec le montant du panier
   ============================================================ */

const REPONSES_KEY = 'maboutique_reponses';

// ══ PROGRESSION ══════════════════════════════════════════════

function mettreAJourProgression() {
  let repondues = 0;
  const total   = 4; // 4 questions radio

  // Compter les questions radio répondues
  ['q1', 'q2', 'q3', 'q4'].forEach(function (name) {
    if (document.querySelector('input[name="' + name + '"]:checked')) {
      repondues++;
    }
  });

  const pct      = Math.round((repondues / total) * 100);
  const barEl    = document.getElementById('progress-bar');
  const labelEl  = document.getElementById('progress-label');
  const textEl   = document.getElementById('progress-text');

  if (barEl)   barEl.style.width = pct + '%';
  if (labelEl) labelEl.textContent = pct + '%';
  if (textEl)  textEl.textContent = repondues + ' / ' + total + ' réponses';
}

// ══ COLLECTE DES RÉPONSES ════════════════════════════════════

function collecterReponses() {
  const email = (document.getElementById('q-email') || {}).value || '';

  function valRadio(name) {
    const el = document.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : null;
  }

  return {
    horodatage:      new Date().toISOString(),
    email:           email.trim(),
    q1_decouverte:   valRadio('q1'),
    q2_premier_achat: valRadio('q2'),
    q3_experience:   valRadio('q3'),
    q4_type_produit: valRadio('q4'),
    panier_total:    typeof calculerTotal === 'function' ? calculerTotal() : 0,
    panier_articles: typeof obtenirPanier === 'function'
                       ? obtenirPanier().map(function (i) {
                           return { id: i.id, nom: i.nom, taille: i.taille, qty: i.quantite };
                         })
                       : []
  };
}

// ══ STOCKAGE ════════════════════════════════════════════════

function sauvegarderReponses(data) {
  try {
    // On accumule toutes les réponses dans un tableau
    const historique = JSON.parse(localStorage.getItem(REPONSES_KEY) || '[]');
    historique.push(data);
    localStorage.setItem(REPONSES_KEY, JSON.stringify(historique));
  } catch (e) {
    console.error('Erreur sauvegarde réponses :', e);
  }
}

// ══ VALIDATION EMAIL ════════════════════════════════════════

function emailValide(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function afficherErreurEmail(afficher) {
  const el = document.getElementById('msg-erreur-email');
  if (el) el.style.display = afficher ? 'flex' : 'none';
}

// ══ ACTIONS BOUTONS ══════════════════════════════════════════

// Valider, sauvegarder et rediriger vers PayPal
window.validerEtPayer = function () {
  const emailEl = document.getElementById('q-email');
  const email   = emailEl ? emailEl.value.trim() : '';

  // L'e-mail est le seul champ obligatoire
  if (!email || !emailValide(email)) {
    afficherErreurEmail(true);
    if (emailEl) emailEl.focus();
    return;
  }

  afficherErreurEmail(false);

  // Collecter et sauvegarder
  const reponses = collecterReponses();
  sauvegarderReponses(reponses);

  // Afficher le message de confirmation
  const msgOk = document.getElementById('msg-sauvegarde');
  if (msgOk) msgOk.style.display = 'flex';

  // Désactiver les boutons pour éviter double-clic
  document.querySelectorAll('button').forEach(function (b) {
    b.disabled = true;
  });

  // Délai court puis redirection PayPal
  setTimeout(function () {
    lancerPayPal();
  }, 1200);
};

// Passer sans répondre (aucun champ n'est obligatoire sauf email)
window.passerSansPondre = function () {
  window.location.href = 'panier.html';
};

// ══ INTÉGRATION PAYPAL ══════════════════════════════════════
// Le fichier paypal.js expose window.lancerPayPal()
// Si paypal.js n'est pas chargé, on redirige directement
window.lancerPayPal = function () {
  // Sécurité : paypal.js doit définir cette fonction
  // (redéfinie dans paypal.js pour utiliser le SDK PayPal)
  console.warn('paypal.js non chargé — redirection de secours');
  window.location.href = 'https://www.paypal.com/checkoutnow';
};

// ══ INIT ════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  mettreAJourProgression();

  // Masquer les messages au départ
  ['msg-sauvegarde', 'msg-erreur-email'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  // Masquer l'erreur email dès que l'utilisateur retape
  const emailEl = document.getElementById('q-email');
  if (emailEl) {
    emailEl.addEventListener('input', function () {
      afficherErreurEmail(false);
    });
  }
});