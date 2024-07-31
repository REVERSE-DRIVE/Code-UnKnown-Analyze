const sql = require("../lib/sql");
const dateUtil = require("../lib/date");

app.get("/admin/user", async function(req, res) {
    const now = new Date();
    const server_date = now.getDate();

    now.setDate(1);
    const YYMMDD = dateUtil.getYYMMDD(now);

    const old_date = new Date();
    old_date.setMonth((old_date.getMonth() - 1 /* 1개월 뺌 */) % 12);

    const old_YYMMDD = dateUtil.getYYMMDD(old_date);

    const connection = await sql.getConnection();

    const waitRow1 = connection.query("SELECT DAY(time) as day, count(*) as count FROM connects WHERE time >= ? GROUP BY DATE(`time`)", [ YYMMDD ]);
    const waitRow3 = connection.query("SELECT DAY(created) as day, count(*) as count FROM users WHERE created >= ? GROUP BY DATE(created)", [ YYMMDD ]);
    const waitRow2 = connection.query(`
    SELECT
        total_users,
        total_users - GREATEST(recent_users, 0) AS inactive_users
    FROM
        (SELECT
            (SELECT COUNT(DISTINCT UUID) FROM connects) AS total_users,
            (SELECT COUNT(DISTINCT UUID) FROM connects WHERE time > ?) AS recent_users
        ) AS counts;
    `, old_YYMMDD);

    const [[rows], [rows2], [rows3]] = await Promise.all([waitRow1, waitRow2, waitRow3]);
    const row2 = rows2[0];

    connection.release();

    res.send({
        play: rows,
        new_play: rows3,
        ...row2,
        server_date
    });
});