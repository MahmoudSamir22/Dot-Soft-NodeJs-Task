import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import response from "../utils/response";
import signToken from "../utils/signToken";
import sendMail from "../utils/sendMails";
import pug from "pug";
import CustomRequest from "../interfaces/customRequest";

class AuthController {
  async signUpUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.signUp(req.body);
      response(res, 201, {
        status: true,
        message: "Account created successfully!",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.login(req.body);
      // delete user.password // remove password from the response
      const token = signToken({ id: user.id, first_login: user.first_login });
      response(res, 200, {
        status: true,
        message: "Login successful!",
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async addUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.signUp(req.body);
      response(res, 201, {
        status: true,
        message: "User created successfully!",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.forgetPassword(req.body.email);
      const html = pug.renderFile(
        `${process.cwd()}/src/templates/forgetPassword.pug`,
        { code: user.code, username: user.username }
      );
      sendMail({ to: user.email, html, subject: "Reset Password" });
      response(res, 200, {
        status: true,
        message: "Reset Code Sent Successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyResetCode(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.verifyResetPasswordCode(req.body);
      response(res, 200, {
        status: true,
        message: "Code Verified Successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body);
      response(res, 200, {
        status: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async changeFirstTimePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authService.changeFirstTimePassword(req.body);
      const token = signToken({ id: user.id, first_login: user.first_login });
      response(res, 200, {
        status: true,
        message: "Password changed successfully",
        data: { token, user },
      });
    } catch (error) {
      next(error);
    }
  }

  async addAirwayRepresentative(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await authService.addAirwayRepresentative(req.body);
      response(res, 201, {
        status: true,
        message: "Airway representative added successfully",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      await authService.changePassword(userId, req.body);
      response(res, 200, {
        status: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
const authController = new AuthController();
export default authController;
