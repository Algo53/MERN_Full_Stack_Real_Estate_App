const express = require('express');
const { loginController, registerController, logoutController, googleLogin, loginSucess } = require('../controllers/auth.controller');
const authenticateJWT = require('../middleware/authenticateJWT');
const passport = require('passport');

const router = express.Router();


router.post('/login', loginController);
router.get('/login/success', authenticateJWT, loginSucess);
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'], }));
router.get('/google/callback', googleLogin);
router.post('/register', registerController);
router.get('/logout', authenticateJWT, logoutController);

module.exports = router;