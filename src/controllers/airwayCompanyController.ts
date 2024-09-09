import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import airwayCompanyService from "../services/airwayCompanyService";
import {
  airwayCompanySerialization,
  airewayCompaniesSerialization,
} from "../utils/serialization/airwayCompany.serialization";
import CustomRequest from "../interfaces/customRequest";

class AirwayCompanyController {
  // @description: create airway company
  // @return 201 status code with success message and created airway company
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const airwayCompany = await airwayCompanyService.create(req.body);
      response(res, 201, {
        status: true,
        message: "Airway Company created successfully",
        data: airwayCompany,
      });
    } catch (error) {
      next(error);
    }
  }

  // @description: get all airway companies
  // @return 200 status code with success message and all airway companies
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const { data, pagination } = await airwayCompanyService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: "Airway Companies retrieved successfully",
        pagination,
        data: skipLang ? data : airewayCompaniesSerialization(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @description: get one airway company
  // @return 200 status code with success message and one airway company
  // @throw 404 status code if airway company not found
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { language, skipLang } = req as CustomRequest;
      const airwayCompany = await airwayCompanyService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Airway Company retrieved successfully",
        data: skipLang
          ? airwayCompany
          : airwayCompanySerialization(airwayCompany, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @description: update airway company
  // @return 200 status code with success message and updated airway company
  // @throw 404 status code if airway company not found
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const airwayCompany = await airwayCompanyService.update(
        +req.params.id,
        req.body
      );
      response(res, 200, {
        status: true,
        message: "Airway Company updated successfully",
        data: airwayCompany,
      });
    } catch (error) {
      next(error);
    }
  }

  // @description: delete airway company
  // @return 200 status code with success message
  // @throw 404 status code if airway company not found
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await airwayCompanyService.delete(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Airway Company deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

const airwayCompanyController = new AirwayCompanyController();
export default airwayCompanyController;
