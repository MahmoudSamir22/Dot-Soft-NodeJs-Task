import IAirPort from "./airPortType";
import IAirway_Company from "./airwayCompanyType";
import { QueryType } from "./generalTypes";
import ITicket from "./ticketType";
import IUser from "./userType";

export default interface IFlight {
  id: number;
  flight_number: string;
  from: number;
  to: number;
  number_of_seats: number;
  reserved_seats: number;
  ticket_price: number;
  flight_date: Date;
  operatorId: number;
  airwayCompanyId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  Departure_Airport?: IAirPort;
  Arrival_Airport?: IAirPort;
  Airway_Company?: IAirway_Company;
  Operator?: IUser;
  Tickets?: ITicket[];
}

export type CreateFlight = Omit<
  IFlight,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "deletedAt"
  | "reserved_seats"
  | "Departure_Airport"
  | "Arrival_Airport"
  | "Airway_Company"
  | "Operator"
  | "Tickets"
>;

export type UpdateFlight = Partial<CreateFlight>;

export type FlightQuery = Partial<
  QueryType & {
    flight_number: string;
    from: number;
    to: number;
    number_of_seats: number;
    ticket_price: number;
    flight_date: Date;
    operatorId: number;
    airwayCompanyId: number;
  }>