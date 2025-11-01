import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { ApiKeyGuard } from '../auth/auth.guard';
import { ConfigService } from '@nestjs/config';

describe('ContactsController', () => {
  let controller: ContactsController;
  let service: ContactsService;

  // Мок-данные для тестирования
  const mockContact: Contact = {
    id: 1,
    name: 'Иван Иванов',
    phone: '+79991234567',
    email: 'ivan@example.com',
    tags: ['друг', 'работа'],
    lastInteraction: new Date('2023-01-01T10:00:00Z'),
  };

  const mockCreateContactDto: CreateContactDto = {
    name: 'Иван Иванов',
    phone: '+79991234567',
    email: 'ivan@example.com',
    tags: ['друг', 'работа'],
    lastInteraction: new Date('2023-01-01T10:00:00Z'),
  };

  const mockUpdateContactDto: UpdateContactDto = {
    name: 'Иван Петров',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        {
          provide: ContactsService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockContact),
            findAll: jest.fn().mockResolvedValue([mockContact]),
            findOne: jest.fn().mockResolvedValue(mockContact),
            update: jest.fn().mockResolvedValue({ ...mockContact, ...mockUpdateContactDto }),
            remove: jest.fn().mockResolvedValue({ message: 'Контакт с id 1 успешно удален', id: 1 }),
          },
        },
        {
          // Мок для ApiKeyGuard чтобы избежать зависимости от ConfigService
          provide: ApiKeyGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) },
        },
        {
          // Мок для ConfigService
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key-123'),
          },
        },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    service = module.get<ContactsService>(ContactsService);
  });

  it('должен быть определен', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('должен создать новый контакт', async () => {
      // Подготовка
      const createContactDto: CreateContactDto = mockCreateContactDto;

      // Выполнение
      const result = await controller.create(createContactDto);

      // Проверка
      expect(result).toEqual(mockContact);
      expect(service.create).toHaveBeenCalledWith(createContactDto);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив всех контактов', async () => {
      // Выполнение
      const result = await controller.findAll();

      // Проверка
      expect(result).toEqual([mockContact]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть контакт по id', async () => {
      // Выполнение
      const result = await controller.findOne('1');

      // Проверка
      expect(result).toEqual(mockContact);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('должен обновить контакт по id', async () => {
      // Подготовка
      const updateContactDto: UpdateContactDto = mockUpdateContactDto;

      // Выполнение
      const result = await controller.update('1', updateContactDto);

      // Проверка
      expect(result).toEqual({ ...mockContact, ...mockUpdateContactDto });
      expect(service.update).toHaveBeenCalledWith(1, updateContactDto);
    });
  });

  describe('remove', () => {
    it('должен удалить контакт по id', async () => {
      // Выполнение
      const result = await controller.remove('1');

      // Проверка
      expect(result).toEqual({ message: 'Контакт с id 1 успешно удален', id: 1 });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});