import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.prismaService.category.create({
      data: { name: createCategoryDto.name },
    });
  }

  async findAll() {
    return await this.prismaService.category.findMany();
  }
}
