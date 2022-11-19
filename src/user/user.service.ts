import { Injectable } from '@nestjs/common';
import { UserRole, UserState } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRoleDto } from './dto/updateRole.dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async me(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { Address: true },
    });

    return {
      user,
    };
  }

  async updateRole(updateRoleDto: UpdateRoleDto) {
    const { userId, role } = updateRoleDto;

    return await this.prismaService.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  async updateFcmToken(fcmToken: string, userId: number) {
    return await this.prismaService.user.update({
      where: { id: userId },
      data: { fcmToken },
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      where: {
        OR: [
          { role: UserRole.PARTNER },
          { role: UserRole.USER },
          { role: UserRole.TASTER },
        ],
      },
      select: {
        id: true,
        phoneNumber: true,
        role: true,
        Store: true,
      },
    });
  }

  async delete(userId: number) {
    return;
    // return await this.prismaService.user.delete({ where: { id: userId } });
  }
}
