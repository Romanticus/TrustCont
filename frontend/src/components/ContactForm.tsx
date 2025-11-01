import React, { useState } from 'react';
import { useAppDispatch } from '../hooks';
import { addContactSuccess } from '../features/contacts/contactsSlice';
import { contactsApi } from '../features/contacts/api';
import './ContactForm.css';

const ContactForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    tags: '',
    lastInteraction: new Date().toISOString()
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and phone are required');
      return;
    }

    setIsAdding(true);

    try {
      // Обработка тегов
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // Формируем данные контакта для отправки 
      const newContactData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        tags,
        lastInteraction: formData.lastInteraction
      };
      
      const newContact = await contactsApi.createContact(newContactData);
      
      // Обновляем хранилище
      dispatch(addContactSuccess(newContact));
      
      // Сброс формы
      setFormData({
        name: '',
        phone: '',
        email: '',
        tags: '',
        lastInteraction: new Date().toISOString()
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при создании');
    } finally {
      setIsAdding(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h3>{isAdding ? 'Добавляем...' : 'Добавить новый контакт'}</h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Наименование"
          value={formData.name}
          onChange={handleChange}
          disabled={isAdding}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="Телефон"
          value={formData.phone}
          onChange={handleChange}
          disabled={isAdding}
          required
        />
      </div>
      
      <div className="form-group">
        <input
          type="email"
          name="email"
          placeholder="Почта"
          value={formData.email}
          onChange={handleChange}
          disabled={isAdding}
        />
      </div>
      
      <div className="form-group">
        <input
          type="text"
          name="tags"
          placeholder="Теги (Разделение запятой, Необязательны)"
          value={formData.tags}
          onChange={handleChange}
          disabled={isAdding}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="lastInteraction">Последнее взаимодействие:</label>
        <input
          type="datetime-local"
          id="lastInteraction"
          name="Последнее взаимодействие"
          value={formData.lastInteraction.slice(0, 16)} // 
          onChange={(e) => setFormData({
            ...formData,
            lastInteraction: new Date(e.target.value).toISOString()
          })}
          disabled={isAdding}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={isAdding}
        className="submit-btn"
      >
        {isAdding ? 'Добавляем...' : 'Добавить'}
      </button>
    </form>
  );
};

export default ContactForm;