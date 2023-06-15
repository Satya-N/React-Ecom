const app = require('./app');
const dotenv = require('dotenv');
const dbconnection = require('./config/db');


//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);

     process.exit(1);
});

//Config
dotenv.config({ path: 'backend/config/config.env' });

//Connect Database
dbconnection()

const PORT = process.env.PORT || 3300
const server = app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`)
});

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting Down Server due to Unhandled Promise Rejection`);

    server.close(() => {
        process.exit(1);
    })
})