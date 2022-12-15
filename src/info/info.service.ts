import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInfoDto } from './dto/createInfo.dto';

@Injectable()
export class InfoService {
  constructor(private prismaService: PrismaService) {}

  async create(createinfoDto: CreateInfoDto, userId: number) {
    try {
      const { birthYear, gender, interestGoods } = createinfoDto;
      return await this.prismaService.info.create({
        data: { userId, birthYear, gender, interestGoods },
      });
    } catch (e) {
      return new InternalServerErrorException();
    }
  }

  async verify(userId) {
    const existInfo = await this.prismaService.info.findUnique({
      where: { userId },
    });
    console.log('check: ', existInfo);
    if (existInfo) {
      return true;
    } else {
      return false;
    }
  }
}
