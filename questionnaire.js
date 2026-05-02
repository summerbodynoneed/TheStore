/* ============================================================
   QUESTIONNAIRE.JS — SBNN store
   - Email validation
   - Saves response to server.js POST /api/responses
   - localStorage fallback if server is unavailable
   ============================================================ */

const STORAGE_KEY = 'sbnn_responses';

// Auto-detect URL : localhost vs GitHub Codespaces
const API_URL = (function () {
  const h = window.location.hostname;
  if (h === 'localhost' || h === '127.0.0.1') {
    return 'http://localhost:3000/api/responses';
  }
  return window.location.protocol + '//' + h.replace(/^(\d+)-/, '3000-') + '/api/responses';
})();

// ── Collect form data ────────────────────────────────────────
function collectData() {
  const email = (document.getElementById('q-email') || {}).value || '';
  const q1    = document.querySelector('input[name="q1"]:checked');

  return {
    timestamp:   new Date().toISOString(),
    email:       email.trim(),
    q1_benefit:  q1 ? q1.value : null,
    cart_total:  typeof calculerTotal === 'function' ? calculerTotal() : 0,
    cart_items:  typeof obtenirPanier === 'function'
                   ? obtenirPanier().map(function (i) {
                       return { id: i.id, name: i.nom, size: i.taille, qty: i.quantite };
                     })
                   : []
  };
}

// ── localStorage fallback ────────────────────────────────────
function saveLocally(data) {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    history.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('localStorage error:', e);
  }
}

// ── Send to Node.js server ───────────────────────────────────
function sendToServer(data) {
  return fetch(API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(data)
  })
  .then(function (r) {
    if (!r.ok) throw new Error('Server error ' + r.status);
    return r.json();
  })
  .then(function (json) {
    console.log('✅ Response saved on server. Total:', json.total);
  })
  .catch(function (err) {
    console.warn('⚠️ Server unavailable, saved locally only.', err.message);
  });
}

// ── Email validation ─────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showEmailError(show) {
  const el = document.getElementById('msg-erreur-email');
  if (el) el.style.display = show ? 'flex' : 'none';
}

// ── Submit ───────────────────────────────────────────────────
window.validerEtPayer = function () {
  const emailEl = document.getElementById('q-email');
  const email   = emailEl ? emailEl.value.trim() : '';

  if (!email || !isValidEmail(email)) {
    showEmailError(true);
    if (emailEl) emailEl.focus();
    return;
  }

  showEmailError(false);

  const data = collectData();
  saveLocally(data);

  const msgOk = document.getElementById('msg-sauvegarde');
  if (msgOk) msgOk.style.display = 'flex';

  document.querySelectorAll('button').forEach(function (b) { b.disabled = true; });

  sendToServer(data).finally(function () {
    setTimeout(function () { window.location.href = 'paiement.html'; }, 800);
  });
};

window.passerSansPondre = function () {
  window.location.href = 'paiement.html';
};

// ── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  ['msg-sauvegarde', 'msg-erreur-email'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const emailEl = document.getElementById('q-email');
  if (emailEl) {
    emailEl.addEventListener('input', function () { showEmailError(false); });
  }
});