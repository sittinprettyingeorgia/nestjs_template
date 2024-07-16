import BaseController from '@controller/base';
import { AuthService } from '@util/authorization';
import { BaseDaoService } from '@dao/base';
import { CrudRequest, GetManyDefaultResponse } from '@nestjsx/crud';
import Base from '@model/base';
import { Repository } from 'typeorm';

jest.mock('@util/authorization');
jest.mock('@dao/base');
jest.mock('typeorm');

describe('BaseController', () => {
  let controller: BaseController;
  let mockService: jest.Mocked<BaseDaoService<Base>>;
  let mockAuth: jest.Mocked<AuthService>;
  let mockRepo: jest.Mocked<Repository<Base>>;
  let mockUser: Base;
  let mockRequest: CrudRequest;

  beforeEach(() => {
    mockRepo = {} as jest.Mocked<Repository<Base>>;
    mockService = new BaseDaoService(mockRepo) as jest.Mocked<
      BaseDaoService<Base>
    >;
    mockAuth = new AuthService() as jest.Mocked<AuthService>;
    mockUser = new Base('write', 'critical');
    mockRequest = {} as CrudRequest;

    mockAuth.getAuthUser.mockReturnValue(mockUser);

    controller = new BaseController(mockService, mockAuth);
  });

  describe('getMany', () => {
    it('should call getMany after authorization check', async () => {
      const mockResponse: GetManyDefaultResponse<Base> = {
        data: [new Base('write', 'critical')],
        count: 1,
        total: 1,
        page: 1,
        pageCount: 1,
      };
      mockService.getMany = jest.fn().mockResolvedValue(mockResponse);

      const result = await controller.getMany(mockRequest);

      expect(mockAuth.getAuthUser).toHaveBeenCalled();
      expect(mockService.getMany).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getOne', () => {
    it('should call getOne after authorization check', async () => {
      const mockResponse = new Base('read', 'private');
      mockService.getOne = jest.fn().mockResolvedValue(mockResponse);

      const result = await controller.getOne(mockRequest);

      expect(mockAuth.getAuthUser).toHaveBeenCalled();
      expect(mockService.getOne).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  //   describe('createOne', () => {
  //     it('should call createOne after authorization check', async () => {
  //       const mockDto = new Base('read', 'private');
  //       const mockResponse = new Base('read', 'private');
  //       mockService.createOne = jest.fn().mockResolvedValue(mockResponse);

  //       const result = await controller.createOne(mockRequest, mockDto);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.createOne).toHaveBeenCalledWith(mockRequest, mockDto);
  //       expect(result).toEqual(mockResponse);
  //     });
  //   });

  //   describe('createMany', () => {
  //     it('should call createMany after authorization check', async () => {
  //       const mockDto = { bulk: [new Base('read', 'private')] };
  //       const mockResponse = [new Base('read', 'private')];
  //       mockService.createMany = jest.fn().mockResolvedValue(mockResponse);

  //       const result = await controller.createMany(mockRequest, mockDto);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.createMany).toHaveBeenCalledWith(mockRequest, mockDto);
  //       expect(result).toEqual(mockResponse);
  //     });
  //   });

  //   describe('updateOne', () => {
  //     it('should call updateOne after authorization check', async () => {
  //       const mockDto = new Base('read', 'private');
  //       const mockResponse = new Base('read', 'private');
  //       mockService.updateOne = jest.fn().mockResolvedValue(mockResponse);

  //       const result = await controller.updateOne(mockRequest, mockDto);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.updateOne).toHaveBeenCalledWith(mockRequest, mockDto);
  //       expect(result).toEqual(mockResponse);
  //     });
  //   });

  //   describe('replaceOne', () => {
  //     it('should call replaceOne after authorization check', async () => {
  //       const mockDto = new Base('read', 'private');
  //       const mockResponse = new Base('read', 'private');
  //       mockService.replaceOne = jest.fn().mockResolvedValue(mockResponse);

  //       const result = await controller.replaceOne(mockRequest, mockDto);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.replaceOne).toHaveBeenCalledWith(mockRequest, mockDto);
  //       expect(result).toEqual(mockResponse);
  //     });
  //   });

  //   describe('deleteOne', () => {
  //     it('should call deleteOne after authorization check', async () => {
  //       mockService.deleteOne = jest.fn().mockResolvedValue(undefined);

  //       await controller.deleteOne(mockRequest);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.deleteOne).toHaveBeenCalledWith(mockRequest);
  //     });
  //   });

  //   describe('recoverOne', () => {
  //     it('should call recoverOne after authorization check', async () => {
  //       mockService.recoverOne = jest.fn().mockResolvedValue(undefined);

  //       await controller.recoverOne(mockRequest);

  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.recoverOne).toHaveBeenCalledWith(mockRequest);
  //     });
  //   });

  //   describe('error handling', () => {
  //     it('should handle errors thrown by the service', async () => {
  //       const errorMessage = 'Service error';
  //       mockService.getMany = jest
  //         .fn()
  //         .mockRejectedValue(new Error(errorMessage));

  //       await expect(controller.getMany(mockRequest)).rejects.toThrow(
  //         errorMessage,
  //       );
  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //       expect(mockService.getMany).toHaveBeenCalledWith(mockRequest);
  //     });

  //     it('should throw an error if willAllowAccessTo fails', async () => {
  //       const errorMessage = 'Access denied';
  //       jest.spyOn(mockUser, 'willAllowAccessTo').mockImplementation(() => {
  //         throw new Error(errorMessage);
  //       });

  //       await expect(controller.getMany(mockRequest)).rejects.toThrow(
  //         errorMessage,
  //       );
  //       expect(mockAuth.getAuthUser).toHaveBeenCalled();
  //     });
  //   });
});
