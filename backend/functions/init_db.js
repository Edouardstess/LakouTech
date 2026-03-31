/**
 * EduManager — Script d'initialisation de la base de données
 * Crée TOUTES les tables nécessaires au fonctionnement complet de la plateforme.
 */

async function initializeDatabase(pool) {
  try {
    console.log('🔄 Initialisation du schéma de la base de données...');

    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- ═══════════════════════════════════════════
      -- 1. ÉTABLISSEMENTS
      -- ═══════════════════════════════════════════
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

      -- ═══════════════════════════════════════════
      -- 2. UTILISATEURS (Auth)
      -- ═══════════════════════════════════════════
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

      -- ═══════════════════════════════════════════
      -- 3. CLASSES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        niveau VARCHAR(100),
        capacite INTEGER DEFAULT 30,
        annee_scolaire VARCHAR(20) DEFAULT '2025-2026',
        salle VARCHAR(100),
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 4. ENSEIGNANTS
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS enseignants (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100),
        email VARCHAR(255),
        telephone VARCHAR(50),
        specialite VARCHAR(100),
        date_embauche DATE,
        salaire NUMERIC(12, 2) DEFAULT 0,
        statut VARCHAR(20) DEFAULT 'Actif',
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 5. MATIÈRES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS matieres (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        code VARCHAR(20),
        coefficient NUMERIC(4, 2) DEFAULT 1,
        description TEXT,
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 6. ÉLÈVES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS eleves (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        date_naissance DATE,
        sexe VARCHAR(1) DEFAULT 'M',
        adresse TEXT,
        telephone VARCHAR(50),
        email VARCHAR(255),
        nom_parent VARCHAR(200),
        tel_parent VARCHAR(50),
        numero_matricule VARCHAR(50),
        statut VARCHAR(20) DEFAULT 'Actif',
        classe_id UUID REFERENCES classes(id),
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 7. PRÉSENCES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS presences (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
        classe_id UUID REFERENCES classes(id),
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        statut VARCHAR(20) DEFAULT 'Présent',
        motif TEXT,
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 8. NOTES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS notes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
        matiere_id UUID REFERENCES matieres(id),
        valeur NUMERIC(5, 2) NOT NULL,
        type_note VARCHAR(50) DEFAULT 'Devoir',
        trimestre VARCHAR(5) DEFAULT 'T1',
        date_evaluation DATE DEFAULT CURRENT_DATE,
        commentaire TEXT,
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 9. PAIEMENTS
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS paiements (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        eleve_id UUID REFERENCES eleves(id) ON DELETE CASCADE,
        montant NUMERIC(12, 2) NOT NULL,
        type_paiement VARCHAR(50) DEFAULT 'Scolarité',
        statut VARCHAR(20) DEFAULT 'En attente',
        date_paiement DATE DEFAULT CURRENT_DATE,
        date_echeance DATE,
        methode VARCHAR(50) DEFAULT 'Espèces',
        reference VARCHAR(100),
        trimestre VARCHAR(5) DEFAULT 'T1',
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 10. EMPLOI DU TEMPS
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS emploi_temps (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        classe_id UUID REFERENCES classes(id),
        enseignant_id UUID REFERENCES enseignants(id),
        matiere_id UUID REFERENCES matieres(id),
        jour VARCHAR(20) NOT NULL,
        heure_debut TIME NOT NULL,
        heure_fin TIME NOT NULL,
        salle VARCHAR(100),
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 11. PERSONNEL (non-enseignant)
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS personnel (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100),
        poste VARCHAR(100),
        departement VARCHAR(100),
        salaire NUMERIC(12, 2) DEFAULT 0,
        date_embauche DATE,
        statut VARCHAR(20) DEFAULT 'Actif',
        telephone VARCHAR(50),
        email VARCHAR(255),
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 12. MESSAGES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        expediteur VARCHAR(200),
        destinataire VARCHAR(200),
        sujet VARCHAR(255),
        contenu TEXT,
        type VARCHAR(50) DEFAULT 'Notification',
        lu BOOLEAN DEFAULT FALSE,
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );

      -- ═══════════════════════════════════════════
      -- 13. DÉPENSES
      -- ═══════════════════════════════════════════
      CREATE TABLE IF NOT EXISTS depenses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        libelle VARCHAR(255) NOT NULL,
        montant NUMERIC(12, 2) NOT NULL,
        categorie VARCHAR(50) DEFAULT 'Fournitures',
        date DATE DEFAULT CURRENT_DATE,
        statut VARCHAR(20) DEFAULT 'En attente',
        description TEXT,
        etablissement_id UUID REFERENCES etablissements(id),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ Schéma complet de la base de données validé (13 tables).');

    // Ajouter un établissement par défaut si vide
    const { rows } = await pool.query('SELECT COUNT(*) FROM etablissements');
    if (parseInt(rows[0].count) === 0) {
      await pool.query(
        "INSERT INTO etablissements (nom, type, adresse) VALUES ($1, $2, $3)",
        ['LakouTech School', 'Mixte', 'Port-au-Prince, Haïti']
      );
      console.log('✅ Établissement par défaut créé.');
    }

  } catch (err) {
    console.error('❌ Erreur lors de l\'initialisation de la DB:', err.stack);
  }
}

module.exports = { initializeDatabase };
