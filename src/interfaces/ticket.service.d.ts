import ITicket, { CreateTicket, TicketQuery, CancelationReason } from "../types/ticketType";
import { PaginateType } from "../types/paginateType";

export default interface ITicketService {
  bookTicket(data: CreateTicket): Promise<ITicket>;
  getMyTickets(userId: number, query: TicketQuery): Promise<PaginateType<ITicket>>;
  getMyReservations(userId: number, query: TicketQuery): Promise<PaginateType<ITicket>>;
  getOne(id: number): Promise<ITicket>;
  cancel(id: number, userId: number, data: CancelationReason): Promise<void>;
}
