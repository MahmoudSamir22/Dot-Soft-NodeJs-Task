import { Router } from "express";
import authController from "../controllers/authController";
import joiMiddleware from "../middlewares/joiMiddleware";
import {
  registerValidationSchema,
  loginValidationSchema,
  changeFirstTimePasswordSchema,
  addAirwayRepresentativeSchema,
  changePasswordSchema,
  resetPasswordSchema,
} from "../validations/authValidation";
import auth from "../middlewares/auth";
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

router.post("/forget-password", authController.forgetPassword);

router.post("/verify-reset-code", authController.verifyResetCode);

router.post(
  "/reset-password",
  joiMiddleware(resetPasswordSchema),
  authController.resetPassword
);

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

router.post(
  "/change-password",
  auth,
  joiMiddleware(changePasswordSchema),
  authController.changePassword
);

export default router;
