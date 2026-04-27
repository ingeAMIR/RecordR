const fs = require('fs');
const path = require('path');
const connection = require('./config/db');

const schemaPath = path.join(__dirname, 'sql', 'schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

const statements = schemaSql.split(';').filter(stmt => stmt.trim() !== '');

// Run statements sequentially
const runStatements = async () => {
    try {
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.promise().query(statement);
                console.log('Executed:', statement.substring(0, 50) + '...');
            }
        }
        console.log('Database initialized successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error initializing database:', err);
        process.exit(1);
    }
};

// Wait for connection to be established (db.js connects on load)
setTimeout(runStatements, 1000);
