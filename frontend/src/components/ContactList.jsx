import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { contactService } from '../services/api';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactService.getAll();
      setContacts(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const confirmDelete = (id) => {
    setToDeleteId(id);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await contactService.delete(toDeleteId);
      await fetchContacts();
      setModalOpen(false);
      setToDeleteId(null);
    } catch (err) {
      setError('Failed to delete contact');
      console.error(err);
    }
  };

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        contacts.map(contact => (
          <div key={contact._id} className="contact-card">
            <h3>{contact.name}</h3>
            <p>Email: {contact.email}</p>
            <p>Phone: {contact.phone}</p>
            <div className="addresses">
              <h4>Addresses:</h4>
              {contact.addresses?.map((addr, idx) => (
                <div key={idx} className="address">
                  <p>{addr.street}</p>
                  <p>{addr.city}, {addr.state}</p>
                  <p>PIN: {addr.pinCode}</p>
                </div>
              ))}
            </div>
            <div className="actions">
              <button onClick={() => confirmDelete(contact._id)}>Delete</button>
            </div>
          </div>
        ))
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
        message="Are you sure you want to delete this contact?"
      />
    </div>
  );
}
