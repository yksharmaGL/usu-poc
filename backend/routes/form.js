const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const formPath = path.join(__dirname, '../data/form.json');

// Get stored form JSON
router.get('/form', (req, res) => {
  const data = fs.readFileSync(formPath, 'utf8');
  res.json(JSON.parse(data));
});

// Save form JSON from builder
router.post('/form', (req, res) => {
  fs.writeFileSync(formPath, JSON.stringify(req.body, null, 2));
  res.json({ message: 'Form saved successfully' });
});

module.exports = router;
