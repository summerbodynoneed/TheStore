const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Fichiers de stockage
const EMAIL_FILE = path.join(__dirname, 'emails.json');
const QUESTIONNAIRE_FILE = path.join(__dirname, 'questionnaires.json');

// Fonction pour lire les données
function readData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la lecture:', error);
    return [];
  }
}

// Fonction pour écrire les données
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Erreur lors de l\'écriture:', error);
  }
}

// Route pour stocker l'email
app.post('/api/email', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }

  const emails = readData(EMAIL_FILE);
  emails.push({ email, timestamp: new Date().toISOString() });
  writeData(EMAIL_FILE, emails);

  res.json({ message: 'Email stocké avec succès' });
});

// Route pour stocker les réponses questionnaires
app.post('/api/questionnaire', (req, res) => {
  const { choice } = req.body;
  if (!choice) {
    return res.status(400).json({ error: 'Choix requis' });
  }

  const questionnaires = readData(QUESTIONNAIRE_FILE);
  questionnaires.push({ choice, timestamp: new Date().toISOString() });
  writeData(QUESTIONNAIRE_FILE, questionnaires);

  res.json({ message: 'Réponse stockée avec succès' });
});

// Route pour récupérer les emails (pour admin)
app.get('/api/emails', (req, res) => {
  const emails = readData(EMAIL_FILE);
  res.json(emails);
});

// Route pour récupérer les questionnaires (pour admin)
app.get('/api/questionnaires', (req, res) => {
  const questionnaires = readData(QUESTIONNAIRE_FILE);
  res.json(questionnaires);
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});