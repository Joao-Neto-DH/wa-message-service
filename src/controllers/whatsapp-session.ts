import { Request, Response } from "express";
import { WebWhatsapp } from "../config/web-whatsapp";
import { Logger } from "../config/logger";
import qrcode from "qrcode";

const logger = Logger.getInstance();

export class WhatsappSessionController {
  static async checkAuthenticationStatus(req: Request, res: Response) {
    const { clientId } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];
    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }
    const isAuthenticated = webWhatsapp.getIsAuthenticated();
    res.status(200).json({ isAuthenticated });
  }

  static async profile(req: Request, res: Response) {
    const { clientId } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];
    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (!webWhatsapp.getIsAuthenticated()) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const profile = webWhatsapp.getClient().info;
    res.status(200).json({
      whatsappName: profile.pushname,
      phoneNumber: profile.wid.user,
    });
  }

  static async sendMessage(req: Request, res: Response) {
    const { clientId } = req.params;
    const { to, message } = req.body;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];
    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }
    console.log(to, message);

    await webWhatsapp.sendMessage(to, message);
    res.status(200).json({ message: "Message sent" });
  }

  static async qrCode(req: Request, res: Response) {
    const { clientId, type } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];

    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }
    const qr = webWhatsapp.getQrCode();

    if (!qr) {
      return res.status(204).json();
    }

    if (type === "code") {
      return res.status(200).json({ qr: webWhatsapp.getQrCode() });
    }

    if (type === "image") {
      res.contentType("image/png");
      qrcode.toFileStream(res, qr, (err) => {
        if (err) {
          logger.log("error", "Error generating qr code: %s", err.message);
          return res.status(500).json({ error: "Error generating qr code" });
        }
      });
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }
  }
  static async logout(req: Request, res: Response) {
    const { clientId, type } = req.params;
    const webWhatsapp = WebWhatsapp.instances[String(clientId)];

    if (!webWhatsapp) {
      return res.status(404).json({ message: "Client not found" });
    }

    await webWhatsapp.logout();
    return res.status(200).json({ message: "Client logged out" });
  }
}
