import dotenv from "dotenv";
dotenv.config();

function validateVariable(
  name: string,
  value: string | undefined,
  type: "number" | "string" | "boolean",
  required = false,
  defaultValue: string | number | boolean,
) {
  if (required && typeof value === "undefined") {
    throw new Error(`Variable ${name} is required`);
  }

  if (!value) {
    return defaultValue;
  }

  switch (type) {
    case "number":
      if (isNaN(parseInt(value, 10)))
        throw new Error(`Variable ${name} should be a number`);
      return parseInt(value, 10);
    case "string":
      return String(value);
    case "boolean":
      return Boolean(value);
    default:
      throw new Error(`Variable type not supported: ${type}`);
  }
}
const enviromentConfig: Record<
  string,
  {
    value: string | undefined;
    type: "number" | "string" | "boolean";
    required: boolean;
    defaultValue: string | number | boolean;
  }
> = {
  PORT: {
    value: process.env.PORT,
    type: "number",
    required: true,
    defaultValue: 3000,
  },
  NODE_ENV: {
    value: process.env.NODE_ENV,
    type: "string",
    required: false,
    defaultValue: "development",
  },
  LOG_LEVEL: {
    value: process.env.LOG_LEVEL,
    type: "string",
    required: false,
    defaultValue: "error",
  },
  REDIS_HOST: {
    value: process.env.REDIS_HOST,
    type: "string",
    required: true,
    defaultValue: "",
  },
  REDIS_PORT: {
    value: process.env.REDIS_PORT,
    type: "number",
    required: true,
    defaultValue: 6379,
  },
  REDIS_USERNAME: {
    value: process.env.REDIS_USERNAME,
    type: "string",
    required: true,
    defaultValue: "",
  },
  REDIS_PASSWORD: {
    value: process.env.REDIS_PASSWORD,
    type: "string",
    required: true,
    defaultValue: "",
  },
  CORS_ORIGIN: {
    value: process.env.CORS_ORIGIN,
    type: "string",
    required: true,
    defaultValue: "",
  },
  MESSAGE_RETRY_ATTEMPTS: {
    value: process.env.MESSAGE_RETRY_ATTEMPTS,
    type: "number",
    required: true,
    defaultValue: 5,
  },
  MESSAGE_RETRY_DELAY: {
    value: process.env.MESSAGE_RETRY_DELAY,
    type: "number",
    required: true,
    defaultValue: 5000,
  },
};

export function getEnviroment() {
  const enviroment: Record<string, string | number | boolean> = {};

  Object.entries(enviromentConfig).forEach(([key, value]) => {
    enviroment[key] = validateVariable(
      key,
      value.value,
      value.type,
      value.required,
      value.defaultValue,
    );
  });

  return enviroment;
}
