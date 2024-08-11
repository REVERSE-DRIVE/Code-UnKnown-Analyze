const sql = require('../lib/sql.js');
const scenes = require("../scene.json");

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

app.post("/game/time/ingame", async function(req, res) {
    const { token } = req.body;

    if (typeof token !== "string") {
        return res.sendStatus(400);
    }
    
    const connection = await sql.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작
    
    // 걸린시간 불러오기
    const duration = await getDuration(connection, req.uuid, token);
    if (duration === false) {
        connection.release();
        res.status(400).send("not found token");
        return;
    }

    try {
        await connection.query("INSERT INTO time_game VALUES(?, ?, NOW())", [ req.uuid, duration ]);
        await connection.commit();

        res.send("ok!");
    } catch { // 실패
        res.sendStatus(500);

        await connection.rollback();
    }
    
    connection.release();
});

const indexScene = {};
scenes.forEach(v => indexScene[v] = true);

app.post("/game/time/scene", async function(req, res) {
    const { scene, token } = req.body;

    if (typeof token !== "string") {
        return res.sendStatus(400);
    }
    if (typeof scene !== "string" || indexScene[scene] !== true) {
        return res.status(400).send("알 수 없는 scene");
    }
    
    const connection = await sql.getConnection();
    await connection.beginTransaction(); // 트랜잭션 시작
    
    // 걸린시간 불러오기
    const duration = await getDuration(connection, req.uuid, token);
    if (duration === false) {
        connection.release();
        res.status(400).send("not found token");
        return;
    }

    try {
        await connection.query("INSERT INTO time_scene VALUES(?, ?, ?, NOW())", [ req.uuid, scene, duration ]);
        await connection.commit();

        res.send("ok!");
    } catch { // 실패
        res.sendStatus(500);

        await connection.rollback();
    }
    
    connection.release();
});