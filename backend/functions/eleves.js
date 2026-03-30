/**
 * EduManager — API Élèves
 * CRUD complet pour la gestion des élèves
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/eleves — Liste tous les élèves
router.get('/', async (req, res) => {
  try {
    const { classe_id, statut, search } = req.query;
    let query = 'SELECT * FROM eleves WHERE 1=1';
    const params = [];

    if (classe_id) { params.push(classe_id); query += ` AND classe_id = $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND statut = $${params.length}`; }
    if (search) { params.push(`%${search}%`); query += ` AND (nom ILIKE $${params.length} OR prenom ILIKE $${params.length} OR numero_matricule ILIKE $${params.length})`; }

    query += ' ORDER BY nom, prenom';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/eleves/:id — Détail d'un élève
router.get('/:id', async (req, res) => {
  try {
    const result = await req.db.query('SELECT * FROM eleves WHERE id = $1', [req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'Élève non trouvé' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/eleves — Créer un élève
router.post('/', async (req, res) => {
  try {
    const { nom, prenom, date_naissance, sexe, adresse, telephone, email, nom_parent, tel_parent, etablissement_id, classe_id, numero_matricule } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO eleves (id, nom, prenom, date_naissance, sexe, adresse, telephone, email, nom_parent, tel_parent, etablissement_id, classe_id, numero_matricule, statut)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'Actif') RETURNING *`,
      [id, nom, prenom, date_naissance, sexe, adresse, telephone, email, nom_parent, tel_parent, etablissement_id, classe_id, numero_matricule]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/eleves/:id — Modifier un élève
router.put('/:id', async (req, res) => {
  try {
    const fields = Object.keys(req.body).map((k, i) => `${k} = $${i+2}`).join(', ');
    const values = Object.values(req.body);
    const result = await req.db.query(
      `UPDATE eleves SET ${fields}, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [req.params.id, ...values]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/eleves/:id — Supprimer un élève
router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM eleves WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Élève supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
