import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.stategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PassportModule.register({}), JwtModule.register({}), HttpModule],
  providers: [AuthService, PrismaService, JwtStrategy],
  controllers: [AuthController],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
