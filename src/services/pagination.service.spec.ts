import { Test, TestingModule } from '@nestjs/testing';
import { PaginationService } from './pagination.service';
import { HttpException } from '@nestjs/common';

describe('PaginationService', () => {
  let service: PaginationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaginationService],
    }).compile();

    service = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should throw an error if currentPage or numberPages < 1', async () => {
    try {
      await service.validate(0, 1);
      await service.validate(1, 0);
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
      await service.validate(currentPage, numberPages);
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
      await service.validate(currentPage, numberPages);
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect(e.message).toBe('Invalid currentPage (currentPage > numberPages)');
    }
  });

  it('should be equal (startPosition = 1, endPosition = 5)', async () => {
    const currentPage = 1;
    const numberPages = 10;
    const result = { startPosition: 1, endPosition: 5 };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it(' if (currentPage === 1 || currentPage === 2) ', async () => {
    const startPosition = 1;
    let currentPage;
    let numberPages;
    let result;

    currentPage = 1;
    numberPages = 10;
    result = { startPosition: 1, endPosition: 5 };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);

    currentPage = 2;
    numberPages = 10;
    result = {
      startPosition: 1,
      endPosition:
        startPosition + 4 > numberPages ? numberPages : startPosition + 4,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);

    currentPage = 2;
    numberPages = 3;
    result = {
      startPosition: 1,
      endPosition:
        startPosition + 4 > numberPages ? numberPages : startPosition + 4,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it(' if (currentPage === 3) ', async () => {
    const currentPage = 3;
    const numberPages = 10;
    const result = {
      startPosition: currentPage - 2,
      endPosition:
        currentPage + 2 <= numberPages ? currentPage + 2 : numberPages,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it('if (currentPage > 3 && currentPage <= numberPages - 2)', async () => {
    const currentPage = 8;
    const numberPages = 10;
    const result = {
      startPosition: currentPage - 2,
      endPosition: currentPage + 2,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it('if (currentPage === numberPages - 1)', async () => {
    const currentPage = 9;
    const numberPages = 10;
    const result = {
      startPosition: currentPage - 3 < 1 ? 1 : currentPage - 3,
      endPosition: currentPage + 1,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it('if (currentPage === numberPages)', async () => {
    const currentPage = 5;
    const numberPages = 5;
    const result = {
      startPosition: currentPage - 4 < 1 ? 1 : currentPage - 4,
      endPosition: numberPages,
    };
    expect(
      await service.calculationStartEndPosition(currentPage, numberPages),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 1, numberPages = 10)', async () => {
    const currentPage = 1;
    const numberPages = 10;
    const result = ['**1**', '2', '3', '4', '5', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 2, numberPages = 10)', async () => {
    const currentPage = 2;
    const numberPages = 10;
    const result = ['1', '**2**', '3', '4', '5', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 3, numberPages = 10)', async () => {
    const currentPage = 3;
    const numberPages = 10;
    const result = ['1', '2', '**3**', '4', '5', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 4, numberPages = 10)', async () => {
    const currentPage = 4;
    const numberPages = 10;
    const result = ['...', '2', '3', '**4**', '5', '6', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 5, numberPages = 10)', async () => {
    const currentPage = 5;
    const numberPages = 10;
    const result = ['...', '3', '4', '**5**', '6', '7', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 6, numberPages = 10)', async () => {
    const currentPage = 6;
    const numberPages = 10;
    const result = ['...', '4', '5', '**6**', '7', '8', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 7, numberPages = 10)', async () => {
    const currentPage = 7;
    const numberPages = 10;
    const result = ['...', '5', '6', '**7**', '8', '9', '...'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 8, numberPages = 10)', async () => {
    const currentPage = 8;
    const numberPages = 10;
    const result = ['...', '6', '7', '**8**', '9', '10'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 9, numberPages = 10)', async () => {
    const currentPage = 9;
    const numberPages = 10;
    const result = ['...', '6', '7', '8', '**9**', '10'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });

  it('Result Array (currentPage = 10, numberPages = 10)', async () => {
    const currentPage = 10;
    const numberPages = 10;
    const result = ['...', '6', '7', '8', '9', '**10**'];
    const positions = await service.calculationStartEndPosition(
      currentPage,
      numberPages,
    );
    expect(
      await service.setItemsOnArray(
        currentPage,
        numberPages,
        positions.startPosition,
        positions.endPosition,
      ),
    ).toEqual(result);
  });
});
