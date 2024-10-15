import { Db } from "mongodb";

export class Database {
  public database!: Db;

  public setDatabase(database: Db) {
    this.database = database;

    return this;
  }

  public collection(collectionName: string) {
    return this.database.collection(collectionName);
  }
}

const database = new Database();

export default database;
