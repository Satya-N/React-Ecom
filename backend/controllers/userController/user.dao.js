const User = require('../../models/userModel');

const addUser = (data) => {
    return User.create(data);
};

const findOneUser = (email) => {
    return User.findOne(email);
}

module.exports = {
    addUser,
    findOneUser
}