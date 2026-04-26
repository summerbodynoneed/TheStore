# Backend TheStore

Ce backend Node.js permet de stocker les adresses email et les réponses aux questionnaires dans des fichiers JSON.

## Installation

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Démarrez le serveur :
   ```bash
   npm start
   ```

Le serveur tournera sur http://localhost:3001.

## Endpoints

- `POST /api/email` : Stocke une adresse email
  - Body: `{ "email": "user@example.com" }`

- `POST /api/questionnaire` : Stocke une réponse questionnaire
  - Body: `{ "choice": "Soutenir un club" }`

- `GET /api/emails` : Récupère toutes les emails (pour admin)
- `GET /api/questionnaires` : Récupère toutes les réponses (pour admin)

## Intégration frontend

Modifiez cart.js pour envoyer les données au backend au lieu de localStorage :

```javascript
// Au lieu de localStorage.setItem("customerEmail", email);
fetch('http://localhost:3001/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email })
});

// Au lieu de localStorage.setItem("benefitChoice", choice.value);
fetch('http://localhost:3001/api/questionnaire', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ choice: choice.value })
});
```

## Stockage

Les données sont stockées dans :
- `emails.json` : Liste des emails avec timestamps
- `questionnaires.json` : Liste des réponses avec timestamps