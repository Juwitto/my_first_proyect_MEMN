import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const foundUser = await this.prisma.user.findUnique({ where: { email } });

    if (!foundUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const passwordMatches = await bcrypt.compare(password, foundUser.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = {
      id: foundUser.id,
      email: foundUser.email,
      role: foundUser.role,
    };

    return { access_token: this.jwtService.sign(payload) };
  }
}