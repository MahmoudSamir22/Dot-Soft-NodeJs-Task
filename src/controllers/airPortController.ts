import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import airPortService from "../services/airPortService";
import {
  airportSerialization,
  airportsSerialization,
} from "../utils/serialization/airport.serialization";
import CustomRequest from "../interfaces/customRequest";

class AirPortController {
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
