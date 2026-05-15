import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };
  const jwtServiceMock = {
    sign: jest.fn().mockReturnValue('mocked.jwt.token'),
    verify: jest.fn(),
  };
  const prismaMock = {
    role: { findUnique: jest.fn(), create: jest.fn() },
  };
  const configServiceMock = {
    get: jest.fn().mockReturnValue('7d'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('issueTokens', () => {
    it('should return access_token and refresh_token', () => {
      const result = service.issueTokens({ id: 'u1', email: 'test@test.com', role: { name: 'customer' } });
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('refresh_token');
      expect(result.token_type).toBe('Bearer');
    });
  });

  describe('validateUser', () => {
    it('should return null when user not found', async () => {
      usersServiceMock.findByEmail.mockResolvedValueOnce(null);
      const result = await service.validateUser('no@one.com', 'pass');
      expect(result).toBeNull();
    });
  });
});
