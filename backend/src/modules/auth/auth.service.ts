import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS ?? '10');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: dto.username },
          ...(dto.email !== undefined ? [{ email: dto.email }] : []),
        ],
      },
    });
    if (existing) {
      if (existing.username === dto.username) {
        throw new ConflictException('Username already taken');
      }
      throw new ConflictException('Email already in use');
    }

    const password = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const user = await this.prisma.user.create({
      data: { email: dto.email, username: dto.username, password, name: dto.name },
      select: { id: true, email: true, username: true, name: true, role: true, createdAt: true },
    });

    const token = this.signToken({ sub: user.id, email: user.email ?? '', username: user.username, role: user.role });
    return { user, accessToken: token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: dto.login },
          { username: dto.login },
        ],
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { password: _, ...safeUser } = user;
    const token = this.signToken({ sub: safeUser.id, email: safeUser.email ?? '', username: safeUser.username, role: safeUser.role });
    return { user: safeUser, accessToken: token };
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true, name: true, role: true, createdAt: true },
    });
    if (!user) throw new UnauthorizedException();
    return { user };
  }

  private signToken(payload: { sub: string; email: string; username: string; role: string }) {
    return this.jwtService.sign(payload);
  }
}
