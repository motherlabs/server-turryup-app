import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CreateStoreDto } from './dto/createStore.dto';
import { UpdateStoreDto } from './dto/updateStore.dto';
import { StoreService } from './store.service';

@ApiTags('가게 API')
@Controller('store')
export class StoreController {
  constructor(private storeService: StoreService) {}

  @Get('/')
  @ApiQuery({
    name: 'userLatitude',
    required: true,
  })
  @ApiQuery({
    name: 'userLongitude',
    required: true,
  })
  @ApiOperation({ summary: '가게 리스트' })
  async findAll(@Query() query) {
    const { userLatitude, userLongitude } = query;
    return this.storeService.findAllByUserLocationRange(
      parseInt(userLatitude),
      parseInt(userLongitude),
    );
  }

  @Get(':userId')
  @ApiParam({ name: 'userId', required: true })
  @ApiOperation({ summary: '가게 상세' })
  async findOne(@Param() param) {
    const { userId } = param;
    return this.storeService.findOne(parseInt(userId));
  }

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '가게 등록' })
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Put('/:userId')
  @ApiParam({ name: 'userId', required: true })
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '가게 수정' })
  async update(@Body() updateStoreDto: UpdateStoreDto, @Param() param) {
    const { userId } = param;
    return this.storeService.update(updateStoreDto, parseInt(userId));
  }
}
