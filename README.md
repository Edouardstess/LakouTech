# EduManager — Plateforme SaaS de Gestion Scolaire

## Description
EduManager est une plateforme complète de gestion d'établissements scolaires multi-établissements.
Elle couvre tous les aspects de la gestion scolaire : élèves, enseignants, classes, présences, notes, paiements, personnel, messagerie et finances.

## Modules
1. **Tableau de bord** — Vue d'ensemble avec statistiques en temps réel
2. **Gestion des élèves** — Profils, inscriptions, dossiers académiques
3. **Gestion des classes** — Création, attribution, planification
4. **Gestion des enseignants** — Profils, spécialités, salaires
5. **Présences/Absences** — Enregistrement quotidien, statistiques
6. **Notes & Bulletins** — Saisie par trimestre, types de notes
7. **Emplois du temps** — Planification hebdomadaire par classe
8. **Paiements** — Frais scolaires, multi-méthodes, suivi
9. **RH & Personnel** — Gestion employés, masse salariale
10. **Messagerie** — Communication parents-école, notifications
11. **Finances** — Revenus, dépenses, solde budgétaire

## Stack Technique
- **Frontend:** React 18 (JSX), CSS-in-JS inline styles
- **Backend:** Base44 (BaaS), REST API auto-générée
- **Base de données:** PostgreSQL (géré par Base44)
- **Hébergement:** Base44 Cloud (CDN global)
- **Auth:** Base44 Auth (JWT)

## Installation locale (Docker)
```bash
docker-compose up -d
```

## Variables d'environnement
```
REACT_APP_BASE44_APP_ID=69c9b24e3697466f8942132b
REACT_APP_API_URL=https://api.base44.com
```

## Déploiement
L'application est déployée sur: https://polo-app-8942132b.base44.app

## Structure du projet
```
edumanager_project/
├── frontend/
│   └── src/
│       ├── pages/          # Pages React
│       ├── api/            # Clients API entités
│       └── components/     # Composants réutilisables
├── backend/
│   ├── functions/          # Fonctions serverless
│   └── models/             # Schémas de données
├── database/
│   └── schema.sql          # Structure de la base
├── docker/
│   └── docker-compose.yml  # Configuration Docker
├── docs/
│   ├── API.md              # Documentation API
│   └── USER_GUIDE.md       # Guide utilisateur
└── README.md
```

## Auteur
Développé avec EduManager SaaS Platform
Version: 1.0.0 — 2025
