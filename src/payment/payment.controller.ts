import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { PaymentService } from './payment.service';

@ApiTags('결제 API')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '결제 등록' })
  async create(@Body() createPaymentDto: CreatePaymentDto, @Req() req) {
    return this.paymentService.create(createPaymentDto, req.user.id);
  }

  @Get('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '결제 리스트' })
  async findAll(@Req() req) {
    return this.paymentService.findAll(req.user.id);
  }

  @Get('/monthly')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '월간 결제내역' })
  async monthlyPayments(@Req() req) {
    const { id } = req.user;
    return this.paymentService.monthlyPayments(id);
  }

  @Post('/cancel')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiBody({
    type: 'opject',
    schema: {
      properties: {
        reason: {
          type: 'string',
          nullable: false,
        },
        orderNumber: {
          type: 'string',
          nullable: false,
        },
        cancelAmount: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  @ApiOperation({ summary: '결제 취소' })
  async cancel(@Body() body, @Req() req) {
    try {
      const { id } = req.user;
      const { reason, orderNumber, cancelAmount } = body;
      const idLength = +id.toString().length;
      const matchingId = +orderNumber.slice(14, 14 + idLength);

      if (id === matchingId) {
        const merchant_uid = orderNumber.slice(0, 14 + idLength);
        return this.paymentService.cancel(
          merchant_uid,
          reason,
          cancelAmount,
          orderNumber,
        );
      } else {
        return new BadRequestException();
      }
    } catch (e) {
      console.error(e);
      return new InternalServerErrorException();
    }
  }
}
