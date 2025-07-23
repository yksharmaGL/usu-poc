const express = require('express');
const router = express.Router();
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

router.get('/form/meta_data', (req, res) => {
  db.query('SELECT * FROM form_metadata', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching metadata');
      return;
    }
    res.json(results);
  });
});

module.exports = router;
