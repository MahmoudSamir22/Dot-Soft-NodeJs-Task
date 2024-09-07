import prisma from "../../prisma/client";
import INationality, {
  CreateNationality,
  NationalityQuery,
  UpdateNationality,
} from "../types/nationalityType";
import INationalityService from "../interfaces/nationality.service";
import ApiError from "../utils/ApiError";
import { PaginateType } from "../types/paginateType";
import { paginate } from "../utils/pagination";

class NationalityService implements INationalityService {
  async create(data: CreateNationality): Promise<INationality> {
    return prisma.nationality.create({ data });
  }

  async getAll(query: NationalityQuery): Promise<PaginateType<INationality>> {
    return paginate("nationality", { where: { deletedAt: null } }, query.page, query.limit);
  }

  async getOne(id: number): Promise<INationality> {
    const nationality = await prisma.nationality.findUnique({ where: { id } });
    if (!nationality) throw new ApiError("Nationality not found", 404);
    return nationality;
  }

  async update(id: number, data: UpdateNationality): Promise<INationality> {
    await this.getOne(id);
    return prisma.nationality.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.nationality.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}

const nationalityService = new NationalityService();
export default nationalityService;
