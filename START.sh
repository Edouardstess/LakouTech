#!/bin/bash

# 🚀 EduManager - Script de Démarrage Complet
# Ce script configure et démarre tous les services

set -e

PROJECT_DIR="C:\xampp\htdocs\edumanager_project"
cd "$PROJECT_DIR"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        🎓 EduManager - Démarrage Complet (v1.0.0)             ║"
echo "║              GestAion Scolaire Multi-établissement             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============ ÉTAPE 1: VÉRIFICATION PRÉREQUIS ============
echo "📋 ÉTAPE 1: Vérification des prérequis..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé!"
    echo "   📥 Téléchargez depuis: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé!"
    exit 1
fi
echo "✅ npm $(npm --version)"

# Vérifier Docker (optionnel)
if command -v docker &> /dev/null; then
    echo "✅ Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
else
    echo "⚠️  Docker non trouvé (optionnel pour dev local)"
fi

echo ""

# ============ ÉTAPE 2: VÉRIFIER .env ============
echo "⚙️  ÉTAPE 2: Configuration (.env)..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env" ]; then
    echo "❌ Fichier .env manquant!"
    echo "   📋 Copie de .env.example..."
    cp .env.example .env
    echo "✅ .env créé (modifiez-le si nécessaire)"
else
    echo "✅ Fichier .env trouvé"
fi

echo ""

# ============ ÉTAPE 3: INSTALLER DÉPENDANCES ============
echo "📦 ÉTAPE 3: Installation des dépendances..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "📦 Backend (Express + PostgreSQL)..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "   ⏳ npm install (backend)..."
    npm ci --silent
    echo "✅ Backend dépendances installées"
else
    echo "✅ Backend node_modules trouvé"
fi
cd ..

echo ""
echo "📦 Frontend (React)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "   ⏳ npm install (frontend)..."
    npm ci --silent
    echo "✅ Frontend dépendances installées"
else
    echo "✅ Frontend node_modules trouvé"
fi
cd ..

echo ""

# ============ ÉTAPE 4: VÉRIFIER DATABASE ============
echo "🗄️  ÉTAPE 4: Base de données..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "⚠️  Assurez-vous que PostgreSQL est en cours d'exécution!"
echo "   DATABASE_URL dans .env: $(grep DATABASE_URL .env | cut -d'=' -f2)"

echo ""

# ============ DÉMARRAGE SERVICES ============
echo "🚀 ÉTAPE 5: Démarrage des services..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⏳ Démarrage de:"
echo "  1. Backend API (port 3001)"
echo "  2. Frontend Web (port 3000)"
echo ""
echo "Ouvrez 3 terminaux et exécutez:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  ┌─────────────────────────────────────────────┐"
echo "  │ cd backend && npm run dev                   │"
echo "  └─────────────────────────────────────────────┘"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  ┌─────────────────────────────────────────────┐"
echo "  │ cd frontend && npm start                    │"
echo "  └─────────────────────────────────────────────┘"
echo ""
echo "  Terminal 3 (Test - optionnel):"
echo "  ┌─────────────────────────────────────────────┐"
echo "  │ curl http://localhost:3001/health           │"
echo "  └─────────────────────────────────────────────┘"
echo ""

# ============ ACCÈS APPLICATION ============
echo "🌐 ÉTAPE 6: Accès à l'application..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Une fois les services démarrés, ouvrez votre navigateur:"
echo ""
echo "  Frontend (Interface Web)"
echo "  ┌──────────────────────────────────────────────┐"
echo "  │ 🌍 http://localhost:3000                     │"
echo "  └──────────────────────────────────────────────┘"
echo ""
echo "  Backend (API REST)"
echo "  ┌──────────────────────────────────────────────┐"
echo "  │ 📡 http://localhost:3001/api                │"
echo "  └──────────────────────────────────────────────┘"
echo ""
echo "  Health Check"
echo "  ┌──────────────────────────────────────────────┐"
echo "  │ ✅ http://localhost:3001/health             │"
echo "  └──────────────────────────────────────────────┘"
echo ""

# ============ MODULES DISPONIBLES ============
echo "📋 Modules Disponibles..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ 12 Modules Complètement Implémentés:"
echo ""
echo "  Gestion Académique:"
echo "    👨‍🎓  Élèves          • Profils, inscriptions, statuts"
echo "    🏫  Classes        • Niveaux, capacités, planification"
echo "    👨‍🏫  Enseignants     • Profils, spécialités, salaires"
echo "    📜  Matières       • Coefficients, classes assignées"
echo "    🗓️  Emploi du Temps • Planning hebdomadaire par classe"
echo ""
echo "  Suivi Scolaire:"
echo "    📋  Présences      • Enregistrement quotidien, stats"
echo "    📝  Notes          • Saisie par trimestre, bulletins"
echo ""
echo "  Gestion Finances:"
echo "    💰  Paiements      • Frais scolaires, méthodes de paiement"
echo "    📊  Finances       • Revenus, dépenses, soldes"
echo ""
echo "  Ressources Humaines:"
echo "    👥  Personnel      • RH, masse salariale"
echo "    ✉️  Messagerie     • Communications internes"
echo "    🏢  Établissements • Infos écoles"
echo ""

# ============ ENDPOINTS API ============
echo "🔌 Endpoints API Disponibles..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Tous les endpoints suivent le pattern CRUD:"
echo ""
echo "  GET    /api/{entite}        - Lister tous"
echo "  POST   /api/{entite}        - Créer un"
echo "  PUT    /api/{entite}/:id    - Modifier"
echo "  DELETE /api/{entite}/:id    - Supprimer"
echo ""
echo "Entités: eleves, classes, enseignants, matieres, presences,"
echo "         notes, paiements, emploitempss, personnel, messages,"
echo "         depenses, etablissements"
echo ""

# ============ VÉRIFICATION FINALE ============
echo "✅ PRÊT À DÉMARRER!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "  • CLAUDE.md       - Guide complet"
echo "  • CHANGELOG.md    - Modifications apportées"
echo "  • README.md       - Présentation générale"
echo ""
echo "💡 Tips:"
echo "  • Utiliser 'npm run dev' pour backend (hot-reload)"
echo "  • Utiliser 'npm start' pour frontend (hot-reload React)"
echo "  • Variables d'env dans .env"
echo ""
echo "🚀 Prêt à développer? Bonne chance! 🎉"
echo ""
