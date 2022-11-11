import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { BasketService } from './basket.service';

@ApiTags('장바구니 API')
@Controller('basket')
export class BasketController {
  constructor(private basketService: BasketService) {}

  @Get('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '장바구니 리스트' })
  async findAll(@Req() req) {
    const { user } = req;
    return this.basketService.findAll(user.id);
  }

  @Post('/create')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        goodsId: {
          type: 'number',
          nullable: false,
        },
        quantity: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  @ApiOperation({ summary: '장바구니 등록' })
  async create(@Body() body, @Req() req) {
    const { user } = req;
    const { goodsId, quantity } = body;
    return this.basketService.create(goodsId, user.id, quantity);
  }

  @Post('/delete')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '장바구니 삭제' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        basketIdList: {
          type: 'array',
          items: {
            type: 'number',
            nullable: false,
          },
        },
      },
    },
  })
  async deleteAll(@Body() body, @Req() req) {
    console.log('delete');
    const { basketIdList } = body;
    const { user } = req;
    return this.basketService.deleteAll(basketIdList, user.id);
  }
}
