import config from "@mongez/config";
import databaseConfigurations from "./database";
import validationConfigurations from "./validation";
import appConfigurations from "./app";

config.set({
  database: databaseConfigurations,
  validation: validationConfigurations,
  app: appConfigurations,
});
