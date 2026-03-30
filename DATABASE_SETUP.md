# 🗄️ Guide Complet - PostgreSQL sur Windows

## 📋 Table des Matières
1. Installation PostgreSQL
2. Configuration initiale
3. Création de la base de données
4. Vérification et tests
5. Dépannage

---

## **1. Installation PostgreSQL sur Windows**

### Option A: Installer depuis le site officiel
```
1. Visitez: https://www.postgresql.org/download/windows/
2. Téléchargez la version 15 ou 16
3. Lancez le fichier .exe
4. Configuration recommandée:
   - Port: 5432 (défaut)
   - Mot de passe superuser: password123
   - Cochez: pgAdmin 4
```

### Option B: Utiliser Chocolatey (PackageManager)
```powershell
# En tant qu'administrateur:
choco install postgresql15 --version=15.0

# Cela installe:
# ✅ PostgreSQL Server
# ✅ psql (client)
# ✅ pgAdmin
```

### Option C: Utiliser Docker
```bash
# Depuis le dossier project:
cd docker
docker-compose up -d postgres

# Vérifie:
docker-compose logs postgres
```

---

## **2. Configuration Initiale**

### Démarrer PostgreSQL
```powershell
# Vérifier le statut
Get-Service postgresql-x64-15

# Démarrer le service
Start-Service postgresql-x64-15

# Ou via Services Windows (services.msc)
```

### Se connecter à PostgreSQL
```bash
# Méthode 1: Ligne de commande
psql -U postgres

# Méthode 2: pgAdmin (interface graphique)
# Navigate to: http://localhost:5050
# Default login: pgadmin4@pgadmin.org / admin
```

---

## **3. Créer la Base de Données EduManager**

### Étape 1: Créer l'utilisateur
```sql
-- Connecté en tant que postgres superuser

-- Créer l'utilisateur:
CREATE USER edumanager_user WITH PASSWORD 'EduManager2025!';

-- Donner les permissions:
ALTER ROLE edumanager_user CREATEDB;
ALTER ROLE edumanager_user SUPERUSER;

-- Vérifier:
\du
```

### Étape 2: Créer la base de données
```sql
-- Créer la base:
CREATE DATABASE edumanager
  OWNER edumanager_user
  ENCODING 'UTF8'
  LC_COLLATE 'en_US.UTF-8'
  LC_CTYPE 'en_US.UTF-8';

-- Vérifier:
\l
```

### Étape 3: Charger le schéma
```bash
# Depuis la ligne de commande:
psql -U edumanager_user -d edumanager -f database/schema.sql

# Ou dans la session psql:
\connect edumanager
\i database/schema.sql

# Vérifier les tables:
\dt
```

---

## **4. Vérification et Tests**

### Via psql (Ligne de commande)
```bash
# Connexion:
psql -U edumanager_user -d edumanager -h localhost

# Requêtes de test:
SELECT COUNT(*) FROM etablissements;
SELECT COUNT(*) FROM eleves;
SELECT COUNT(*) FROM classes;

# Lister les tables:
\dt

# Quitter:
\q
```

### Via pgAdmin (Interface graphique)
```
1. Ouvrir: http://localhost:5050
2. Login: pgadmin4@pgadmin.org / admin
3. Ajouter serveur:
   - Host: localhost
   - Port: 5432
   - Username: edumanager_user
   - Password: EduManager2025!
4. Browser → edumanager → Public → Tables
```

### Script de Vérification automatique
```bash
# Depuis le dossier backend:
node db-init.js

# Cela affichera:
# ✅ Statut de connexion
# ✅ Tables présentes
# ✅ Nombre d'enregistrements
```

### Via Node.js (Depuis l'app)
```bash
# Tester la connexion depuis le backend:
cd backend
npm install
node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://edumanager_user:EduManager2025!@localhost:5432/edumanager'
});
pool.query('SELECT version()', (err, res) => {
  console.log(err || res.rows[0].version.split(',')[0]);
  process.exit();
});
"
```

---

## **5. Configuration du Fichier .env**

### Paramètres PostgreSQL
```env
# .env dans le dossier racine:
DATABASE_URL=postgresql://edumanager_user:EduManager2025!@localhost:5432/edumanager
DB_PASSWORD=EduManager2025!
POSTGRES_DB=edumanager
POSTGRES_USER=edumanager_user
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

### Vérifier la connexion
```bash
# Depuis Node.js:
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.query('SELECT COUNT(*) FROM information_schema.tables', (err, res) => {
  if (err) console.error('❌ Erreur:', err.message);
  else console.log(`✅ Connecté! ${res.rows[0].count} tables`);
});
```

---

## **6. Dépannage Courant**

### Erreur: "could not connect to server"
```bash
# Vérifier que PostgreSQL tourne:
Get-Service postgresql-x64-15

# Redémarrer le service:
Restart-Service postgresql-x64-15

