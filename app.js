const express = require("express");
const app = express();
const http = require("http");
require('dotenv').config()

const server = http.createServer(app);
const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`server is starting on port http://localhost:${PORT} ..`))





