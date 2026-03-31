/**
 * EduManager — Authentification Endpoints
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';
const TOKEN_EXPIRY = '24h';

// ---- POST /api/auth/register (Créer un compte) ----
router.post('/register', async (req, res) => {
  const { nom, email, password, role, etablissement_id } = req.body;

  if (!nom || !email || !password) {
    return res.status(400).json({ success: false, error: 'Champs obligatoires manquants' });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const checkUser = await req.db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (checkUser.rows.length > 0) {
      return res.status(409).json({ success: false, error: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insérer l'utilisateur
    const result = await req.db.query(
      `INSERT INTO users (nom, email, password, role, etablissement_id) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, nom, email, role, etablissement_id`,
      [nom, email.toLowerCase(), hashedPassword, role || 'Direction', etablissement_id]
    );

    const user = result.rows[0];

    // Créer le token
    const token = jwt.sign(
      { id: user.id, role: user.role, etablissement_id: user.etablissement_id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la création du compte' });
  }
});

// ---- POST /api/auth/login (Se connecter) ----
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Informations manquantes' });
  }

  try {
    // Chercher l'utilisateur actif
    const result = await req.db.query(
      'SELECT * FROM users WHERE email = $1 AND actif = true', 
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Identifiants invalides' });
    }

    const user = result.rows[0];

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Identifiants invalides' });
    }

    // Mettre à jour last_login
    await req.db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    // Créer le token
    const token = jwt.sign(
      { id: user.id, role: user.role, etablissement_id: user.etablissement_id },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRY }
    );

    // Ne pas renvoyer le password
    const { password: _, ...userData } = user;

    res.json({ success: true, token, user: userData });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la connexion' });
  }
});

// ---- GET /api/auth/me (Vérifier la session) ----
const protect = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  try {
    const result = await req.db.query(
      'SELECT id, nom, email, role, etablissement_id, last_login FROM users WHERE id = $1', 
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Utilisateur non trouvé' });
    }

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error('AuthMe Error:', err);
    res.status(500).json({ success: false, error: 'Erreur lors de la récupération du profil' });
  }
});

// ---- Initialisation SuperAdmin ----
router.initializeAdmin = async (db) => {
  try {
    const email = 'admin@edumanager.ht';
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      console.log('🔄 Création du compte SuperAdmin...');
      const hashedPassword = await bcrypt.hash('EduManager2026!', 10);
      
      // S'assurer qu'au moins un établissement existe
      let etablissementId = null;
      const etabResult = await db.query('SELECT id FROM etablissements LIMIT 1');
      if (etabResult.rows.length === 0) {
        const newEtab = await db.query(
          "INSERT INTO etablissements (nom, type) VALUES ($1, $2) RETURNING id",
          ['Mon Établissement', 'Mixte']
        );
        etablissementId = newEtab.rows[0].id;
      } else {
        etablissementId = etabResult.rows[0].id;
      }

      await db.query(
        'INSERT INTO users (nom, email, password, role, etablissement_id) VALUES ($1, $2, $3, $4, $5)',
        ['Super Administrateur', email, hashedPassword, 'Admin', etablissementId]
      );
      console.log(`✅ Compte SuperAdmin créé : ${email} / EduManager2026!`);
    } else {
      console.log('✅ Le compte SuperAdmin existe déjà.');
    }
  } catch (err) {
    console.error('❌ Erreur initialisation Admin:', err.message);
  }
};

module.exports = router;
