import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import airPortService from "../services/airPortService";
import {
  airportSerialization,
  airportsSerialization,
} from "../utils/serialization/airport.serialization";
import CustomRequest from "../interfaces/customRequest";

class AirPortController {
  // @return 201 status code with success message and created air port
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const airPort = await airPortService.create(req.body);
      response(res, 201, {
        status: true,
        message: "Air Port created successfully",
        data: airPort,
      });
    } catch (error) {
      next(error);
    }
  }
 
  // @return 200 status code with success message and all air ports
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const { data, pagination } = await airPortService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: "Air Ports fetched successfully",
        pagination,
        data: skipLang ? data : airportsSerialization(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and one air
  // @throw 404 status code if air port not found
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const airPort = await airPortService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Air Port Fetched Successfully",
        data: skipLang ? airPort : airportSerialization(airPort, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and updated
  // @throw 404 status code if air port not found
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const airPort = await airPortService.update(+req.params.id, req.body);
      response(res, 200, {
        status: true,
        message: "Air Port Updated Successfully",
        data: airPort,
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message
  // @throw 404 status code if air port not found
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await airPortService.delete(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Air Port Deleted Successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

const airPortController = new AirPortController();
export default airPortController;
