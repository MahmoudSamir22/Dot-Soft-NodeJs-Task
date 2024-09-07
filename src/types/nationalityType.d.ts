import { QueryType } from "./generalTypes";

export default interface INationality {
  id: number;
  name:
    | JsonValue
    | {
        en: string;
        ar: string;
        fr: string;
      };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateNationality = Omit<
  INationality,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;
export type UpdateNationality = Partial<CreateNationality>;

export type NationalityQuery = Partial<
  QueryType & {
    name: string;
  }
>;