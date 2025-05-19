// controllers/contactController.js
const Contact = require('../models/Contact');

// GET all contacts
exports.getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
};

// POST create contact
exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT update contact
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
