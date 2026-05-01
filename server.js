/* ============================================================
   SERVER.JS — Serveur Node.js / Express
   Rôle : recevoir les réponses du questionnaire via POST
          et les écrire dans reponses.json
   Lancement : node server.js
   Port par défaut : 3000
   ============================================================ */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app            = express();
const PORT           = 3000;
const FICHIER_JSON   = path.join(__dirname, 'reponses.json');
const DOSSIER_SITE   = __dirname; // tous les fichiers HTML/CSS/JS sont au même niveau

// ── Middlewares ──────────────────────────────────────────────
app.use(cors());                          // autorise les requêtes depuis le navigateur
app.use(express.json());                  // parse le body JSON des requêtes POST
app.use(express.static(DOSSIER_SITE));    // sert tous les fichiers HTML, CSS, JS, JSON, images

// ── GET /api/reponses — lire toutes les réponses ─────────────
app.get('/api/reponses', function (req, res) {
  try {
    const contenu = fs.readFileSync(FICHIER_JSON, 'utf8');
    const data    = JSON.parse(contenu);
    res.json(data.reponses || []);
  } catch (err) {
    console.error('Erreur lecture reponses.json :', err.message);
    res.status(500).json({ erreur: 'Impossible de lire les réponses.' });
  }
});

// ── POST /api/reponses — enregistrer une nouvelle réponse ─────
app.post('/api/reponses', function (req, res) {
  const nouvelle = req.body;

  // Validation minimale : l'e-mail doit être présent
  if (!nouvelle || !nouvelle.email) {
    return res.status(400).json({ erreur: 'Champ email manquant.' });
  }

  // Ajouter l'horodatage serveur si absent
  if (!nouvelle.horodatage) {
    nouvelle.horodatage = new Date().toISOString();
  }

  try {
    // Lire le fichier existant
    let data = { reponses: [] };
    if (fs.existsSync(FICHIER_JSON)) {
      const contenu = fs.readFileSync(FICHIER_JSON, 'utf8');
      data = JSON.parse(contenu);
      if (!Array.isArray(data.reponses)) data.reponses = [];
    }

    // Ajouter la nouvelle réponse
    data.reponses.push(nouvelle);

    // Réécrire le fichier proprement
    fs.writeFileSync(FICHIER_JSON, JSON.stringify(data, null, 2), 'utf8');

    console.log('✅ Reply registered — email :', nouvelle.email);
    res.json({ succes: true, total: data.reponses.length });

  } catch (err) {
    console.error('Erreur écriture reponses.json :', err.message);
    res.status(500).json({ erreur: 'Impossible d\'enregistrer la réponse.' });
  }
});

// ── Démarrage ────────────────────────────────────────────────
app.listen(PORT, function () {
  console.log('');
  console.log('SBNN store — Serveur démarré');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 Site       : http://localhost:' + PORT);
  console.log('📋 Réponses   : http://localhost:' + PORT + '/api/reponses');
  console.log('📁 JSON       : ' + FICHIER_JSON);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Appuie sur Ctrl+C pour arrêter.');
  console.log('');
});