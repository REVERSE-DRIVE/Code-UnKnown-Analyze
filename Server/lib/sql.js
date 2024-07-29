const mysql = require("mysql2");
const { sql: cfg } = require("../config.json");

const pool = mysql.createPool({
    host: cfg.host,
    port: cfg.port,
    database: cfg.database,

    user: cfg.user,
    password: cfg.password
});

module.exports = pool.promise();