/**
 * EduManager — API Notes & Bulletins
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// GET /api/notes — Liste avec filtres
router.get('/', async (req, res) => {
  try {
    const { eleve_id, classe_id, trimestre, matiere_id } = req.query;
    let query = `
      SELECT n.*, e.nom as eleve_nom, e.prenom as eleve_prenom, m.nom as matiere_nom
      FROM notes n
      LEFT JOIN eleves e ON n.eleve_id = e.id
      LEFT JOIN matieres m ON n.matiere_id = m.id
      WHERE 1=1`;
    const params = [];

    if (eleve_id) { params.push(eleve_id); query += ` AND n.eleve_id = $${params.length}`; }
    if (classe_id) { params.push(classe_id); query += ` AND n.classe_id = $${params.length}`; }
    if (trimestre) { params.push(trimestre); query += ` AND n.trimestre = $${params.length}`; }
    if (matiere_id) { params.push(matiere_id); query += ` AND n.matiere_id = $${params.length}`; }

    query += ' ORDER BY n.date_evaluation DESC';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/notes/bulletin/:eleve_id/:trimestre — Bulletin d'un élève
router.get('/bulletin/:eleve_id/:trimestre', async (req, res) => {
  try {
    const result = await req.db.query(`
      SELECT
        m.nom as matiere, m.coefficient,
        AVG(n.valeur) as moyenne,
        MIN(n.valeur) as min_note,
        MAX(n.valeur) as max_note,
        COUNT(n.id) as nb_notes
      FROM notes n
      JOIN matieres m ON n.matiere_id = m.id
      WHERE n.eleve_id = $1 AND n.trimestre = $2
      GROUP BY m.id, m.nom, m.coefficient
      ORDER BY m.nom`, [req.params.eleve_id, req.params.trimestre]);

    const eleve = await req.db.query('SELECT * FROM eleves WHERE id = $1', [req.params.eleve_id]);

    let totalCoeff = 0, totalPoints = 0;
    result.rows.forEach(r => {
      totalCoeff += parseFloat(r.coefficient);
      totalPoints += parseFloat(r.moyenne) * parseFloat(r.coefficient);
    });
    const moyenne_generale = totalCoeff > 0 ? (totalPoints / totalCoeff).toFixed(2) : 0;

    res.json({
      success: true,
      eleve: eleve.rows[0],
      trimestre: req.params.trimestre,
      matieres: result.rows,
      moyenne_generale,
      mention: moyenne_generale >= 16 ? 'Excellent' : moyenne_generale >= 14 ? 'Très bien' : moyenne_generale >= 12 ? 'Bien' : moyenne_generale >= 10 ? 'Passable' : 'Insuffisant'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/notes — Saisir une note
router.post('/', async (req, res) => {
  try {
    const { eleve_id, matiere_id, classe_id, valeur, type_note, trimestre, date_evaluation, commentaire } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO notes (id, eleve_id, matiere_id, classe_id, valeur, type_note, trimestre, date_evaluation, commentaire)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [id, eleve_id, matiere_id, classe_id, valeur, type_note, trimestre, date_evaluation, commentaire]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
