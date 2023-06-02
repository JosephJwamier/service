const mysql = require('mysql2/promise');
require('dotenv').config()
mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
}).then(connection => {
    connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`).then((res) => {
        console.info("Database create or successfully checked");
        // process.exit(0);
    })})
