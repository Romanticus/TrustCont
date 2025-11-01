import React from 'react';
import type { Contact } from '../features/contacts/contactsSlice';
import './ContactCard.css';

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  return (
    <div className="contact-card">
      <div className="contact-header">
        <h3 className="contact-name">{contact.name}</h3>
        <span className="contact-id">ID: {contact.id}</span>
      </div>
      
      <div className="contact-info">
        <div className="contact-row">
          <strong>Телефон:</strong>
          <span>{contact.phone}</span>
        </div>
        
        <div className="contact-row">
          <strong>Почта:</strong>
          <span>{contact.email}</span>
        </div>
        
        {contact.tags && contact.tags.length > 0 && (
          <div className="contact-row">
            <strong>Теги:</strong>
            <span className="tags">
              {contact.tags.map(tag => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </span>
          </div>
        )}
        
        <div className="contact-row">
          <strong>Последнее вазимодействие:</strong>
          <span>{new Date(contact.lastInteraction).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;