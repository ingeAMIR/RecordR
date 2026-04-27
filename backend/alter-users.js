const connection = require('./config/db');

setTimeout(() => {
  const query = `ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL, ADD COLUMN google_id VARCHAR(255) UNIQUE;`;

  connection.promise().query(query)
  .then(() => {
    console.log("Migration complete: added google_id and made password_hash optional in users");
    process.exit(0);
  })
  .catch((err) => {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
      process.exit(0);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}, 1000);
