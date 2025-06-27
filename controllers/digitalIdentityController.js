const DigitalIdentity = require('../models/DigitalIdentity');
const Hub = require('../models/Hub');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Notify subscribers
const notifyListeners = async (eventType, digitalIdentity) => {
  const hubs = await Hub.find();
  const event = {
    eventId: uuidv4(),
    eventTime: new Date().toISOString(),
    eventType,
    event: { digitalIdentity },
  };
  for (const hub of hubs) {
    try {
      await axios.post(hub.callback, event);
    } catch (err) {
      console.error(`Failed to notify hub ${hub.callback}:`, err.message);
    }
  }
};

// GET all Digital Identities
exports.listDigitalIdentities = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.creationDate) filter.creationDate = req.query.creationDate;
    if (req.query.id) filter.id = req.query.id;

    const identities = await DigitalIdentity.find(filter).lean();
    const requiredFields = ['id', 'href', 'creationDate', 'status', 'credential'];

    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      requiredFields.forEach(f => {
        if (!fields.includes(f)) fields.push(f);
      });

      const filtered = identities.map(obj =>
        Object.fromEntries(fields.map(f => [f, obj[f] !== undefined ? obj[f] : getDefault(f)]))
      );
      return res.status(200).json(filtered);
    }

    const patched = identities.map(identity => {
      requiredFields.forEach(field => {
        if (!(field in identity) || identity[field] === null || identity[field] === undefined) {
          identity[field] = getDefault(field);
        }
      });
      return identity;
    });

    res.status(200).json(patched);
  } catch (err) {
    res.status(500).json({ code: 500, reason: err.message });
  }
};

function getDefault(field) {
  const defaults = {
    status: 'active',
    credential: [],
    creationDate: new Date().toISOString(),
    href: '',
    id: ''
  };
  return defaults[field] || null;
}

// GET by ID
exports.getDigitalIdentityById = async (req, res) => {
  try {
    const identity = await DigitalIdentity.findOne({ id: req.params.id });
    if (!identity) return res.status(404).json({ code: 404, reason: 'Not found' });
    res.status(200).json(identity);
  } catch (err) {
    res.status(500).json({ code: 500, reason: err.message });
  }
};

// POST new Digital Identity
exports.createDigitalIdentity = async (req, res) => {
  try {
    const id = uuidv4();
    const creationDate = new Date().toISOString();
    const href = `http://localhost/DigitalIdentity/${id}`;

    if (!req.body.credential || !Array.isArray(req.body.credential) || req.body.credential.length === 0) {
      return res.status(400).json({ code: 400, reason: "Missing 'credential' array" });
    }

    const newIdentity = new DigitalIdentity({
      ...req.body,
      id,
      href,
      creationDate,
      status: req.body.status || "active"
    });

    await newIdentity.save();
    notifyListeners("DigitalIdentityCreationNotification", newIdentity);
    res.status(201).json(newIdentity);
  } catch (err) {
    res.status(500).json({ code: 500, reason: err.message });
  }
};

// PATCH Digital Identity
exports.patchDigitalIdentity = async (req, res) => {
  try {
    const identity = await DigitalIdentity.findOne({ id: req.params.id });
    if (!identity) return res.status(404).json({ code: 404, reason: 'Not found' });

    Object.assign(identity, req.body, { lastUpdate: new Date().toISOString() });
    await identity.save();
    await notifyListeners('DigitalIdentityChangeEvent', identity);
    res.status(200).json(identity);
  } catch (err) {
    res.status(500).json({ code: 500, reason: err.message });
  }
};

// DELETE Digital Identity
exports.deleteDigitalIdentity = async (req, res) => {
  try {
    const identity = await DigitalIdentity.findOneAndDelete({ id: req.params.id });
    if (!identity) return res.status(404).json({ code: 404, reason: 'Not found' });
    await notifyListeners('DigitalIdentityDeleteEvent', identity);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ code: 500, reason: err.message });
  }
};
