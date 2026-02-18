import { Router } from "express";
import { whatsappRoutes } from "./whatsapp.routes";

export const routes = Router();

routes.use("/whatsapp", whatsappRoutes);
