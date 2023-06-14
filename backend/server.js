const app = require('./app');
const dotenv = require('dotenv');
const dbconnection = require('./config/db')

//Config
dotenv.config({ path: 'backend/config/config.env' });

//Connect Database
dbconnection()


const PORT = process.env.PORT || 3300
app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`)
})