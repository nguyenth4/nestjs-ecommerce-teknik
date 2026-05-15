import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    validateUser: jest.fn(),
    login: jest.fn().mockResolvedValue({ access_token: 'tok', refresh_token: 'ref', token_type: 'Bearer' }),
    register: jest.fn().mockResolvedValue({ access_token: 'tok', refresh_token: 'ref', token_type: 'Bearer' }),
    refresh: jest.fn().mockResolvedValue({ access_token: 'new', refresh_token: 'new_ref', token_type: 'Bearer' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      authServiceMock.validateUser.mockResolvedValueOnce({ id: 'u1', email: 'a@b.com' });
      const result = await controller.login({ email: 'a@b.com', password: '123' });
      expect(result).toHaveProperty('access_token');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      authServiceMock.validateUser.mockResolvedValueOnce(null);
      await expect(controller.login({ email: 'bad@bad.com', password: 'wrong' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should return tokens on successful registration', async () => {
      const result = await controller.register({ email: 'new@user.com', password: 'pass', fullName: 'New User' });
      expect(result).toHaveProperty('access_token');
      expect(authServiceMock.register).toHaveBeenCalledWith({ email: 'new@user.com', password: 'pass', fullName: 'New User' });
    });
  });
});
