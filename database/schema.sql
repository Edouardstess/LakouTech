-- ============================================================
-- EduManager — Schéma de base de données
-- Compatible PostgreSQL 14+
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: users (Authentification & Rôles)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin','Direction','Enseignant','Comptable','Parent')) DEFAULT 'Direction',
    etablissement_id UUID REFERENCES etablissements(id),
    actif BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: etablissements
-- ============================================================
CREATE TABLE IF NOT EXISTS etablissements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('Primaire','Secondaire','Supérieur','Mixte')),
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    directeur VARCHAR(255),
    logo_url TEXT,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: classes
-- ============================================================
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    niveau VARCHAR(100),
    capacite INTEGER DEFAULT 30,
    etablissement_id UUID REFERENCES etablissements(id),
    enseignant_principal_id UUID,
    annee_scolaire VARCHAR(20),
    salle VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: enseignants
-- ============================================================
CREATE TABLE IF NOT EXISTS enseignants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(50),
    specialite VARCHAR(200),
    etablissement_id UUID REFERENCES etablissements(id),
    salaire DECIMAL(12,2) DEFAULT 0,
    date_embauche DATE,
    statut VARCHAR(20) CHECK (statut IN ('Actif','Congé','Inactif')),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: eleves
-- ============================================================
CREATE TABLE IF NOT EXISTS eleves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE,
    sexe CHAR(1) CHECK (sexe IN ('M','F')),
    adresse TEXT,
    telephone VARCHAR(50),
    email VARCHAR(255),
    nom_parent VARCHAR(200),
    tel_parent VARCHAR(50),
    etablissement_id UUID REFERENCES etablissements(id),
    classe_id UUID REFERENCES classes(id),
    statut VARCHAR(20) CHECK (statut IN ('Actif','Inactif','Transféré','Diplômé')) DEFAULT 'Actif',
    photo_url TEXT,
    numero_matricule VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: matieres
-- ============================================================
CREATE TABLE IF NOT EXISTS matieres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(200) NOT NULL,
    code VARCHAR(20),
    coefficient DECIMAL(4,2) DEFAULT 1,
    enseignant_id UUID REFERENCES enseignants(id),
    classe_id UUID REFERENCES classes(id),
    heures_semaine DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: presences
-- ============================================================
CREATE TABLE IF NOT EXISTS presences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eleve_id UUID REFERENCES eleves(id),
    classe_id UUID REFERENCES classes(id),
    matiere_id UUID REFERENCES matieres(id),
    date DATE NOT NULL,
    statut VARCHAR(20) CHECK (statut IN ('Présent','Absent','Retard','Excusé')),
    motif TEXT,
    enregistre_par VARCHAR(200),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: notes
-- ============================================================
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eleve_id UUID REFERENCES eleves(id),
    matiere_id UUID REFERENCES matieres(id),
    classe_id UUID REFERENCES classes(id),
    valeur DECIMAL(5,2) CHECK (valeur >= 0 AND valeur <= 20),
    type_note VARCHAR(30) CHECK (type_note IN ('Devoir','Interrogation','Examen','TP','Oral')),
    trimestre VARCHAR(5) CHECK (trimestre IN ('T1','T2','T3')),
    date_evaluation DATE,
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: emploi_temps
-- ============================================================
CREATE TABLE IF NOT EXISTS emploi_temps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classe_id UUID REFERENCES classes(id),
    matiere_id UUID REFERENCES matieres(id),
    enseignant_id UUID REFERENCES enseignants(id),
    jour VARCHAR(15) CHECK (jour IN ('Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi')),
    heure_debut TIME,
    heure_fin TIME,
    salle VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: paiements
-- ============================================================
CREATE TABLE IF NOT EXISTS paiements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    eleve_id UUID REFERENCES eleves(id),
    montant DECIMAL(12,2) NOT NULL,
    type_paiement VARCHAR(30) CHECK (type_paiement IN ('Inscription','Scolarité','Transport','Cantine','Activités','Autre')),
    statut VARCHAR(20) CHECK (statut IN ('Payé','En attente','Partiel','Annulé')) DEFAULT 'En attente',
    date_paiement DATE,
    date_echeance DATE,
    methode VARCHAR(30) CHECK (methode IN ('Espèces','Virement','Mobile Money','Carte','Chèque')),
    reference VARCHAR(100),
    trimestre VARCHAR(5),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: personnel
-- ============================================================
CREATE TABLE IF NOT EXISTS personnel (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    poste VARCHAR(200),
    departement VARCHAR(200),
    salaire DECIMAL(12,2) DEFAULT 0,
    date_embauche DATE,
    statut VARCHAR(20) CHECK (statut IN ('Actif','Congé','Suspendu','Quitté')) DEFAULT 'Actif',
    telephone VARCHAR(50),
    email VARCHAR(255),
    etablissement_id UUID REFERENCES etablissements(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expediteur VARCHAR(255),
    destinataire VARCHAR(255),
    sujet VARCHAR(500),
    contenu TEXT,
    lu BOOLEAN DEFAULT FALSE,
    type VARCHAR(30) CHECK (type IN ('Parent-Ecole','Notification','Circulaire','Urgence')),
    etablissement_id UUID REFERENCES etablissements(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TABLE: depenses
-- ============================================================
CREATE TABLE IF NOT EXISTS depenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    libelle VARCHAR(500) NOT NULL,
    montant DECIMAL(12,2) NOT NULL,
    categorie VARCHAR(50) CHECK (categorie IN ('Salaires','Fournitures','Infrastructure','Services','Activités','Autre')),
    date DATE,
    statut VARCHAR(20) CHECK (statut IN ('Payée','En attente','Annulée')) DEFAULT 'En attente',
    etablissement_id UUID REFERENCES etablissements(id),
    justificatif_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INDEX pour performances
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_eleves_classe ON eleves(classe_id);
CREATE INDEX IF NOT EXISTS idx_eleves_etablissement ON eleves(etablissement_id);
CREATE INDEX IF NOT EXISTS idx_presences_date ON presences(date);
CREATE INDEX IF NOT EXISTS idx_presences_eleve ON presences(eleve_id);
CREATE INDEX IF NOT EXISTS idx_notes_eleve ON notes(eleve_id);
CREATE INDEX IF NOT EXISTS idx_notes_trimestre ON notes(trimestre);
CREATE INDEX IF NOT EXISTS idx_paiements_statut ON paiements(statut);
CREATE INDEX IF NOT EXISTS idx_paiements_eleve ON paiements(eleve_id);

-- ============================================================
-- DONNÉES DE TEST
-- ============================================================
INSERT INTO etablissements (nom, type, adresse, telephone, email, directeur, actif) VALUES
('Collège Saint-Pierre', 'Secondaire', '12 Rue des Fleurs, Port-au-Prince', '+509 3700-0001', 'contact@saintpierre.edu.ht', 'Jean-Baptiste Moreau', TRUE),
('École Primaire Lumière', 'Primaire', '45 Ave Christophe, Cap-Haïtien', '+509 3700-0002', 'info@ecole-lumiere.ht', 'Marie Claire Dupont', TRUE)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE eleves IS 'Table des élèves inscrits dans les établissements';
COMMENT ON TABLE presences IS 'Suivi des présences et absences journalières';
COMMENT ON TABLE notes IS 'Notes et évaluations des élèves par trimestre';
COMMENT ON TABLE paiements IS 'Frais scolaires et paiements des familles';
