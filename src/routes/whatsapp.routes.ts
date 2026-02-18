import { Router } from "express";
import { WhatsappController, WhatsappSessionController } from "../controllers";

export const whatsappRoutes = Router();

// manage whatsapp connection
whatsappRoutes.post("/:clientId", WhatsappController.initiateConnection);
whatsappRoutes.delete("/:clientId/destroy", WhatsappController.destroy);

// manage whatsapp session
whatsappRoutes.get("/:clientId/qrcode/:type", WhatsappSessionController.qrCode);
whatsappRoutes.post("/:clientId/logout", WhatsappSessionController.logout);
whatsappRoutes.get("/:clientId/me", WhatsappSessionController.profile);
whatsappRoutes.get(
  "/:clientId/status",
  WhatsappSessionController.checkAuthenticationStatus,
);

whatsappRoutes.post(
  "/:clientId/send-message",
  WhatsappSessionController.sendMessage,
);
