var mysql = require('mysql2');

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '12345',
  database : 'saboroso',
  multipleStatements: true
});

module.exports = connection;