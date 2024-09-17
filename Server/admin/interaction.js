const sql = require("../lib/sql.js");
const dateUtil = require("../lib/date");

const buttonList = require("../buttons.json");

const ID_LIST = exports.ID_LIST = {
    button: buttonList,
    skill: []
}

app.get("/admin/interaction/:type", async function(req, res) {
    const time = Number(req.query.time);
    const type = req.params.type;
    const YYMMDD = dateUtil.getYYMMDD_time(time);

    if (isNaN(time) || typeof(type) !== "string" || YYMMDD === null) {
        return res.sendStatus(400);
    }

    const idList = ID_LIST[type];
    if (idList === undefined) return res.sendStatus(400);

    const db = await sql.getConnection();

    const wait1 = db.query(`SELECT id, SUM(count) AS count, COUNT(DISTINCT UUID) AS access FROM interactions WHERE \`type\` = ? AND created >= ? GROUP BY id`, [ type.toUpperCase(), YYMMDD ]);
    const wait2 = db.query(`SELECT COUNT(*) as total FROM users`);
    
    const [ [rows], [[ { total } ]] ] = await Promise.all([wait1, wait2]);
    db.release();

    // 비어있는건 0으로 채워줌
    const alreadyIds = new Set();
    rows.forEach(v => alreadyIds.add(v.id));
    
    idList.forEach(v => {
        if (!alreadyIds.has(v))
            rows.push({ id: v, count: 0, access: 0 });
    });

    res.send({
        total,
        data: rows
    });
});