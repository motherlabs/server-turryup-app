import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

  @Get('/:storeId')
  @ApiParam({ name: 'storeId', required: true })
  @UseGuards(jwtGuard)
  @ApiOperation({ summary: '주문 리스트' })
  @ApiBearerAuth('accessToken')
  async findAllByStoreId(@Param() param) {
    const { storeId } = param;
    return this.orderService.findAllByStoreId(parseInt(storeId));
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
