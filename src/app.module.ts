import { Module } from '@nestjs/common';
import { PaginationModule } from './modules/pagination.module';

@Module({
  imports: [PaginationModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
