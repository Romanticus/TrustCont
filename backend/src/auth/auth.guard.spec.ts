import { ApiKeyGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  let configService: ConfigService;

  // Мок-данные для тестирования
  const mockValidApiKey = 'test-api-key-123';
  const mockRequest = {
    headers: {},
  } as unknown as Request;

  const mockContext = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnValue(mockRequest),
  } as unknown as ExecutionContext;

  beforeEach(() => {
    // Создаем мок для ConfigService
    configService = new ConfigService();
    jest.spyOn(configService, 'get').mockReturnValue(mockValidApiKey);
    
    // Создаем экземпляр гварда с моком ConfigService
    guard = new ApiKeyGuard(configService);
  });

  it('должен быть определен', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('должен возвращать true при наличии правильного API ключа', () => {
      // Подготовка
      mockRequest.headers['x-api-key'] = mockValidApiKey;

      // Выполнение
      const result = guard.canActivate(mockContext);

      // Проверка
      expect(result).toBe(true);
    });

    it('должен выбрасывать UnauthorizedException если API ключ не сконфигурирован на сервере', () => {
      // Подготовка
      jest.spyOn(configService, 'get').mockReturnValue(undefined);
      mockRequest.headers['x-api-key'] = mockValidApiKey;

      // Выполнение и проверка
      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockContext)).toThrow('API key not configured on server');
    });

    it('должен выбрасывать UnauthorizedException если API ключ отсутствует в заголовках', () => {
      // Подготовка
      mockRequest.headers = {};

      // Выполнение и проверка
      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockContext)).toThrow('Invalid or missing API key');
    });

    it('должен выбрасывать UnauthorizedException если API ключ неверный', () => {
      // Подготовка
      mockRequest.headers['x-api-key'] = 'invalid-key';

      // Выполнение и проверка
      expect(() => guard.canActivate(mockContext)).toThrow(UnauthorizedException);
      expect(() => guard.canActivate(mockContext)).toThrow('Invalid or missing API key');
    });
  });
});