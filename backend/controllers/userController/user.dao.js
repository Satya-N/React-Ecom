const User = require('../../models/userModel');

const addUser = (data) => {
    return User.create(data);
};

const findOneUser = (email) => {
    return User.findOne(email);
}

const findUserById = (userId) => {
    return User.findById(userId);
}

const findUserByIdAndUpdate = (userId, newData) => {
    return User.findByIdAndUpdate(userId, newData, { new: true, runValidators: true, useFindAndModify: false });
}

const findUsers = () => {
    return User.find();
}

module.exports = {
    addUser,
    findOneUser,
    findUserById,
    findUserByIdAndUpdate,
    findUsers
}