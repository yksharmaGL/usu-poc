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

module.exports = router;
