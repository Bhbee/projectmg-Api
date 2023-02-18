const express = require("express");
const router = express.Router();


const authController = require("../controllers/authController");
const resetPassword = require("../controllers/resetPassword");


router.post('/register', authController.register)
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.get('/refreshToken', authController.refreshToken)
router.post('/forgotPassword', resetPassword.getLink);
router.get('/reset-password/:id/:token', resetPassword.verification);
router.post('/reset-password/:id/:token', resetPassword.reset);
module.exports = router;
