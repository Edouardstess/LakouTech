/**
 * EduManager — API Classes
 * CRUD complet pour la gestion des classes
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/classes — Liste toutes les classes
router.get('/', async (req, res) => {
  try {
    const { etablissement_id, niveau } = req.query;
    let query = 'SELECT * FROM classes WHERE 1=1';
    const params = [];

    if (etablissement_id) { params.push(etablissement_id); query += ` AND etablissement_id = $${params.length}`; }
    if (niveau) { params.push(niveau); query += ` AND niveau = $${params.length}`; }

    query += ' ORDER BY nom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/classes/:id — Détail d'une classe
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM classes WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Classe non trouvée' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/classes — Créer une classe
router.post('/', async (req, res) => {
  try {
    const { nom, niveau, capacite, annee_scolaire, salle, etablissement_id, enseignant_principal_id } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO classes (id, nom, niveau, capacite, annee_scolaire, salle, etablissement_id, enseignant_principal_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, nom, niveau, capacite || 30, annee_scolaire || '2024-2025', salle, etablissement_id, enseignant_principal_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/classes/:id — Modifier une classe
router.put('/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i+2}`).join(', ');
    const values = Object.values(req.body);
    const result = await req.db.query(
      `UPDATE classes SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id, ...values]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/classes/:id — Supprimer une classe
router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM classes WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Classe supprimée' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
