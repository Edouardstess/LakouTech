/**
 * EduManager — Script d'initialisation DB
 * Lit le schema.sql et l'exécute si possible
 */
const fs = require('fs');
const path = require('path');

async function initializeDatabase(pool) {
  try {
    console.log('🔄 Vérification du schéma de la base de données...');
    
    // Chemin vers le schema.sql (situé dans /database à la racine du projet)
    // ATTENTION : Dans le docker context 'backend', on a peut-être pas accès à /database.
    // Je vais plutôt injecter le contenu SQL directement dans ce script pour plus de fiabilité sur Render.
    
    const schemaSql = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS etablissements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(255) NOT NULL,
        type VARCHAR(50) DEFAULT 'Mixte',
        adresse TEXT,
        telephone VARCHAR(50),
        email VARCHAR(255),
        directeur VARCHAR(255),
        logo_url TEXT,
        actif BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) DEFAULT 'Direction',
        etablissement_id UUID REFERENCES etablissements(id),
        actif BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Autres tables simplifiées pour l'initialisation immédiate (Eleves, Classes, etc.)
    CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        niveau VARCHAR(100),
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS eleves (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        etablissement_id UUID REFERENCES etablissements(id),
        classe_id UUID REFERENCES classes(id),
        created_at TIMESTAMP DEFAULT NOW()
    );
    `;

    await pool.query(schemaSql);
    console.log('✅ Schéma de base de données validé.');

    // Ajouter un établissement par défaut si vide
    const { rows } = await pool.query('SELECT COUNT(*) FROM etablissements');
    if (parseInt(rows[0].count) === 0) {
      await pool.query("INSERT INTO etablissements (nom, type, adresse) VALUES ($1, $2, $3)", 
      ['LakouTech School', 'Mixte', 'Port-au-Prince, Haïti']);
      console.log('✅ Établissement par défaut créé.');
    }

  } catch (err) {
    console.error('❌ Erreur lors de l’initialisation de la DB:', err.message);
  }
}

module.exports = { initializeDatabase };
