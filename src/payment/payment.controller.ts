import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
