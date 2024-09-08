import Joi from "joi";
import { CreateFlight, UpdateFlight, FlightQuery } from "../types/flightType";

export const createFlightSchema = Joi.object<CreateFlight>().keys({
  flight_number: Joi.string().required(),
  from: Joi.number().strict().required(),
  to: Joi.number().strict().required(),
  number_of_seats: Joi.number().strict().required(),
  ticket_price: Joi.number().strict().required(),
  flight_date: Joi.date().iso().required(),
});

export const updateFlightSchema = Joi.object<UpdateFlight>().keys({
  flight_number: Joi.string(),
  from: Joi.number().strict(),
  to: Joi.number().strict(),
  number_of_seats: Joi.number().strict(),
  ticket_price: Joi.number().strict(),
  flight_date: Joi.date()
    .iso()
    .custom((val) => {
      if (new Date(val) < new Date()) {
        throw new Error("Flight date must be in the future");
      }
      return val;
    }),
});
