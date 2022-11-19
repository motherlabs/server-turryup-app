import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { OrderService } from './order.service';

@ApiTags('주문 API')
@Controller('order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('/monthly')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '월간 판매내역' })
  async monthlyOrders(@Req() req) {
    const { id } = req.user;
    return this.orderService.monthlyOrdersByStore(id);
  }

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiOperation({ summary: '주문 등록' })
  @ApiBearerAuth('accessToken')
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Patch('/:orderId')
  @ApiParam({ name: 'orderId', required: true })
  @UseGuards(jwtGuard)
  @ApiOperation({ summary: '주문 수정' })
  @ApiBearerAuth('accessToken')
  async updateStatus(@Body() updateOrderDto: UpdateOrderDto, @Param() param) {
    const { orderId } = param;
    return this.orderService.updateStatus(updateOrderDto, parseInt(orderId));
  }
}
