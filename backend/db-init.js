/**
 * EduManager — Configuration PostgreSQL
 * Script d'initialisation de la base de données
 */

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

// ============================================================
// FONCTIONS D'INITIALISATION
// ============================================================

async function createDatabase() {
  console.log('🔧 Initialisation de la base de données...');

  try {
    // Test de connexion
    const connection = await pool.connect();
    console.log('✅ Connexion établie avec PostgreSQL');

    // Récupérer info database
    const result = await connection.query('SELECT version()');
    console.log('📊 Version PostgreSQL:', result.rows[0].version.split(',')[0]);

    // Vérifier les tables
    const tables = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log(`\n📋 Tables existantes: ${tables.rows.length}`);
    tables.rows.forEach(t => console.log(`  ✓ ${t.table_name}`));

    if (tables.rows.length === 0) {
      console.log('\n⚠️  Aucune table trouvée!');
      console.log('🔨 Vous devez charger le schéma:');
      console.log('   psql -U edumanager_user -d edumanager -f database/schema.sql');
    }

    connection.release();

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    process.exit(1);
  }
}

async function checkDataIntegrity() {
  console.log('\n🔍 Vérification de l\'intégrité des données...');

  try {
    const connection = await pool.connect();

    const checks = [
      { name: 'Établissements', table: 'etablissements' },
      { name: 'Classes', table: 'classes' },
      { name: 'Élèves', table: 'eleves' },
      { name: 'Enseignants', table: 'enseignants' },
      { name: 'Présences', table: 'presences' },
      { name: 'Notes', table: 'notes' },
      { name: 'Paiements', table: 'paiements' }
    ];

    for (const check of checks) {
      const result = await connection.query(`SELECT COUNT(*) FROM ${check.table}`);
      const count = result.rows[0].count;
      const icon = count > 0 ? '✓' : '—';
      console.log(`  ${icon} ${check.name}: ${count} enregistrement(s)`);
    }

    connection.release();

  } catch (error) {
    console.error('⚠️  Erreur lors de la vérification:', error.message);
  }
}

async function seedTestData() {
  console.log('\n🌱 Insertion de données de test...');

  try {
    const connection = await pool.connect();

    // Vérifier s'il y a déjà des données
    const etab = await connection.query('SELECT COUNT(*) FROM etablissements');
    if (etab.rows[0].count >= 2) {
      console.log('  ✓ Données de test déjà présentes');
      connection.release();
      return;
    }

    console.log('  ⏳ Insertion des établissements...');
    await connection.query(`
      INSERT INTO etablissements (nom, type, adresse, telephone, email, directeur, actif)
      VALUES
        ('Collège Saint-Pierre', 'Secondaire', '12 Rue des Fleurs, Port-au-Prince', '+509 3700-0001', 'contact@saintpierre.edu.ht', 'Jean-Baptiste Moreau', TRUE),
        ('École Primaire Lumière', 'Primaire', '45 Ave Christophe, Cap-Haïtien', '+509 3700-0002', 'info@ecole-lumiere.ht', 'Marie Claire Dupont', TRUE)
      ON CONFLICT DO NOTHING
    `);
    console.log('  ✓ Établissements insérés');

    connection.release();

  } catch (error) {
    console.error('⚠️  Erreur lors de l\'insertion:', error.message);
  }
}

async function runChecks() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║        🗄️  EduManager - Diagnostic Base de Données         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  await createDatabase();
  await checkDataIntegrity();
  await seedTestData();

  console.log('\n✅ Diagnostic terminé!\n');
  process.exit(0);
}

// ============================================================
// EXÉCUTION
// ============================================================

if (require.main === module) {
  runChecks().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { pool, createDatabase, checkDataIntegrity, seedTestData };
