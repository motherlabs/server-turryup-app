import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CreateInfoDto } from './dto/createInfo.dto';
import { InfoService } from './info.service';

@ApiTags('정보 API')
@Controller('info')
export class InfoController {
  constructor(private infoService: InfoService) {}

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '사용자 정보 등록' })
  async create(@Body() createInfoDto: CreateInfoDto, @Req() req) {
    const { id } = req.user;
    return this.infoService.create(createInfoDto, id);
  }

  @Get('/verify')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '사용자 정보 확인' })
  async verify(@Req() req) {
    const { id } = req.user;
    return this.infoService.verify(id);
  }
}
