/**
 * EduManager — API Paiements
 */
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { eleve_id, statut, trimestre } = req.query;
    let query = `SELECT p.*, e.nom as eleve_nom, e.prenom as eleve_prenom FROM paiements p LEFT JOIN eleves e ON p.eleve_id = e.id WHERE 1=1`;
    const params = [];
    if (eleve_id) { params.push(eleve_id); query += ` AND p.eleve_id = $${params.length}`; }
    if (statut) { params.push(statut); query += ` AND p.statut = $${params.length}`; }
    if (trimestre) { params.push(trimestre); query += ` AND p.trimestre = $${params.length}`; }
    query += ' ORDER BY p.created_at DESC';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await req.db.query(`
      SELECT statut, SUM(montant) as total, COUNT(*) as nb
      FROM paiements GROUP BY statut`);
    res.json({ success: true, data: result.rows });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { eleve_id, montant, type_paiement, statut, date_paiement, date_echeance, methode, reference, trimestre } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO paiements (id, eleve_id, montant, type_paiement, statut, date_paiement, date_echeance, methode, reference, trimestre)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [id, eleve_id, montant, type_paiement, statut||'En attente', date_paiement, date_echeance, methode, reference, trimestre]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const { statut, date_paiement, methode, reference } = req.body;
    const result = await req.db.query(
      `UPDATE paiements SET statut=$2, date_paiement=$3, methode=$4, reference=$5, updated_at=NOW() WHERE id=$1 RETURNING *`,
      [req.params.id, statut, date_paiement, methode, reference]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) { res.status(500).json({ success: false, error: err.message }); }
});

module.exports = router;
