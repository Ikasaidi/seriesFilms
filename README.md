# 420-514-TP1 – API Films & Séries (Express + TypeScript + Mongoose)

API REST pour gérer **films**, **séries**, **saisons**, **épisodes**, **notes (ratings)** et **utilisateurs** (auth JWT, rôles).

## Sommaire
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
  - [Variables d’environnement](#variables-denvironnement)
  - [Fichiers de config](#fichiers-de-config)
- [Scripts NPM](#scripts-npm)
- [Démarrage](#démarrage)
  - [Développement](#développement)
  - [Test](#test)
  - [Production](#production)
- [BasePath & Ports](#basepath--ports)
- [Seed des données](#seed-des-données)
- [Table des routes](#table-des-routes)
- [Swagger`](#Documentation-API-(Swagger))
- [Codes HTTP & erreurs](#codes-http--erreurs)
- [Notes](#notes)

---

## Prérequis
- Node.js 18+ et npm
- MongoDB (local ou Atlas)
- OpenSSL si HTTPS local (certificats)

## Installation
```bash
git clone <repo>
cd 420-514-tp1
npm install
```

## Configuration

### Variables d’environnement
Créer un fichier **.env** à la racine (exemple) :
```
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/Film
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
SSL_KEY_PATH=./cert/server.key
SSL_CERT_PATH=./cert/server.crt
```

### Fichiers de config
Le projet utilise [`config`](https://www.npmjs.com/package/config). Fichiers usuels :
- `config/default.json` (dev local par défaut)
- `config/development.json`
- `config/test.json`
- `config/production.json`
- `config/env.variables.json` (valeurs surchargées par variables d’env)

Clés importantes :
- `db.uri`, `security.jwt.secret`, `server.http.port`, `server.https.enabled`, `server.https.port`, `server.https.redirectAllHttpToHttps`, `ssl.keyPath`, `ssl.certPath`.

## Scripts NPM
```json
{
  "start": "ts-node-dev --respawn src/V2/server.ts",
  "seed":  "ts-node src/data/seed.ts",
  "test":  "echo \"Error: no test specified\" && exit 1"
}
```

- `npm start` : démarre l’API en **développement** (reload).
- `npm run seed` : **vide** et **insère** des données d’exemple.
- `npm test` : placeholder.

## Démarrage

### Développement
```bash
export NODE_ENV=development
npm start
# Serveur HTTP sur le port défini (souvent 3000)
```

### Test
```bash
export NODE_ENV=test
npm start
# Base/port de test (3100) selon config/test.json
```

### Production
```bash
export NODE_ENV=production
# Assure-toi d’avoir SSL_KEY_PATH / SSL_CERT_PATH / JWT_SECRET
npm start
# HTTPS activé + redirection HTTP→HTTPS selon config/production.json
```

## BasePath & Ports
- BasePath logique de l’API : **/api/v2** (ex : `/api/v2/movies`).
- Ports : selon config. En dev, typiquement **HTTP 3000**. En prod, **HTTPS** activé (ex. 3443) et redirection HTTP→HTTPS.

## Seed des données
```bash
npm run seed
```
- Vide les collections et insère quelques Users/Movies/Series/Seasons/Episodes/Ratings.
- Après seed, faites un `GET /api/v2/series` et utilisez un `_id` retourné pour vos tests.

---

## Table des routes

### Auth
| Méthode | Chemin                                 | Rôle       | Description                       |
|--------:|----------------------------------------|------------|-----------------------------------|
| POST    | `/api/v2/auth/register`                | Public     | Créer un compte                   |
| POST    | `/api/v2/auth/login`                   | Public     | Se connecter (JWT)                |
| PATCH   | `/api/v2/auth/:id/promote`             | Admin      | Promouvoir un user en admin       |

### Users
| Méthode | Chemin                     | Rôle   | Description                       |
|--------:|----------------------------|--------|-----------------------------------|
| GET     | `/api/v2/users/me`         | User   | Mon profil                        |
| PATCH   | `/api/v2/users/me`         | User   | Modifier mon profil               |
| GET     | `/api/v2/users/:id`        | Admin  | Voir un utilisateur spécifique    |

### Movies
| Méthode | Chemin                   | Rôle   | Description                        |
|--------:|--------------------------|--------|------------------------------------|
| GET     | `/api/v2/movies`         | Public | Lister (filtres query)             |
| GET     | `/api/v2/movies/:id`     | Public | Détails d’un film                  |
| POST    | `/api/v2/movies`         | Admin  | Créer un film                      |
| PATCH   | `/api/v2/movies/:id`     | Admin  | Modifier un film                   |
| DELETE  | `/api/v2/movies/:id`     | Admin  | Supprimer un film                  |

### Series / Seasons / Episodes
| Méthode | Chemin                                                                 | Rôle   | Description                         |
|--------:|------------------------------------------------------------------------|--------|-------------------------------------|
| GET     | `/api/v2/series`                                                       | Public | Lister les séries                    |
| GET     | `/api/v2/series/:id`                                                   | Public | Détails d’une série (+saisons)       |
| POST    | `/api/v2/series`                                                       | Admin  | Créer une série                      |
| GET     | `/api/v2/series/:seriesId/seasons`                                     | Public | Lister les saisons d’une série       |
| POST    | `/api/v2/series/:seriesId/seasons`                                     | Admin  | Créer une saison                     |
| GET     | `/api/v2/series/:seriesId/seasons/:seasonId/episodes`                  | Public | Lister les épisodes d’une saison     |
| POST    | `/api/v2/series/:seriesId/seasons/:seasonId/episodes`                  | Admin  | Créer un épisode                     |

### Ratings
| Méthode | Chemin                                   | Rôle | Description                                      |
|--------:|------------------------------------------|------|--------------------------------------------------|
| POST    | `/api/v2/ratings`                         | User | Créer un rating (Movie/Episode)                  |
| GET     | `/api/v2/ratings/movie/:movieId/average`  | Public | Moyenne des notes d’un film                      |
| GET     | `/api/v2/ratings/series/:seriesId/average`| Public | Moyenne sur tous les épisodes d’une série        |

---

## Documentation API (Swagger)
- v2: http://localhost:3000/docs/v2
- v1 (dépréciée): http://localhost:3000/docs/v1

---


## Codes HTTP & erreurs
- Succès : **200** (GET/UPDATE), **201** (CREATE), **204** (DELETE sans body recommandé).
- Client : **400** (paramètre manquant), **401** (non authentifié), **403** (non autorisé), **404** (introuvable), **422** (validation).
- Serveur : **500** (erreur inattendue).
---

## Notes
- Après un **seed**, les `_id` changent. Récupérez un ID via `GET /api/v2/...` avant de tester une route détaillée.
- Un script sur postman permet de récuperer automatiquement le token losrqu'on se connecte.