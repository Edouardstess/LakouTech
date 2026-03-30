# 🎓 EduManager - Guide Complet Finale v1.0.0

![EduManager](https://img.shields.io/badge/EduManager-v1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Production%20Ready-green)
![Node](https://img.shields.io/badge/Node-18%2B-brightgreen)
![React](https://img.shields.io/badge/React-18.2-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)

---

## 📋 Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Démarrage](#démarrage)
5. [Utilisation](#utilisation)
6. [API Documentation](#api-documentation)
7. [Tests](#tests)
8. [Troubleshooting](#troubleshooting)
9. [Déploiement](#déploiement)

---

## 🎯 Vue d'ensemble

**EduManager** est une plateforme SaaS complète de gestion scolaire pour les établissements d'enseignement.

### Fonctionnalités

✅ **12 Modules Complets:**
- 👨‍🎓 Gestion des élèves
- 🏫 Gestion des classes
- 👨‍🏫 Gestion des enseignants
- 📜 Gestion des matières
- 🗓️ Emploi du temps
- 📋 Présences et absences
- 📝 Notes et bulletins
- 💰 Paiements et frais
- 📊 Finances et dépenses
- 👥 RH et personnel
- ✉️ Messagerie interne
- 🏢 Gestion d'établissements

### Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18.2 + JavaScript |
| **Backend** | Node.js 18+ + Express 4.18 |
| **Database** | PostgreSQL 15 |
| **Containerization** | Docker + Docker Compose |
| **Testing** | Jest + Supertest |

---

## 🚀 Installation

### Prérequis

```bash
# Vérifier Node.js et npm:
node --version    # v18 ou plus
npm --version     # v9 ou plus

# PostgreSQL (local ou Docker):
postgres --version  # v15 ou plus
```

### Cloner et Configurer

```bash
# 1. Naviguer vers le projet:
cd C:\xampp\htdocs\edumanager_project

# 2. Vérifier la structure:
ls -la
# Vous devriez voir: backend/, frontend/, docker/, database/, .env

# 3. Installer les dépendances:
cd backend && npm ci
cd ../frontend && npm ci
cd ..
```

---

## ⚙️ Configuration

### Variables d'Environnement

**Créer/modifier `.env` (déjà créé):**

```env
# Base de données
DATABASE_URL=postgresql://edumanager_user:EduManager2025!@localhost:5432/edumanager
DB_PASSWORD=EduManager2025!

# Serveur
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Sécurité
JWT_SECRET=your_super_secret_key_change_this_in_production_minimum_32_chars_12345
JWT_EXPIRES_IN=24h

# Frontend
REACT_APP_API_URL=http://localhost:3001
REACT_APP_BASE44_APP_ID=69c9b24e3697466f8942132b
```

### PostgreSQL Setup

**Option 1: Installation Locale**

```bash
# 1. Télécharger: https://www.postgresql.org/download/

# 2. Créer la base:
psql -U postgres -c "CREATE USER edumanager_user WITH PASSWORD 'EduManager2025!';"
psql -U postgres -c "CREATE DATABASE edumanager OWNER edumanager_user;"

# 3. Charger le schéma:
psql -U edumanager_user -d edumanager -f database/schema.sql

# 4. Vérifier:
psql -U edumanager_user -d edumanager -c "SELECT COUNT(*) FROM information_schema.tables;"
```

**Option 2: Docker**

```bash
# Depuis le dossier project:
cd docker
docker-compose up -d postgres

# Vérifier:
docker-compose logs postgres
```

---

## 🎬 Démarrage

### Mode Développement (Recommandé)

**Ouvrir 2-3 terminaux:**

```bash
# Terminal 1 - Backend API:
cd backend
npm run dev
# Serveur sur http://localhost:3001

# Terminal 2 - Frontend Web:
cd frontend
npm start
# Ouvre http://localhost:3000 automatiquement

# Terminal 3 (Optionnel) - Tests:
cd backend
npm test
```

### Mode Production (Docker)

```bash
# Démarrer tous les services:
cd docker
docker-compose up -d

# Vérifier:
docker-compose ps

# Accéder:
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

### Scripts Rapides (Windows)

```batch
# Démarrage complet:
START.bat

# Gestion Docker:
docker-compose.bat up      # Démarrer
docker-compose.bat down    # Arrêter
docker-compose.bat logs    # Logs
docker-compose.bat shell   # PostgreSQL shell
```

---

## 💻 Utilisation

### Accès à l'Application

| URL | Service | Description |
|-----|---------|-------------|
| `http://localhost:3000` | Frontend | Interface web EduManager |
| `http://localhost:3001/api` | Backend API | Endpoints REST |
| `http://localhost:3001/health` | Health Check | Statut serveur |
| `http://localhost:5050` | pgAdmin | Gestion PostgreSQL |

### Navigation

1. **Tableau de Bord** - Vue d'ensemble et statistiques
2. **Élèves** - Gestion des profils étudiants
3. **Classes** - Configuration des classes
4. **Enseignants** - Gestion du personnel enseignant
5. **Présences** - Enregistrement des présences/absences
6. **Notes** - Saisie des notes et bulletins
7. **Emploi du Temps** - Planning hebdomadaire
8. **Paiements** - Frais scolaires
9. **RH & Personnel** - Paie et ressources humaines
10. **Messagerie** - Communications internes
11. **Finances** - Comptabilité et dépenses
12. **Établissements** - Infos écoles

---

## 🔌 API Documentation

### Format des Réponses

**Succès (200):**
```json
{
  "success": true,
  "data": [...],
  "total": 42
}
```

**Erreur (4xx/5xx):**
```json
{
  "success": false,
  "error": "Message d'erreur"
}
```

### Endpoints Disponibles

**Format:** `GET|POST|PUT|DELETE /api/{entite}`

**Entités (12 totales):**
```
/api/eleves
/api/classes
/api/enseignants
/api/matieres
/api/presences
/api/notes
/api/paiements
/api/emploitempss          # Note: endpoint spécial
/api/personnel
/api/messages
/api/depenses
/api/etablissements
```

### Exemples de Requêtes

```bash
# Lister les élèves:
curl http://localhost:3001/api/eleves

# Lister avec filtres:
curl "http://localhost:3001/api/eleves?statut=Actif"

# Créer un élève:
curl -X POST http://localhost:3001/api/eleves \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dupont","prenom":"Jean","statut":"Actif"}'

# Modifier un élève:
curl -X PUT http://localhost:3001/api/eleves/abc123 \
  -H "Content-Type: application/json" \
  -d '{"statut":"Inactif"}'

# Supprimer un élève:
curl -X DELETE http://localhost:3001/api/eleves/abc123

# Health check:
curl http://localhost:3001/health
```

---

## 🧪 Tests

### Lancer les Tests

```bash
# Tests de base:
cd backend
npm test

# Tests avec watch:
npm run test:watch

# Tests détaillés:
npm run test:verbose
```

### Coberture

```bash
# Générer rapport de couverture:
npm test -- --coverage

# Voir les résultats:
open coverage/index.html
```

### Tests Frontend (Optionnel)

```bash
cd frontend
npm test
# Appuyez sur 'a' pour lancer tous les tests
```

---

## 🔍 Troubleshooting

### Backend n'a pas démarré

**Erreur:** `Error: listen EADDRINUSE: address already in use :::3001`

```bash
# Solution 1: Changer le port:
PORT=3002 npm run dev

# Solution 2: Kills le processus:
# Windows PowerShell:
Stop-Process -Name node -Force

# Linux/Mac:
lsof -ti:3001 | xargs kill -9
```

### Base de données non accessible

**Erreur:** `could not connect to server`

```bash
# Vérifer que PostgreSQL tourne:
# Windows:
Get-Service postgresql-x64-15

# Redémarrer:
Restart-Service postgresql-x64-15

# Ou via Docker:
docker-compose restart postgres
```

### Frontend ne charge pas

**Erreur:** `Cannot GET /`

```bash
# Vérifier que Frontend tourne:
# Devrait ouvrir http://localhost:3000 automatiquement

# Sinon, relancer:
cd frontend
npm start
```

### CORS Error

**Erreur:** `Access to XMLHttpRequest blocked by CORS policy`

```js
// Vérifier .env:
CORS_ORIGIN=http://localhost:3000

// Redémarrer le backend:
npm run dev
```

---

## 🚀 Déploiement

### Préparation Production

**Modifier `.env` (IMPORTANT!):**

```env
# ❌ JAMAIS en production:
NODE_ENV=development
DB_PASSWORD=EduManager2025!
JWT_SECRET=...default...

# ✅ À remplacer:
NODE_ENV=production
DB_PASSWORD=<Mot de passe fort aléatoire>
JWT_SECRET=<Clé JWT sécurisée 32+ chars>
CORS_ORIGIN=https://votre-domaine.com
```

### Déploiement Docker

```bash
# Build images:
cd docker
docker-compose -f docker-compose.yml build

# Démarrer:
docker-compose up -d

# Vérifier:
docker-compose ps
docker-compose logs -f

# Arrêter:
docker-compose down
```

### Kubernetes (Avancé)

Voir la documentation K8s (à venir).

---

## 📚 Ressources

### Documentation

- **CLAUDE.md** - Guide créateur
- **CHANGELOG.md** - Modifications apportées
- **DATABASE_SETUP.md** - Configuration PostgreSQL
- **README.md** - Présentation générale

### Liens Utiles

- PostgreSQL: https://www.postgresql.org/
- Express: https://expressjs.com/
- React: https://react.dev/
- Docker: https://www.docker.com/

### Support

Pour tout problème:
1. Consultez la section **Troubleshooting**
2. Vérifiez les logs: `docker-compose logs`
3. Testez les endpoints: `curl http://localhost:3001/health`

---

## 📋 Checklist de Démarrage

- [ ] Node.js et npm installés
- [ ] PostgreSQL en cours d'exécution
- [ ] `.env` configuré
- [ ] Base de données créée
- [ ] Dépendances installées (`npm ci`)
- [ ] Backend démarré (`npm run dev`)
- [ ] Frontend démarré (`npm start`)
- [ ] Interfaces accessibles (http://localhost:3000)
- [ ] Endpoints testés (`curl http://localhost:3001/health`)
- [ ] Tests passent (`npm test`)

---

## 📞 Support & Feedback

Pour les questions:
1. Consultez la documentation
2. Testez avec `curl` ou Postman
3. Vérifiez les logs: `npm run logs`
4. Arrêtez et redémarrez les services

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** 2026-03-30
**Made with ❤️ for EduManager**

---

Happy Coding! 🚀
