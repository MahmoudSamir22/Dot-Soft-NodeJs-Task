import airwayCompanyService from '../../src/services/airwayCompanyService';
import prisma from '../../prisma/client';
import { paginate } from '../../src/utils/pagination';
import ApiError from '../../src/utils/ApiError';
import { CreateAirwayCompany, AirwayCompanyQuery, UpdateAirwayCompany } from '../../src/types/airwayCompanyType';
import IAirway_Company from '../../src/types/airwayCompanyType';

jest.mock('../../prisma/client', () => ({
  airway_Company: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/utils/pagination', () => ({
  paginate: jest.fn(),
}));

describe('AirwayCompanyService', () => {
  describe('create', () => {
    it('should create an airway company', async () => {
      const companyData: CreateAirwayCompany = {
        name: { en: 'Delta Airlines', ar: 'دلتا إيرلاينز', fr: 'Delta Airlines' },
      };

      (prisma.airway_Company.create as jest.Mock).mockResolvedValue({
        id: expect.any(Number),
        ...companyData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await airwayCompanyService.create(companyData);

      expect(result).toHaveProperty('id', expect.any(Number));
      expect(prisma.airway_Company.create).toHaveBeenCalledWith({ data: companyData });
    });
  });

  describe('getAll', () => {
    it('should paginate airway companies', async () => {
      const query: AirwayCompanyQuery = { page: 1, limit: 10, name: 'Delta' };

      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);

      const result = await airwayCompanyService.getAll(query);

      expect(mockPaginate).toHaveBeenCalledWith(
        'airway_Company',
        { where: { deletedAt: null } },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe('getOne', () => {
    it('should return an airway company by ID', async () => {
      const mockCompany: IAirway_Company = {
        id: 1,
        name: { en: 'Delta Airlines', ar: 'دلتا إيرلاينز', fr: 'Delta Airlines' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      (prisma.airway_Company.findUnique as jest.Mock).mockResolvedValue(mockCompany);

      const result = await airwayCompanyService.getOne(1);

      expect(result).toEqual(mockCompany);
      expect(prisma.airway_Company.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw an error if airway company not found', async () => {
      (prisma.airway_Company.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(airwayCompanyService.getOne(999)).rejects.toThrowError(
        new ApiError('Airway company not found', 404)
      );
      expect(prisma.airway_Company.findUnique).toHaveBeenCalledWith({ where: { id: 999 } });
    });
  });

  describe('update', () => {
    it('should update an airway company', async () => {
      const mockCompany: IAirway_Company = {
        id: 1,
        name: { en: 'Delta Airlines', ar: 'دلتا إيرلاينز', fr: 'Delta Airlines' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(airwayCompanyService, 'getOne').mockResolvedValue(mockCompany);
      (prisma.airway_Company.update as jest.Mock).mockResolvedValue({
        ...mockCompany,
        name: { en: 'Updated Delta Airlines', ar: 'دلتا إيرلاينز المحدثة', fr: 'Delta Airlines mis à jour' },
      });

      const result = await airwayCompanyService.update(1, {
        name: { en: 'Updated Delta Airlines', ar: 'دلتا إيرلاينز المحدثة', fr: 'Delta Airlines mis à jour' },
      });

      expect(result).toEqual({
        ...mockCompany,
        name: { en: 'Updated Delta Airlines', ar: 'دلتا إيرلاينز المحدثة', fr: 'Delta Airlines mis à jour' },
      });
      expect(prisma.airway_Company.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: { en: 'Updated Delta Airlines', ar: 'دلتا إيرلاينز المحدثة', fr: 'Delta Airlines mis à jour' } },
      });
    });
  });

  describe('delete', () => {
    it('should mark an airway company as deleted', async () => {
      const mockCompany: IAirway_Company = {
        id: 1,
        name: { en: 'Delta Airlines', ar: 'دلتا إيرلاينز', fr: 'Delta Airlines' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      jest.spyOn(airwayCompanyService, 'getOne').mockResolvedValue(mockCompany);
      (prisma.airway_Company.update as jest.Mock).mockResolvedValue({
        ...mockCompany,
        deletedAt: new Date(),
      });

      await airwayCompanyService.delete(1);

      expect(prisma.airway_Company.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
