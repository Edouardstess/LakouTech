/**
 * EduManager — API Établissements
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { type, actif } = req.query;
    let query = 'SELECT * FROM etablissements WHERE 1=1';
    const params = [];
    if (type) { params.push(type); query += ` AND type = $${params.length}`; }
    if (actif !== undefined) { params.push(actif === 'true'); query += ` AND actif = $${params.length}`; }
    query += ' ORDER BY nom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM etablissements WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, type, adresse, telephone, email, directeur, logo_url } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO etablissements (id, nom, type, adresse, telephone, email, directeur, logo_url, actif)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,TRUE) RETURNING *`,
      [id, nom, type, adresse, telephone, email, directeur, logo_url]
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
    const result = await req.db.query(`UPDATE etablissements SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`, [req.params.id, ...values]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM etablissements WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
