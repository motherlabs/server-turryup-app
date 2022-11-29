import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskService } from './task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TaskService, PrismaService],
})
export class BatchModule {}
