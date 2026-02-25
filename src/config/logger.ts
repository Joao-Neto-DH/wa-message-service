import pino from "pino";
// import dotenv from "dotenv";
import { getEnviroment } from "./enviroment";

// dotenv.config();
const enviroment = getEnviroment();

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export class Logger {
  private logger;
  private static instance: Logger;

  constructor(fileLog: string) {
    this.logger = pino({
      level: enviroment.LOG_LEVEL as LogLevel,
      transport: {
        targets: [
          { target: "pino/file", options: { destination: fileLog } },
          { target: "pino-pretty", options: { colorize: true } },
        ],
      },
    });

    this.logger;
  }

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger("./app.log");
    }
    return Logger.instance;
  }

  public log(level: LogLevel, message: Object, ...args: string[]) {
    return this.logger[level](message, ...args);
  }

  public getLogger() {
    return this.logger;
  }
}
