/* ============================================================
   SERVER.JS — SBNN store
   Receives questionnaire responses via POST and writes
   them into reponses.json
   Start: node server.js
   Port : 3000
   ============================================================ */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app          = express();
const PORT         = 3000;
const RESPONSES_FILE = path.join(__dirname, 'reponses.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// ── GET /api/responses — read all responses ──────────────────
app.get('/api/responses', function (req, res) {
  try {
    const data = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'));
    res.json(data.responses || []);
  } catch (err) {
    console.error('Read error:', err.message);
    res.status(500).json({ error: 'Unable to read responses.' });
  }
});

// ── POST /api/responses — save a new response ────────────────
app.post('/api/responses', function (req, res) {
  const entry = req.body;

  if (!entry || !entry.email) {
    return res.status(400).json({ error: 'Missing email field.' });
  }

  if (!entry.timestamp) entry.timestamp = new Date().toISOString();

  try {
    let data = { responses: [] };
    if (fs.existsSync(RESPONSES_FILE)) {
      data = JSON.parse(fs.readFileSync(RESPONSES_FILE, 'utf8'));
      if (!Array.isArray(data.responses)) data.responses = [];
    }

    data.responses.push(entry);
    fs.writeFileSync(RESPONSES_FILE, JSON.stringify(data, null, 2), 'utf8');

    console.log('✅ Response saved — email:', entry.email, '| q1:', entry.q1_benefit);
    res.json({ success: true, total: data.responses.length });

  } catch (err) {
    console.error('Write error:', err.message);
    res.status(500).json({ error: 'Unable to save response.' });
  }
});

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, function () {
  console.log('');
  console.log('🛍️  SBNN.store — Server started');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🌐 Site      : http://localhost:' + PORT);
  console.log('📋 Responses : http://localhost:' + PORT + '/api/responses');
  console.log('📁 File      : ' + RESPONSES_FILE);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Press Ctrl+C to stop.');
  console.log('');
});