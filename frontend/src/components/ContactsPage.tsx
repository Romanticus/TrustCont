import React, { useEffect } from 'react';
import ContactList from './ContactList';
import ContactForm from './ContactForm';
import { fetchContactsStart, fetchContactsSuccess, fetchContactsFailure } from '../features/contacts/contactsSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { contactsApi } from '../features/contacts/api';
import './ContactsPage.css';

const ContactsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.contacts);

  useEffect(() => {
    const loadContacts = async () => {
      dispatch(fetchContactsStart());
      try {
        const contacts = await contactsApi.getContacts();
        dispatch(fetchContactsSuccess(contacts));
      } catch (err) {
        dispatch(fetchContactsFailure(err instanceof Error ? err.message : 'Ошибка получения контактов'));
      }
    };

    loadContacts();
  }, [dispatch]);

  return (
    <div className="contacts-page">
      <div className="contacts-header">
      
        
        <ContactForm />
      </div>
      
      {loading && <div className="loading">Загружаем...</div>}
      {error && <div className="error">Ошибка: {error}</div>}
      
      {!loading && !error && <ContactList />}
    </div>
  );
};

export default ContactsPage;