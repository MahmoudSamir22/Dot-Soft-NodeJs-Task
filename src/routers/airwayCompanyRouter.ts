import { Router } from "express";
import airwayCompanyController from "../controllers/airwayCompanyController";
import joiMiddleWare from "../middlewares/joiMiddleware";
import {
  createAirwayCompanySchema,
  updateAirwayCompanySchema,
} from "../validations/airwayCompanyValidation";

const router = Router();

router
  .route("/")
  .get(airwayCompanyController.getAll)
  .post(
    joiMiddleWare(createAirwayCompanySchema),
    airwayCompanyController.create
  );

router
  .route("/:id")
  .get(airwayCompanyController.getOne)
  .patch(
    joiMiddleWare(updateAirwayCompanySchema),
    airwayCompanyController.update
  )
  .delete(airwayCompanyController.delete);

export default router;
