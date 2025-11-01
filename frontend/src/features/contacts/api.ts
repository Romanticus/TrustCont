import type { Contact } from './contactsSlice';

const API_BASE =import.meta.env.VITE_API_BASE || 'http://localhost:3000/api';
const API_KEY = import.meta.env.VITE_API_KEY;  
 console.log(import.meta.env);
 

//  заголовки для работы с АПИ
const getHeaders = () => ({
  'x-api-key': API_KEY,
  'Content-Type': 'application/json',
});

// Обработчик ошибок с сервера
const handleApiError = async (response: Response): Promise<never> => {
  try {
    const errorData = await response.json();
    const errorMessage = errorData.message 
      ? Array.isArray(errorData.message) 
        ? errorData.message.join(', ')
        : errorData.message
      : `Error: ${response.status}`;
    throw new Error(errorMessage);
  } catch (err) {
    // если не можем обработать, выбрасываем код ошибки
    throw new Error(`Error: ${response.status}`);
  }
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