import { PaginationObjectType } from "./paginateType";

export type ResponseType = {
  status: boolean;
  message: string;
  pagination?: PaginationObjectType;
  data?: T;
  stack?: string;
};
