import IAirway_Company, {
  CreateAirwayCompany,
  UpdateAirwayCompany,
  AirwayCompanyQuery,
} from "../types/airwayCompanyType";
import { PaginateType } from "../types/paginateType";

export default interface IAirwayCompanyService {
  create(data: CreateAirwayCompany): Promise<IAirway_Company>;
  getAll(query: AirwayCompanyQuery): Promise<PaginateType<IAirway_Company>>;
  getOne(id: number): Promise<IAirway_Company>;
  update(id: number, data: UpdateAirwayCompany): Promise<IAirway_Company>;
  delete(id: number): Promise<void>;
}
