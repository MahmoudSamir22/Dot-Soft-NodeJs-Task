import { Router } from "express";
import userController from "../controllers/userController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import auth from "../middlewares/auth";

const router = Router();

router.route("/").post(userController.addAirwayRepresentative);

router
  .route("/profile")
  .get(auth, userController.getProfile)
  .patch(auth, userController.updateProfile);

export default router;
