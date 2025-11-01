import React, { useState, useEffect } from 'react';
import type { Contact } from '../features/contacts/contactsSlice';
import { contactsApi } from '../features/contacts/api';
import { useAppDispatch } from '../hooks';
import { updateContactSuccess } from '../features/contacts/contactsSlice';
import './EditContactModal.css';

interface EditContactModalProps {
  contact: Contact;
  onClose: () => void;
 
}

const EditContactModal: React.FC<EditContactModalProps> = ({ contact, onClose }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    id: contact.id,
    name: contact.name,
    phone: contact.phone,
    email: contact.email,
    tags: contact.tags.join(', ')
  });
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setFormData({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      tags: contact.tags.join(', ')
    });
  }, [contact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUpdating(true);

    // валидация
    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Name and phone are required');
      setIsUpdating(false);
      return;
    }

    try {
      // обработка тегов
      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
      
      // обновленные данные контакта
      const updatedContactData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        tags
      };
      
      const updatedContact = await contactsApi.updateContact(contact.id, updatedContactData);
      
      // Обновление хранилища
      dispatch(updateContactSuccess(updatedContact));
       
      
      // Закрытие окна
      onClose();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка обновления контакта');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактирование</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="form-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="edit-contact-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Наименование"
              value={formData.name}
              onChange={handleChange}
              disabled={isUpdating}
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
              disabled={isUpdating}
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
              disabled={isUpdating}
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="tags"
              placeholder="Теги (comma-separated, optional)"
              value={formData.tags}
              onChange={handleChange}
              disabled={isUpdating}
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isUpdating}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isUpdating}
              className="save-btn"
            >
              {isUpdating ? 'Изменяем...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;