import prisma from "../../prisma/client";
import ITicket, { CreateTicket, TicketQuery } from "../types/ticketType";
import { paginate } from "../utils/pagination";
import { PaginateType } from "../types/paginateType";
import ITicketService from "../interfaces/ticket.service";
import ApiError from "../utils/ApiError";
import moment from "moment";
import flightService from "./flightService";

class TicketService implements ITicketService {
  async bookTicket(data: CreateTicket): Promise<ITicket> {
    await flightService.getOne(data.flightId);
    return prisma.ticket.create({ data });
  }

  async getMyTickets(userId: number, query: TicketQuery): Promise<PaginateType<ITicket>> {
    return paginate(
      "ticket",
      {
        where: {
          canceledAt: null,
          userId,
        },
      },
      query.page,
      query.limit
    );
  }

  async getMyReservations(userId: number, query: TicketQuery): Promise<PaginateType<ITicket>> {
    return paginate(
      "ticket",
      {
        where: {
          canceledAt: null,
          operatorId: userId,
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
      include: {
        Flight: true,
      },
    });
    if (!ticket) throw new ApiError("Ticket not found", 404);
    return ticket;
  }

  async cancel(id: number, userId: number): Promise<void> {
    const ticket = await this.getOne(id);
    if (moment(ticket.Flight?.flight_date).diff(moment(), "hours") < 72) {
      throw new ApiError("You can't cancel ticket 72 hours before flight", 400);
    }
    if (ticket.userId !== userId && ticket.operatorId !== userId) {
      throw new ApiError("You can't cancel other user's ticket", 403);
    }
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
