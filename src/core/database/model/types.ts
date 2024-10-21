import { ObjectId, WithId } from "mongodb";
import Model from "./model";

export type ChildModel<T> = typeof Model & (new () => T);

export type primaryIdType = string | number | ObjectId;

export type paginationListing<T> = {
  documents: T[];
  paginationInfo: {
    limit: number;
    result: number;
    page: number;
    total: number;
    pages: number;
  };
};

export type Document = Record<string, any>;

export type Filter = Record<string, any>;

export type ModelDocument = WithId<{
  id: number;
  [key: string]: any;
}>;

export type CustomCastType = (column: string, value: any, model: Model) => any;

export type CastType =
  | "string"
  | "number"
  | "int"
  | "float"
  | "integer"
  | "bool"
  | "boolean"
  | "object"
  | "array"
  | "data"
  | CustomCastType;

export type Casts = {
  [column: string]: CastType;
};
