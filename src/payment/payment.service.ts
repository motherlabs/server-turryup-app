import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
import admin from 'firebase-admin';
// import * as moment from 'moment';
// import 'moment/locale/ko';

@Injectable()
export class PaymentService {
  constructor(
    private prismaService: PrismaService,
    private httpService: HttpService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto, userId: number) {
    const { amount, method, imp_uid, merchant_uid } = createPaymentDto;
    return await this.prismaService.payment.create({
      data: { amount, method, userId, merchant_uid, imp_uid },
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
          where: {
            NOT: { status: '주문 취소' },
          },
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

  private getImportTokenHandler() {
    return lastValueFrom(
      this.httpService.post(
        `https://api.iamport.kr/users/getToken`,
        {
          imp_key: process.env.IMP_REST_API_KEY,
          imp_secret: process.env.IMP_SECRET_KEY,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    );
  }

  private importPaymentCancelHandler(
    accessToken: string,
    reason: string,
    imp_uid: string,
    amount: number,
    checksum: number,
  ) {
    return lastValueFrom(
      this.httpService.post(
        `https://api.iamport.kr/payments/cancel`,
        {
          reason,
          imp_uid,
          amount,
          checksum,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `${accessToken}`,
          },
        },
      ),
    );
  }

  async cancel(
    merchant_uid: string,
    reason: string,
    cancelRequestAmount: number,
    orderNumber: string,
  ) {
    try {
      const existPayment = await this.prismaService.payment.findUnique({
        where: {
          merchant_uid,
        },
        include: {
          Order: {
            where: { orderNumber },
            include: { goods: true },
          },

          user: true,
        },
      });
      console.log('check: ', existPayment);

      if (existPayment) {
        const accessTokenResponse = await this.getImportTokenHandler();
        const accessToken = accessTokenResponse.data.response.access_token;
        console.log('check token: ', accessToken);

        if (accessToken) {
          const cancelableAmount =
            existPayment.amount - existPayment.cancelAmount;
          console.log('cancelabbleAmount: ', cancelableAmount);

          if (cancelableAmount <= 0) {
            return new BadRequestException('이미 전액환불된 주문입니다.');
          } else {
            const cancelResponse = await this.importPaymentCancelHandler(
              accessToken,
              reason,
              existPayment.imp_uid,
              cancelRequestAmount,
              cancelableAmount,
            );

            if (cancelResponse.data.code === 0) {
              console.log('취소 응답: ', cancelResponse);
              await this.prismaService.$transaction([
                this.prismaService.order.update({
                  where: {
                    id: existPayment.Order[0].id,
                  },
                  data: { status: '주문 취소' },
                }),
                this.prismaService.payment.update({
                  where: { id: existPayment.id },
                  data: {
                    cancelAmount:
                      existPayment.cancelAmount + cancelRequestAmount,
                  },
                }),
              ]);
              if (existPayment.user.fcmToken) {
                admin.messaging().send({
                  token: existPayment.user.fcmToken,
                  notification: {
                    title: `${existPayment.user.phoneNumber.substring(
                      7,
                      11,
                    )}님, 구매하신 ${
                      existPayment.Order[0].goods.name
                    }의 재고가 소진되었습니다.`,
                    body: `자동으로 환불됩니다. 죄송합니다.`,
                  },
                  android: {
                    notification: {
                      channelId: 'user-order',
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
                        category: 'user-order',
                      },
                    },
                  },
                  data: {},
                });
              }
              return true;
            } else {
              return new BadRequestException(`${cancelResponse.data.message}`);
            }
          }
        } else {
          console.error('아임포트 엑세스 코드');
          return new InternalServerErrorException();
        }
      } else {
        return new NotFoundException('결제정보가 존재하지 않습니다.');
      }
    } catch (e) {
      console.error('error: ', e);
      return new InternalServerErrorException();
    }
  }
}
