const express = require('express');
const authenticateJWT = require('../middleware/authenticateJWT');
const { getUserDetails, updateUserDetails, findUser } = require('../controllers/user.controller');

const router = express.Router();

router.get('/', authenticateJWT, getUserDetails);
router.post('/finduser', findUser);
router.post('/:id/update', authenticateJWT, updateUserDetails);

module.exports = router;
