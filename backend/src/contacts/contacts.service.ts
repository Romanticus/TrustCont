import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactsRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactsRepository.create(createContactDto);
    return await this.contactsRepository.save(contact);
  }

  async findAll(): Promise<Contact[]> {
    return await this.contactsRepository.find();
  }

  async findOne(id: number): Promise<Contact> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Контакт ${id} не найден`);
    }
    return contact;
  }

  async update(
    id: number,
    updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    // Проверка что существует
    const existingContact = await this.contactsRepository.findOne({
      where: { id },
    });
    if (!existingContact) {
      throw new NotFoundException(`Контакт ${id} не найден`);
    }

    // Проверка что есть данные для обновления
    const hasUpdateData = Object.keys(updateContactDto).length > 0;
    if (!hasUpdateData) {
      throw new BadRequestException('Нет данных для обновления');
    }

    // обновим

    await this.contactsRepository.update(id, updateContactDto);
    // вернем обновленный контакт из бд
    const updatedContact = await this.contactsRepository.findOne({
      where: { id },
    });
    if (!updatedContact) {
      throw new NotFoundException(`контакт ${id} не был найден`);
    }
    return updatedContact;
  }

  async remove(id: number): Promise<{ message: string; id: number }> {
    const contact = await this.contactsRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Контакт ${id} не найден`);
    }
    await this.contactsRepository.delete(id);
    return { message: `Контакт с id ${id} успешно удален`, id };
  }
}
