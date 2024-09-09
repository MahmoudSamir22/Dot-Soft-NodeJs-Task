import airPortService from '../../src/services/airPortService';
import { paginate } from '../../src/utils/pagination';
import prisma from '../../prisma/client';
import ApiError from '../../src/utils/ApiError';
import IAirPort, { CreateAirPort, AirPortQuery } from '../../src/types/airPortType';

jest.mock('../../prisma/client', () => ({
  air_Port: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/utils/pagination', () => ({
  paginate: jest.fn(),
}));

describe('AirPortService', () => {
  describe('create', () => {
    it('should create an airport', async () => {
      const airportData: CreateAirPort = {
        name: { en: 'JFK Airport', ar: 'مطار JFK', fr: 'Aéroport JFK' },
        country: { en: 'USA', ar: 'الولايات المتحدة', fr: 'États-Unis' },
        city: { en: 'New York', ar: 'نيويورك', fr: 'New York' },
      };

      (prisma.air_Port.create as jest.Mock).mockResolvedValue({
        id: expect.any(Number),
        ...airportData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await airPortService.create(airportData);

      expect(result).toHaveProperty('id', expect.any(Number));
      expect(prisma.air_Port.create).toHaveBeenCalledWith({ data: airportData });
    });
  });

  describe('getAll', () => {
    it('should paginate airports', async () => {
      const query: AirPortQuery = { page: 1, limit: 10, name: 'JFK' };

      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);

      const result = await airPortService.getAll(query);

      expect(mockPaginate).toHaveBeenCalledWith(
        'air_Port',
        { where: { deletedAt: null } },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe('getOne', () => {
    it('should return an airport by ID', async () => {
      const mockAirPort: IAirPort = {
        id: 1,
        name: { en: 'JFK Airport', ar: 'مطار JFK', fr: 'Aéroport JFK' },
        country: { en: 'USA', ar: 'الولايات المتحدة', fr: 'États-Unis' },
        city: { en: 'New York', ar: 'نيويورك', fr: 'New York' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (prisma.air_Port.findUnique as jest.Mock).mockResolvedValue(mockAirPort);

      const result = await airPortService.getOne(1);

      expect(result).toEqual(mockAirPort);
      expect(prisma.air_Port.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw an error if airport not found', async () => {
      (prisma.air_Port.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(airPortService.getOne(999)).rejects.toThrowError(
        new ApiError('airPort not found', 404)
      );
      expect(prisma.air_Port.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('update', () => {
    it('should update an airport', async () => {
      const mockAirPort: IAirPort = {
        id: 1,
        name: { en: 'JFK Airport', ar: 'مطار JFK', fr: 'Aéroport JFK' },
        country: { en: 'USA', ar: 'الولايات المتحدة', fr: 'États-Unis' },
        city: { en: 'New York', ar: 'نيويورك', fr: 'New York' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(airPortService, 'getOne').mockResolvedValue(mockAirPort);
      (prisma.air_Port.update as jest.Mock).mockResolvedValue({
        ...mockAirPort,
        name: { en: 'Updated Airport', ar: 'مطار محدث', fr: 'Aéroport mis à jour' },
      });

      const result = await airPortService.update(1, {
        name: { en: 'Updated Airport', ar: 'مطار محدث', fr: 'Aéroport mis à jour' },
      });

      expect(result).toEqual({
        ...mockAirPort,
        name: { en: 'Updated Airport', ar: 'مطار محدث', fr: 'Aéroport mis à jour' },
      });
      expect(prisma.air_Port.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: { en: 'Updated Airport', ar: 'مطار محدث', fr: 'Aéroport mis à jour' } },
      });
    });
  });

  describe('delete', () => {
    it('should mark an airport as deleted', async () => {
      const mockAirPort: IAirPort = {
        id: 1,
        name: { en: 'JFK Airport', ar: 'مطار JFK', fr: 'Aéroport JFK' },
        country: { en: 'USA', ar: 'الولايات المتحدة', fr: 'États-Unis' },
        city: { en: 'New York', ar: 'نيويورك', fr: 'New York' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(airPortService, 'getOne').mockResolvedValue(mockAirPort);
      (prisma.air_Port.update as jest.Mock).mockResolvedValue({
        ...mockAirPort,
        deletedAt: new Date(),
      });

      await airPortService.delete(1);

      expect(prisma.air_Port.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
