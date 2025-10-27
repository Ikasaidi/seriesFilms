// ===========================================================
// SERVER 
// - Charge la config/env
// - Se connecte à Mongo
// - Démarre HTTP et/ou HTTPS (avec redirection possible)
// ===========================================================
import "dotenv/config";
import config from "config";

// Debug rapide : voir l'environnement courant
console.log("ENV:", process.env.NODE_ENV);
console.log("Config chargée:", config.util.getEnv("NODE_ENV"));

import app from "./app";
import fs from "fs";
import path from "path";
import http from "http";
import https from "https";
import { connectDB } from "../data/database";

// -----------------------------------------------------------
// CONFIG SERVEUR (lue depuis config/*)
// -----------------------------------------------------------
// Ports + options HTTPS
const httpPort = config.get<number>("server.http.port");
const httpsPort = config.get<number>("server.https.port");
const enableHttps = config.get<boolean>("server.https.enabled");
const redirectAll = config.get<boolean>("server.https.redirectAllHttpToHttps");

// -----------------------------------------------------------
// CERTIFICATS SSL (si HTTPS activé)
// - On lit les chemins depuis la config et on charge key/cert
// -----------------------------------------------------------
let sslOptions: any = {};
if (enableHttps) {
  const keyPath = path.resolve(config.get<string>("ssl.keyPath"));
  const certPath = path.resolve(config.get<string>("ssl.certPath"));
  sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

// -----------------------------------------------------------
// FONCTION DE DÉMARRAGE
// - 1) Connexion DB
// - 2) Lancer HTTPS si activé
// - 3) Soit rediriger tout le HTTP → HTTPS, soit démarrer un HTTP normal
// NOTE : redirection sur le production seulement
// -----------------------------------------------------------
const startServer = async () => {
  try {

    // 1) DB
    console.log("db import:", connectDB);
    await connectDB();

    // 2) HTTPS (si activé dans la config)
    if (enableHttps) {
      https.createServer(sslOptions, app).listen(httpsPort, () => {
        console.log(
          `Serveur HTTPS lancé sur https://localhost:${httpsPort}`
        );
      });
    }

    // 3) HTTP
    if (redirectAll && enableHttps) {
      // -----------------------------------------------------
      // MODE REDIRECTION : tout le HTTP renvoie vers HTTPS
      // -----------------------------------------------------
      http
        .createServer((req, res) => {
          res.writeHead(301, {
            Location: `https://localhost:${httpsPort}${req.url}`,
          });
          res.end();
        })
        .listen(httpPort, () => {
          console.log(`Redirection HTTP → HTTPS sur le port ${httpPort}`);
        });
    } else {
      // -----------------------------------------------------
      // MODE HTTP NORMAL : on lance l’API en HTTP classique
      // -----------------------------------------------------
      app.listen(httpPort, () => {
        console.log(`Serveur lancé sur http://localhost:${httpPort}`);
      });
    }
  } catch (err) {

    console.error("Impossible de démarrer le serveur :", err);
  }
};

// -----------------------------------------------------------
// LANCEMENT
// -----------------------------------------------------------
startServer();
