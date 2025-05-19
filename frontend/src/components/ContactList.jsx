import React, { useEffect, useState } from 'react';
import ConfirmationModal from './ConfirmationModal';
import { contactService } from '../services/api';
import ContactForm from './ContactForm';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaSpinner } from 'react-icons/fa';

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpdate = (contact, e) => {
    e.stopPropagation();
    setSelectedContact(contact);
  };

  if (loading) return (
    <div className="loading-state">
      <FaSpinner className="spinner" />
      <p>Loading contacts...</p>
    </div>
  );
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      {contacts.length === 0 ? (
        <p>No contacts found</p>
      ) : (
        contacts.map(contact => (
          <div 
            key={contact._id} 
            className={`contact-card ${expandedId === contact._id ? 'expanded' : ''}`}
            onClick={() => toggleExpand(contact._id)}
          >
            <div className="contact-summary">
              <div className="contact-info">
                <div className="contact-name">
                  <FaUser className="icon" />
                  <h3>{contact.name}</h3>
                </div>
                <div className="contact-phone">
                  <FaPhone className="icon" />
                  <span>{contact.phone}</span>
                </div>
              </div>
              {expandedId === contact._id ? 
                <FaChevronUp className="expand-icon" /> : 
                <FaChevronDown className="expand-icon" />
              }
            </div>

            {expandedId === contact._id && (
              <div className="contact-details" onClick={e => e.stopPropagation()}>
                <div className="detail-item">
                  <FaEnvelope className="icon" />
                  <span>{contact.email}</span>
                </div>
                <div className="addresses">
                  <h4>
                    <FaMapMarkerAlt className="icon" />
                    Addresses
                  </h4>
                  {contact.addresses?.map((addr, idx) => (
                    <div key={idx} className="address">
                      <div className="address-content">
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state}</p>
                        <p>PIN: {addr.pinCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="actions">
                  <button 
                    onClick={(e) => handleUpdate(contact, e)}
                    className="update-button"
                  >
                     Update
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(contact._id);
                    }}
                    className="delete-button"
                  >
                     Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}

      <ConfirmationModal
        isOpen={modalOpen}
        onConfirm={handleDelete}
        onCancel={() => setModalOpen(false)}
        message="Are you sure you want to delete this contact?"
      />

      {selectedContact && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setSelectedContact(null)}
            >
              ×
            </button>
            <ContactForm 
              contact={selectedContact} 
              onSuccess={() => {
                setSelectedContact(null);
                fetchContacts();
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
