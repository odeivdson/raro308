import { Test, TestingModule } from '@nestjs/testing';
import { PaginationController } from './pagination.controller';
import { PaginationService } from '../services/pagination.service';
import { HttpException } from '@nestjs/common';

describe('PaginationController', () => {
  let controller: PaginationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaginationController],
      providers: [PaginationService],
    }).compile();

    controller = module.get<PaginationController>(PaginationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw an error if currentPage or numberPages < 1', async () => {
    try {
      await controller.findPage(0, 1);
      await controller.findPage(1, 0);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe(
        'Invalid currentPage or numberPages (values must be greater than 0)',
      );
    }
  });

  it('should throw an error if currentPage or numberPages is empty', async () => {
    let currentPage;
    let numberPages;
    try {
      await controller.findPage(currentPage, numberPages);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe(
        'Invalid currentPage or numberPages (is required)',
      );
    }
  });

  it('should throw an error if currentPage > numberPages', async () => {
    const currentPage = 2;
    const numberPages = 1;
    try {
      await controller.findPage(currentPage, numberPages);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe('Invalid currentPage (currentPage > numberPages)');
    }
  });
});
