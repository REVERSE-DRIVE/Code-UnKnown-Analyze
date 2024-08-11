const sql = require("../lib/sql.js");
const { getYYMMDD_time } = require("../lib/date");

app.get("/admin/time/ingame_chart", async function(req, res) {
    const YYMMDD = getYYMMDD_time(2); // 무조건 30일 전
    const serverTime = new Date();
    
    const [rows] = await sql.query(`SELECT FLOOR(AVG(time)) AS time, created FROM
        (SELECT UUID, SUM(time) AS time, DATE(created) AS created FROM time_game WHERE DATE(created) >= ? GROUP BY UUID, DATE(created)) AS domi
        GROUP BY created`, [ YYMMDD ]);

    res.send({ result: rows, server_time: serverTime });
});

app.get("/admin/time/scene_chart", async function(req, res) {
    const YYMMDD = getYYMMDD_time(2); // 무조건 30일 전

    const [rows] = await sql.query(`SELECT scene, FLOOR(AVG(time)) AS time, created FROM 
        (SELECT UUID, scene, SUM(TIME) AS time, DATE(created) AS created FROM time_scene WHERE DATE(created) >= ? GROUP BY UUID, scene, DATE(created)) AS domi
        GROUP BY scene, created;`, [ YYMMDD ]);

    res.send(rows);
});

app.get("/admin/time/scene", async function(req, res) {
    const { time } = req.query;
    const YYMMDD = getYYMMDD_time(Number(time));
    
    if (YYMMDD === null) {
        return res.sendStatus(400);
    }

    const [rows] = await sql.query(`SELECT scene, FLOOR(AVG(time)) AS time FROM 
        (SELECT UUID, scene, SUM(TIME) AS time, DATE(created) AS created FROM time_scene WHERE DATE(created) >= ? GROUP BY UUID, scene) AS domi
        GROUP BY scene`, [ YYMMDD ]);

    res.send(rows);
});