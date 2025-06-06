const sql = require("../lib/sql");
const dateUtil = require("../lib/date");

app.get("/admin/exception", async function(req, res) {
    const timeId = Number(req.query.time);
    const YYMMDD = dateUtil.getYYMMDD_time(timeId);

    if (YYMMDD === null) {
        res.sendStatus(400);
        return;
    }


    const [rows] = await sql.query("SELECT type, SUM(count) AS count FROM exceptions WHERE time >= ? GROUP BY type", [ YYMMDD ]);
    res.send(rows);
});

app.get("/admin/exception/:type", async function(req, res) {
    const type = req.params.type;

    const timeId = Number(req.query.time);
    const YYMMDD = dateUtil.getYYMMDD_time(timeId);

    if (YYMMDD === null) {
        res.sendStatus(400);
        return;
    }
    
    const [rows] = await sql.query("SELECT func, sum(count) as count FROM exceptions WHERE time >= ? AND type = ? GROUP BY func", [ YYMMDD, type ]);
    res.send(rows);
});

app.get("/admin/exception/:type/:func/messages", async function(req, res) {
    const { type, func } = req.params;

    const timeId = Number(req.query.time);
    const YYMMDD = dateUtil.getYYMMDD_time(timeId);

    if (YYMMDD === null) {
        res.sendStatus(400);
        return;
    }
    
    const [rows] = await sql.query("SELECT message, count FROM exceptions WHERE time >= ? AND type = ? AND func = ? ORDER BY count DESC", [ YYMMDD, type, func ]);
    res.send(rows);
});

app.get("/admin/exception/:type/chart", async function(req, res) {
    const type = req.params.type;

    const YYMMDD = dateUtil.getYYMMDD_time(2); // 강제로 30일 전
    
    const [rows] = await sql.query("SELECT time, sum(count) as count  FROM exceptions WHERE time >= ? AND type = ? GROUP BY time;", [ YYMMDD, type ]);
    res.send(rows);
});