import mongoose from "mongoose";
import config from "config";

// -----------------------------------------------------------
// FONCTION: connexion à la base MongoDB
// - Rôle: ouvrir une connexion Mongoose à partir de l'URI stockée en config
// - Retour: l’état de la connexion
// -----------------------------------------------------------

export async function connectDB(): Promise<void> {

  // RÉCUPÉRATION DE L’URI
  const uri = config.get<string>("db.uri");
  //DEBUG
  console.log("Connection vers:",uri);
  if (!uri) throw new Error("URI MongoDB manquante");

  try {

    // CONNEXION
    await mongoose.connect(uri);
    console.log("MongoDB connecté :", uri);
  } catch (err) {
    console.error("Erreur MongoDB :", err);
  }
}
