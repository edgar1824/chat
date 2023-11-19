import { NextFunction, Request, Response } from "express";
import { FilterQuery, ProjectionType, QueryOptions, Types } from "mongoose";

export interface IPagination {
  items: any[];
  count: number;
  docsCount: number;
}

export interface IMe {
  _id?: Types.ObjectId;
  isAdmin?: boolean;
}

interface IRequest extends Request {
  _user: IMe;
  user: Record<string, any>;
  query: Record<string, string>;
  logout?(fn?: (err?: any) => void): any;
}

interface IResponse extends Response {
  paginated?: IPagination;
}

export type IFind<Model> = Partial<
  [
    FilterQuery<Model>,
    ProjectionType<Model> | null | undefined,
    QueryOptions<Model> | null | undefined
  ]
>;

export type IDelete<Model> = Partial<[FilterQuery<Model>, QueryOptions<Model>]>;

export type RequestHandler = (
  req: IRequest,
  res: IResponse,
  next: NextFunction
) => any;
