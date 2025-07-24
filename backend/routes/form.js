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


router.post('/form/submitted_forms', (req, res) => {
  const { metadata_id, form_data } = req.body;
  console.log("REQ", req.body);
  const query = 'INSERT INTO submitted_forms (metadata_id, form_data) VALUES (?, ?)';
  db.query(query, [metadata_id, JSON.stringify(form_data)], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Database error');
      return;
    }
    res.status(200).send('Data saved');
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
router.get('/form/submitted_forms/:id', (req, res) => {
  console.log("SubmittedForms", req.params)
  const metadataId = parseInt(req.params.id, 10);

  if (isNaN(metadataId)) {
    return res.status(400).send('Invalid form ID');
  }

  db.query('SELECT * FROM submitted_forms WHERE metadata_id = ?', [metadataId], (err, results) => {
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
