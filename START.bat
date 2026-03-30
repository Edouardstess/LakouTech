@echo off
REM 🚀 EduManager - Script de Démarrage Windows
REM Démarrage complet du projet (Backend + Frontend)

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        🎓 EduManager - Démarrage Complet (v1.0.0)             ║
echo ║              Gestion Scolaire Multi-établissement             ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d %~dp0

REM ============ VÉRIFICATION PRÉREQUIS ============
echo 📋 ÉTAPE 1: Vérification des prérequis...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js n'est pas installé!
    echo    📥 Téléchargez depuis: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js %NODE_VERSION%

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm n'est pas installé!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm %NPM_VERSION%

echo.

REM ============ VÉRIFIER .env ============
echo ⚙️  ÉTAPE 2: Configuration (.env)...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

if not exist ".env" (
    echo ❌ Fichier .env manquant!
    echo    📋 Copie de .env.example...
    copy .env.example .env >nul
    echo ✅ .env créé (modifiez-le si nécessaire)
) else (
    echo ✅ Fichier .env trouvé
)

echo.

REM ============ INSTALLER DÉPENDANCES ============
echo 📦 ÉTAPE 3: Installation des dépendances...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo.
echo 📦 Backend (Express + PostgreSQL)...
cd backend
if not exist "node_modules" (
    echo    ⏳ npm install (backend) - cela peut prendre 1-2 minutes...
    call npm ci --silent
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erreur installation backend
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Backend dépendances installées
) else (
    echo ✅ Backend node_modules trouvé
)
cd ..

echo.
echo 📦 Frontend (React)...
cd frontend
if not exist "node_modules" (
    echo    ⏳ npm install (frontend) - cela peut prendre 2-3 minutes...
    call npm ci --silent
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Erreur installation frontend
        cd ..
        pause
        exit /b 1
    )
    echo ✅ Frontend dépendances installées
) else (
    echo ✅ Frontend node_modules trouvé
)
cd ..

echo.

REM ============ VÉRIFIER DATABASE ============
echo 🗄️  ÉTAPE 4: Base de données...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo ⚠️  Assurez-vous que PostgreSQL est en cours d'exécution!
echo    Pour tester PostgreSQL:
echo    ┌────────────────────────────────────────────┐
echo    │ psql -U edumanager_user -d edumanager      │
echo    │ Password: EduManager2025!                  │
echo    └────────────────────────────────────────────┘

echo.

REM ============ DÉMARRAGE SERVICES ============
echo 🚀 ÉTAPE 5: Préparation au démarrage...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ⏳ À FAIRE DANS DES TERMINAUX SÉPARÉS:
echo.
echo  Terminal 1 (Backend API):
echo  ┌──────────────────────────────────────┐
echo  │ cd backend                           │
echo  │ npm run dev                          │
echo  │                                      │
echo  │ Serveur sur: http://localhost:3001  │
echo  └──────────────────────────────────────┘
echo.
echo  Terminal 2 (Frontend Web):
echo  ┌──────────────────────────────────────┐
echo  │ cd frontend                          │
echo  │ npm start                            │
echo  │                                      │
echo  │ Ouvre: http://localhost:3000         │
echo  └──────────────────────────────────────┘
echo.

REM ============ ACCÈS APPLICATION ============
echo 🌐 ÉTAPE 6: Accès à l'application...
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo Une fois les services démarrés, ouvrez votre navigateur:
echo.
echo  Frontend (Interface Web)
echo  ┌──────────────────────────────────────┐
echo  │ 🌍 http://localhost:3000             │
echo  └──────────────────────────────────────┘
echo.
echo  Backend (API REST)
echo  ┌──────────────────────────────────────┐
echo  │ 📡 http://localhost:3001/api         │
echo  └──────────────────────────────────────┘
echo.
echo  Health Check
echo  ┌──────────────────────────────────────┐
echo  │ ✅ http://localhost:3001/health      │
echo  └──────────────────────────────────────┘
echo.

REM ============ MODULES DISPONIBLES ============
echo 📋 12 Modules Implémentés:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo ✅ Gestion Académique:
echo    👨‍🎓  Élèves          • Profils, inscriptions, statuts
echo    🏫  Classes        • Niveaux, capacités, salles
echo    👨‍🏫  Enseignants     • Profils, spécialités, salaires
echo    📝  Matières       • Coefficients, classes
echo    🗓️  Emploi du Temps • Planning hebdomadaire
echo.
echo ✅ Suivi Scolaire:
echo    📋  Présences      • Enregistrement quotidien
echo    📊  Notes          • Saisie par trimestre, bulletins
echo.
echo ✅ Gestion Finances:
echo    💰  Paiements      • Frais scolaires
echo    📉  Dépenses       • Budget et comptabilité
echo.
echo ✅ Ressources Humaines:
echo    👥  Personnel      • RH et masse salariale
echo    ✉️  Messagerie     • Communications internes
echo    🏢  Établissements • Infos écoles
echo.

REM ============ VÉRIFICATION FINALE ============
echo ✅ PRÊT À DÉMARRER!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo 📚 Documentation:
echo    • CLAUDE.md       - Guide complet
echo    • CHANGELOG.md    - Modifications apportées
echo    • README.md       - Présentation générale
echo.
echo 💡 Tips pour PowerShell:
echo    • Start-Process powershell -ArgumentList "cd backend; npm run dev"
echo    • Start-Process powershell -ArgumentList "cd frontend; npm start"
echo.
echo 🚀 Prêt à développer? Bonne chance! 🎉
echo.
pause
