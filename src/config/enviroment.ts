function validateVariable(
  name: string,
  value: string | undefined,
  type: "number" | "string" | "boolean",
  required = false,
  defaultValue: string | number | boolean,
) {
  if (required && !value) {
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
