/**
 * EduManager — API Enseignants
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/enseignants
router.get('/', async (req, res) => {
  try {
    const { etablissement_id, specialite, statut } = req.query;
    let query = 'SELECT * FROM enseignants WHERE 1=1';
    const params = [];

    if (etablissement_id) { params.push(etablissement_id); query += ` AND etablissement_id = $${params.length}`; }
    if (specialite) { params.push(`%${specialite}%`); query += ` AND specialite ILIKE $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND statut = $${params.length}`; }

    query += ' ORDER BY nom, prenom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/enseignants/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM enseignants WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Enseignant non trouvé' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/enseignants
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, email, telephone, specialite, salaire, date_embauche, statut, etablissement_id } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO enseignants (id, nom, prenom, email, telephone, specialite, salaire, date_embauche, statut, etablissement_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id, nom, prenom, email, telephone, specialite, salaire || 0, date_embauche, statut || 'Actif', etablissement_id]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/enseignants/:id
router.put('/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i+2}`).join(', ');
    const values = Object.values(req.body);
    const result = await req.db.query(
      `UPDATE enseignants SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id, ...values]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/enseignants/:id
router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM enseignants WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Enseignant supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
