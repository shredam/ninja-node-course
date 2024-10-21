import { env } from "@mongez/dotenv";

const appConfigurations = {
  debug: env("DEBUG", false),
  baseUrl: env("BASE_URL", "localhost"),
  port: env("PORT", 3000),
};

export default appConfigurations;