# Ou via Services Windows:
# Win + R → services.msc → postgresql → redémarrer
```

### Erreur: "role does not exist"
```bash
# Vérifier que l'utilisateur existe:
psql -U postgres -c "\du"

# Recréer l'utilisateur:
psql -U postgres -c "CREATE USER edumanager_user WITH PASSWORD 'EduManager2025!';"
```

### Erreur: "database does not exist"
```bash
# Vérifier les bases:
psql -U postgres -c "\l"

# Recréer la base:
psql -U postgres -c "CREATE DATABASE edumanager OWNER edumanager_user;"
psql -U edumanager_user -d edumanager -f database/schema.sql
```

### Performance lente
```sql
-- Analyser et réindexer:
VACUUM ANALYZE;
REINDEX DATABASE edumanager;

-- Commandes de maintenance:
CHECKPOINT;
```

---

## **7. Sauvegarde & Restauration**

### Backup complet
```bash
# Exporter la base complète:
pg_dump -U edumanager_user -d edumanager > backup_edumanager.sql

# Avec compression:
pg_dump -U edumanager_user -d edumanager | gzip > backup_edumanager.sql.gz
```

### Restauration
```bash
# Restaurer depuis un backup:
psql -U edumanager_user -d edumanager < backup_edumanager.sql

# Depuis un backup compressé:
gunzip -c backup_edumanager.sql.gz | psql -U edumanager_user -d edumanager
```

---

## **8. Information Système**

### Localiser PostgreSQL
```powershell
# Où est installé PostgreSQL?
$env:ProgramFiles + "\PostgreSQL"

# Dossier données:
$env:APPDATA + "\postgresql"
ou
"C:\Program Files\PostgreSQL\15\data"
```

### Fichier de configuration
```bash
# postgresql.conf:
C:\Program Files\PostgreSQL\15\data\postgresql.conf

# pg_hba.conf (authentification):
C:\Program Files\PostgreSQL\15\data\pg_hba.conf
```

---

## **9. Commandes PostgreSQL Utiles**

```sql
-- Lister les bases:
\l

-- Lister les utilisateurs:
\du

-- Lister les tables:
\dt

-- Afficher la structure d'une table:
\d eleves

-- Statistiques:
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Taille de la base:
SELECT pg_size_pretty(pg_database_size('edumanager'));

-- Requête de test:
SELECT version();
SELECT current_user;
SELECT now();
```

---

## **10. Configuration Production (Important!)**

### Changements recommandés
```env
# .env pour PRODUCTION:

# ❌ NE PAS utiliser:
DB_PASSWORD=EduManager2025!
JWT_SECRET=your_super_secret_key...

# ✅ À remplacer:
DB_PASSWORD=<Mot de passe fort aléatoire - minimum 32 caractères>
JWT_SECRET=<Clé JWT sécurisée - minimum 32 caractères>

# Générer une clé sécurisée:
# Windows PowerShell:
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).Guid + (New-Guid).Guid))

# Linux/Mac:
openssl rand -base64 32
```

### Permissions sécurisées
```sql
-- Créer un utilisateur sans SUPERUSER:
CREATE USER edumanager_prod WITH PASSWORD '...';

-- Donner les permissions minimales:
GRANT CONNECT ON DATABASE edumanager TO edumanager_prod;
GRANT USAGE ON SCHEMA public TO edumanager_prod;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO edumanager_prod;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO edumanager_prod;

-- Révoquer SUPERUSER:
ALTER ROLE edumanager_prod NOSUPERUSER;
```

---

## **11. Monitoring & Maintenance**

### Monitoring actif
```bash
# Connexions actuelles:
psql -U postgres -d edumanager -c "SELECT datname, usename, application_name, state FROM pg_stat_activity;"

# Requêtes lentes:
psql -U postgres -d edumanager -c "SELECT query, calls, mean_time FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"

# Cache hit ratio:
psql -U postgres -d edumanager -c "SELECT sum(heap_blks_hit)/(sum(heap_blks_hit) + sum(heap_blks_read)) FROM pg_statio_user_tables;"
```

### Maintenance programmée
```sql
-- Quotidien:
VACUUM ANALYZE;

-- Hebdomadaire:
REINDEX DATABASE edumanager;

-- Mensuel:
pg_dump et archivage;
```

---

## **Résumé Rapide**

| Action | Commande |
|--------|----------|
| Installer | Télécharger depuis postgresql.org |
| Démarrer | `Start-Service postgresql-x64-15` |
| Connexion | `psql -U edumanager_user -d edumanager` |
| Créer base | `createdb -U postgres edumanager` |
| Charger schéma | `psql -U edumanager_user -d edumanager -f database/schema.sql` |
| Tester | `node db-init.js` |
| Backup | `pg_dump -U edumanager_user -d edumanager > backup.sql` |
| Restore | `psql -U edumanager_user -d edumanager < backup.sql` |

---

**Made with ❤️ for EduManager**
