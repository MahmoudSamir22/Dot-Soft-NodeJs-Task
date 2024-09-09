import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import ticketService from "../services/ticketService";
import CustomRequest from "../interfaces/customRequest";
import ApiError from "../utils/ApiError";
import { Roles } from "../enum/user.enums";

class TicketController {
  async bookTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, role } = req as CustomRequest;
      const ticket = await ticketService.bookTicket({
        ...req.body,
        userId: role === Roles.CUSTOMER ? userId : req.body.userId,
        operatorId: role === Roles.AIRWAY_REPRESENTATIVE ? userId : undefined,
      });
      response(res, 201, {
        status: true,
        message: "Ticket booked",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      const tickets = await ticketService.getMyTickets(userId, req.query);
      response(res, 200, {
        status: true,
        message: "Tickets fetched",
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getMyReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      const tickets = await ticketService.getMyReservations(userId, req.query);
      response(res, 200, {
        status: true,
        message: "Tickets fetched",
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await ticketService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Ticket fetched",
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      await ticketService.cancel(+req.params.id, userId);
      response(res, 200, {
        status: true,
        message: "Ticket canceled",
      });
    } catch (error) {
      next(error);
    }
  }
}

const ticketController = new TicketController();
export default ticketController;
