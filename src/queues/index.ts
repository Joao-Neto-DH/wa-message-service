import { Logger } from "../config/logger";
import { QueueConfig } from "../config/queue-config";
import { WebWhatsapp } from "../config/web-whatsapp";
import { getEnviroment } from "../config/enviroment";

const logger = Logger.getInstance();
const enviroment = getEnviroment();

const messageQueue = new QueueConfig<{
  to: string;
  message: string;
  clientId: string;
}>(
  "whatsapp-message-queue",
  async (job) => {
    const { to, message, clientId } = job.data;

    const webWhatsapp = WebWhatsapp.instances[String(clientId)];

    if (!webWhatsapp) {
      new WebWhatsapp(String(clientId));
      logger.log("error", "Client not found");
      throw new Error("Client not found");
    }

    const isReady = webWhatsapp.getIsReady();
    logger.log(
      "info",
      "Is ready: %s. Sending message to %s attempts: %s, delay: %s",
      String(isReady),
      to,
      job.attemptsMade.toString(),
      job.delay.toString(),
    );

    if (!isReady) {
      logger.log("error", "Client not ready");
      throw new Error("Client not ready");
    }
    await webWhatsapp.sendMessage(to, message);
  },
  enviroment,
);

export { messageQueue };
