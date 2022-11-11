import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { jwtGuard } from 'src/auth/jwt.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@ApiTags('카테고리 API')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post('/')
  @UseGuards(jwtGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '카테고리 등록' })
  async create(@Req() req, @Body() createCategoryDto: CreateCategoryDto) {
    console.log('category');
    if (req.user.role === UserRole.ADMIN) {
      return this.categoryService.create(createCategoryDto);
    } else {
      return;
    }
  }

  @Get('/')
  @ApiOperation({ summary: '카테고리 리스트' })
  async findAll() {
    return this.categoryService.findAll();
  }
}
