import React, { useState } from 'react';
import { contactService } from '../services/api';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

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

export default function ContactForm({ contact, onSuccess }) {
  const [formData, setFormData] = useState(contact || initialContact);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeAddressIndex, setActiveAddressIndex] = useState(0);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    
    if (['name', 'email', 'phone'].includes(name)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Handle address fields
      const updatedAddresses = [...formData.addresses];
      updatedAddresses[index] = {
        ...updatedAddresses[index],
        [name]: value
      };
      setFormData(prev => ({
        ...prev,
        addresses: updatedAddresses
      }));
    }
  };

  const addAddress = () => {
    setFormData(prev => ({
      ...prev,
      addresses: [...prev.addresses, { ...initialAddress }]
    }));
  };

  const removeAddress = (index) => {
    if (formData.addresses.length === 1) return;
    
    setFormData(prev => ({
      ...prev,
      addresses: prev.addresses.filter((_, idx) => idx !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.name) return 'Name is required';
    if (!formData.email?.match(/\S+@\S+\.\S+/)) return 'Invalid email format';
    if (!formData.phone?.match(/^[0-9]{10}$/)) return 'Phone must be 10 digits';
    
    for (let addr of formData.addresses) {
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
      
      if (contact?._id) {
        // Update existing contact
        await contactService.update(contact._id, formData);
      } else {
        // Create new contact
        await contactService.create(formData);
      }
      
      setFormData(initialContact);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  const toggleAddress = (index) => {
    setActiveAddressIndex(activeAddressIndex === index ? -1 : index);
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>{contact ? 'Update Contact' : 'Add New Contact'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={e => handleChange(e)}
          placeholder="Name"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={e => handleChange(e)}
          placeholder="Email"
          required
        />
      </div>

      <div className="form-group">
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={e => handleChange(e)}
          placeholder="Phone (10 digits)"
          required
        />
      </div>

      <div className="addresses">
        <h3>Addresses ({formData.addresses.length})</h3>
        {formData.addresses.map((address, index) => (
          <div key={index} className="address-group">
            <div 
              className="address-header" 
              onClick={() => toggleAddress(index)}
            >
              <span>Address {index + 1}</span>
              {activeAddressIndex === index ? 
                <FaChevronUp className="icon" /> : 
                <FaChevronDown className="icon" />
              }
            </div>
            {activeAddressIndex === index && (
              <div className="address-fields">
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
                {formData.addresses.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeAddress(index)}
                    className="remove-address"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        <button type="button" onClick={addAddress} className="add-address">
          Add Another Address
        </button>
      </div>

      <button type="submit" disabled={loading} className="submit-button">
        {loading ? (contact ? 'Updating...' : 'Adding...') : (contact ? 'Update Contact' : 'Add Contact')}
      </button>
    </form>
  );
}
