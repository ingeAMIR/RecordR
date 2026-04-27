const connection = require('./config/db');

// Allow db.js to connect and switch db (since it happens asynchronously)
setTimeout(() => {
  const query = `ALTER TABLE match_opinions ADD COLUMN parent_id INT DEFAULT NULL;`;
  const fkQuery = `ALTER TABLE match_opinions ADD FOREIGN KEY (parent_id) REFERENCES match_opinions(id) ON DELETE CASCADE;`;

  connection.promise().query(query)
    .then(() => connection.promise().query(fkQuery))
  .then(() => {
    console.log("Migration complete: added parent_id");
    process.exit(0);
  })
  .catch((err) => {
    // ignore if already exists
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log("Column already exists.");
      process.exit(0);
    } else {
      console.error(err);
      process.exit(1);
    }
  });
}, 1000);
