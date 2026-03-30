/**
 * EduManager — Serveur Principal Express
 * Node.js 18+ requis
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Middleware ----
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ---- Base de données ----
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Injecter db dans chaque requête
app.use((req, res, next) => { req.db = pool; next(); });

// ---- Routes ----
app.use('/api/etablissements', require('./functions/etablissements'));
app.use('/api/eleves', require('./functions/eleves'));
app.use('/api/classes', require('./functions/classes'));
app.use('/api/enseignants', require('./functions/enseignants'));
app.use('/api/matieres', require('./functions/matieres'));
app.use('/api/presences', require('./functions/presences'));
app.use('/api/notes', require('./functions/notes'));
app.use('/api/paiements', require('./functions/paiements'));
app.use('/api/emploitempss', require('./functions/emploi_temps'));
app.use('/api/personnel', require('./functions/personnel'));
app.use('/api/messages', require('./functions/messages'));
app.use('/api/depenses', require('./functions/depenses'));

// Route health check
app.get('/health', (req, res) => res.json({ status: 'OK', version: '1.0.0', timestamp: new Date().toISOString() }));

// Route 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route non trouvée' }));

// Erreur globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

app.listen(PORT, () => console.log(`🚀 EduManager API démarré sur le port ${PORT}`));

module.exports = app;
