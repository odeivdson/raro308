import { Module } from '@nestjs/common';
import { PaginationService } from '../services/pagination.service';
import { PaginationController } from '../controllers/pagination.controller';

@Module({
  controllers: [PaginationController],
  providers: [PaginationService],
})
export class PaginationModule {}
