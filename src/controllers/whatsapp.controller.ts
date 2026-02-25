import { Request, Response } from "express";
import { WebWhatsapp } from "../config/web-whatsapp";
import { Logger } from "../config/logger";

const logger = Logger.getInstance();

export class WhatsappController {
  static initiateConnection(req: Request, res: Response) {
    const { clientId } = req.params;

    if (WebWhatsapp.instances[String(clientId)]) {
      logger.log("info", "Client %s already exists", String(clientId));
      res.status(200).json({ error: "Client already exists" });
      return;
    }

    new WebWhatsapp(String(clientId));

    return res.status(200).json({ message: "Client initialized" });
  }

  static async destroy(req: Request, res: Response) {
    const { clientId } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];
    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }
    await webWhatsapp.logout();
    res.status(200).json({ message: "Client stopped" });
  }
}
