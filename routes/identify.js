const express = require('express');
const Contact = require('../models/contact');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).send({ error: 'Email or phone number is required' });
  }

  const existingContacts = await Contact.find({
    $or: [
      { email: email },
      { phoneNumber: phoneNumber }
    ]
  });

  if (existingContacts.length === 0) {
    const newContact = new Contact({
      email,
      phoneNumber,
      linkPrecedence: 'primary'
    });
    await newContact.save();

    return res.status(200).send({
      contact: {
        primaryContactId: newContact._id,
        emails: [newContact.email].filter(Boolean),
        phoneNumbers: [newContact.phoneNumber].filter(Boolean),
        secondaryContactIds: []
      }
    });
  }

  // Determine the primary contact
  let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary');
  let secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');

  if (!primaryContact) {
    primaryContact = existingContacts[0];
  } else {
    // Ensure the oldest contact remains primary
    existingContacts.forEach(contact => {
      if (contact.linkPrecedence === 'primary' && contact.createdAt < primaryContact.createdAt) {
        secondaryContacts.push(primaryContact);
        primaryContact = contact;
      }
    });
  }

  const newSecondaryContacts = [];
  if (!existingContacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber)) {
    const newContact = new Contact({
      email,
      phoneNumber,
      linkedId: primaryContact._id,
      linkPrecedence: 'secondary'
    });
    await newContact.save();
    newSecondaryContacts.push(newContact);
  }

  secondaryContacts = [...secondaryContacts, ...newSecondaryContacts];

  const allContacts = await Contact.find({
    $or: [
      { email: primaryContact.email },
      { phoneNumber: primaryContact.phoneNumber },
      { linkedId: primaryContact._id }
    ]
  });

  const emails = [...new Set(allContacts.map(contact => contact.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allContacts.map(contact => contact.phoneNumber).filter(Boolean))];
  const secondaryContactIds = secondaryContacts.map(contact => contact._id);

  res.status(200).send({
    contact: {
      primaryContactId: primaryContact._id,
      emails,
      phoneNumbers,
      secondaryContactIds
    }
  });
});

module.exports = router;
