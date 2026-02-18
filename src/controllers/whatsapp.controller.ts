import { Request, Response } from "express";
import { WebWhatsapp } from "../config/web-whatsapp";
import { Logger } from "../config/logger";
import qrcode from "qrcode";

const logger = Logger.getInstance();

export class WhatsappController {
  static initiateConnection(req: Request, res: Response) {
    const { clientId } = req.params;

    if (WebWhatsapp.instances[String(clientId)]) {
      logger.log("info", "Client %s already exists", String(clientId));
      res.status(200).json({ error: "Client already exists" });
      return;
    }

    const webWhatsapp = new WebWhatsapp(String(clientId));

    webWhatsapp.getClient().on("qr", (qr) => {
      logger.log("info", "Client %s qr code: %s", String(clientId), qr);
      res.contentType("image/png");

      qrcode.toFileStream(res, qr, (err) => {
        if (err) {
          logger.log("error", "Error generating qr code: %s", err.message);
          return res.status(500).json({ error: "Error generating qr code" });
        }
      });
    });

    webWhatsapp.getClient().on("authenticated", (qr) => {
      return res.status(200).json({ message: "Client authenticated" });
    });

    webWhatsapp.getClient().on("disconnected", (reason) => {
      logger.log(
        "info",
        "Client %s disconnected: %s",
        String(clientId),
        reason,
      );
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
