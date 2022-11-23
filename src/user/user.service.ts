import { Injectable } from '@nestjs/common';
import { DefaultState, UserRole, UserState } from '@prisma/client';
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
        OR: [{ role: UserRole.PARTNER }, { role: UserRole.USER }],
        NOT: [{ state: UserState.DELETE }],
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
    const now = Date.now();
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { Store: { include: { Goods: true } } },
    });
    if (user.Store) {
      await this.prismaService.store.update({
        where: { userId: user.id },
        data: { state: DefaultState.DELETE },
      });
      if (user.Store.Goods.length > 0) {
        const goodsIdList: number[] = [];
        user.Store.Goods.map((v) => {
          goodsIdList.push(v.id);
        });
        await this.prismaService.goods.updateMany({
          where: { id: { in: goodsIdList } },
          data: { state: DefaultState.DELETE },
        });
      }
    }
    await this.prismaService.user.update({
      where: { id: user.id },
      data: {
        phoneNumber: `${user.phoneNumber}-${now}`,
        fcmToken: '',
        state: UserState.DELETE,
      },
    });
    return true;
  }
}
