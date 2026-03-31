/**
 * EduManager — Serveur Principal Express
 * Node.js 18+ requis
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');
require('dotenv').config({ path: '../.env' });

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Middleware ----
app.use(helmet());
app.use(cors()); // Accepte toutes les origines pour éviter les blocages de déploiement Render
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

// ---- Auth middleware ----
const authMiddleware = require('./middleware/auth');
const authRouter = require('./functions/auth');
const { initializeDatabase } = require('./functions/init_db');

// ---- Routes publiques ----
app.use('/api/auth', authRouter);

// ---- Routes protégées (JWT requis) ----
app.use('/api/etablissements', authMiddleware, require('./functions/etablissements'));
app.use('/api/eleves', authMiddleware, require('./functions/eleves'));
app.use('/api/classes', authMiddleware, require('./functions/classes'));
app.use('/api/enseignants', authMiddleware, require('./functions/enseignants'));
app.use('/api/matieres', authMiddleware, require('./functions/matieres'));
app.use('/api/presences', authMiddleware, require('./functions/presences'));
app.use('/api/notes', authMiddleware, require('./functions/notes'));
app.use('/api/paiements', authMiddleware, require('./functions/paiements'));
app.use('/api/emploitemps', authMiddleware, require('./functions/emploi_temps'));
app.use('/api/personnel', authMiddleware, require('./functions/personnel'));
app.use('/api/messages', authMiddleware, require('./functions/messages'));
app.use('/api/depenses', authMiddleware, require('./functions/depenses'));

// Route health check
app.get('/health', (req, res) => res.json({ status: 'OK', version: '2.0.0', timestamp: new Date().toISOString() }));

// Route 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Route non trouvée' }));

// Erreur globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Erreur serveur interne' });
});

app.listen(PORT, async () => {
  console.log(`🚀 EduManager API v2.0 démarré sur le port ${PORT}`);
  
  // 1. Initialiser la structure de la DB si nécessaire
  await initializeDatabase(pool);
  
  // 2. Initialiser le SuperAdmin au premier lancement
  if (authRouter.initializeAdmin) {
    await authRouter.initializeAdmin(pool);
  }
});

module.exports = app;
