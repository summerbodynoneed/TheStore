/* ============================================================
   QUESTIONNAIRE.JS — Gestion du formulaire pré-paiement
   - Suivi de progression en temps réel
   - Validation de l'e-mail
   - Stockage localStorage (secours) + envoi POST vers server.js
   - Redirection vers PayPal avec le montant du panier
   ============================================================ */

const REPONSES_KEY = 'maboutique_reponses';

// Détecte automatiquement l'URL : localhost en local, URL Codespaces en ligne
const API_URL = (function () {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') {
    return 'http://localhost:3000/api/reponses';
  }
  // GitHub Codespaces : remplace le port 5500 (ou autre) par 3000
  return window.location.protocol + '//' + h.replace(/^(\d+)-/, '3000-') + '/api/reponses';
})();

// ══ PROGRESSION ══════════════════════════════════════════════

function mettreAJourProgression() {
  let repondues = 0;
  const total   = 4;

  ['q1', 'q2', 'q3', 'q4'].forEach(function (name) {
    if (document.querySelector('input[name="' + name + '"]:checked')) {
      repondues++;
    }
  });

  const pct     = Math.round((repondues / total) * 100);
  const barEl   = document.getElementById('progress-bar');
  const labelEl = document.getElementById('progress-label');
  const textEl  = document.getElementById('progress-text');

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
    horodatage:        new Date().toISOString(),
    email:             email.trim(),
    q1_decouverte:     valRadio('q1'),
    q2_premier_achat:  valRadio('q2'),
    q3_experience:     valRadio('q3'),
    q4_type_produit:   valRadio('q4'),
    panier_total:      typeof calculerTotal === 'function' ? calculerTotal() : 0,
    panier_articles:   typeof obtenirPanier === 'function'
                         ? obtenirPanier().map(function (i) {
                             return { id: i.id, nom: i.nom, taille: i.taille, qty: i.quantite };
                           })
                         : []
  };
}

// ══ STOCKAGE ════════════════════════════════════════════════

// Secours localStorage (fonctionne même sans serveur)
function sauvegarderEnLocal(data) {
  try {
    const historique = JSON.parse(localStorage.getItem(REPONSES_KEY) || '[]');
    historique.push(data);
    localStorage.setItem(REPONSES_KEY, JSON.stringify(historique));
  } catch (e) {
    console.error('Erreur localStorage :', e);
  }
}

// Envoi vers le serveur Node.js
function envoyerAuServeur(data) {
  return fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(function (r) {
    if (!r.ok) throw new Error('Réponse serveur ' + r.status);
    return r.json();
  })
  .then(function (json) {
    console.log('✅ Réponse enregistrée côté serveur. Total :', json.total);
  })
  .catch(function (err) {
    // Le serveur est peut-être absent — pas grave, localStorage prend le relais
    console.warn('⚠️ Serveur indisponible, réponse sauvegardée en local uniquement.', err.message);
  });
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

window.validerEtPayer = function () {
  const emailEl = document.getElementById('q-email');
  const email   = emailEl ? emailEl.value.trim() : '';

  if (!email || !emailValide(email)) {
    afficherErreurEmail(true);
    if (emailEl) emailEl.focus();
    return;
  }

  afficherErreurEmail(false);

  const reponses = collecterReponses();

  // Toujours sauvegarder en local d'abord (filet de sécurité)
  sauvegarderEnLocal(reponses);

  // Afficher le message de confirmation
  const msgOk = document.getElementById('msg-sauvegarde');
  if (msgOk) msgOk.style.display = 'flex';

  // Désactiver les boutons
  document.querySelectorAll('button').forEach(function (b) { b.disabled = true; });

  // Envoyer au serveur, puis rediriger (même si le serveur échoue)
  envoyerAuServeur(reponses).finally(function () {
    setTimeout(function () {
      lancerPayPal();
    }, 800);
  });
};

window.passerSansPondre = function () {
  window.location.href = 'panier.html';
};

window.lancerPayPal = function () {
  window.location.href = 'paiement.html';
};

// ══ INIT ════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function () {
  mettreAJourProgression();

  ['msg-sauvegarde', 'msg-erreur-email'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const emailEl = document.getElementById('q-email');
  if (emailEl) {
    emailEl.addEventListener('input', function () {
      afficherErreurEmail(false);
    });
  }
});