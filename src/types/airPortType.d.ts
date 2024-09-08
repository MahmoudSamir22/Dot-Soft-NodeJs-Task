import { QueryType } from "./generalTypes";

type Translation = {
  en: string;
  ar: string;
  fr: string;
};

export default interface IAirPort {
  id: number;
  name: JsonValue | Translation;
  country: JsonValue | Translation;
  city: JsonValue | Translation;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export type CreateAirPort = Omit<
  IAirPort,
  "id" | "createdAt" | "updatedAt" | "deletedAt"
>;
export type UpdateAirPort = Partial<CreateAirPort>;

export type AirPortQuery = Partial<
  QueryType & {
    name: string;
    country: string;
    city: string;
  }
>;
