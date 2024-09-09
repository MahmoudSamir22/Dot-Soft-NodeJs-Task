import Joi from "joi";
import { CreateTicket, TicketQuery } from "../types/ticketType";

export const bookTicketSchema = Joi.object<CreateTicket>().keys({
  flightId: Joi.number().strict().required(),
  userId: Joi.number().strict(),
  seats: Joi.number().strict(),
});
