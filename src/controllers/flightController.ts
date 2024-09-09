import { Request, Response, NextFunction } from "express";
import flightService from "../services/flightService";
import CustomRequest from "../interfaces/customRequest";
import response from "../utils/response";
import ApiError from "../utils/ApiError";
import {
  flightSerialization,
  flightsSerialization,
} from "../utils/serialization/flight.serialization";

class FlightController {
  // @return 201 status code with success message and created flight
  // @throw 400 status code if user is not in a company
  // @throw 400 status code if flight number already exists
  // @thorw 404 status code if airport does not exist
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, companyId } = req as CustomRequest;
      if (!companyId) {
        throw new ApiError("You are not in a company", 400);
      }
      const flight = await flightService.create({
        ...req.body,
        operatorId: userId,
        airwayCompanyId: companyId,
      });
      response(res, 201, {
        status: true,
        message: "Flight created",
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and all flights
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const { data, pagination } = await flightService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: "Flights fetched",
        pagination,
        data: skipLang ? data : flightsSerialization(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and one flight
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const flight = await flightService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Flight fetched",
        data: skipLang ? flight : flightSerialization(flight, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and updated flight
  // @throw 404 status code if flight not found
  // @throw 400 status code if flight date is in the past
  // @throw 400 status code if flight number already exists
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const flight = await flightService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: "Flight updated",
        data: flight,
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message
  // @throw 404 status code if flight not found
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await flightService.delete(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Flight deleted",
      });
    } catch (error) {
      next(error);
    }
  }
}

const flightController = new FlightController();
export default flightController;
