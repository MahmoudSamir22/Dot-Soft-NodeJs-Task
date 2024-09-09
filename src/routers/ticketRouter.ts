import { Router } from "express";
import ticketController from "../controllers/ticketController";
import auth from "../middlewares/auth";
import joiMiddleWare from "../middlewares/joiMiddleware";
import { bookTicketSchema } from "../validations/ticketValidation";
import { Roles } from "../enum/user.enums";
import authorization from "../middlewares/authorization";

const router = Router();

router
  .route("/")
  .get(auth, authorization(Roles.CUSTOMER), ticketController.getMyTickets)
  .post(
    auth,
    authorization(Roles.AIRWAY_REPRESENTATIVE, Roles.CUSTOMER),
    joiMiddleWare(bookTicketSchema),
    ticketController.bookTicket
  );

router.get("/reservations", auth, ticketController.getMyReservations);

router
  .route("/:id")
  .get(auth, ticketController.getOne)
  .delete(
    auth,
    authorization(Roles.AIRWAY_REPRESENTATIVE, Roles.CUSTOMER),
    ticketController.cancel
  );

export default router;
