const express = require("express");
const config = require("./config.json");

const app = global.app = express();
app.use(express.json());

const HEAD_TAG = 'DOMI ';
app.use(function(req, res, next) {
    if (!req.path.startsWith('/game') || req.path === "/game/register") {
        return next();
    }

    // 헤더 검증
    const data = req.headers["authorization"];
    if (typeof data !== "string") {
        return res.sendStatus(401);
    }

    if (!data.startsWith(HEAD_TAG)) {
        return res.sendStatus(400);
    }

    req.uuid = data.substring(data.indexOf(HEAD_TAG) + HEAD_TAG.length);
    next();
});

require("./admin/user.js");
require("./game/user.js");
require("./admin/scene.js");
require("./game/scene.js");
require("./admin/exception.js");
require("./game/exception.js");
require("./admin/time.js");
require("./game/time.js");
require("./admin/interaction.js");
require("./game/interaction.js");

app.listen(config.port, () => console.log(`[API] server listen ${config.port}`));