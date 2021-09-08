import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { PaginationService } from '../services/pagination.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/v1/pagination')
@ApiTags('Paginação')
export class PaginationController {
  constructor(private readonly paginationService: PaginationService) {}

  @Get()
  @ApiOperation({ summary: 'Rota de paginação' })
  @ApiResponse({ status: 200, description: 'successful operation' })
  async findPage(
    @Query('currentPage', ParseIntPipe) currentPage: number,
    @Query('numberPages', ParseIntPipe) numberPages: number,
  ) {
    return await this.paginationService.findPage(currentPage, numberPages);
  }
}
