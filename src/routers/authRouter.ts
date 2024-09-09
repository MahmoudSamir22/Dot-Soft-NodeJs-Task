import { Router } from "express";
import authController from "../controllers/authController";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  changeFirstTimePasswordSchema,
  addAirwayRepresentativeSchema,
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

router.post(
  "/first-time-password",
  joiMiddleware(changeFirstTimePasswordSchema),
  authController.changeFirstTimePassword
);

router.post(
  "/add-airway-representative",
  joiMiddleware(addAirwayRepresentativeSchema),
  authController.addAirwayRepresentative
);

export default router;
