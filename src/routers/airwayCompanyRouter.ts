import { Router } from "express";
import airwayCompanyController from "../controllers/airwayCompanyController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createAirwayCompanySchema,
  updateAirwayCompanySchema,
} from "../validations/airwayCompanyValidation";
import auth from "../middlewares/auth";
import authorization from "../middlewares/authorization";
import { Roles } from "../enum/user.enums";

const router = Router();

router
  .route("/")
  .get(airwayCompanyController.getAll)
  .post(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(createAirwayCompanySchema),
    airwayCompanyController.create
  );

router
  .route("/:id")
  .get(airwayCompanyController.getOne)
  .patch(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    joiMiddleWare(updateAirwayCompanySchema),
    airwayCompanyController.update
  )
  .delete(
    auth,
    authorization(Roles.SYSTEM_ADMIN),
    airwayCompanyController.delete
  );

export default router;
