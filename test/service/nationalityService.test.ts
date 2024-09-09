import nationalityService from '../../src/services/nationalityService';
import { paginate } from '../../src/utils/pagination';
import prisma from '../../prisma/client';
import ApiError from '../../src/utils/ApiError';
import { CreateNationality } from '../../src/types/nationalityType';

jest.mock('../../prisma/client', () => ({
  nationality: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

jest.mock('../../src/utils/pagination', () => ({
  paginate: jest.fn(),
}));

describe('NationalityService', () => {
  describe('create', () => {
    it('should create a nationality', async () => {
      const nationalityData: CreateNationality = {
        name: { en: 'English', ar: 'عربي', fr: 'Français' },
      };

      (prisma.nationality.create as jest.Mock).mockResolvedValue({
        id: expect.any(Number),
        ...nationalityData,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });
  
      
      const result = await nationalityService.create(nationalityData);
      
      
      expect(result).toHaveProperty('id', expect.any(Number));
  
      
      expect(prisma.nationality.create).toHaveBeenCalledWith({ data: nationalityData });
    });
  });

  describe('getAll', () => {
    it('should paginate nationalities', async () => {
      const query = { page: 1, limit: 10 };
  
      
      const mockPaginate = jest.fn(() =>
        Promise.resolve({
          data: [],
          total: 0,
          page: 1,
          limit: 10,
        })
      );
      (paginate as jest.Mock).mockImplementation(mockPaginate);
  
      const result = await nationalityService.getAll(query);
      expect(mockPaginate).toHaveBeenCalledWith(
        'nationality',
        { where: { deletedAt: null } },
        query.page,
        query.limit
      );
      expect(result).toEqual({ data: [], total: 0, page: 1, limit: 10 });
    });
  });

  describe('getOne', () => {
    it('should return a nationality by ID', async () => {
      const mockNationality = {
        id: 1,
        name: { en: 'English', ar: 'عربي', fr: 'Français' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
  
      
      (prisma.nationality.findUnique as jest.Mock).mockResolvedValue(mockNationality);
  
      const result = await nationalityService.getOne(1);
      expect(result).toEqual(mockNationality);
      expect(prisma.nationality.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  
    it('should throw an error if nationality not found', async () => {
      
      (prisma.nationality.findUnique as jest.Mock).mockResolvedValue(null);
  
      await expect(nationalityService.getOne(999)).rejects.toThrowError(
        new ApiError('Nationality not found', 404)
      );
      expect(prisma.nationality.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });
  });

  describe('update', () => {
    it('should update a nationality', async () => {
      const mockNationality = {
        id: 1,
        name: { en: 'English', ar: 'عربي', fr: 'Français' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
  
      
      jest.spyOn(nationalityService, 'getOne').mockResolvedValue(mockNationality);
      (prisma.nationality.update as jest.Mock).mockResolvedValue({
        ...mockNationality,
        name: { en: 'Updated', ar: 'محدث', fr: 'Mis à jour' },
      });
  
      const result = await nationalityService.update(1, {
        name: { en: 'Updated', ar: 'محدث', fr: 'Mis à jour' },
      });
  
      expect(result).toEqual({
        ...mockNationality,
        name: { en: 'Updated', ar: 'محدث', fr: 'Mis à jour' },
      });
      expect(prisma.nationality.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: { en: 'Updated', ar: 'محدث', fr: 'Mis à jour' } },
      });
    });
  });

  describe('delete', () => {
    it('should mark a nationality as deleted', async () => {
      const mockNationality = {
        id: 1,
        name: { en: 'English', ar: 'عربي', fr: 'Français' },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
  
      
      jest.spyOn(nationalityService, 'getOne').mockResolvedValue(mockNationality);
      (prisma.nationality.update as jest.Mock).mockResolvedValue({
        ...mockNationality,
        deletedAt: new Date(),
      });
  
      await nationalityService.delete(1);
      expect(prisma.nationality.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });
});
