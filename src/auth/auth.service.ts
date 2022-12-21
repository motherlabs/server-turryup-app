import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import hashed from 'src/utils/hashed';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  makeSignitureForSMS = (): string => {
    console.log(
      process.env.NAVER_SECRET_KEY,
      process.env.NAVER_SERVICE_ID,
      process.env.NAVER_ACCESS_KEY,
    );
    const message = [];
    const hmac = crypto.createHmac('SHA256', process.env.NAVER_SECRET_KEY);
    const space = ' ';
    const newLine = '\n';
    const method = 'POST';
    const timeStamp = Date.now().toString();

    message.push(method);
    message.push(space);
    message.push(`/sms/v2/services/${process.env.NAVER_SERVICE_ID}/messages`);
    message.push(newLine);
    message.push(timeStamp);
    message.push(newLine);
    message.push(process.env.NAVER_ACCESS_KEY);
    // 시그니쳐 생성
    const signiture = hmac.update(message.join('')).digest('base64');
    // string 으로 반환
    return signiture.toString();
  };

  makeRand6Num = (): string => {
    const randNum = Math.floor(Math.random() * 1000000);
    return randNum.toString().padStart(6, '0');
  };

  getAccessToken = (id: number): string => {
    return this.jwtService.sign(
      { id },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: +process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    );
  };

  async existUser(phoneNumber: string) {
    const existUser = await this.prismaService.user.findUnique({
      where: { phoneNumber },
    });
    if (existUser) {
      const accessToken = await this.getAccessToken(existUser.id);

      const user = {
        id: existUser.id,
        phoneNumber: existUser.phoneNumber,
        state: existUser.state,
        role: existUser.role,
        fcmToken: existUser.fcmToken,
        uniqueCode: existUser.uniqueCode,
      };
      return {
        accessToken,
        user,
      };
    } else {
      return null;
    }
  }

  async sendSMS(phoneNumber: string) {
    const authNumber: string = this.makeRand6Num();

    const body = {
      body: `[덕템 플랫폼] 인증번호 [${authNumber}]를 입력해주세요.`,
      sendNo: `${process.env.HOST_PHONE_NUMBER}`,
      from: `${process.env.HOST_PHONE_NUMBER}`,
      recipientList: [
        {
          recipientNo: `${phoneNumber}`,
        },
      ],
    };

    const options = {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Secret-Key': process.env.NHN_SECRET_KEY,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${process.env.NHN_APP_KEY}/sender/sms`,
          body,
          options,
        ),
      );
      if (response.data.body.data.statusCode === '2') {
        return authNumber;
      }
    } catch (err) {
      console.error(err.response.data);
      throw new InternalServerErrorException();
    }
  }

  async signUp(phoneNumber: string) {
    try {
      const hashCode = await hashed.generate(phoneNumber);
      await this.prismaService.user.create({
        data: {
          uniqueCode: hashCode,
          phoneNumber,
        },
      });
      const existUser = await this.existUser(phoneNumber);
      return {
        method: 'signUp',
        uniqueCode: hashCode,
        accessToken: existUser.accessToken,
        user: existUser.user,
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(phoneNumber: string) {
    const existUser = await this.existUser(phoneNumber);
    if (existUser) {
      return {
        method: 'signIn',
        uniqueCode: existUser.user.uniqueCode,
        accessToken: existUser.accessToken,
        user: existUser.user,
      };
    } else {
      return this.signUp(phoneNumber);
    }
  }

  async isUniqueCodeMetches(uniqueCode: string) {
    const existUser = await this.prismaService.user.findUnique({
      where: { uniqueCode },
    });
    if (existUser) {
      const accessToken = await this.getAccessToken(existUser.id);
      return {
        accessToken,
      };
    } else {
      return new NotFoundException();
    }
  }
}
