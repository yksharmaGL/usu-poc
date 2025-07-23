const express = require('express');
const db = require('../database/db');
const router = express.Router();

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

router.post('/form/meta_data', (req, res) => {
  const form = JSON.stringify(req.body);
  const query = 'INSERT INTO form_metadata (form_data) VALUES (?)';
  db.query(query, [form], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
      return;
    }
    res.status(200).send('Data saved');
  });
});

module.exports = router;
