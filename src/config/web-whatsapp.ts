import { LocalAuth, Client } from "whatsapp-web.js";
import { Logger } from "./logger";

export class WebWhatsapp {
  private client: Client;
  private isReady: boolean = false;
  private logger = Logger.getInstance();
  private readonly clientId: string;
  static instances: Record<string, WebWhatsapp> = {};

  constructor(clientId: string) {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: clientId,
      }),
    });
    this.clientId = clientId;

    this.client
      .initialize()
      .then(() => {
        this.logger.log("info", "Client %s initialized", clientId);
      })
      .catch((error) => {
        this.logger.log(
          "error",
          "Client %s failed to initialize: %s",
          clientId,
          error.message,
        );
        this.logger.log("error", error);
      });

    this.client.on("ready", () => {
      this.logger.log("info", "Client %s ready", clientId);
      this.isReady = true;
    });

    this.client.on("disconnected", () => {
      this.logger.log("info", "Client %s disconnected", clientId);
      this.isReady = false;
    });

    WebWhatsapp.instances[clientId] = this;
  }

  getClient() {
    return this.client;
  }

  getIsReady() {
    return this.isReady;
  }

  async stop() {
    this.logger.log("info", "Client %s stopping", this.clientId);
    await this.client.logout();
    await this.client.destroy();
    delete WebWhatsapp.instances[this.clientId];
    this.logger.log("info", "Client %s stopped", this.clientId);
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
