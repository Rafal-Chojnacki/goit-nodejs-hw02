const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const app = express();
const Joi = require('joi'); // Importuj pakiet Joi

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// Import funkcji obsługujących operacje na kontaktach
const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require('./contactsController');

// Definicje walidacji dla danych wejściowych (POST i PUT)
const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

// Endpoint do pobierania listy kontaktów
app.get('/api/contacts', (req, res) => {
  const contacts = listContacts();
  res.status(200).json(contacts);
});

// Endpoint do pobierania kontaktu po ID
app.get('/api/contacts/:id', (req, res) => {
  const contact = getById(req.params.id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Endpoint do dodawania nowego kontaktu z walidacją
app.post('/api/contacts', (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const newContact = addContact({ ...req.body });
  res.status(201).json(newContact);
});

// Endpoint do usuwania kontaktu po ID
app.delete('/api/contacts/:id', (req, res) => {
  const contactId = req.params.id;
  const result = removeContact(contactId);
  if (result) {
    res.status(200).json({ message: 'Contact deleted' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

// Endpoint do aktualizacji kontaktu po ID z walidacją
app.put('/api/contacts/:id', (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const contactId = req.params.id;
  const updatedContact = updateContact(contactId, { ...req.body });
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
