import { Router } from "express";
import nationalityController from "../controllers/nationalityController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createNationalitySchema,
  updateNationalitySchema,
} from "../validations/nationalityValidation";
import auth from "../middlewares/auth";
import { Roles } from "../enum/user.enums";
import authorization from "../middlewares/authorization";

const router = Router();

router
  .route("/")
  .get(nationalityController.getAll)
  .post(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(createNationalitySchema),
    nationalityController.create
  );

router
  .route("/:id")
  .get(nationalityController.getOne)
  .patch(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(updateNationalitySchema),
    nationalityController.update
  )
  .delete(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    nationalityController.delete
  );

export default router;
