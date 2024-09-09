import prisma from "../../prisma/client";
import IAirway_Company, {
  AirwayCompanyQuery,
  CreateAirwayCompany,
  UpdateAirwayCompany,
} from "../types/airwayCompanyType";
import IAirwayCompanyService from "../interfaces/airwayCompany.service";
import ApiError from "../utils/ApiError";
import { paginate } from "../utils/pagination";
import { PaginateType } from "../types/paginateType";

class AirwayCompanyService implements IAirwayCompanyService {
  // @description: Create a new airway company
  async create(data: CreateAirwayCompany): Promise<IAirway_Company> {
    const airwayCompany = await prisma.airway_Company.create({
      data,
    });
    return airwayCompany;
  }

  // @description: Get all airway companies
  async getAll(query: AirwayCompanyQuery): Promise<PaginateType<IAirway_Company>> {
    return paginate("airway_Company",{where: {
      deletedAt: null,
    }}, query.page, query.limit);
  }

  // @description: Get one airway company
  // @throw 404 status code if airway company not found
  async getOne(id: number): Promise<IAirway_Company> {
    const airwayCompany = await prisma.airway_Company.findUnique({
      where: {
        id,
      },
    });
    if (!airwayCompany) {
      throw new ApiError("Airway company not found", 404);
    }
    return airwayCompany;
  }

  // @description: Update an airway company
  // @throw 404 status code if airway company not found
  async update(
    id: number,
    data: UpdateAirwayCompany
  ): Promise<IAirway_Company> {
    await this.getOne(id);
    const airwayCompany = await prisma.airway_Company.update({
      where: {
        id,
      },
      data,
    });
    return airwayCompany;
  }

  // @description: Soft delete an airway company
  // @throw 404 status code if airway company not found
  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.airway_Company.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

}

const airwayCompanyService = new AirwayCompanyService();
export default airwayCompanyService;
