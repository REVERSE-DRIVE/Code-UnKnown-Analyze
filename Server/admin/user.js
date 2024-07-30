const sql = require("../lib/sql");

app.get("/admin/user", async function(req, res) {
    const now = new Date();
    const server_date = now.getDate();

    now.setDate(1);
    const YYMMDD = getYYMMDD(now);

    const old_date = new Date();
    old_date.setMonth((old_date.getMonth - 1 /* 1개월 뺌 */) % 12);

    const old_YYMMDD = getYYMMDD(now);

    const waitRow1 = sql.query("SELECT DAY(time) as day, count(*) as count FROM connects WHERE time >= ? GROUP BY DATE(`time`)", [ YYMMDD ]);
    const waitRow2 = sql.query(`
    SELECT
        total_users,
        total_users - GREATEST(recent_users, 0) AS inactive_users
    FROM
        (SELECT
            (SELECT COUNT(DISTINCT UUID) FROM connects) AS total_users,
            (SELECT COUNT(DISTINCT UUID) FROM connects WHERE time > ?) AS recent_users
        ) AS counts;
    `, old_YYMMDD);

    const [[rows], [rows2]] = await Promise.all([waitRow1, waitRow2]);
    const row2 = rows2[0];

    res.send({
        play: rows,
        ...row2,
        server_date
    });
});

function getYYMMDD(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}