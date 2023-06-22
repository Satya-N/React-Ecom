const { addUser, findOneUser, findUserById, findUserByIdAndUpdate, findUsers, findUserByIdAndRemove } = require('./user.dao');
const User = require('../../models/userModel');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const sendToken = require('../../utils/jwtToken');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto');

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(422).send(errorResponse('Enter All The Details'));
        const user = await addUser({
            name,
            email,
            password,
            avatar: {
                public_id: 'this is sample',
                url: 'profilepic'
            }
        });
        sendToken(user, 201, res)
    } catch (e) {
        res.status(500).send(errorResponse(e.message))
    }
}


// Login User

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).send(errorResponse('Please Enter Email & Password'));
        const user = await findOneUser({ email }).select("+password"); //this code without the Select will give user data without password as we (password{select :false}) in USER Model
        if (!user) return res.status(404).send(errorResponse('User Not Found'));
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return res.status(401).send(errorResponse('Invalid Email or Password'))
        }
        sendToken(user, 200, res);
    } catch (e) {
        res.status(500).send(errorResponse(e.message));
    }
}

const logOutUser = async (req, res, next) => {
    try {
        const result = res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        if (!result) return res.status(401).send(errorResponse('Logout Failed'));
        res.status(200).send(successResponse('Logged Out'));
    } catch (e) {
        res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'));
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await findOneUser({ email });
        if (!user) return res.status(400).send(errorResponse('User Not Found'));
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
        const message = `Your Password Reset Token is :- \n\n ${resetPasswordURL} \n\n If u have not requested this, please ignore it`;

        const sendMail = await sendEmail({
            email,
            subject: `Password Recovery`,
            message
        });
        res.status(200).send(successResponse(`Email Sent to ${user.email} Successfully`))

    } catch (e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).send(errorResponse(e.message))
    }
}


const resetPassword = async (req, res, next) => {
    try {
        const token = req.params.token;
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) return res.status(400).send(errorResponse('Reset Password Token is Invalid or Expired'));
        if (req.body.password !== req.body.confirmPassword) return res.status(400).send(errorResponse('Password Does not Match'));
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        sendToken(user, 200, res);
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'));
    }
}


const getUserDetails = async (req, res, next) => {
    try {

        const userId = req.user.id;
        let user = await findUserById(userId);
        if (!user) return res.status(404).send(errorResponse('User Not Found'));
        user = user._doc
        return res.status(200).send(successResponse('Fetched Successfully', { user }))

    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'));
    }
}

const updatePassword = async (req, res, next) => {
    try {

        const userId = req.user.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;
        let user = await findUserById(userId).select("+password");
        if (!user) return res.status(404).send(errorResponse('User Not Found'));
        const isPasswordMatched = await user.comparePassword(oldPassword);
        if (!isPasswordMatched) return res.status(400).send(errorResponse('Old Password is Incorrect'));
        if (newPassword !== confirmPassword) return res.status(400).send(errorResponse('Password Does not Match'));
        user.password = newPassword;
        await user.save();
        return res.status(200).send(successResponse('Updated Successfully', { user: user._doc }))

    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'));
    }
}


const updateUserProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email
        }
        const user = await findUserByIdAndUpdate(req.user.id, newUserData);
        if (!user) return res.status(404).send(errorResponse('User Not Found'));
        return res.status(200).send(successResponse('Updated Successfully', { user: user._doc }))
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went wrong'))
    }
}

const getAllUsers = async (req, res, next) => {
    try {
        const users = await findUsers();
        if (!users) return res.status(404).send(errorResponse('No Users Found'));
        return res.status(200).send(successResponse('Fetched Successfully', { users }));
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'))
    }
}

const getOneUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await findUserById(userId);
        if (!user) return res.status().send(errorResponse(`User does not Exist With id ${userId}`));
        return res.status(200).send(successResponse('Fetched Successfully', { user: user._doc }));
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'))
    }
}

//Update User Role - ADMIN
const updateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }
        const userId = req.params.userId;
        const user = await findUserByIdAndUpdate(userId, newUserData);
        if (!user) return res.status().send(errorResponse(`User does not Exist With id ${userId}`));
        res.status(200).send(successResponse('Updated Successfully', { user: user._doc }))
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'))

    }
}

//Delete User - ADMIN
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await findUserByIdAndRemove(userId);
        if (!user) return res.status(400).send(errorResponse('User does not Exist'));
        res.status(200).send(successResponse('Deleted Successfully'));
    } catch (e) {
        return res.status(500).send(errorResponse(e.message ? e.message : 'Something Went Wrong'))

    }
}



module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateUserProfile,
    getAllUsers,
    getOneUser,
    updateProfile,
    deleteUser
}