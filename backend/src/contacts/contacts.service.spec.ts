import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { Contact } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let repository: Repository<Contact>;

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

  const mockDeleteResult: DeleteResult = {
    raw: [],
    affected: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        {
          provide: getRepositoryToken(Contact),
          useValue: {
            create: jest.fn().mockReturnValue(mockContact),
            save: jest.fn().mockResolvedValue(mockContact),
            find: jest.fn().mockResolvedValue([mockContact]),
            findOne: jest.fn(),
            update: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(mockDeleteResult),
          },
        },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    repository = module.get<Repository<Contact>>(getRepositoryToken(Contact));
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('должен создать новый контакт', async () => {
      // Подготовка
      const createContactDto: CreateContactDto = mockCreateContactDto;

      // Выполнение
      const result = await service.create(createContactDto);

      // Проверка
      expect(result).toEqual(mockContact);
      expect(repository.create).toHaveBeenCalledWith(createContactDto);
      expect(repository.save).toHaveBeenCalledWith(mockContact);
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив всех контактов', async () => {
      // Выполнение
      const result = await service.findAll();

      // Проверка
      expect(result).toEqual([mockContact]);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('должен вернуть контакт по id', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockContact);

      // Выполнение
      const result = await service.findOne(1);

      // Проверка
      expect(result).toEqual(mockContact);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('должен выбросить NotFoundException если контакт не найден', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Выполнение и проверка
      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(1)).rejects.toThrow('Контакт 1 не найден');
    });
  });

  describe('update', () => {
    it('должен обновить контакт по id', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockContact); // Для проверки существования
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({ ...mockContact, ...mockUpdateContactDto }); // Для возврата обновленного контакта
      const updateContactDto: UpdateContactDto = mockUpdateContactDto;

      // Выполнение
      const result = await service.update(1, updateContactDto);

      // Проверка
      expect(result).toEqual({ ...mockContact, ...mockUpdateContactDto });
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.update).toHaveBeenCalledWith(1, updateContactDto);
    });

    it('должен выбросить NotFoundException если контакт не найден при обновлении', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      const updateContactDto: UpdateContactDto = mockUpdateContactDto;

      // Выполнение и проверка
      await expect(service.update(1, updateContactDto)).rejects.toThrow(NotFoundException);
      await expect(service.update(1, updateContactDto)).rejects.toThrow('Контакт 1 не найден');
    });

    it('должен выбросить BadRequestException если нет данных для обновления', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockContact);
      const emptyUpdateContactDto: UpdateContactDto = {};

      // Выполнение и проверка
      await expect(service.update(1, emptyUpdateContactDto)).rejects.toThrow(BadRequestException);
      await expect(service.update(1, emptyUpdateContactDto)).rejects.toThrow('Нет данных для обновления');
    });
  });

  describe('remove', () => {
    it('должен удалить контакт по id', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockContact);
      jest.spyOn(repository, 'delete').mockResolvedValue(mockDeleteResult);

      // Выполнение
      const result = await service.remove(1);

      // Проверка
      expect(result).toEqual({ message: 'Контакт с id 1 успешно удален', id: 1 });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('должен выбросить NotFoundException если контакт не найден при удалении', async () => {
      // Подготовка
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Выполнение и проверка
      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
      await expect(service.remove(1)).rejects.toThrow('Контакт 1 не найден');
    });
  });
});