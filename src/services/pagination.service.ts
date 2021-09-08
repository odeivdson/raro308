import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

function getPagination(currentPage, numberPages) {
  const pages = [];
  const positions = calculationStartEndPosition(currentPage, numberPages);

  pages.push(
    ...setItemsOnArray(
      currentPage,
      numberPages,
      positions.startPosition,
      positions.endPosition,
    ),
  );

  return [
    {
      id: randomUUID(),
      pagination: pages,
    },
  ];
}

function setItemsOnArray(
  currentPage: number,
  numberPages: number,
  startPosition: number,
  endPosition: number,
) {
  const pages = [];

  if (startPosition > 1 && numberPages > 5) {
    pages.push('...');
  }

  for (let item = startPosition; item <= endPosition; item++) {
    if (item !== currentPage) {
      pages.push(`${item}`);
    } else {
      pages.push(`**${item}**`);
    }
  }

  if (startPosition < numberPages - 4) {
    pages.push('...');
  }
  return pages;
}

function calculationStartEndPosition(currentPage: number, numberPages: number) {
  let startPosition = 1;
  let endPosition = 1;

  if (currentPage === 1 || currentPage === 2) {
    endPosition =
      startPosition + 4 > numberPages ? numberPages : startPosition + 4;
  }

  if (currentPage === 3) {
    startPosition = currentPage - 2;
    endPosition =
      currentPage + 2 <= numberPages ? currentPage + 2 : numberPages;
  }

  if (currentPage > 3 && currentPage <= numberPages - 2) {
    startPosition = currentPage - 2;
    endPosition = currentPage + 2;
  }

  if (currentPage === numberPages - 1) {
    startPosition = currentPage - 3 < 1 ? 1 : currentPage - 3;
    endPosition = currentPage + 1;
  }

  if (currentPage === numberPages) {
    startPosition = currentPage - 4 < 1 ? 1 : currentPage - 4;
    endPosition = numberPages;
  }

  return { startPosition, endPosition };
}

@Injectable()
export class PaginationService {
  async validate(currentPage: number, numberPages: number) {
    if (currentPage < 1 || numberPages < 1) {
      throw new HttpException(
        'Invalid currentPage or numberPages (values must be greater than 0)',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!currentPage || !numberPages) {
      throw new HttpException(
        'Invalid currentPage or numberPages (is required)',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (currentPage > numberPages) {
      throw new HttpException(
        'Invalid currentPage (currentPage > numberPages)',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findPage(currentPage: number, numberPages: number) {
    await this.validate(currentPage, numberPages);
    try {
      return getPagination(currentPage, numberPages);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Invalid data. It was not possible to perform the paging',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async calculationStartEndPosition(currentPage: number, numberPages: number) {
    await this.validate(currentPage, numberPages);
    try {
      return calculationStartEndPosition(currentPage, numberPages);
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Invalid data. It was not possible to perform the paging',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async setItemsOnArray(
    currentPage: number,
    numberPages: number,
    startPosition: number,
    endPosition: number,
  ) {
    await this.validate(currentPage, numberPages);
    try {
      return setItemsOnArray(
        currentPage,
        numberPages,
        startPosition,
        endPosition,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        'Invalid data. It was not possible to perform the paging',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
