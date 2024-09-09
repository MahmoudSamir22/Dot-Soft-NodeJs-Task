import flightService from '../../src/services/flightService';
import prisma from '../../prisma/client';
import ApiError from '../../src/utils/ApiError';
import { paginate } from '../../src/utils/pagination';
import { CreateFlight, FlightQuery, UpdateFlight } from '../../src/types/flightType';
import IFlight from '../../src/types/flightType';

jest.mock('../../prisma/client', () => ({
  flight: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/utils/pagination', () => ({
  paginate: jest.fn(),
}));

describe('FlightService', () => {
  describe('create', () => {
    it('should create a flight', async () => {
      const flightData: CreateFlight = {
        flight_number: 'AB123',
        from: 1,
        to: 2,
        number_of_seats: 150,
        ticket_price: 99.99,
        flight_date: new Date(Date.now() + 86400000), 
        operatorId: 1,
        airwayCompanyId: 1,
      };

      (prisma.flight.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.flight.create as jest.Mock).mockResolvedValue({
        id: expect.any(Number),
        ...flightData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await flightService.create(flightData);

      expect(result).toHaveProperty('id', expect.any(Number));
      expect(prisma.flight.create).toHaveBeenCalledWith({ data: flightData });
    });

    it('should throw an error if flight number already exists', async () => {
      (prisma.flight.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

      const flightData: CreateFlight = {
        flight_number: 'AB123',
        from: 1,
        to: 2,
        number_of_seats: 150,
        ticket_price: 99.99,
        flight_date: new Date(Date.now() + 86400000), 
        operatorId: 1,
        airwayCompanyId: 1,
      };

      await expect(flightService.create(flightData)).rejects.toThrowError(
        new ApiError('Flight with same number already exists', 400)
      );
      expect(prisma.flight.findUnique).toHaveBeenCalledWith({ where: { flight_number: 'AB123' } });
    });

    it('should throw an error if flight date is in the past', async () => {
      (prisma.flight.findUnique as jest.Mock).mockResolvedValue(null);

      const flightData: CreateFlight = {
        flight_number: 'AB123',
        from: 1,
        to: 2,
        number_of_seats: 150,
        ticket_price: 99.99,
        flight_date: new Date(Date.now() - 86400000), 
        operatorId: 1,
        airwayCompanyId: 1,
      };

      await expect(flightService.create(flightData)).rejects.toThrowError(
        new ApiError('Flight date must be in the future', 400)
      );
    });
  });

  describe('getAll', () => {
    it('should paginate flights', async () => {
      const query: FlightQuery = { page: 1, limit: 10, flight_number: 'AB123' };

      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);

      const result = await flightService.getAll(query);

      expect(mockPaginate).toHaveBeenCalledWith(
        'flight',
        { where: { deletedAt: null } },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe('getOne', () => {
    it('should return a flight by ID', async () => {
      const mockFlight: IFlight = {
        id: 1,
        flight_number: 'AB123',
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
      };

      (prisma.flight.findUnique as jest.Mock).mockResolvedValue(mockFlight);

      const result = await flightService.getOne(1);

      expect(result).toEqual(mockFlight);
      expect(prisma.flight.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if flight not found', async () => {
      (prisma.flight.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(flightService.getOne(999)).rejects.toThrowError(
        new ApiError('Flight not found', 404)
      );
      expect(prisma.flight.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('update', () => {
    it('should update a flight', async () => {
      const mockFlight: IFlight = {
        id: 1,
        flight_number: 'AB123',
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
      };

      jest.spyOn(flightService, 'getOne').mockResolvedValue(mockFlight);
      (prisma.flight.update as jest.Mock).mockResolvedValue({
        ...mockFlight,
        flight_number: 'CD456',
      });

      const result = await flightService.update(1, { flight_number: 'CD456' });

      expect(result).toEqual({ ...mockFlight, flight_number: 'CD456' });
      expect(prisma.flight.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { flight_number: 'CD456' },
      });
    });

    it('should throw an error if flight number already exists during update', async () => {
      jest.spyOn(flightService, 'getOne').mockResolvedValue({
        id: 1,
        flight_number: 'AB123',
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
      });

      (prisma.flight.findUnique as jest.Mock).mockResolvedValue({
        id: 2,
        flight_number: 'CD456',
      });

      await expect(flightService.update(1, { flight_number: 'CD456' })).rejects.toThrowError(
        new ApiError('Flight with same number already exists', 400)
      );
    });

    it('should throw an error if flight date is in the past during update', async () => {
      jest.spyOn(flightService, 'getOne').mockResolvedValue({
        id: 1,
        flight_number: 'AB123',
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
      });

      await expect(flightService.update(1, { flight_date: new Date(Date.now() - 86400000) })).rejects.toThrowError(
        new ApiError('Flight date must be in the future', 400)
      );
    });
  });

  describe('delete', () => {
    it('should mark a flight as deleted', async () => {
      const mockFlight: IFlight = {
        id: 1,
        flight_number: 'AB123',
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
      };

      jest.spyOn(flightService, 'getOne').mockResolvedValue(mockFlight);
      (prisma.flight.update as jest.Mock).mockResolvedValue({
        ...mockFlight,
        deletedAt: new Date(),
      });

      await flightService.delete(1);

      expect(prisma.flight.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw an error if flight not found during delete', async () => {
        jest.spyOn(flightService, 'getOne').mockRejectedValueOnce(new ApiError('Flight not found', 404));
  
        await expect(flightService.delete(999)).rejects.toThrowError(
          new ApiError('Flight not found', 404)
        );
      });
  });
});
