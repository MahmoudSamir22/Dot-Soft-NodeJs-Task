import { Router } from "express";
import ticketController from "../controllers/ticketController";
import auth from "../middlewares/auth";
import joiMiddleWare from "../middlewares/joiMiddleware";
import { bookTicketSchema } from "../validations/ticketValidation";

const router = Router();

router
  .route("/")
  .get(auth, ticketController.getMyTickets)
  .post(auth, joiMiddleWare(bookTicketSchema), ticketController.bookTicket);

router.get("/reservations", auth, ticketController.getMyReservations);

router
  .route("/:id")
  .get(auth, ticketController.getOne)
  .delete(auth, ticketController.cancel);

export default router;