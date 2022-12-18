import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BasketService {
  constructor(private prismaService: PrismaService) {}

  async findAll(userId: number) {
    return await this.prismaService.basket.findMany({
      where: { userId },
      include: { goods: { include: { GoodsImage: true, store: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  private findOne(basketId: number) {
    return this.prismaService.basket.findUnique({
      where: { id: basketId },
      include: { goods: { include: { GoodsImage: true, store: true } } },
    });
  }

  async create(goodsId: number, userId: number, quantity: number) {
    const response = await this.prismaService.basket.create({
      data: {
        userId,
        goodsId,
        quantity,
      },
    });
    if (response.id) {
      return await this.findOne(response.id);
    }
  }

  async deleteAll(basketIdList: number[], userId: number) {
    return await this.prismaService.basket.deleteMany({
      where: { userId, id: { in: basketIdList } },
    });
  }

  async updateQuantity(basketId: number, quantity: number) {
    return await this.prismaService.basket.update({
      where: { id: basketId },
      data: { quantity },
    });
  }
}
