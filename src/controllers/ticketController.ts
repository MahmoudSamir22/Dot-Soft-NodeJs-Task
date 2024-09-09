import { Request, Response, NextFunction } from "express";
import response from "../utils/response";
import ticketService from "../services/ticketService";
import CustomRequest from "../interfaces/customRequest";
import { Roles } from "../enum/user.enums";
import {
  ticketSerialization,
  ticketsSerialization,
} from "../utils/serialization/ticket.serialization";

class TicketController {
  // @return 201 status code with success message and created ticket
  // @throw 400 status code if user is not in a company
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

  // @return 200 status code with success message and all tickets
  async getMyTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, skipLang, language } = req as CustomRequest;
      const {data, pagination} = await ticketService.getMyTickets(userId, req.query);
      response(res, 200, {
        status: true,
        message: "Tickets fetched",
        pagination,
        data: skipLang ? data : ticketsSerialization(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and all reservations
  async getMyReservations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, skipLang, language } = req as CustomRequest;
      const {data, pagination} = await ticketService.getMyReservations(userId, req.query);
      response(res, 200, {
        status: true,
        message: "Tickets fetched",
        pagination,
        data: skipLang ? data : ticketsSerialization(data, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and all tickets
  // @throw 404 status code if user not found
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const { skipLang, language } = req as CustomRequest;
      const ticket = await ticketService.getOne(+req.params.id);
      response(res, 200, {
        status: true,
        message: "Ticket fetched",
        data: skipLang ? ticket : ticketSerialization(ticket, language),
      });
    } catch (error) {
      next(error);
    }
  }

  // @return 200 status code with success message and updated ticket
  // @throw 404 status code if ticket not found
  async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req as CustomRequest;
      await ticketService.cancel(+req.params.id, userId, req.body);
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
