import ticketService from "../../src/services/ticketService";
import prisma from "../../prisma/client";
import ApiError from "../../src/utils/ApiError";
import { paginate } from "../../src/utils/pagination";
import {
  CreateTicket,
  TicketQuery,
  CancelationReason,
} from "../../src/types/ticketType";
import IFlight from "../../src/types/flightType";
import ITicket from "../../src/types/ticketType";
import flightService from "../../src/services/flightService";
import moment from "moment";

jest.mock("../../prisma/client", () => ({
  ticket: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock("../../src/utils/pagination", () => ({
  paginate: jest.fn(),
}));

jest.mock("../../src/services/flightService", () => ({
  getOne: jest.fn(),
}));

describe("TicketService", () => {
  describe("bookTicket", () => {
    it("should book a ticket successfully", async () => {
      const flight: IFlight = {
        id: 1,
        flight_number: "AB123",
        from: 1,
        to: 2,
        number_of_seats: 150,
        reserved_seats: 0,
        ticket_price: 99.99,
        flight_date: new Date(Date.now() + 86400000), 
        operatorId: 1,
        airwayCompanyId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (flightService.getOne as jest.Mock).mockResolvedValue(flight);

      const ticketData: CreateTicket = {
        flightId: 1,
        userId: 1,
        operatorId: null,
        seats: 2,
      };

      (prisma.ticket.create as jest.Mock).mockResolvedValue({
        id: expect.any(Number),
        ...ticketData,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
      });

      const result = await ticketService.bookTicket(ticketData);

      expect(result).toHaveProperty("id", expect.any(Number));
      expect(prisma.ticket.create).toHaveBeenCalledWith({ data: ticketData });
    });

    it("should throw an error if flight does not exist", async () => {
      (flightService.getOne as jest.Mock).mockRejectedValue(
        new ApiError("Flight not found", 404)
      );

      const ticketData: CreateTicket = {
        flightId: 1,
        userId: 1,
        operatorId: null,
        seats: 2,
      };

      await expect(ticketService.bookTicket(ticketData)).rejects.toThrowError(
        new ApiError("Flight not found", 404)
      );
    });
  });

  describe("getMyTickets", () => {
    it("should paginate and return tickets for a user", async () => {
      const query: TicketQuery = { userId: 1, page: 1, limit: 10 };

      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);

      const result = await ticketService.getMyTickets(1, query);

      expect(mockPaginate).toHaveBeenCalledWith(
        "ticket",
        {
          where: { userId: 1 },
          include: {
            Flight: {
              include: {
                Departure_Airport: true,
                Arrival_Airport: true,
                Airway_Company: true,
              },
            },
          },
        },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe("getMyReservations", () => {
    it("should paginate and return reservations for an operator", async () => {
      const query: TicketQuery = { operatorId: 1, page: 1, limit: 10 };

      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);

      const result = await ticketService.getMyReservations(1, query);

      expect(mockPaginate).toHaveBeenCalledWith(
        "ticket",
        {
          where: { operatorId: 1 },
          include: {
            Flight: {
              include: {
                Departure_Airport: true,
                Arrival_Airport: true,
                Airway_Company: true,
              },
            },
          },
        },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe("getOne", () => {
    it("should return a ticket by ID", async () => {
      const mockTicket: ITicket = {
        id: 1,
        userId: 1,
        flightId: 1,
        operatorId: null,
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
        Flight: {
          id: 1,
          flight_number: "AB123",
          from: 1,
          to: 2,
          number_of_seats: 150,
          reserved_seats: 0,
          ticket_price: 99.99,
          flight_date: new Date(),
          operatorId: 1,
          airwayCompanyId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      };

      (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(mockTicket);

      const result = await ticketService.getOne(1);

      expect(result).toEqual(mockTicket);
      expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          Flight: {
            include: {
              Departure_Airport: true,
              Arrival_Airport: true,
              Airway_Company: true,
            },
          },
        },
      });
    });

    it("should throw an error if ticket not found", async () => {
      (prisma.ticket.findUnique as jest.Mock).mockRejectedValueOnce(
        new ApiError("Ticket not found", 404)
      );

      await expect(ticketService.getOne(999)).rejects.toThrowError(
        new ApiError("Ticket not found", 404)
      );
      expect(prisma.ticket.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
        include: {
          Flight: {
            include: {
              Departure_Airport: true,
              Arrival_Airport: true,
              Airway_Company: true,
            },
          },
        },
      });
    });
  });

  describe("cancel", () => {
    it("should successfully cancel a ticket if conditions are met", async () => {
      const flightDate = moment().add(5, "days").toDate(); 
      const ticket = {
        id: 1,
        userId: 1,
        flightId: 1,
        operatorId: null,
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
        Flight: { flight_date: flightDate },
      };

      (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);
      (prisma.ticket.update as jest.Mock).mockResolvedValue({
        ...ticket,
        canceledAt: new Date(),
      });

      const data: CancelationReason = {}; 
      await ticketService.cancel(1, 1, data);

      expect(prisma.ticket.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          canceledAt: expect.any(Date),
          Cancelation_Reason: undefined,
        },
      });
    });

    it("should throw an error if attempting to cancel less than 72 hours before the flight", async () => {
      const flightDate = moment().add(1, "day").toDate(); 
      const ticket = {
        id: 1,
        userId: 1,
        flightId: 1,
        operatorId: null,
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
        Flight: { flight_date: flightDate },
      };

      (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);

      const data: CancelationReason = {}; 
      await expect(ticketService.cancel(1, 1, data)).rejects.toThrowError(
        new ApiError(
          "You can't cancel the ticket less than 72 hours before the flight",
          400
        )
      );
    });

    it("should throw an error if the user is not authorized to cancel the ticket", async () => {
      const flightDate = moment().add(3, "days").toDate(); 
      const ticket = {
        id: 1,
        userId: 1,
        flightId: 1,
        operatorId: 2,
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
        Flight: { flight_date: flightDate },
      };

      (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);

      const data: CancelationReason = {}; 
      await expect(ticketService.cancel(1, 3, data)).rejects.toThrowError(
        new ApiError("You can't cancel other user's ticket", 403)
      );
    });

    it("should throw an error if the operator does not provide a reason for cancellation", async () => {
      const flightDate = moment().add(3, "days").toDate(); 
      const ticket = {
        id: 1,
        userId: 1,
        flightId: 1,
        operatorId: 2,
        seats: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        canceledAt: null,
        Flight: { flight_date: flightDate },
      };

      (prisma.ticket.findUnique as jest.Mock).mockResolvedValue(ticket);

      const data: CancelationReason = { reason: undefined }; 
      await expect(ticketService.cancel(1, 2, data)).rejects.toThrowError(
        new ApiError("You have to provide a reason for the cancellation", 400)
      );
    });
  });
});
