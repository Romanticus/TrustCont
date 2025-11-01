import React, { useState } from "react";
import type { Contact } from "../features/contacts/contactsSlice";
import { contactsApi } from "../features/contacts/api";
import { useAppDispatch } from "../hooks";
import { deleteContactSuccess } from "../features/contacts/contactsSlice";
import EditContactModal from "./EditContactModal";
import "./ContactCard.css";

interface ContactCardProps {
  contact: Contact;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const dispatch = useAppDispatch();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await contactsApi.deleteContact(contact.id);
      dispatch(deleteContactSuccess(contact.id));
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("Ошибка удаления:", err);
      alert("Ошибка удаления контакта"); // заменить
    }
  };

  return (
    <>
      <div className="contact-card">
        <div className="contact-header">
          <h3 className="contact-name">{contact.name}</h3>
          <div className="contact-actions">
            <button
              className="edit-button"
              onClick={() => setShowEditModal(true)}
              aria-label="Edit contact"
            >
              ✏️
            </button>
            <button
              className="delete-button"
              onClick={() => setShowDeleteConfirm(true)}
              aria-label="Delete contact"
            >
              🗑️
            </button>
          </div>
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
                {contact.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </span>
            </div>
          )}

          <div className="contact-row">
            <strong>Последнее взаимодейсвтие:</strong>
            <span>{new Date(contact.lastInteraction).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditContactModal
          contact={contact}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="modal-content confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Подтверждение удаления</h3>
            <p>Вы точно хотите удалить "{contact.name}"?</p>
            <div className="confirm-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Отмена
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactCard;
