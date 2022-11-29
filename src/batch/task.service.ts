import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';
import * as moment from 'moment';
import 'moment/locale/ko';

@Injectable()
export class TaskService {
  constructor(private prismaService: PrismaService) {}

  @Cron('0 */5 0-23 * * *', { name: 'discount' })
  async discountHandler() {
    try {
      const date = new Date();
      const ADDITIONAL_DISCOUNT01 = 5;
      const ADDITIONAL_DISCOUNT02 = 10;
      const currentHour = +moment(date).format('HH').replace('0', '');

      const goodsList = await this.prismaService.goods.findMany({
        where: {
          AND: [
            { expiryDate: new Date(moment(date).format('YYYY-MM-DD')) },
            { isAutoDiscount: 1 },
          ],
        },
      });
      if (goodsList.length > 0) {
        for await (const item of goodsList) {
          if (currentHour >= 12) {
            if (item.additionalDiscount !== ADDITIONAL_DISCOUNT02) {
              if (item.discount + ADDITIONAL_DISCOUNT02 < 100) {
                const discount = item.discount + ADDITIONAL_DISCOUNT02;
                const salePrice =
                  item.originPrice -
                  Math.floor((item.originPrice * discount) / 100);
                await this.prismaService.goods.update({
                  where: { id: item.id },
                  data: {
                    salePrice,
                    additionalDiscount: ADDITIONAL_DISCOUNT02,
                  },
                });
              }
            }
          } else {
            if (item.additionalDiscount !== ADDITIONAL_DISCOUNT01) {
              if (item.discount + ADDITIONAL_DISCOUNT01 < 100) {
                console.log(item);
                const discount = item.discount + ADDITIONAL_DISCOUNT01;
                const salePrice =
                  item.originPrice -
                  Math.floor((item.originPrice * discount) / 100);
                await this.prismaService.goods.update({
                  where: { id: item.id },
                  data: {
                    salePrice,
                    additionalDiscount: ADDITIONAL_DISCOUNT01,
                  },
                });
              }
            }
          }
        }
      }
    } catch (e) {
      console.error('discount task error: ', e);
    }
  }
}
