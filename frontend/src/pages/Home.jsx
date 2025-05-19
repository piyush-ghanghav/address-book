import React, { useState } from 'react';
import ContactForm from '../components/ContactForm';
import ContactList from '../components/ContactList';

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="home">
      <div className="header">
        <h1>Address Book</h1>
        <button 
          className="add-button"
          onClick={() => setIsFormOpen(true)}
        >
          +
        </button>
      </div>
      
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setIsFormOpen(false)}
            >
              ×
            </button>
            <ContactForm onSuccess={() => setIsFormOpen(false)} />
          </div>
        </div>
      )}
      
      <ContactList />
    </div>
  );
}
