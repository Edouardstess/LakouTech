/**
 * EduManager — Middleware d'authentification JWT
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Token manquant' });
  }

  const token = authHeader.split(' ')[1]; // Format "Bearer TOKEN"
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Format de token invalide' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, etablissement_id }
    next();
  } catch (err) {
    return res.status(403).json({ success: false, error: 'Token invalide ou expiré' });
  }
};
