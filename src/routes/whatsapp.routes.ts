import { Router } from "express";
import { WhatsappController } from "../controllers";

export const whatsappRoutes = Router();

whatsappRoutes.get("/:clientId", WhatsappController.initiateConnection);
whatsappRoutes.get("/:clientId/logout", WhatsappController.stopConnection);
