 const mysql = require('mysql2/promise');
 const mysqlPool =  mysql.createPool ({
//     host : 'localhost', 
//     user: 'root',
//     password : '867666122',
//     database: 'branch',
//      waitForConnections: true,
//   connectionLimit: 10

 host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
 })


 module.exports = mysqlPool;