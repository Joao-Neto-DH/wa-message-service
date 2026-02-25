import { ConnectionOptions, Job, Queue, Worker } from "bullmq";
import { Logger } from "./logger";
import { getEnviroment } from "./enviroment";

export class QueueConfig<T extends object> {
  private readonly queue: Queue;
  private readonly QUEUE_NAME: string;
  private readonly logger = Logger.getInstance();
  private readonly worker: Worker<T>;

  constructor(
    name: string,
    processWorker: (job: Job<T, any, string>) => Promise<void>,
    enviroment: ReturnType<typeof getEnviroment>,
  ) {
    const connectionOptions: ConnectionOptions = {
      host: String(enviroment.REDIS_HOST),
      port: Number(enviroment.REDIS_PORT),
      username: String(enviroment.REDIS_USERNAME),
      password: String(enviroment.REDIS_PASSWORD),
    };

    this.QUEUE_NAME = name;
    this.queue = new Queue(name, { connection: connectionOptions });
    this.worker = new Worker(name, processWorker, {
      connection: connectionOptions,
      removeOnComplete: { age: 60, count: 10 },
      maxStartedAttempts: 5,
    });

    this.setupEvents();
  }

  private setupEvents() {
    this.logger.log("info", "Setting up events for queue %s", this.QUEUE_NAME);
    this.queue.on("error", (err) => {
      this.logger.log("error", "Error: %s", err.message);
      this.logger.log("error", err);
    });

    this.queue.on("ioredis:close", () => {
      this.logger.log("info", "Redis connection closed");
    });

    this.queue.on("removed", (queueName) => {
      this.logger.log("info", "Queue %s removed", queueName);
    });

    // =========================================================================
    // Worker events
    // ============================================================================

    this.worker.on("error", (err) => {
      this.logger.log("error", "Error: %s", err.message);
      this.logger.log("error", err);
    });

    this.worker.on("completed", (job) => {
      this.logger.log("info", "Job %s completed", job.id || "unknown");
    });

    this.worker.on("progress", (job) => {
      this.logger.log("info", "Job %s progress: %s", job.id || "unknown");
    });

    this.worker.on("completed", (job) => {
      this.logger.log("info", "Job %s completed", job.id || "unknown");
    });
  }

  public getQueueName() {
    return this.QUEUE_NAME;
  }

  public async addJob(data: T) {
    return await this.queue.add("message", data, {
      attempts: 5,
    });
  }
}
