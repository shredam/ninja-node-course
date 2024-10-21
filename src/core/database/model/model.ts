import {
  areEqual,
  except,
  get,
  merge,
  only,
  set,
} from "@mongez/reinforcements";
import CrudModel from "./crud-model";
import { Casts, CastType, Document, ModelDocument } from "./types";
import queryBuilder from "../query-builder/query-builder";
import Is from "@mongez/supportive-is";

const MISSING_KEY = Symbol("MISSING_KEY");

export default abstract class Model extends CrudModel {
  public initialData: Partial<ModelDocument> = {};

  public data: Partial<ModelDocument> = {};

  public defaultValue: Document = {};

  protected isRestored: boolean = false;

  protected casts: Casts = {};

  public constructor(public originalData: Partial<ModelDocument> = {}) {
    super();
    this.data = { ...this.originalData };

    this.initialData = { ...this.originalData };
  }

  public markAsRestored() {
    this.isRestored = true;
  }

  public set(column: string, value: any) {
    this.data = set(this.data, column, value);
    return this;
  }

  public get(column: string, dataValue = null) {
    return get(this.data, column, dataValue);
  }

  public has(column: string) {
    return get(this.data, column, MISSING_KEY) !== MISSING_KEY;
  }

  public except(columns: string[]): Document {
    return except(this.data, columns);
  }

  public only(columns: string[]): Document {
    return only(this.data, columns);
  }

  public unset(...columns: string[]) {
    this.data = except(this.data, columns);

    return this;
  }

  public replaceWith(data: Document) {
    if (!data.id && this.data.id) {
      data.id = this.data.id;
    }

    if (!data._id && this.data._id) {
      data._id = this.data._id;
    }

    this.data = data;

    return this;
  }

  public merge(data: Document) {
    this.data = merge(this.data, data);

    return this;
  }

  public async save(mergedData: Document = {}) {
    this.merge(mergedData);

    if (!this.isNewModel()) {
      if (areEqual(this.originalData, this.data)) return;

      this.data.updatedAt = new Date();

      this.castData();

      await queryBuilder.update(
        this.getCollectionName(),
        {
          _id: this.data._id,
        },
        this.data,
      );
    } else {
      const generateNextId =
        this.getStaticProperty("generateNextId").bind(Model)();

      this.checkForDefaultValues();

      if (!this.data.id) {
        this.data.id = await generateNextId();
      }

      const now = new Date();

      if (!this.data.createdAt) {
        this.data.createdAt = now;
      }

      if (!this.data.updatedAt) {
        this.data.updatedAt = now;
      }

      this.castData();

      this.data = await queryBuilder.create(
        this.getCollectionName(),
        this.data,
      );
    }

    this.originalData = this.data;
  }

  protected castData() {
    for (const column in this.casts) {
      if (!this.isDirty(column)) continue;

      let value = this.get(column);

      if (value === undefined) continue;

      const castType = this.casts[column];

      if (typeof castType === "function") {
        value = castType(column, value, this);
      } else {
        value = this.castValue(value, castType);
      }

      this.set(column, value);
    }
  }

  protected castValue(value: any, castType: CastType) {
    switch (castType) {
      case "string":
        return String(value);

      case "number":
        return Number(value);

      case "int":
      case "integer":
        return parseInt(value);

      case "float":
        return parseFloat(value);

      case "bool":
      case "boolean":
        if (value === "true") return true;

        if (value === "false" || value === "0" || value === 0) return false;

        return Boolean(value);

      case "data":
        if (typeof value === "string") {
          return new Date(value);
        }

        if (typeof value === "number") {
          return new Date(value * 1000);
        }

        if (value instanceof Date) {
          return value;
        }

        return new Date();

      case "object":
        if (!value) return {};

        if (typeof value === "string") {
          return JSON.parse(value);
        }

        return value;

      case "array":
        if (!value) return [];

        if (typeof value === "string") {
          return JSON.parse(value);
        }

        return value;

      default:
        return value;
    }
  }

  protected checkForDefaultValues() {
    if (Is.empty(this.defaultValue)) return;

    this.data = merge(this.defaultValue, this.data);
  }

  public async destroy() {
    if (!this.data._id) return;

    this.data.deletedAt = new Date();

    await queryBuilder.create(this.getCollectionName() + "Trash", {
      document: this.data,
      _id: this.data._id,
      id: this.data.id,
    });

    await queryBuilder.deleteOne(this.getCollectionName(), {
      _id: this.data._id,
    });
  }

  public isDirty(column: string) {
    if (this.isNewModel()) return true;
    const currentValue = get(this.data, column);
    const originalValue = get(this.originalData, column);

    return areEqual(currentValue, originalValue) === false;
  }

  public isNewModel() {
    return !this.data._id || (this.data._id && this.isRestored);
  }
}
