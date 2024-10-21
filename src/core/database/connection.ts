import { MongoClient } from "mongodb";
import config from "@mongez/config";
import chalk from "chalk";
import database, { Database } from "./database";

export class Connection {
  public client?: MongoClient;

  public database!: Database;

  public async connect() {
    if (this.client) return;

    const { host, port, username, password, name } =
      this.databaseConfigurations;

    try {
      this.client = await MongoClient.connect(`mongodb://${host}:${port}`, {
        auth: {
          username: username,
          password: password,
        },
      });

      const mongoDBDatabase = await this.client.db(name);

      this.database = database.setDatabase(mongoDBDatabase);

      console.log(
        chalk.green("Connected"),
        !username || !password
          ? chalk.red("You are not making a secure authenticated connection")
          : "",
      );
    } catch (error) {
      console.log(error);
    }
  }

  public get databaseConfigurations() {
    return {
      host: config.get("database.host", "localhost"),
      port: config.get("database.port", 27017),
      username: config.get("database.username", ""),
      password: config.get("database.password", ""),
      name: config.get("database.name", ""),
    };
  }
}

const connection = new Connection();

export default connection;
