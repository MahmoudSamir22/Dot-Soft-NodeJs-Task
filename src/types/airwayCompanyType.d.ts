import { QueryType } from "./generalTypes";

export default interface IAirway_Company {
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

export type CreateAirwayCompany = Omit<
  IAirway_Company,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;
export type UpdateAirwayCompany = Partial<CreateAirwayCompany>;
export type AirwayCompanyQuery = Partial<
  QueryType & {
    name: string;
  }
>;
