import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import nationalityService from "../services/nationalityService";

class NationalityController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const nationality = await nationalityService.create(req.body);
      response(res, 201, {
        status: true,
        message: "Nationality created successfully",
        data: nationality,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {data, pagination} = await nationalityService.getAll(req.query);
      response(res, 200, {
        status: true,
        message: "Nationalities fetched successfully",
        pagination,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const nationality = await nationalityService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Nationality Fetched Successfully",
        data: nationality,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const nationality = await nationalityService.update(
        +req.params.id,
        req.body
      );
      response(res, 200, {
        status: true,
        message: "Nationality Updated Successfully",
        data: nationality,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await nationalityService.delete(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Nationality Deleted Successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

const nationalityController = new NationalityController();
export default nationalityController;
