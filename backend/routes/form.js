const express = require('express');
const db = require('../database/db');
const router = express.Router();

router.get('/form/meta_data', (req, res) => {
   console.log("PArams", req.params)
  db.query('SELECT * FROM form_metadata', (err, results) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send('Error fetching metadata');
      return;
    }
    res.json(results);
  });
});

router.get('/form/meta_data/:id', (req, res) => {
  console.log("PArams", req.params)
  const formId = parseInt(req.params.id, 10);

  if (isNaN(formId)) {
    return res.status(400).send('Invalid form ID');
  }

  db.query('SELECT * FROM form_metadata WHERE id = ?', [formId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err.stack);
      return res.status(500).send('Internal Server Error');
    }
    if (results.length === 0) {
      return res.status(404).send('Form not found');
    }
    res.json(results[0]);
  });
})

module.exports = router;
