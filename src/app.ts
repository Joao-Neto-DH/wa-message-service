import express from "express";
import * as dotenv from "dotenv";
import { routes } from "./routes";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { Logger } from "./config/logger";

const app = express();

const pinoMiddleware = pinoHttp({
  logger: Logger.getInstance().getLogger(),
});

dotenv.config();
app.use(helmet({}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoMiddleware);

app.use("/api/v1", routes);

export { app };
