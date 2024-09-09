import { Router } from "express";
import airPortController from "../controllers/airPortController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createAirPortSchema,
  updateAirPortSchema,
} from "../validations/airPortValidation";
import authorization from "../middlewares/authorization";
import { Roles } from "../enum/user.enums";
import auth from "../middlewares/auth";

const router = Router();

router
  .route("/")
  .get(airPortController.getAll)
  .post(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(createAirPortSchema),
    airPortController.create
  );

router
  .route("/:id")
  .get(airPortController.getOne)
  .patch(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(updateAirPortSchema),
    airPortController.update
  )
  .delete(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    airPortController.delete
  );

export default router;
