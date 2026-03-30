# EduManager — Documentation API REST

## Base URL
```
https://votre-domaine.com/api
```

## Authentification
Toutes les routes (sauf /health) nécessitent un token JWT :
```
Authorization: Bearer <token>
```

---

## ÉLÈVES

### GET /api/eleves
Récupère la liste des élèves.

**Paramètres de requête :**
| Paramètre  | Type   | Description              |
|------------|--------|--------------------------|
| classe_id  | UUID   | Filtrer par classe       |
| statut     | string | Actif, Inactif, etc.     |
| search     | string | Recherche nom/matricule  |

**Réponse :**
```json
{
  "success": true,
  "data": [...],
  "total": 42
}
```

### POST /api/eleves
Créer un nouvel élève.

**Corps :**
```json
{
  "nom": "PIERRE",
  "prenom": "Jean",
  "date_naissance": "2010-03-15",
  "sexe": "M",
  "classe_id": "uuid-classe",
  "numero_matricule": "2024-001"
}
```

---

## PRÉSENCES

### GET /api/presences
Filtres disponibles : `date`, `classe_id`, `eleve_id`, `statut`

### POST /api/presences
```json
{
  "eleve_id": "uuid",
  "classe_id": "uuid",
  "date": "2025-03-29",
  "statut": "Absent",
  "motif": "Maladie"
}
```

### POST /api/presences/bulk
Enregistrer toute une classe en une fois :
```json
{
  "classe_id": "uuid",
  "date": "2025-03-29",
  "presences": [
    { "eleve_id": "uuid-1", "statut": "Présent" },
    { "eleve_id": "uuid-2", "statut": "Absent", "motif": "Maladie" }
  ]
}
```

---

## NOTES

### GET /api/notes/bulletin/:eleve_id/:trimestre
Génère le bulletin d'un élève pour un trimestre.

**Réponse :**
```json
{
  "success": true,
  "eleve": { "nom": "PIERRE", "prenom": "Jean", ... },
  "trimestre": "T1",
  "matieres": [
    { "matiere": "Mathématiques", "coefficient": 3, "moyenne": 15.5 }
  ],
  "moyenne_generale": "13.80",
  "mention": "Bien"
}
```

---

## PAIEMENTS

### GET /api/paiements/stats
Retourne les statistiques financières par statut.

---

## Codes d'erreur
| Code | Description           |
|------|-----------------------|
| 200  | Succès                |
| 201  | Créé avec succès      |
| 400  | Données invalides     |
| 401  | Non authentifié       |
| 403  | Accès refusé          |
| 404  | Ressource non trouvée |
| 500  | Erreur serveur        |
