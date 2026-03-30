#!/bin/bash

# EduManager - Verification Script
# Vérifie que toutes les corrections ont été appliquées

echo "🔍 Vérification du Projet EduManager..."
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1 existe"
    return 0
  else
    echo -e "${RED}✗${NC} $1 MANQUANT"
    return 1
  fi
}

echo "📁 Vérification des Fichiers Créés:"
echo "-----------------------------------"

# Backend APIs
check_file "backend/functions/classes.js"
check_file "backend/functions/enseignants.js"
check_file "backend/functions/matieres.js"
check_file "backend/functions/emploi_temps.js"
check_file "backend/functions/personnel.js"
check_file "backend/functions/messages.js"
check_file "backend/functions/depenses.js"
check_file "backend/functions/etablissements.js"

echo ""
echo "🔧 Vérification des Fichiers Modifiés:"
echo "--------------------------------------"

# Check if routes are in server.js
if grep -q "require('./functions/classes')" backend/server.js && \
   grep -q "require('./functions/enseignants')" backend/server.js && \
   grep -q "require('./functions/emploi_temps')" backend/server.js; then
  echo -e "${GREEN}✓${NC} backend/server.js - Routes enregistrées"
else
  echo -e "${RED}✗${NC} backend/server.js - Routes MANQUANTES"
fi

# Check entities.js
if grep -q "createLocalEntity" frontend/src/api/entities.js && \
   grep -q "EmploiTemps" frontend/src/api/entities.js; then
  echo -e "${GREEN}✓${NC} frontend/src/api/entities.js - EmploiTemps présent"
else
  echo -e "${RED}✗${NC} frontend/src/api/entities.js - EmploiTemps MANQUANT"
fi

# Check Dashboard.jsx
if grep -q "Promise.all.*Note.list.*Eleve.list.*Matiere.list" frontend/src/pages/Dashboard.jsx; then
  echo -e "${GREEN}✓${NC} frontend/src/pages/Dashboard.jsx - Imports corrigés"
else
  echo -e "${RED}✗${NC} frontend/src/pages/Dashboard.jsx - Imports INCORRECTS"
fi

# Check .env
check_file ".env"

echo ""
echo "✅ Vérification Terminée!"
echo "========================================="
echo ""
echo "Pour démarrer le projet:"
echo "1. cd docker && docker-compose up -d"
echo "2. cd backend && npm install && npm run dev"
echo "3. cd frontend && npm install && npm start"
echo ""
echo "Accès:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:3001"
echo "  - Health: http://localhost:3001/health"
