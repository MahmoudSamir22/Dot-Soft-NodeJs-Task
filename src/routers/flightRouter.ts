import { Router } from "express";
import flightController from "../controllers/flightController";
import auth from "../middlewares/auth";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createFlightSchema,
  updateFlightSchema,
} from "../validations/flightValidation";
import authorization from "../middlewares/authorization";
import { Roles } from "../enum/user.enums";

const router = Router();

router
  .route("/")
  .get(flightController.getAll)
  .post(
    auth,
    authorization(Roles.AIRWAY_REPRESENTATIVE),
    joiMiddleWare(createFlightSchema),
    flightController.create
  );
router
  .route("/:id")
  .get(flightController.getOne)
  .patch(
    auth,
    authorization(Roles.AIRWAY_REPRESENTATIVE),
    joiMiddleWare(updateFlightSchema),
    flightController.update
  )
  .delete(
    auth,
    authorization(Roles.AIRWAY_REPRESENTATIVE),
    flightController.delete
  );

export default router;
