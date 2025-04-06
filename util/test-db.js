// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '!QAZ2wsx3edc',
  database: 'spendwise' // <- change this if your DB name is different
});
connection.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err.stack);
    return;
  }
  console.log('✅ Connected to database!');
  // Optional: test a query
  connection.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('❌ Query test failed:', err);
    } else {
      console.log('✅ Test query result:', results[0].result); // Should print 2
    }
    connection.end(); // Close connection after test
  });
});
