import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { UploadModule } from './upload/upload.module';
import { OrderModule } from './order/order.module';
import { OrderService } from './order/order.service';
import { PaymentModule } from './payment/payment.module';
import { PaymentService } from './payment/payment.service';
import { GoodsModule } from './goods/goods.module';
import { CategoryModule } from './category/category.module';
import { StoreModule } from './store/store.module';
import { StoreService } from './store/store.service';
import { BasketModule } from './basket/basket.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '../static'),
    }),
    AuthModule,
    UserModule,
    AddressModule,
    StoreModule,
    CategoryModule,
    GoodsModule,
    PaymentModule,
    OrderModule,
    UploadModule,
    BasketModule,
    BatchModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    StoreService,
    PaymentService,
    OrderService,
  ],
})
export class AppModule {}
