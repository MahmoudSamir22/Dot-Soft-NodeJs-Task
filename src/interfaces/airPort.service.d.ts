import IAirPort, {
  CreateAirPort,
  AirPortQuery,
  UpdateAirPort,
} from "../types/airPortType";

export default interface IAirPortService {
  create(data: CreateAirPort): Promise<IAirPort>;
  getAll(query: AirPortQuery): Promise<PaginateType<IAirPort>>;
  getOne(id: number): Promise<IAirPort>;
  update(id: number, data: UpdateAirPort): Promise<IAirPort>;
  delete(id: number): Promise<void>;
}
