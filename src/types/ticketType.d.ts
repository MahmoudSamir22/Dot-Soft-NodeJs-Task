import IFlight from "./flightType";
import { QueryType } from "./generalTypes";
import IUser from "./userType";

export default interface ITicket {
  id: number;
  userId: number;
  flightId: number;
  operatorId: number;
  seats: number;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;

  User?: IUser;
  Operator?: IUser;
  Flight?: IFlight;
}

export type CreateTicket = Omit<
  ITicket,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "canceledAt"
  | "User"
  | "Operator"
  | "Flight"
>;

export type TicketQuery = Partial<
  QueryType & {
    userId: number;
    flightId: number;
    operatorId: number;
    seats: number;
  }
>;
