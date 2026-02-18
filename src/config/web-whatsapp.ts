import { LocalAuth, Client } from "whatsapp-web.js";
import { Logger } from "./logger";

export class WebWhatsapp {
  private client: Client;
  private isReady: boolean = false;
  private logger = Logger.getInstance();
  private readonly clientId: string;
  static instances: Record<string, WebWhatsapp> = {};
  private isAuthenticated = false;
  private qrCode: string | null = null;
  private isInitialized = false;

  constructor(clientId: string) {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: clientId,
      }),
    });
    this.clientId = clientId;

    this.attachEvents();
    this.start();

    WebWhatsapp.instances[clientId] = this;

    this.logger.log(
      "info",
      "%s clients initialized",
      Object.keys(WebWhatsapp.instances).length.toString(),
    );
  }

  private async start() {
    this.client
      .initialize()
      .then(() => {
        this.logger.log("info", "Client %s initialized", this.clientId);
        this.isInitialized = true;
      })
      .catch((error) => {
        this.logger.log(
          "error",
          "Client %s failed to initialize: %s",
          this.clientId,
          error.message,
        );
        this.logger.log("error", error);
        this.isInitialized = false;
      });
  }

  private attachEvents() {
    this.client.on("ready", () => {
      this.logger.log("info", "Client %s ready", this.clientId);
      this.isReady = true;
    });

    this.client.on("disconnected", (reason) => {
      this.logger.log(
        "info",
        "Client %s disconnected. Reason: %s",
        this.clientId,
        reason,
      );
      this.isReady = false;
      this.isAuthenticated = false;
    });

    this.client.on("authenticated", () => {
      this.logger.log("info", "Client %s authenticated", this.clientId);
      this.isAuthenticated = true;
    });

    this.client.on("auth_failure", (e) => {
      this.logger.log(
        "error",
        "Client %s failed to authenticate: %s",
        this.clientId,
        e,
      );
      this.logger.log("error", e);
    });

    this.client.on("qr", (qr) => {
      this.logger.log("info", "Client %s qr code received", this.clientId);
      this.qrCode = qr;
    });
  }

  getClient() {
    return this.client;
  }

  getIsReady() {
    return this.isReady;
  }

  async destroy() {
    this.logger.log("info", "Client %s destroying", this.clientId);

    await this.client.logout();
    await this.client.destroy();

    this.client.removeAllListeners();

    delete WebWhatsapp.instances[this.clientId];

    this.isReady = false;
    this.isAuthenticated = false;
    this.isInitialized = false;

    this.logger.log("info", "Client %s destroyed", this.clientId);
    this.logger.log(
      "info",
      "%s clients initialized",
      Object.keys(WebWhatsapp.instances).length.toString(),
    );
  }

  async logout() {
    this.logger.log("info", "Client %s logging out", this.clientId);
    await this.client.logout();

    this.isReady = false;
    this.isAuthenticated = false;
    this.isInitialized = false;

    this.logger.log("info", "Client %s logged out", this.clientId);
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getQrCode() {
    return this.qrCode;
  }
  getIsInitialized() {
    return this.isInitialized;
  }

  async sendMessage(to: string, message: string) {
    this.logger.log(
      "info",
      "Client %s is sending message to %s",
      this.clientId,
      to,
    );
    await this.client
      .sendMessage(to, message)
      .then(() => {
        this.logger.log(
          "info",
          "Client %s sent message successfully to %s",
          this.clientId,
          to,
        );
      })
      .catch((error) => {
        this.logger.log(
          "error",
          "Client %s failed to send message to %s: %s",
          this.clientId,
          to,
          error.message,
        );
        this.logger.log("error", error);
      });
  }
}
