import "dotenv/config";
import config from "config";  
import { connectDB } from "./database";
import {Movie} from "../V2/models/movie";
import {Series} from "../V2/models/series";
import {Season} from "../V2/models/season";
import {Episode} from "../V2/models/episode";
import {Rating} from "../V2/models/rating";
import {User} from "../V2/models/user";

// -----------------------------------------------------------
// CONFIG .env
// Debug rapide : voir l'environnement courant
// -----------------------------------------------------------
console.log("Config chargée:", config.util.getEnv("NODE_ENV"));

// -----------------------------------------------------------
// FONCTION PRINCIPALE DE SEED
// - Objectif: réinitialiser la base et insérer des données de test
// - Remarque: npm run seed
// -----------------------------------------------------------
const seed = async () => {
  try {

    // ---------------------------------------------------------
    // 1) CONNEXION À LA BASE
    // ---------------------------------------------------------
    console.log("Connexion à la base MongoDB...");
    await connectDB();

    // ---------------------------------------------------------
    // 2) NETTOYAGE DES COLLECTIONS
    // - On vide toutes les collections avant de réinsérer
    // - Promise.all pour paralléliser les deleteMany
    // ---------------------------------------------------------
    await Promise.all([
      Movie.deleteMany({}),
      Series.deleteMany({}),
      Season.deleteMany({}),
      Episode.deleteMany({}),
      Rating.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("Collections vidées !");

    // ---------------------------------------------------------
    // 3) UTILISATEURS (USERS)
    // - On insère quelques comptes de test (user/admin)
    // ---------------------------------------------------------
    const users = await User.create([
      {
        email: "test@example.com",
        name: "test",
        username: "test",
        password: "Motdepasse123!",
        role: "user",
        favorites: [],
      },
      {
        email: "admin@example.com",
        name:"Admin",
        username: "admin",
        password: "Admin1234!",
        role: "admin",
      },
      {
        email: "user1@example.com",
        name:"batata",
        username: "batata",
        password: "User1234!",
        role: "user",
      },
      {
        email: "adminin2@example.com",
        name:"imdmin",
        username: "adminadmin",
        password: "Admin1234!",
        role: "admin",
      },
      {
        email: "ika@example.com",
        name:"ika",
        username: "ika",
        password: "Ika1234!",
        role: "user",
      },
    ]);

    console.log(`${users.length} utilisateurs insérés.`);

    // ---------------------------------------------------------
    // 4) FILMS (MOVIES)
    // ---------------------------------------------------------
  
    const movies = await Movie.insertMany([
      {
        title: "film22",
        genres: ["Sci-Fi", "Comédie"],
        synopsis: "Des villes deux deux",
        releaseDate: new Date("2004-11-07"),
        durationMin: 1,
      },
      {
        title: "Terre",
        genres: ["Sci-Fi", "Drame"],
        synopsis: "Planet A",
        releaseDate: new Date("2023-11-07"),
        durationMin: 100,
      },
    ]);

    console.log(`${movies.length} films insérés.`);

    // ---------------------------------------------------------
    // 5) SÉRIES (SERIES)
    // ---------------------------------------------------------
    const series = await Series.insertMany([
      {
        title: "The Office",
        genres: ["Comedy"],
        status: "ended",
      },
      {
        title: "Breaking Code",
        genres: ["Tech", "Drama"],
        status: "on-going",
      },
      {
        title: "Love Red",
        genres: ["Drama"],
        status: "ended",
      },
    ]);

    console.log(` ${series.length} séries insérées.`);

    // ---------------------------------------------------------
    // 6) SAISONS (SEASONS)
    // - On crée 2 saisons pour la série "Love Red" (series[2])
    // - Le champ episodes est initialisé à 0; il pourra être incrémenté
    //   à la création d'épisodes
    // ---------------------------------------------------------
    const seasons = await Season.insertMany([
      {
        seriesId: series[2]!._id, // Love Red
        seasonNo: 1,
        episodes: 0,
      },
      {
        seriesId: series[2]!._id, // Love Red
        seasonNo: 2,
        episodes: 0,
      },
    ]);

    console.log(` ${seasons.length} saisons insérées.`);
 // ---------------------------------------------------------
    // 7) ÉPISODES (EPISODES)
    // - On ajoute un épisode à la saison 1 de "Love Red"
    // ---------------------------------------------------------
    const episodes = await Episode.insertMany([
      {
        seriesId: series[2]!._id, // Love Red
        seasonId: seasons[0]!._id,
        epNo: 1,
        title: "First day : le premier hug",
        durationMin: 52,
      },
    ]);

    console.log(`${episodes.length} épisode inséré.`);

    // ---------------------------------------------------------
    // 8) NOTES (RATINGS)
    // - Un rating pour un film
    // - Un rating pour un épisode
    // ---------------------------------------------------------
    await Rating.insertMany([
      {
        userId: users[4]!._id, // ika
        target: "Movie",
        targetId: movies[0]!._id, // film22
        score: 9,
        review: "Un excellent film !",
      },
      {
        userId: users[4]!._id, // ika
        target: "Episode",
        targetId: episodes[0]!._id, // First day
        score: 8,
        review: "bien !",
      },
    ]);

    console.log("Ratings insérés.");

    console.log("SEED terminé avec succès !");
    process.exit(0);
  } catch (err) {
    console.error("Erreur pendant le seed :", err);
    process.exit(1);
  }
};

// -----------------------------------------------------------
// LANCEMENT DU SCRIPT
// -----------------------------------------------------------
seed();