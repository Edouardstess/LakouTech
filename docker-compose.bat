@echo off
REM 🐳 EduManager - Gestion Docker

setlocal enabledelayedexpansion

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║        🐳 EduManager - Gestion Docker                          ║
echo ║                  v1.0.0                                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0docker"

REM ============ COMMANDES DISPONIBLES ============

if "%1"=="" (
 call :show_menu
 goto :eof
)

if /i "%1"=="up" goto :cmd_up
if /i "%1"=="down" goto :cmd_down
if /i "%1"=="restart" goto :cmd_restart
if /i "%1"=="logs" goto :cmd_logs
if /i "%1"=="status" goto :cmd_status
if /i "%1"=="shell" goto :cmd_shell
if /i "%1"=="clean" goto :cmd_clean
if /i "%1"=="help" goto :show_menu

echo ❌ Commande inconnue: %1
call :show_menu
goto :eof

REM ============ FONCTIONS ============

:show_menu
echo 📋 Commandes Disponibles:
echo.
echo   docker-compose.bat up          - Démarrer tous les services
echo   docker-compose.bat down        - Arrêter tous les services
echo   docker-compose.bat restart     - Redémarrer les services
echo   docker-compose.bat logs        - Afficher les logs
echo   docker-compose.bat status      - Statut des services
echo   docker-compose.bat shell       - Ouvrir un shell PostgreSQL
echo   docker-compose.bat clean       - Nettoyer (données supprimées!)
echo   docker-compose.bat help        - Afficher cette aide
echo.
echo 📚 Documentation:
echo   - DATABASE_SETUP.md  - Configuration PostgreSQL
echo   - CLAUDE.md          - Guide complet
echo   - CHANGELOG.md       - Modifications apportées
echo.
goto :eof

:cmd_up
echo 🚀 Démarrage des services...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Erreur au démarrage
  goto :eof
)
echo.
echo ✅ Services démarrés!
echo.
call :show_status
goto :eof

:cmd_down
echo 🛑 Arrêt des services...
docker-compose down
echo ✅ Services arrêtés
goto :eof

:cmd_restart
echo 🔄 Redémarrage des services...
docker-compose restart
echo ✅ Services redémarrés
goto :eof

:cmd_logs
echo 📋 Affichage des logs (Ctrl+C pour arrêter)...
docker-compose logs -f
goto :eof

:cmd_status
call :show_status
goto :eof

:cmd_shell
echo 💻 Connexion à PostgreSQL...
docker-compose exec postgres psql -U edumanager_user -d edumanager
goto :eof

:cmd_clean
echo ⚠️  ATTENTION! Cela va supprimer TOUTES les données!
set /p confirm="Êtes-vous sûr? (oui/non): "
if /i "%confirm%"=="oui" (
  echo 🗑️  Nettoyage en cours...
  docker-compose down -v
  echo ✅ Nettoyage terminé
) else (
  echo ❌ Annulé
)
goto :eof

:show_status
echo.
echo 📊 Statut des Services:
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
docker-compose ps
echo.
echo 🌐 URLs d'Accès:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:3001
echo   Health:    http://localhost:3001/health
echo   pgAdmin:   http://localhost:5050
echo.
goto :eof

echo.
echo 💡 Tips:
echo   - docker-compose logs -f postgres    # Logs PostgreSQL
echo   - docker-compose logs -f backend     # Logs Backend
echo   - docker-compose logs -f frontend    # Logs Frontend
echo.
