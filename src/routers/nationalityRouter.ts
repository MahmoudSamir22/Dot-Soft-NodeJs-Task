import { Router } from "express";
import nationalityController from "../controllers/nationalityController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createNationalitySchema,
  updateNationalitySchema,
} from "../validations/nationalityValidation";

const router = Router();

router
  .route("/")
  .get(nationalityController.getAll)
  .post(joiMiddleWare(createNationalitySchema), nationalityController.create);

router
  .route("/:id")
  .get(nationalityController.getOne)
  .patch(joiMiddleWare(updateNationalitySchema), nationalityController.update)
  .delete(nationalityController.delete);

export default router;
