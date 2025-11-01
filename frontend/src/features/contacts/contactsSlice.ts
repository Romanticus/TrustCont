import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Contact {
  id: number;
  name: string;
  phone: string;
  email: string;
  tags: string[];
  lastInteraction: string;
}

export interface ContactsState {
  items: Contact[];
  loading: boolean;
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  loading: false,
  error: null,
};

export const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    fetchContactsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchContactsSuccess(state, action: PayloadAction<Contact[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchContactsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addContactSuccess(state, action: PayloadAction<Contact>) {
      state.items.push(action.payload);
    },
    updateContactSuccess(state, action: PayloadAction<Contact>) {
      const index = state.items.findIndex(
        (contact) => contact.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteContactSuccess(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (contact) => contact.id !== action.payload
      );
    },
  },
});

export const {
  fetchContactsStart,
  fetchContactsSuccess,
  fetchContactsFailure,
  addContactSuccess,
  updateContactSuccess,
  deleteContactSuccess,
} = contactsSlice.actions;

export default contactsSlice.reducer;