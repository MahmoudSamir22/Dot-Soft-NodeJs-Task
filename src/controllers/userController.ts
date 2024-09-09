import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import CustomRequest from "../interfaces/customRequest";
import userService from "../services/userService";

class UserController {
  // @return 200 status code with success message and user profile
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      const user = await userService.getProfile(userId);
      response(res, 200, {
        status: true,
        message: "User profile fetched successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

const userController = new UserController();
export default userController;