const sql = require("../lib/sql");
const dateUtil = require("../lib/date");

app.post("/game/excpetion", async function(req, res) {
    const body = req.body;
    
    if (!(body instanceof Array)) {
        res.sendStatus(400);
        return;
    }

    // 무결성 검사
    for (const iterator of body) {
        if (typeof iterator.type !== "string" || typeof iterator.function !== "string" || typeof iterator.stack !== "string" || typeof iterator.count !== "number") {
            res.sendStatus(400);
            return;
        }
    }

    const connection = await sql.getConnection();
    await connection.beginTransaction();

    try {
        let waits = [];
        for (const iterator of body) {
            waits.push(registerException(connection, iterator));
        }

        await Promise.all(waits);

        await connection.commit();

        res.send('ok!');
    } catch(e) {
        console.error(e);
        
        await connection.rollback();

        res.sendStatus(500);
    }

    connection.release();
});

async function registerException(conn, data) {
    const nowYYMMDD = dateUtil.getYYMMDD(new Date());

    const [[{ count }]] = await conn.query("SELECT count(*) AS count FROM exceptions WHERE type = ? AND func = ? AND message = ? AND time = ? FOR UPDATE", [ data.type, data.function, data.stack, nowYYMMDD ]);
    
    let wait;
    if (count > 0) {
        wait = conn.query("UPDATE exceptions SET count = count + ? WHERE type = ? AND func = ? AND message = ? AND time = ?", [data.count, data.type, data.function, data.stack, nowYYMMDD]);
    } else {
        wait = conn.query("INSERT INTO exceptions VALUES(?, ?, ?, ?, ?)", [data.type, data.function, data.stack, data.count, nowYYMMDD]);
    }

    await wait;
}