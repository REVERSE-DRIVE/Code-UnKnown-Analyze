const express = require("express");
const config = require("./config.json");

const app = global.app = express();
app.use(express.json());

require("./admin/user.js");

app.listen(config.port, () => console.log(`[API] server listen ${config.port}`));