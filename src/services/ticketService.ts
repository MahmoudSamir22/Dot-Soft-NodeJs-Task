import prisma from "../../prisma/client";
import ITicket, {
  CancelationReason,
  CreateTicket,
  TicketQuery,
} from "../types/ticketType";
import { paginate } from "../utils/pagination";
import { PaginateType } from "../types/paginateType";
import ITicketService from "../interfaces/ticket.service";
import ApiError from "../utils/ApiError";
import moment from "moment";
import flightService from "./flightService";

class TicketService implements ITicketService {
  // @description: Book a ticket
  // @throw 404 status code if flight not found
  async bookTicket(data: CreateTicket): Promise<ITicket> {
    await flightService.getOne(data.flightId);
    return prisma.ticket.create({ data });
  }

  // @description: Get all tickets
  async getMyTickets(
    userId: number,
    query: TicketQuery
  ): Promise<PaginateType<ITicket>> {
    return paginate(
      "ticket",
      {
        where: {
          userId,
        },
        include: {
          Flight: {
            include: {
              Departure_Airport: true,
              Arrival_Airport: true,
              Airway_Company: true,
            },
          },
        },
      },
      query.page,
      query.limit
    );
  }

  // @description: Get all reservations for an operator
  async getMyReservations(
    userId: number,
    query: TicketQuery
  ): Promise<PaginateType<ITicket>> {
    return paginate(
      "ticket",
      {
        where: {
          operatorId: userId,
        },
        include: {
          Flight: {
            include: {
              Departure_Airport: true,
              Arrival_Airport: true,
              Airway_Company: true,
            },
          },
        },
      },
      query.page,
      query.limit
    );
  }

  // @description: Get one ticket
  // @throw 404 status code if ticket not found
  async getOne(id: number): Promise<ITicket> {
    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        Flight: {
          include: {
            Departure_Airport: true,
            Arrival_Airport: true,
            Airway_Company: true,
          }
        }
      }
    });
    if (!ticket) throw new ApiError("Ticket not found", 404);
    return ticket;
  }

  // @description: Cancel a ticket
  // @throw 400 status code if the user tries to cancel less than 72 hours before the flight
  // @throw 403 status code if the user tries to cancel other user's ticket
  // @throw 400 status code if the operator tries to cancel a ticket without providing a reason
  async cancel(
    id: number,
    userId: number,
    data: CancelationReason
  ): Promise<void> {
    const ticket = await this.getOne(id);
    if (
      moment(ticket.Flight?.flight_date).diff(moment(), "hours") < 72 &&
      ticket.userId === userId
    ) {
      throw new ApiError("You can't cancel the ticket less than 72 hours before the flight", 400);
    }
    if (ticket.userId !== userId && ticket.operatorId !== userId) {
      throw new ApiError("You can't cancel other user's ticket", 403);
    }
    if (ticket.operatorId === userId && !data.reason)
      throw new ApiError(
        "You have to provide a reason for the cancellation",
        400
      );
    await prisma.ticket.update({
      where: {
        id,
      },
      data: {
        canceledAt: new Date(),
        Cancelation_Reason:
          data.reason && userId == ticket.operatorId
            ? {
                create: {
                  operatorId: userId,
                  reason: data.reason,
                },
              }
            : undefined,
      },
    });
  }
}

const ticketService = new TicketService();
export default ticketService;
