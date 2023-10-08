import fs from 'fs/promises';
import { nanoid } from 'nanoid';

const contactsPath = './models/contacts.json';

export const listContacts = async () => {
	const jsonString = await fs.readFile(contactsPath, 'utf8');
	return JSON.parse(jsonString);
};

export const getContactById = async (contactId) => {
	const jsonString = await fs.readFile(contactsPath, 'utf8');
	const contacts = JSON.parse(jsonString);

	return contacts.find((contact) => contact.id === contactId);
};

export const removeContact = async (contactId) => {
	const jsonString = await fs.readFile(contactsPath, 'utf8');
	const contacts = JSON.parse(jsonString);

	const numberOfContacts = contacts.length;
	contacts.splice(
		contacts.findIndex(function (i) {
			return i.id === contactId;
		}),
		1
	);

	if (contacts.length === numberOfContacts) return;

	await fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf8');
};

export const addContact = async (body) => {
	const { name, email, phone } = body;
	const jsonString = await fs.readFile(contactsPath, 'utf8');
	const contacts = JSON.parse(jsonString);

	const newContact = { id: nanoid(), name, email, phone };
	contacts.push(newContact);

	await fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf8');
	return newContact;
};

export const updateContact = async (contactId, body) => {
	const jsonString = await fs.readFile(contactsPath, 'utf8');
	const contacts = JSON.parse(jsonString);

	let contact = contacts.find((contact) => contact.id === contactId);
	if (contact === undefined) {
		return;
	}

	Object.assign(contact, body);
	await fs.writeFile(contactsPath, JSON.stringify(contacts), 'utf8');
	return contact;
};
