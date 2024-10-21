import connection, { Connection } from "../connection";

export class MasterMind {
  public collectionName = "MasterMind";

  protected connection: Connection = connection;

  public async getLastId(collectionName: string): Promise<number> {
    const query = this.connection.database.collection(this.collectionName);

    const collectionDocument = await query.findOne({
      collection: collectionName,
    });

    return collectionDocument ? collectionDocument.id : 0;
  }

  public async generateNextId(
    collectionName: string,
    incrementIdBy: number = 1,
    initialId: number = 1,
  ): Promise<number> {
    const query = this.connection.database.collection(this.collectionName);

    const collectionDocument = await query.findOne({
      collection: collectionName,
    });

    if (collectionDocument) {
      const nextId = collectionDocument.id + incrementIdBy;

      await query.updateOne(
        {
          collection: collectionName,
        },
        {
          $set: {
            id: nextId,
          },
        },
      );

      return nextId;
    } else {
      await query.insertOne({
        collection: collectionName,
        id: initialId,
      });

      return initialId;
    }
  }
}

const masterMind = new MasterMind();

export default masterMind;
