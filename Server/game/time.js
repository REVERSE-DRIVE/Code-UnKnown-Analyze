const sql = require('../lib/sql.js');

function randomString(length) {
    return Math.random().toString(36).substr(2, length);
}

app.post("/game/time/token", async function(req, res) {
    const token = randomString(10);
    const result = await sql.query("INSERT INTO time_token VALUES(?, ?, now())", [ req.uuid, token ]).catch(e => e);

    if (result.code !== undefined) {
        let error = [500, "db 오류"];
        switch (result.code) {
            case "ER_NO_REFERENCED_ROW_2":
                error = [403, "유저를 찾을 수 없습니다."];
                break;
            default:
                break;
        }

        res.status(error[0]).send(error[1]);
        return;
    }
    
    res.send(token);
});

async function getDuration(conn, uuid, token) {
    const [[row]] = await conn.query("SELECT `create` FROM time_token WHERE UUID = ? AND token = ?", [ uuid, token ]);
    
    if (row === undefined) {
        return false;
    }
    
    conn.query("DELETE FROM time_token WHERE token = ?", [ token ]);
    return Math.floor((new Date() - new Date(row.create)) / 1000); // 밀리초 -> 초
}