// ===========================================================
// APP (Express)
// - Configure middlewares, routes, gestion d'erreurs
// - SWAGGER UI (v1 deprecated + v2 current)
// ===========================================================

import express from "express";
import cors, { CorsOptions } from "cors";
import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import config from "config";
import swaggerUi from "swagger-ui-express";


import { errorMiddleware } from "./middlewares/errorMiddleWare";

import logRoutes from "./routes/logRoutes";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import movieRoutes from "./routes/movieRoute";
import seriesRoutes from "./routes/seriesRoute";
import seasonRoutes from "./routes/seasonroute";
import episodeRoutes from "./routes/episodeRoute";
import ratingRoutes from "./routes/ratingRoute";

import swaggerV1 from "../docs/swagger-v1.json";
import swaggerV2 from "../docs/swagger-v2.json";


const app = express();
app.use(express.json());



// -----------------------------------------------------------
//  CONFIGURER CORS
// -----------------------------------------------------------
const allowedOrigins: string[] = config.get("security.cors.origins");

const corsOptions: CorsOptions = {
  origin: (origin, callback) => { 
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origine non autorisée par CORS"));
    }
  },
};

app.use(cors(corsOptions));

// -----------------------------------------------------------
//  RATE LIMITING
// -----------------------------------------------------------
const rateConfig = config.get<{
  windowMs: number;
  max: number;
}>("security.rateLimit");

const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: rateConfig.windowMs,
  max: rateConfig.max,
  message: "Trop de requêtes, réessayez plus tard.",
});

app.use("/api/v2/auth/login", limiter);
app.use("/api/v2/ratings", limiter);

// -----------------------------------------------------------
// Swagger
// -----------------------------------------------------------

//v1 (DEPRECATED)
app.use(
  "/docs/v1",
  swaggerUi.serveFiles(swaggerV1),
  swaggerUi.setup(swaggerV1, {
    customSiteTitle: "TP1 API - Swagger v1 (DEPRECATED)",
  })
);

// v2 (courante) 
app.use(
  "/docs/v2",
  swaggerUi.serveFiles(swaggerV2),
  swaggerUi.setup(swaggerV2, {
    customSiteTitle: "TP2 API - Swagger v2",
  })
);


// -----------------------------------------------------------
// ROUTES
// -----------------------------------------------------------

app.get("/", (req, res) => {
  res.send(" Serveur actif ! Bienvenue sur l'API médias du TP2.");
});

// logs
app.use("/api/v2/logs", logRoutes);

// Auth + Users
app.use("/api/v2/auth", authRoutes);
app.use("/api/v2/users", userRoutes);

// Movies + Ratings
app.use("/api/v2/movies", movieRoutes);
app.use("/api/v2/ratings", ratingRoutes);

// Series + Seasons + Episodes
app.use("/api/v2/series", seriesRoutes);
app.use("/api/v2/series", seasonRoutes); 
app.use("/api/v2/series", episodeRoutes);

// -----------------------------------------------------------
// 404 fallback (si aucune route ne matche)
// -----------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route introuvable" });
});

// -----------------------------------------------------------
//  MIDDLEWARES
// -----------------------------------------------------------
app.use(errorMiddleware);

export default app;
