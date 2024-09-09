import { Language } from "../../types/languageType";
import IFlight from "../../types/flightType";
import { airportSerialization } from "./airport.serialization";
import { airwayCompanySerialization } from "./airwayCompany.serialization";

export const flightSerialization = (flight: IFlight, lang: Language) => ({
  ...flight,
  Departure_Airport: flight.Departure_Airport
    ? airportSerialization(flight.Departure_Airport, lang)
    : undefined,
  Arrival_Airport: flight.Arrival_Airport
    ? airportSerialization(flight.Arrival_Airport, lang)
    : undefined,
  Airway_Company: flight.Airway_Company
    ? airwayCompanySerialization(flight.Airway_Company, lang)
    : undefined,
});

export const flightsSerialization = (flights: IFlight[], lang: Language) =>
  flights.map((flight) => flightSerialization(flight, lang));
