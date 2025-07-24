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

  // Call function to create tables
  createTables();
});

function createTables() {
  const formMetadataTable = `
    CREATE TABLE IF NOT EXISTS form_metadata (
        id INT AUTO_INCREMENT PRIMARY KEY,
        form_data JSON NOT NULL
      )
  `;

  db.query(formMetadataTable, (err, result) => {
    if (err) {
      console.error('Error creating Form Metadata table:', err);
    } else {
      console.log('Table Form Metadata created');
    }
  });

  const createSubmittedFormsTable = `
    CREATE TABLE IF NOT EXISTS submitted_forms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        metadata_id INT NOT NULL,
        form_data JSON NOT NULL,
        FOREIGN KEY (metadata_id) REFERENCES form_metadata(id) ON DELETE CASCADE
      )
  `;

  db.query(createSubmittedFormsTable, (err, result) => {
    if (err) {
      console.error('Error creating submitted forms table:', err);
    } else {
      console.log('Table submitted forms created');
    }
  });
}

module.exports = db;