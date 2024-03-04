const mysql = require("mysql2");
const bluebird = require("bluebird");

// Create a connection pool
const connection = mysql.createPool({
  connectionLimit: 10, // Adjust this value based on your requirements
  host: "localhost",
  user: "root",
  port: "3306",
  password: "",
  database: "agenda",
  Promise: bluebird,
  multipleStatements: true,
  timezone: "Z",
});

// Promisify the pool
connection.query = bluebird.promisify(connection.query);

// Export a function to execute queries
module.exports = connection;
