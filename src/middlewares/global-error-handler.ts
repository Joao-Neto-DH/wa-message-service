import { NextFunction, Request, Response } from "express";
import { Logger } from "../config/logger";

const logger = Logger.getInstance();
export function globalErrorHandlerMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.log("error", "Error: %s", err.message);
  // logger.log("error", err);

  res.status(500).json({ error: err.message });
}
