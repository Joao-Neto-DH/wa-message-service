import { Router } from "express";
import { WhatsappController } from "../controllers";

export const whatsappRoutes = Router();

whatsappRoutes.get("/:clientId", WhatsappController.initiateConnection);
whatsappRoutes.get("/:clientId/logout", WhatsappController.stopConnection);
whatsappRoutes.get("/:clientId/me", WhatsappController.profile);
whatsappRoutes.get(
  "/:clientId/status",
  WhatsappController.checkAuthenticationStatus,
);

whatsappRoutes.post("/:clientId/send-message", WhatsappController.sendMessage);
