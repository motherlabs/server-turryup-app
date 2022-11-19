import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import admin from 'firebase-admin';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async monthlyOrdersByStore(userId: number) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const monthly = new Date(year, month, 1, 0, 0, 0, 0);

    return await this.prismaService.store.findUnique({
      where: { userId },
      include: {
        Order: { where: { createdAt: { gt: monthly }, status: '픽업 완료' } },
      },
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
      targetId,
      goodsName,
    } = createOrderDto;
    try {
      await this.prismaService.order.create({
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
      const targetUser = await this.prismaService.user.findUnique({
        where: { id: targetId },
      });
      if (targetUser.fcmToken) {
        admin.messaging().send({
          token: targetUser.fcmToken,
          notification: {
            title: '주문이 들어왔습니다.',
            body: `상품 ${goodsName}\n수량 ${quantity}개`,
          },
          android: {
            notification: {
              channelId: 'partner-order',
              // vibrateTimingsMillis: [0, 500, 500, 500],
              priority: 'high',
              defaultSound: true,
              defaultVibrateTimings: false,
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
                category: 'partner-order',
              },
            },
          },
          data: {},
        });
      }
    } catch (e) {
      console.log(e);
    }
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
