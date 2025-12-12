const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "NAVIYA-MD=fVVX3BCb#9aJ-fkWVdjic36KyCJ_otnufDJRCR1jBFF92GdOXs7Y",
MONGODB: process.env.MONGODB || "mongodb+srv://darknaviya78_db_user:mbWTl6vbPt8J9Y0S@cluster0.jwwyvwc.mongodb.net",
OMDB_API_KEY: process.env.OMDB_API_KEY || "8748dc2e",
AUTO_RECORDING:process.env.AUTO_RECORDING || "true",
AUTO_NEWS:process.env.AUTO_NEWS || "false",
AUTO_STATUS_LIKE: process.env.AUTO_STATUS_LIKE || "true" 
};






