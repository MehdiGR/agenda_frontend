const mysql = require("mysql2");
const bluebird = require("bluebird");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "",
  database: "agenda",
  Promise: bluebird,
  multipleStatements: true,
});

connection.connect((err) => {
  if (err) {
    console.log("Failed to connect to the database:", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

// Automatically attempt to reconnect on connection errors
connection.on("error", (err) => {
  console.log("Connection error:", err);
  if (
    err.message.includes(
      "Can't add new command when connection is in closed state"
    )
  ) {
    console.log("Attempting to reconnect...");
    connection = mysql.createConnection(connection.config);
    connection.connect((err) => {
      if (err) {
        console.log("Failed to reconnect to the database:", err);
      } else {
        console.log("Successfully reconnected to the database");
      }
    });
  } else {
    throw err;
  }
});

module.exports = connection;
