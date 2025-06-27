const express = require('express');
const router = express.Router();

const digitalIdentityController = require('../controllers/digitalIdentityController');

router.get('/', digitalIdentityController.listDigitalIdentities);
router.get('/:id', digitalIdentityController.getDigitalIdentityById);
router.post('/', digitalIdentityController.createDigitalIdentity);
router.patch('/:id', digitalIdentityController.patchDigitalIdentity);
router.delete('/:id', digitalIdentityController.deleteDigitalIdentity);

module.exports = router;
