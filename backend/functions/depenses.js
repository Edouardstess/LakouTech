/**
 * EduManager — API Dépenses & Finances
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { etablissement_id, categorie, statut, date_min, date_max } = req.query;
    let query = 'SELECT * FROM depenses WHERE 1=1';
    const params = [];
    if (etablissement_id) { params.push(etablissement_id); query += ` AND etablissement_id = $${params.length}`; }
    if (categorie) { params.push(categorie); query += ` AND categorie = $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND statut = $${params.length}`; }
    if (date_min) { params.push(date_min); query += ` AND date >= $${params.length}`; }
    if (date_max) { params.push(date_max); query += ` AND date <= $${params.length}`; }
    query += ' ORDER BY date DESC';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { libelle, montant, categorie, date, statut, etablissement_id, justificatif_url } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO depenses (id, libelle, montant, categorie, date, statut, etablissement_id, justificatif_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, libelle, montant, categorie || 'Autre', date, statut || 'En attente', etablissement_id, justificatif_url]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i+2}`).join(', ');
    const values = Object.values(req.body);
    const result = await req.db.query(`UPDATE depenses SET ${fields} WHERE id = $1 RETURNING *`, [req.params.id, ...values]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM depenses WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/depenses/stats — Statistiques financières
router.get('/stats/:etablissement_id', async (req, res) => {
  try {
    const result = await req.db.query(`
      SELECT categorie, SUM(montant) as total, COUNT(*) as nb
      FROM depenses
      WHERE etablissement_id = $1 AND statut = 'Payée'
      GROUP BY categorie
      ORDER BY total DESC`, [req.params.etablissement_id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
