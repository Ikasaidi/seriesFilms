import express from "express";
import { reqLogger } from "./middlewares/logMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleWare";
import mediaRoutes from "./routes/mediaRoutes";

const app = express();
app.use(express.json());

app.use(reqLogger);

//route 
app.use("/api/medias", mediaRoutes);
app.use(errorMiddleware);


export default app;