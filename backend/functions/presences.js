/**
 * EduManager — API Présences/Absences
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/presences — Liste avec filtres
router.get('/', async (req, res) => {
  try {
    const { date, classe_id, eleve_id, statut } = req.query;
    let query = `
      SELECT p.*, e.nom as eleve_nom, e.prenom as eleve_prenom, c.nom as classe_nom
      FROM presences p
      LEFT JOIN eleves e ON p.eleve_id = e.id
      LEFT JOIN classes c ON p.classe_id = c.id
      WHERE 1=1`;
    const params = [];

    if (date) { params.push(date); query += ` AND p.date = $${params.length}`; }
    if (classe_id) { params.push(classe_id); query += ` AND p.classe_id = $${params.length}`; }
    if (eleve_id) { params.push(eleve_id); query += ` AND p.eleve_id = $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND p.statut = $${params.length}`; }

    query += ' ORDER BY p.date DESC, e.nom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/presences/stats — Statistiques par élève
router.get('/stats/:eleve_id', async (req, res) => {
  try {
    const result = await req.db.query(`
      SELECT statut, COUNT(*) as total
      FROM presences WHERE eleve_id = $1
      GROUP BY statut`, [req.params.eleve_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/presences — Enregistrer présence
router.post('/', async (req, res) => {
  try {
    const { eleve_id, classe_id, date, statut, motif, matiere_id, enregistre_par } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO presences (id, eleve_id, classe_id, date, statut, motif, matiere_id, enregistre_par)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, eleve_id, classe_id, date, statut, motif, matiere_id, enregistre_par]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/presences/bulk — Enregistrement en masse pour une classe
router.post('/bulk', async (req, res) => {
  try {
    const { classe_id, date, presences } = req.body;
    const results = [];
    for (const p of presences) {
      const id = uuidv4();
      const r = await req.db.query(
        `INSERT INTO presences (id, eleve_id, classe_id, date, statut, motif)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING RETURNING *`,
        [id, p.eleve_id, classe_id, date, p.statut, p.motif || null]
      );
      if (r.rows[0]) results.push(r.rows[0]);
    }
    res.status(201).json({ success: true, data: results, count: results.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
