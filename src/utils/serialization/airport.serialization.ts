import { Language } from "../../types/languageType";
import IAirPort from "../../types/airPortType";

export const airportSerialization = (airport: IAirPort, lang: Language) => ({
  ...airport,
  name: airport.name[lang],
  country: airport.country[lang],
  city: airport.city[lang],
});

export const airportsSerialization = (airports: IAirPort[], lang: Language) =>
  airports.map((airport) => airportSerialization(airport, lang));
