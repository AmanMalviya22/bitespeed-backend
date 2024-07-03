const express = require('express');
const Contact = require('../models/contact');
const router = express.Router();

router.post('/', async (req, res) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).send({ error: 'Email or phone number is required' });
  }

  // Find existing contacts with matching email or phoneNumber
  const existingContacts = await Contact.find({
    $or: [
      { email: email },
      { phoneNumber: phoneNumber }
    ]
  });

  // If no existing contacts found, create a new primary contact
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

  // Determine the primary contact and existing secondary contacts
  let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary');
  let secondaryContacts = existingContacts.filter(contact => contact.linkPrecedence === 'secondary');

  // If no primary contact found, set the first contact as primary
  if (!primaryContact) {
    primaryContact = existingContacts[0];
  }

  // Check if there's another primary contact to merge into current primary
  const mergePrimaryContact = existingContacts.find(contact =>
    contact.linkPrecedence === 'primary' && contact._id.toString() !== primaryContact._id.toString()
  );

  if (mergePrimaryContact) {
    // Convert the mergePrimaryContact to secondary
    mergePrimaryContact.linkPrecedence = 'secondary';
    mergePrimaryContact.linkedId = primaryContact._id;
    await mergePrimaryContact.save();

    // Update secondary contacts list
    secondaryContacts.push(mergePrimaryContact);
  }

  // Check if the current request's email or phoneNumber matches an existing contact
  const matchContact = existingContacts.find(contact =>
    (email && contact.email === email) || (phoneNumber && contact.phoneNumber === phoneNumber)
  );

  // If there's a match and it's not the current primary contact, convert it to secondary
  if (matchContact && matchContact._id.toString() !== primaryContact._id.toString()) {
    matchContact.linkPrecedence = 'secondary';
    matchContact.linkedId = primaryContact._id;
    await matchContact.save();

    // Update secondary contacts list
    secondaryContacts.push(matchContact);
  }

  // If no match found, create a new secondary contact
  if (!matchContact && (email || phoneNumber)) {
    const newContact = new Contact({
      email,
      phoneNumber,
      linkedId: primaryContact._id,
      linkPrecedence: 'secondary'
    });
    await newContact.save();
    secondaryContacts.push(newContact);
  }

  // Fetch all contacts related to the primary contact
  const allContacts = await Contact.find({
    $or: [
      { email: primaryContact.email },
      { phoneNumber: primaryContact.phoneNumber },
      { linkedId: primaryContact._id }
    ]
  });

  // Extract unique emails and phone numbers
  const emails = [...new Set(allContacts.map(contact => contact.email).filter(Boolean))];
  const phoneNumbers = [...new Set(allContacts.map(contact => contact.phoneNumber).filter(Boolean))];
  const secondaryContactIds = secondaryContacts.map(contact => contact._id);

  // Send response with consolidated contact information
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
