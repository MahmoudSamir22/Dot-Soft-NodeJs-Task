import prisma from "../../prisma/client";
import IAirPort, {
  CreateAirPort,
  AirPortQuery,
  UpdateAirPort,
} from "../types/airPortType";
import IAirPortService from "../interfaces/airPort.service";
import ApiError from "../utils/ApiError";
import { PaginateType } from "../types/paginateType";
import { paginate } from "../utils/pagination";

class AirPortService implements IAirPortService {
  async create(data: CreateAirPort): Promise<IAirPort> {
    return prisma.air_Port.create({ data });
  }

  async getAll(query: AirPortQuery): Promise<PaginateType<IAirPort>> {
    return paginate("air_Port", { where: { deletedAt: null } }, query.page, query.limit);
  }

  async getOne(id: number): Promise<IAirPort> {
    const airPort = await prisma.air_Port.findUnique({ where: { id } });
    if (!airPort) throw new ApiError("airPort not found", 404);
    return airPort;
  }

  async update(id: number, data: UpdateAirPort): Promise<IAirPort> {
    await this.getOne(id);
    return prisma.air_Port.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.air_Port.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

const airPortService = new AirPortService();
export default airPortService;
