import express from "express";
import { routes } from "./routes";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { Logger } from "./config/logger";
import { globalErrorHandlerMiddleware } from "./middlewares";
import { getEnviroment } from "./config/enviroment";

const enviroment = getEnviroment();
const app = express();

const pinoMiddleware = pinoHttp({
  logger: Logger.getInstance().getLogger(),
  level: "error",
});

app.use(helmet({}));
app.use(
  cors({
    methods: ["GET", "POST", "DELETE"],
    origin: String(enviroment.CORS_ORIGIN),
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoMiddleware);

app.use("/api/v1", routes);
app.use(globalErrorHandlerMiddleware);

export { app };
