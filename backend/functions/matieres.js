/**
 * EduManager — API Matieres
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { classe_id, enseignant_id } = req.query;
    let query = 'SELECT * FROM matieres WHERE 1=1';
    const params = [];
    if (classe_id) { params.push(classe_id); query += ` AND classe_id = $${params.length}`; }
    if (enseignant_id) { params.push(enseignant_id); query += ` AND enseignant_id = $${params.length}`; }
    query += ' ORDER BY nom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM matieres WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: result.rows[0] || null });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, code, coefficient, classe_id, enseignant_id, heures_semaine } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO matieres (id, nom, code, coefficient, classe_id, enseignant_id, heures_semaine)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [id, nom, code, coefficient || 1, classe_id, enseignant_id, heures_semaine]
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
    const result = await req.db.query(`UPDATE matieres SET ${fields} WHERE id = $1 RETURNING *`, [req.params.id, ...values]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM matieres WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
