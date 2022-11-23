import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CreateGoodsDto } from './dto/createGoods.dto';
import { UpdateGoodsDto } from './dto/updateGoods.dto';
import { GoodsService } from './goods.service';

@ApiTags('상품 API')
@Controller('goods')
export class GoodsController {
  constructor(private goodsService: GoodsService) {}

  @Post('/list')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        latitude: { type: 'string', nullable: false },
        longitude: { type: 'string', nullable: false },
        range: { type: 'string', nullable: false },
      },
    },
  })
  @ApiQuery({
    name: 'skip',
    required: true,
  })
  @ApiQuery({
    name: 'take',
    required: true,
  })
  @ApiOperation({ summary: '상품 리스트' })
  async findAllByUserLocationRange(@Body() body, @Query() query) {
    const { latitude, longitude, range } = body;
    const { skip, take } = query;

    return this.goodsService.findAllByUserLocationRange(
      latitude,
      longitude,
      range,
      +skip,
      +take,
    );
  }

  @Get('/:storeId/store')
  @ApiParam({ name: 'storeId', required: true })
  @ApiOperation({ summary: '가게 상품 리스트' })
  async findAllByStoreId(@Param() param) {
    const { storeId } = param;
    return this.goodsService.findAll(parseInt(storeId));
  }

  @Get('/:goodsId')
  @ApiParam({ name: 'goodsId', required: true })
  @ApiOperation({ summary: '상품 상세' })
  async findOne(@Param() param) {
    const { goodsId } = param;
    return this.goodsService.findOne(parseInt(goodsId));
  }

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 등록' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('image'))
  async create(
    @Body() createGoodsDto: CreateGoodsDto,
    @UploadedFiles() image: Array<Express.Multer.File>,
  ) {
    return this.goodsService.create(createGoodsDto, image);
  }

  @Put('/:goodsId')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 수정' })
  // @ApiConsumes('multipart/form-data')
  // @UseInterceptors(AnyFilesInterceptor())
  @ApiParam({ name: 'goodsId', required: true })
  async update(
    @Body() updateGoodsDto: UpdateGoodsDto,
    // @UploadedFiles() image: Array<Express.Multer.File>,
    @Param() param,
  ) {
    const { goodsId } = param;
    return this.goodsService.update(parseInt(goodsId), updateGoodsDto);
  }

  @Patch('/:goodsId')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '상품 수량 수정' })
  @ApiParam({ name: 'goodsId', required: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  async updateQuantity(@Body() body, @Param() param) {
    const { goodsId } = param;
    const { quantity } = body;
    return this.goodsService.updateQuantity(parseInt(goodsId), quantity);
  }
}
