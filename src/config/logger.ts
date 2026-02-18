import pino from "pino";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

export class Logger {
  private logger;
  private static instance: Logger;

  constructor(fileLog: string) {
    this.logger = pino({
      level: "info",
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
