export type PaginateType<T> = {
  pagination: PaginationObjectType;
  data: T[];
};

export type PaginationObjectType = {
  totalPages: number;
  totalItems: number;
  page: number;
  limit: number;
};
