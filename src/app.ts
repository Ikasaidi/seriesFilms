import express from "express";
import { reqLogger } from "./middlewares/logMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleWare";
import mediaRoutes from "./routes/mediaRoutes";
import userRoutes from "./routes/userRoutes";
import filmRoutes from "./routes/filmRoutes";
import serieRoutes from "./routes/serieRoutes";
import episodeRoutes from "./routes/episodeRoutes";
import saisonRoutes from "./routes/saisonRoutes";
import logRoutes from "./routes/logRoutes";

const app = express();
app.use(express.json());

app.use(reqLogger);

// mes routes cheries
app.use("/api/medias", mediaRoutes);
app.use("/api/users", userRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/series", serieRoutes);
app.use("/api/saisons", saisonRoutes);
app.use("/api/episodes", episodeRoutes);
app.use("/api/logs", logRoutes);


app.use(errorMiddleware);


export default app;