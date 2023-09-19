const fs = require('fs');
const path = require('path');

const contactsFilePath = path.join(__dirname, 'contacts.json');

// Funkcja do wczytywania danych kontaktów z pliku
function loadContacts() {
  try {
    const data = fs.readFileSync(contactsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Funkcja do zapisywania danych kontaktów do pliku
function saveContacts(contacts) {
  try {
    const data = JSON.stringify(contacts, null, 2);
    fs.writeFileSync(contactsFilePath, data);
  } catch (error) {
    console.error('Error saving contacts:', error);
  }
}

// Funkcja do pobierania listy kontaktów
function listContacts() {
  return loadContacts();
}

// Funkcja do pobierania kontaktu po ID
function getById(id) {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.id === id);
}

// Funkcja do dodawania nowego kontaktu
function addContact(contact) {
  const contacts = loadContacts();
  const newContact = { id: Date.now().toString(), ...contact };
  contacts.push(newContact);
  saveContacts(contacts);
  return newContact;
}

// Funkcja do usuwania kontaktu po ID
function removeContact(id) {
  let contacts = loadContacts();
  const initialLength = contacts.length;
  contacts = contacts.filter((contact) => contact.id !== id);
  if (contacts.length < initialLength) {
    saveContacts(contacts);
    return true;
  }
  return false;
}

// Funkcja do aktualizacji kontaktu po ID
function updateContact(id, updatedContact) {
  const contacts = loadContacts();
  const contactIndex = contacts.findIndex((contact) => contact.id === id);
  if (contactIndex !== -1) {
    contacts[contactIndex] = { ...contacts[contactIndex], ...updatedContact };
    saveContacts(contacts);
    return contacts[contactIndex];
  }
  return null;
}

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
