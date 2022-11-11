import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UploadService } from 'src/upload/upload.service';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';

@Module({
  controllers: [GoodsController],
  providers: [GoodsService, PrismaService, UploadService],
})
export class GoodsModule {}
