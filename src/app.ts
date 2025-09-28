import express from "express";
import { reqLogger } from "./middlewares/logMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleWare";


const app = express();
app.use(express.json());

app.use(reqLogger);

//route 

app.use(errorMiddleware)


export default app;