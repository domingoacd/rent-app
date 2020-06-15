const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'rent_app',
  multipleStatements: true
});

connection.connect((err) => {
  if (err) {
    console.error('Connection error', err)
  } else {
    console.log('DB Connection Successful!');
  }
});
module.exports = connection;