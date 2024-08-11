const sql = require("../lib/sql.js");
const { getYYMMDD_time } = require("../lib/date");

app.get("/admin/time/ingame_chart", async function(req, res) {
    const YYMMDD = getYYMMDD_time(2); // 무조건 30일 전
    
    const [rows] = await sql.query(`SELECT FLOOR(AVG(time)) AS time, created FROM
        (SELECT UUID, SUM(time) AS time, DATE(created) AS created FROM time_game WHERE DATE(created) >= ? GROUP BY UUID, DATE(created)) AS domi
        GROUP BY created`, [ YYMMDD ]);

    res.send(rows);
});

app.get("/admin/time/scene", async function(req, res) {
    
});