import React from "react";
import ContactCard from "./ContactCard";
import { useAppSelector } from "../hooks";
import "./ContactList.css";
import type { Contact } from "../features/contacts/contactsSlice";

const ContactList: React.FC = () => {
  const { items: contacts } = useAppSelector((state) => state.contacts);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filteredContacts, setFilteredContacts] = React.useState(contacts);

  const filterContacts = (searchQuery: string, list: Contact[]) => {
    if (!searchQuery) return list;
    return list.filter((list) =>
      list.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  React.useEffect(() => {
    const Debounce = setTimeout(() => {
      setFilteredContacts(filterContacts(searchQuery, contacts));
    }, 300);
    return () => clearTimeout(Debounce);
  }, [searchQuery,contacts]);

  if (contacts.length === 0) {
    return <div className="no-contacts">Контакты не найдены</div>;
  }

  return (
    <div className="contact-list-container">
      <div className="search-container">
        🔍
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          autoFocus
          autoComplete="off"
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по контактам"
        />
      </div>
      <div className="contact-list">
        {filteredContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
