import React from 'react';
import ContactCard from './ContactCard';
import { useAppSelector } from '../hooks';
import './ContactList.css';

const ContactList: React.FC = () => {
  const { items: contacts } = useAppSelector(state => state.contacts);

  if (contacts.length === 0) {
    return <div className="no-contacts">Контакты не найдены</div>;
  }

  return (<>
  
    <div className="contact-list">
      {contacts.map(contact => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div></>
  );
};

export default ContactList;