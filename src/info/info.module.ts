import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { InfoController } from './info.controller';
import { InfoService } from './info.service';

@Module({
  controllers: [InfoController],
  providers: [InfoService, PrismaService],
})
export class InfoModule {}
