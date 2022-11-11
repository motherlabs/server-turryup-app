import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async findAllByStoreId(storeId: number) {
    return await this.prismaService.order.findMany({
      where: { storeId },
      include: { goods: { include: { GoodsImage: true } } },
    });
  }

  async create(createOrderDto: CreateOrderDto) {
    const {
      goodsId,
      orderNumber,
      paymentId,
      price,
      quantity,
      status,
      storeId,
    } = createOrderDto;
    return await this.prismaService.order.create({
      data: {
        paymentId,
        goodsId,
        orderNumber,
        price,
        quantity,
        status,
        storeId,
      },
    });
  }

  async updateStatus(updateOrderDto: UpdateOrderDto, orderId: number) {
    const { status } = updateOrderDto;
    return await this.prismaService.order.update({
      where: { id: orderId },
      data: {
        status,
      },
    });
  }
}
