/**
 * EduManager — API Personnel
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { etablissement_id, statut, departement } = req.query;
    let query = 'SELECT * FROM personnel WHERE 1=1';
    const params = [];
    if (etablissement_id) { params.push(etablissement_id); query += ` AND etablissement_id = $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND statut = $${params.length}`; }
    if (departement) { params.push(`%${departement}%`); query += ` AND departement ILIKE $${params.length}`; }
    query += ' ORDER BY nom, prenom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nom, prenom, poste, departement, salaire, date_embauche, statut, telephone, email, etablissement_id } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO personnel (id, nom, prenom, poste, departement, salaire, date_embauche, statut, telephone, email, etablissement_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, nom, prenom, poste, departement, salaire || 0, date_embauche, statut || 'Actif', telephone, email, etablissement_id]
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
    const result = await req.db.query(`UPDATE personnel SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`, [req.params.id, ...values]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM personnel WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
