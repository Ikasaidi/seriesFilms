# TP1 - API Films & Séries

## Description
Ce projet est une API REST en **Node.js + Express + TypeScript** qui permet de gérer des **médias** (films, séries, saisons et épisodes) avec persistance dans un fichier JSON (`src/data/db.json`).

### Fonctionnalités principales
- **/api/medias**
  - GET : lister tous les médias (+ filtres `type`, `genre`, `year`)
  - GET : obtenir un média par ID
  - POST : ajouter un média (admin)
  - PUT : modifier un média (admin)
  - DELETE : supprimer un média (admin)
- **/api/films**
  - POST : ajouter un film
- **/api/series**
  - POST : créer une série
  - GET : lister les épisodes d’une série spécifique
- **/api/seasons**
  - POST : ajouter une saison liée à une série
- **/api/episodes**
  - POST : ajouter un épisode dans une saison
  - PATCH : mettre à jour `watched` d’un épisode
- **/api/users/:id/medias**
  - GET : liste des médias favoris d’un utilisateur
- **/api/logs**
  - GET : renvoie la dernière action enregistrée

Toutes les opérations sont loguées avec **Winston** (`logs/actions.log`, `logs/warnings.log`, `logs/error.log`).

---

## Installation

1. Cloner le projet :
   ```bash
   git clone <url-du-repo>
   cd 420-514-TP1
   ```
   
2. Installer les dépendances :
    ```bash
    npm install
    ```
3. Lancer le serveur:
    ```bash
    npm run start
    ```

## Utilisation

L’API tourne par défaut sur http://localhost:3000







