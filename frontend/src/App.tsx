import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import ContactsPage from './components/ContactsPage';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <header className="app-header">
          <h1>TrustContacts</h1>
        </header>
        <main className="app-main">
          <ContactsPage />
        </main>
      </div>
    </Provider>
  );
}

export default App;