import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { jwtGuard } from 'src/auth/jwt.guard';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { UserService } from './user.service';

@ApiTags('유저 API')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  async me(@Req() req) {
    return req.user;
  }

  @Patch('role')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  async updateRole(@Req() req, @Body() updateRoleDto: UpdateRoleDto) {
    if (req.user.role === UserRole.ADMIN) {
      return this.userService.updateRole(updateRoleDto);
    } else {
      return new ForbiddenException();
    }
  }

  @Patch('fcmToken')
  @UseGuards(jwtGuard)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fcmToken: {
          type: 'string',
          nullable: false,
        },
      },
    },
  })
  @ApiBearerAuth('accessToken')
  async updateFcmToken(@Req() req, @Body() body) {
    const { fcmToken } = body;
    const { id } = req.user;
    return this.userService.updateFcmToken(fcmToken, id);
  }

  @Get('findAll')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  async findAll(@Req() req) {
    if (req.user.role === UserRole.ADMIN) {
      return this.userService.findAll();
    } else {
      return new ForbiddenException();
    }
  }

  @Post('/delete')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '회원 탈퇴' })
  async delete(@Req() req) {
    const { id } = req.user;
    return this.userService.delete(id);
  }
}
