import { FindCursor, FindOptions } from "mongodb";
import connection, { Connection } from "../connection";
import { Document, Filter, ModelDocument } from "../model/types";

export class QueryBuilder {
  protected connection: Connection = connection;

  public query(collectionName: string) {
    return this.connection.database.collection(collectionName);
  }

  public async create(collectionName: string, data: Document) {
    const query = this.query(collectionName);

    const result = await query.insertOne(data);

    return {
      ...data,
      _id: result.insertedId,
    };
  }

  public async update(
    collectionName: string,
    filter: Filter,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    const query = this.query(collectionName);

    const result = await query.findOneAndUpdate(
      filter,
      {
        $set: data,
      },
      {
        returnDocument: "after",
      },
    );

    return result?.ok ? result.value : null;
  }

  public async replace(
    collectionName: string,
    filter: Filter,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    const query = this.query(collectionName);

    const result = await query.findOneAndReplace(filter, {
      returnDocument: "after",
    });

    return result?.ok ? result.value : null;
  }

  public async upsert(
    collectionName: string,
    filter: ModelDocument,
    data: Document,
  ): Promise<Partial<ModelDocument> | null> {
    const query = this.query(collectionName);

    const result = await query.findOneAndUpdate(
      filter,
      {
        $set: data,
      },
      {
        returnDocument: "after",
        upsert: true,
      },
    );

    return result?.ok ? result.value : null;
  }

  public async deleteOne(
    collectionName: string,
    filter: Filter,
  ): Promise<boolean> {
    const query = this.query(collectionName);

    const result = await query.deleteOne(filter);

    return result.deletedCount > 0;
  }

  public async delete(collectionName: string, filter: Filter): Promise<number> {
    const query = this.query(collectionName);

    const result = await query.deleteMany(filter);

    return result.deletedCount;
  }

  public async first(
    collectionName: string,
    filter: Filter = {},
    findOptions?: FindOptions,
  ) {
    const query = this.query(collectionName);

    return await query.findOne(filter, findOptions);
  }

  public async last(collectionName: string, filter: Filter = {}) {
    const query = this.query(collectionName);

    const results = await query
      .find(filter)
      .sort({
        _id: "desc",
      })
      .limit(1)
      .toArray();

    return results.length > 0 ? results[0] : null;
  }

  public async list(
    collectionName: string,
    filter: Filter,
    queryHandler?: (query: FindCursor) => void,
    findOptions?: FindOptions,
  ) {
    const query = this.query(collectionName);

    const findOperation = query.find(filter, findOptions);

    if (queryHandler) {
      queryHandler(findOperation);
    }

    return await findOperation.toArray();
  }

  public async lastest(collectionName: string, filter: Filter = {}) {
    const query = this.query(collectionName);

    return await query
      .find(filter)
      .sort({
        _id: "desc",
      })
      .toArray();
  }

  public async count(collectionName: string, filter: Filter = {}) {
    return await this.query(collectionName).countDocuments(filter);
  }
}

const queryBuilder = new QueryBuilder();

export default queryBuilder;
