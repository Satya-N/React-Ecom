const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getOneUser, deleteUser, updateProfile } = require('../controllers/userController/userController');
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth')
//Routes

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);
router.get('/me', isAuthenticatedUser, getUserDetails);
router.put('/me/update', isAuthenticatedUser, updateUserProfile);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.get('/admin/user/:userId', isAuthenticatedUser, authorizeRole("admin"), getOneUser);
router.get('/admin/users', isAuthenticatedUser, authorizeRole("admin"), getAllUsers);
router.put('/admin/user/:userId', isAuthenticatedUser, authorizeRole("admin"), updateProfile);
router.delete('/admin/user/:userId', isAuthenticatedUser, authorizeRole("admin"), deleteUser);



module.exports = router;