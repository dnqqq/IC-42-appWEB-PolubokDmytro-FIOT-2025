const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root', 
    database: 'delivery_db',
    connectionLimit: 10
});

module.exports = pool;
