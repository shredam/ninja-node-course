import config from "@mongez/config";
import { databaseConfigurations } from "./database";

config.set({
  database: databaseConfigurations,
});
