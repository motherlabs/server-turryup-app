import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { jwtGuard } from './jwt.guard';

@ApiTags('인증 API')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '토큰인증' })
  async auth(@Res() res, @Req() req) {
    console.log('at');

    res.status(HttpStatus.OK).send({
      id: req.user.id,
      phoneNumber: req.user.phoneNumber,
      state: req.user.state,
      role: req.user.role,
      fcmToken: req.user.fcmToken,
    });
  }

  @Post('/sms')
  @ApiOperation({ summary: 'sms인증' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
        },
      },
    },
  })
  async sendSMS(@Body() body) {
    const { phoneNumber } = body;
    console.log('sendSNS: ', phoneNumber);
    return this.authService.sendSMS(phoneNumber);
  }

  @Post('/signIn')
  @ApiOperation({ summary: '로그인' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        phoneNumber: {
          type: 'string',
        },
      },
    },
  })
  async signIn(@Body() body) {
    const { phoneNumber } = body;
    return this.authService.signIn(phoneNumber);
  }

  @Post('/refresh')
  @ApiOperation({ summary: '유니크코드 매치 인증' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        uniqueCode: {
          type: 'string',
        },
      },
    },
  })
  async isUniqueCodeMatches(@Body() body) {
    console.log('rt');
    const { uniqueCode } = body;
    return this.authService.isUniqueCodeMetches(uniqueCode);
  }
}
