import { app } from "./app";
import { getEnviroment } from "./config/enviroment";
import { Logger } from "./config/logger";

const enviroment = getEnviroment();

app.listen(enviroment.PORT, () => {
  Logger.getInstance().log(
    "info",
    `Server running on port ${enviroment.PORT} in ${enviroment.NODE_ENV} mode`,
  );
  console.log(
    `Server running on port ${enviroment.PORT} in ${enviroment.NODE_ENV} mode`,
  );
});
