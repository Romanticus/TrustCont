import type { Contact } from './contactsSlice';

const API_BASE = 'http://localhost:3000/api';
const API_KEY = 'test-api-key-123'; 

// Базовые заголовки необходимые для раоты с апи
const getHeaders = () => ({
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
});

// обработчик ошибок
const handleApiError = async (response: Response): Promise<never> => {
  const errorData = await response.json();
  const errorMessage = errorData.message 
    ? Array.isArray(errorData.message) 
      ? errorData.message.join(', ')
      : errorData.message
    : `Error: ${response.status}`;
  throw new Error(errorMessage);
};

export const contactsApi = {
  async getContacts(): Promise<Contact[]> {
    const response = await fetch(`${API_BASE}/contacts`, {
      headers: {
        ...getHeaders()
      },
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  async createContact(contact: Omit<Contact, 'id' | 'lastInteraction'>): Promise<Contact> {
    const response = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  async updateContact(id: number, contact: Partial<Omit<Contact, 'id' | 'lastInteraction'>>): Promise<Contact> {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(contact),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
    
    return response.json();
  },

  async deleteContact(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/contacts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      await handleApiError(response);
    }
  },
};