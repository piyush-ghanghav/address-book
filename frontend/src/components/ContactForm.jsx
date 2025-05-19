import React, { useState } from 'react';
import { contactService } from '../services/api';

const initialAddress = {
  street: '',
  city: '',
  state: '',
  pinCode: ''
};

const initialContact = {
  name: '',
  email: '',
  phone: '',
  addresses: [{ ...initialAddress }]
};

export default function ContactForm({ onSuccess }) {
  const [contact, setContact] = useState(initialContact);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    
    if (['name', 'email', 'phone'].includes(name)) {
      setContact(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Handle address fields
      const updatedAddresses = [...contact.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [name]: value
      };
      setContact(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
    }
  };

  const addAddress = () => {
    setContact(prev => ({
      ...prev,
      addresses: [...prev.addresses, { ...initialAddress }]
    }));
  };

  const removeAddress = (index) => {
    if (contact.addresses.length === 1) return;
    
    setContact(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, idx) => idx !== index)
    }));
  };

  const validateForm = () => {
    if (!contact.name) return 'Name is required';
    if (!contact.email?.match(/\S+@\S+\.\S+/)) return 'Invalid email format';
    if (!contact.phone?.match(/^[0-9]{10}$/)) return 'Phone must be 10 digits';
    
    for (let addr of contact.addresses) {
      if (!addr.street || !addr.city || !addr.state) return 'All address fields are required';
      if (!addr.pinCode?.match(/^[1-9][0-9]{5}$/)) return 'Invalid PIN code format';
    }
    
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError('');
      await contactService.create(contact);
      setContact(initialContact);
      onSuccess?.(); // Call onSuccess after successful creation
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Add New Contact</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={contact.name}
          onChange={e => handleChange(e)}
          placeholder="Name"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          value={contact.email}
          onChange={e => handleChange(e)}
          placeholder="Email"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="tel"
          name="phone"
          value={contact.phone}
          onChange={e => handleChange(e)}
          placeholder="Phone (10 digits)"
          required
        />
      </div>

      <div className="addresses">
        <h3>Addresses</h3>
        {contact.addresses.map((address, index) => (
          <div key={index} className="address-group">
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={e => handleChange(e, index)}
              placeholder="Street"
              required
            />
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={e => handleChange(e, index)}
              placeholder="City"
              required
            />
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={e => handleChange(e, index)}
              placeholder="State"
              required
            />
            <input
              type="text"
              name="pinCode"
              value={address.pinCode}
              onChange={e => handleChange(e, index)}
              placeholder="PIN Code"
              required
            />
            {contact.addresses.length > 1 && (
              <button 
                type="button" 
                onClick={() => removeAddress(index)}
                className="remove-address"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addAddress} className="add-address">
          Add Another Address
        </button>
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? 'Adding...' : 'Add Contact'}
      </button>
    </form>
  );
}
