import IFlight, {
  CreateFlight,
  UpdateFlight,
  FlightQuery,
} from "../types/flightType";
import { PaginateType } from "../types/paginateType";

export default interface IFlightService {
  create(data: CreateFlight): Promise<IFlight>;
  getAll(query: FlightQuery): Promise<PaginateType<IFlight>>;
  getOne(id: number): Promise<IFlight>;
  update(id: number, data: UpdateFlight): Promise<IFlight>;
  delete(id: number): Promise<void>;
}
