const express = require('express');
const cors = require('cors');
const formRoutes = require('./routes/form');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', formRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
