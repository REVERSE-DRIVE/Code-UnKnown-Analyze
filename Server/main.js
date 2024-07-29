const express = require("express");
const config = require("./config.json");

const app = express();

app.use(express.json());

app.listen(config.port, () => console.log(`[API] server listen ${config.port}`));