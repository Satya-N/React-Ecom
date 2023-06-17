const { addUser, findOneUser } = require('./user.dao');
const User = require('../../models/userModel');
const { successResponse, errorResponse } = require('../../utils/responseHandler');
const sendToken = require('../../utils/jwtToken');
const sendEmail = require('../../utils/sendEmail');


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

const logOutUser = async( req, res, next) => {
    try{
        const result = res.cookie('token', null, {
            expires: new Date(Date.now()),
            httpOnly: true
        })
        if(!result) return res.status(401).send(errorResponse('Logout Failed'));
        res.status(200).send(successResponse('Logged Out'));
    }catch(e) {
        res.status(500).send(errorResponse(e.message? e.message : 'Something Went Wrong'));
    }
}

const forgotPassword = async(req, res, next) => {
    try{
        const email = req.body.email;
        const user = await findOneUser({email});
        if(!user) return res.status(400).send(errorResponse('User Not Found'));
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

    }catch(e) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500).send(errorResponse(e.message))
    }
}

module.exports = {
    registerUser,
    loginUser,
    logOutUser,
    forgotPassword
}