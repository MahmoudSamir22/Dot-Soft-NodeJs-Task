import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import airwayCompanyService from "../services/airwayCompanyService";

class AirwayCompanyController {
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

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {data, pagination} = await airwayCompanyService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: "Airway Companies retrieved successfully",
        pagination,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const airwayCompany = await airwayCompanyService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Airway Company retrieved successfully",
        data: airwayCompany,
      });
    } catch (error) {
      next(error);
    }
  }

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