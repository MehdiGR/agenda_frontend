import mysql from "mysql";

const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "agenda",
});

export default connection;
