import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @Get('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '주소 가져오기' })
  async findFirst(@Req() req) {
    return this.addressService.findFirst(req.user.id);
  }
}
