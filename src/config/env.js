require('dotenv').config();

module.exports = {
    MYSQL: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    BOT: {
        RATE_LIMIT: 10 // msgs/min
    }
};
