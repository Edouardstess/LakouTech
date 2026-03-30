/**
 * EduManager — API Emploi du Temps
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { classe_id, enseignant_id, jour } = req.query;
    let query = `SELECT e.*, c.nom as classe_nom, en.nom as enseignant_nom, en.prenom as enseignant_prenom
                 FROM emploi_temps e
                 LEFT JOIN classes c ON e.classe_id = c.id
                 LEFT JOIN enseignants en ON e.enseignant_id = en.id WHERE 1=1`;
    const params = [];
    if (classe_id) { params.push(classe_id); query += ` AND e.classe_id = $${params.length}`; }
    if (enseignant_id) { params.push(enseignant_id); query += ` AND e.enseignant_id = $${params.length}`; }
    if (jour) { params.push(jour); query += ` AND e.jour = $${params.length}`; }
    query += ' ORDER BY e.jour, e.heure_debut';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { classe_id, enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO emploi_temps (id, classe_id, enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [id, classe_id, enseignant_id, matiere_id, jour, heure_debut, heure_fin, salle]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM emploi_temps WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
