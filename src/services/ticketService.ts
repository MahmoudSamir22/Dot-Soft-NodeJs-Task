import prisma from "../../prisma/client";
import ITicket, { CreateTicket, TicketQuery } from "../types/ticketType";
import { paginate } from "../utils/pagination";
import { PaginateType } from "../types/paginateType";
import ITicketService from "../interfaces/ticket.service";
import ApiError from "../utils/ApiError";

class TicketService implements ITicketService {
  async bookTicket(data: CreateTicket): Promise<ITicket> {
    return prisma.ticket.create({ data });
  }

  async getAll(query: TicketQuery): Promise<PaginateType<ITicket>> {
    return paginate(
      "ticket",
      {
        where: {
          canceledAt: null,
        },
      },
      query.page,
      query.limit
    );
  }

  async getOne(id: number): Promise<ITicket> {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
    });
    if (!ticket) throw new ApiError("Ticket not found", 404);
    return ticket;
  }

  async cancel(id: number): Promise<void> {
    const ticket = await this.getOne(id);
    await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        canceledAt: new Date(),
      },
    });
  }
}

const ticketService = new TicketService();
export default ticketService;
