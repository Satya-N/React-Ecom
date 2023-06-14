const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Config
dotenv.config({ path: 'backend/config/config.env' });

const dbURI = process.env.dbURI;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected`);
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

module.exports = connectDB;