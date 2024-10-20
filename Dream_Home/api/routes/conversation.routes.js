const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const { getAllMessages, getSingleUserMessages, singlePropertyMessages } = require('../controllers/conversation.controller');

const router = express.Router();

router.get('/:id', authenticateJWT, getAllMessages);
router.post('/:id/:id', authenticateJWT, getSingleUserMessages);
router.post('/:id/property', authenticateJWT, singlePropertyMessages);

module.exports = router;