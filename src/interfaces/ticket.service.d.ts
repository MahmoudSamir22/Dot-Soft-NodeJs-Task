import ITicket, {CreateTicket, TicketQuery} from "../types/ticketType";
import {PaginateType} from "../types/paginateType";

export default interface ITicketService {
  bookTicket(data: CreateTicket): Promise<ITicket>;
  getAll(query: TicketQuery): Promise<PaginateType<ITicket>>;
  getOne(id: number): Promise<ITicket>;
  cancel(id: number, userId: number): Promise<void>;
}