import { Language } from "../../types/languageType";
import ITicket from "../../types/ticketType";
import { flightSerialization } from "./flight.serialization";

export const ticketSerialization = (
  ticket: ITicket,
  lang: Language
) => ({
  ...ticket,
  Flight: ticket.Flight ? flightSerialization(ticket.Flight, lang) : undefined,
});

export const ticketsSerialization = (
  tickets: ITicket[],
  lang: Language
) =>
  tickets.map((ticket) =>
    ticketSerialization(ticket, lang)
  );
