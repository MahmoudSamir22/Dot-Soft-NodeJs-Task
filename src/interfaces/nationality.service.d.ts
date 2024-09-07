import INationality, {
  CreateNationality,
  NationalityQuery,
  UpdateNationality,
} from "../types/nationalityType";

export default interface INationalityService {
  create(data: CreateNationality): Promise<INationality>;
  getAll(query: NationalityQuery): Promise<PaginateType<INationality>>;
  getOne(id: number): Promise<INationality>;
  update(id: number, data: UpdateNationality): Promise<INationality>;
  delete(id: number): Promise<void>;
}
