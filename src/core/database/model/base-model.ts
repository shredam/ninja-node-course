import { Collection } from "mongodb";
import connection, { Connection } from "../connection";
import Model from "./model";
import { Database } from "../database";
import masterMind from "./master-mind";
import { ModelDocument } from "./types";

export default abstract class BaseModel {
  public static collectionName = "";

  public static connection: Connection = connection;

  public static initialId = 1;

  public static incrementIdBy = 1;

  public static primaryIdColumn = "id";

  public static query() {
    return this.connection.database.collection(this.collectionName);
  }

  public static async generateNextId() {
    return await masterMind.generateNextId(
      this.collectionName,
      this.incrementIdBy,
      this.initialId,
    );
  }

  public static async getLastId() {
    return await masterMind.getLastId(this.collectionName);
  }

  protected static self(data: Record<string, any>) {
    return new (this as any)(data);
  }

  public getCollectionName(): string {
    return this.getStaticProperty("collectionName");
  }

  public getConnection(): Connection {
    return this.getStaticProperty("connection");
  }

  public getDatabase(): Database {
    return this.getConnection().database;
  }

  public getQuery(): Collection {
    return this.getStaticProperty("query")();
  }

  protected getStaticProperty(property: keyof typeof Model) {
    return (this.constructor as any)[property];
  }
}
