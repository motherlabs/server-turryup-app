import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [BasketController],
  providers: [BasketService, PrismaService],
})
export class BasketModule {}
