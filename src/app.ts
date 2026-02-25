import express from "express";
import { routes } from "./routes";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { Logger } from "./config/logger";
import { globalErrorHandlerMiddleware } from "./middlewares";

const app = express();

const pinoMiddleware = pinoHttp({
  logger: Logger.getInstance().getLogger(),
  level: "error",
});

app.use(helmet({}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoMiddleware);

app.use("/api/v1", routes);
app.use(globalErrorHandlerMiddleware);

export { app };
