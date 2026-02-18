import { Request, Response } from "express";
import { WebWhatsapp } from "../config/web-whatsapp";
import { Logger } from "../config/logger";

const logger = Logger.getInstance();

export class WhatsappController {
  static initiateConnection(req: Request, res: Response) {
    const { clientId } = req.params;

    logger.log(
      "info",
      "%s clients initialized",
      Object.keys(WebWhatsapp.instances).length.toString(),
    );
    if (WebWhatsapp.instances[String(clientId)]) {
      logger.log("info", "Client %s already exists", String(clientId));
      res.status(200).json({ message: "Client already exists" });
      return;
    }

    const webWhatsapp = new WebWhatsapp(String(clientId));
    webWhatsapp.getClient().on("qr", (qr) => {
      res.status(200).json({ qr });
      logger.log("info", "Client %s qr code: %s", String(clientId), qr);
    });
  }

  static async stopConnection(req: Request, res: Response) {
    const { clientId } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];
    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }
    await webWhatsapp.stop();
    res.status(200).json({ message: "Client stopped" });
  }
}
