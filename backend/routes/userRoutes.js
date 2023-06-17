const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logOutUser, forgotPassword } = require('../controllers/userController/userController');

//Routes

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);
router.post('/password/forgot', forgotPassword);



module.exports = router;