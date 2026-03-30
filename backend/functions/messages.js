/**
 * EduManager — API Messages
 */

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

router.get('/', async (req, res) => {
  try {
    const { etablissement_id, lu, type } = req.query;
    let query = 'SELECT * FROM messages WHERE 1=1';
    const params = [];
    if (etablissement_id) { params.push(etablissement_id); query += ` AND etablissement_id = $${params.length}`; }
    if (lu !== undefined) { params.push(lu === 'true'); query += ` AND lu = $${params.length}`; }
    if (type) { params.push(type); query += ` AND type = $${params.length}`; }
    query += ' ORDER BY created_at DESC';
    const result = await req.db.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { expediteur, destinataire, sujet, contenu, type, etablissement_id } = req.body;
    const id = uuidv4();
    const result = await req.db.query(
      `INSERT INTO messages (id, expediteur, destinataire, sujet, contenu, type, etablissement_id, lu)
       VALUES ($1,$2,$3,$4,$5,$6,$7,FALSE) RETURNING *`,
      [id, expediteur, destinataire, sujet, contenu, type || 'Notification', etablissement_id]
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
    const result = await req.db.query(`UPDATE messages SET ${fields} WHERE id = $1 RETURNING *`, [req.params.id, ...values]);
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await req.db.query('DELETE FROM messages WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
