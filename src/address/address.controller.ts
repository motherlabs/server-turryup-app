import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/createAddress.dto';
import 'moment/locale/ko';

@ApiTags('주소 api')
@Controller('address')
export class AddressController {
  constructor(private addressService: AddressService) {}

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '주소 등록' })
  async create(@Body() createAddress: CreateAddressDto, @Req() req) {
    return this.addressService.create(createAddress, req.user.id);
  }

  @Get('/pinned')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '고정 주소 가져오기' })
  async findPinned(@Req() req) {
    return this.addressService.findPinned(req.user.id);
  }

  @Get('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '주소 리스트 가져오기' })
  async findAll(@Req() req) {
    return this.addressService.findAll(req.user.id);
  }

  @Post('/delete')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '주소 삭제' })
  @ApiBody({
    type: 'object',
    schema: {
      properties: {
        addressId: {
          type: 'number',
          nullable: false,
        },
      },
    },
  })
  async delete(@Body() body) {
    const { addressId } = body;
    return this.addressService.delete(addressId);
  }
}
