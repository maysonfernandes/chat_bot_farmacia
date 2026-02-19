const mysql = require('mysql2/promise');
const { MYSQL } = require('../config/env');

const pool = mysql.createPool({
    ...MYSQL,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
