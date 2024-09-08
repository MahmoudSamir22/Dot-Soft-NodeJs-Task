import { Router } from "express";
import flightController from "../controllers/flightController";
import auth from "../middlewares/auth";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createFlightSchema,
  updateFlightSchema,
} from "../validations/flightValidation";

const router = Router();

router
  .route("/")
  .get(flightController.getAll)
  .post(auth, joiMiddleWare(createFlightSchema), flightController.create);
router
  .route("/:id")
  .get(flightController.getOne)
  .patch(auth, joiMiddleWare(updateFlightSchema), flightController.update)
  .delete(auth, flightController.delete);

export default router;