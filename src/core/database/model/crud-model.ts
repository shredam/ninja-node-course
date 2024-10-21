import queryBuilder from "../query-builder/query-builder";
import BaseModel from "./base-model";
import {
  ChildModel,
  Document,
  Filter,
  ModelDocument,
  paginationListing,
  primaryIdType,
} from "./types";

export default abstract class CrudModel extends BaseModel {
  public static async create<T>(
    this: ChildModel<T>,
    data: Document,
  ): Promise<T> {
    const model = this.self(data);

    await model.save();

    return model;
  }

  public static async update<T>(
    this: ChildModel<T>,
    id: primaryIdType,
    data: Document,
  ): Promise<T | null> {
    const model = (await this.find(id)) as any;

    if (!model) return null;

    await model.save(data);

    return model;
  }

  public static async replace<T>(
    this: ChildModel<T>,
    id: primaryIdType,
    data: Document,
  ): Promise<T | null> {
    const model = (await this.find(id)) as any;

    if (!model) return null;

    model.replaceWith(data);

    await model.save();

    return model;
  }

  public static async upsert<T>(
    this: ChildModel<T>,
    filter: ModelDocument,
    data: Document,
  ): Promise<T> {
    let model = (await this.first(filter)) as any;

    if (!model) {
      model = this.self({ ...data, ...filter });
    } else {
      model.merge(data);
    }

    await model.save();

    return model;
  }

  public static async restore<T>(
    this: ChildModel<T>,
    id: primaryIdType,
  ): Promise<T | null> {
    const result = await queryBuilder.first(this.collectionName + "Trash", {
      [this.primaryIdColumn]: id,
    });

    if (!result) return null;

    const document = result.document;

    document.restoredAt = new Date();

    const model = this.self(document);

    model.markAsRestored();

    await model.save();

    return model;
  }

  public static async find<T>(this: ChildModel<T>, id: primaryIdType) {
    return this.findBy(this.primaryIdColumn, id);
  }

  public static async findBy<T>(
    this: ChildModel<T>,
    column: string,
    value: any,
  ): Promise<T | null> {
    const query = this.query();

    const result = await query.findOne({
      [column]: value,
    });

    return result ? this.self(result as ModelDocument) : null;
  }

  public static async list<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T[]> {
    return (await queryBuilder.list(this.collectionName, filter)).map(
      document => this.self(document),
    );
  }

  public static async paginate<T>(
    this: ChildModel<T>,
    filter: Filter,
    page: number,
    limit: number,
  ): Promise<paginationListing<T>> {
    const query = this.query();

    const documents = await queryBuilder.list(
      this.collectionName,
      filter,
      query => {
        query.skip((page - 1) * limit).limit(limit);
      },
    );

    const totalDocumentsOfFilter = await queryBuilder.count(
      this.collectionName,
      filter,
    );

    const result: paginationListing<T> = {
      documents: documents.map(item => this.self(item)),
      paginationInfo: {
        limit,
        page,
        result: documents.length,
        total: totalDocumentsOfFilter,
        pages: Math.ceil(totalDocumentsOfFilter / limit),
      },
    };

    return result;
  }

  public static async count(filter: Filter = {}) {
    return await queryBuilder.count(this.collectionName, filter);
  }

  public static async first<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T | null> {
    const result = await queryBuilder.first(this.collectionName, filter);

    return result ? this.self(result) : null;
  }

  public static async last<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T | null> {
    const result = await queryBuilder.last(this.collectionName, filter);

    return result ? this.self(result) : null;
  }

  public static async lastest<T>(
    this: ChildModel<T>,
    filter: Filter = {},
  ): Promise<T[]> {
    const documents = await queryBuilder.lastest(this.collectionName, filter);

    return documents.map(document => this.self(document));
  }

  public static async delete<T>(
    this: ChildModel<T>,
    filter: primaryIdType | Filter,
  ): Promise<number> {
    const query = this.query();

    if (
      filter.constructor.name === "ObjectId" ||
      typeof filter === "string" ||
      typeof filter === "number"
    ) {
      return (await queryBuilder.deleteOne(this.collectionName, {
        [this.primaryIdColumn]: filter,
      }))
        ? 1
        : 0;
    } else {
      return await queryBuilder.delete(this.collectionName, filter);
    }
  }
}
