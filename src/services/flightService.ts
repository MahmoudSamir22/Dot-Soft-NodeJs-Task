import prisma from "../../prisma/client";
import IFlight, {
  CreateFlight,
  FlightQuery,
  UpdateFlight,
} from "../types/flightType";
import { paginate } from "../utils/pagination";
import { PaginateType } from "../types/paginateType";
import IFlightService from "../interfaces/flight.service";
import ApiError from "../utils/ApiError";

class FlightService implements IFlightService {
  async create(data: CreateFlight): Promise<IFlight> {
    await this.validateBookFlightBody(data);
    return prisma.flight.create({
      data,
    });
  }

  async getAll(query: FlightQuery): Promise<PaginateType<IFlight>> {
    return paginate(
      "flight",
      {
        where: {
          deletedAt: null,
        },
      },
      query.page,
      query.limit
    );
  }

  async getOne(id: number): Promise<IFlight> {
    const flight = await prisma.flight.findUnique({
      where: {
        id,
      },
    });
    if (!flight) throw new ApiError("Flight not found", 404);
    return flight;
  }

  async update(id: number, data: UpdateFlight): Promise<IFlight> {
    await this.getOne(id);
    await this.validateUpdateFlightBody(data);
    return prisma.flight.update({
      where: {
        id,
      },
      data,
    });
  }

  async delete(id: number): Promise<void> {
    await this.getOne(id);
    await prisma.flight.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  private async validateBookFlightBody(data: CreateFlight) {
    const flight = await prisma.flight.findUnique({
      where: {
        flight_number: data.flight_number,
      },
    });
    if (flight)
      throw new ApiError("Flight with same number already exists", 400);
    if (new Date(data.flight_date) < new Date())
      throw new ApiError("Flight date must be in the future", 400);
  }

  private async validateUpdateFlightBody(data: UpdateFlight) {
    if (data.flight_number) {
      const flight = await prisma.flight.findUnique({
        where: {
          flight_number: data.flight_number,
        },
      });
      if (flight)
        throw new ApiError("Flight with same number already exists", 400);
    }
    if (data.flight_date && new Date(data.flight_date) < new Date())
      throw new ApiError("Flight date must be in the future", 400);
  }
}

const flightService = new FlightService();
export default flightService;
