import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/createPayment.dto';

@Injectable()
export class PaymentService {
  constructor(private prismaService: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const { amount, method } = createPaymentDto;
    return await this.prismaService.payment.create({
      data: { amount, method, userId },
    });
  }

  async findAll(userId: number) {
    return await this.prismaService.payment.findMany({
      where: { userId },
      include: {
        Order: {
          include: {
            goods: {
              include: { GoodsImage: true, store: true },
            },
          },
        },
      },
      orderBy: { id: 'desc' },
    });
  }
}
