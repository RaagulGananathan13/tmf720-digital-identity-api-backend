
const mongoose = require('mongoose');

const ContactMediumSchema = new mongoose.Schema({
  id: String,
  contactType: String,
  preferred: Boolean,
  validFor: {
    startDateTime: String,
    endDateTime: String
  },
  '@type': String,
  emailAddress: String,
  phoneNumber: String
}, { _id: false });

const CredentialSchema = new mongoose.Schema({
  id: String,
  state: String,
  trustLevel: String,
  contactMedium: [ContactMediumSchema],
  validFor: {
    startDateTime: String,
    endDateTime: String
  },
  '@type': String,
  login: String,
  password: String
}, { _id: false });

const AttachmentSchema = new mongoose.Schema({
  attachmentType: String,
  description: String,
  mimeType: String,
  name: String,
  url: String,
  size: {
    amount: Number,
    units: String
  },
  validFor: {
    startDateTime: String
  },
  '@type': String
}, { _id: false });

const DigitalIdentitySchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active', required: true },
  creationDate: { type: String, required: true },
  lastUpdate: String,
  nickname: String,
  attachment: [AttachmentSchema],
  contactMedium: [ContactMediumSchema],
  credential: { type: [CredentialSchema], required: true },
  individualIdentified: {
    id: String,
    name: String,
    '@type': String,
    '@referredType': String
  },
  partyRoleIdentified: [{
    id: String,
    '@type': String,
    '@referredType': String
  }],
  relatedParty: [{
    id: String,
    name: String,
    role: String,
    '@type': String,
    '@referredType': String
  }],
  validFor: {
    startDateTime: String,
    endDateTime: String
  },
  '@type': String
});

module.exports = mongoose.model('DigitalIdentity', DigitalIdentitySchema);
