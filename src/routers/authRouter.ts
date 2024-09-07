import { Router } from "express";
import authController from "../controllers/authController";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
} from "../validations/authValidation";
const router = Router();

router.post(
  "/signup",
  joiMiddleware(registerValidationSchema),
  authController.signUpUser
);

router.post(
  "/login",
  joiMiddleware(loginValidationSchema),
  authController.login
);

router.post("/add-users", authController.addUsers);

router.post("/forget-password", authController.forgetPassword);

router.post("/verify-reset-code", authController.verifyResetCode);

router.post("/reset-password", authController.resetPassword);

export default router;
