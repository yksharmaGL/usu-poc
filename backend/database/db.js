const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'usupoc',
  port: 3306
});

// Connect to MySql
db.connect((err) => {
  if(err) {
    console.error('Error connecting to MySql: ' + err.stack);
    return;
  }
  console.log('Connected to MySql');
});

module.exports = db;