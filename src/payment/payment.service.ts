import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
// import * as moment from 'moment';
// import 'moment/locale/ko';

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

  async monthlyPayments(userId: number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthly = new Date(year, month, 1, 0, 0, 0, 0);

    return await this.prismaService.payment.findMany({
      where: { userId, createdAt: { gt: monthly } },
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
