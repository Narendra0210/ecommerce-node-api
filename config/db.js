 const mysql = require('mysql2/promise');
 const mysqlPool =  mysql.createPool ({
    host : 'localhost',
    user: 'root',
    password : '867666122',
    database: 'branch',
     waitForConnections: true,
  connectionLimit: 10
 })

 module.exports = mysqlPool;