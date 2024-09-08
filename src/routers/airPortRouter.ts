import { Router } from "express";
import airPortController from "../controllers/airPortController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createAirPortSchema,
  updateAirPortSchema,
} from "../validations/airPortValidation";

const router = Router();

router
  .route("/")
  .get(airPortController.getAll)
  .post(joiMiddleWare(createAirPortSchema), airPortController.create);

router
  .route("/:id")
  .get(airPortController.getOne)
  .patch(joiMiddleWare(updateAirPortSchema), airPortController.update)
  .delete(airPortController.delete);

export default router;
