import { Db } from "mongodb";

export class Database {
  public database!: Db;

  public setDatabase(database: Db) {
    this.database = database;

    return this;
  }
}

const database = new Database();

export default database;
