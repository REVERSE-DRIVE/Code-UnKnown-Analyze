const sql = require("../lib/sql");
const scenes = require("../scene.json");

const indexScene = {};
scenes.forEach(v => indexScene[v] = true);

app.post("/game/scene", async function(req, res) {
    const { scene } = req.body;
    
    if (typeof scene !== "string") {
        return res.status(400).send("scene 이름은 필수 입니다.");
    }

    if (!indexScene[scene]) {
        return res.status(400).send("알 수 없는 scene");
    }

    const connection = await sql.getConnection();
    const [rows] = await connection.query("SELECT created FROM users WHERE UUID = ?", [ req.uuid ]);

    if (rows.length === 0) {
        connection.release();
        return res.status(403).send("등록되지 않은 ID 입니다.");
    }

    const diff = Math.floor((new Date() - new Date(rows[0].created)) / 1000);
    const result = await connection.query("INSERT INTO scenes VALUES(?, ?, ?)", [ req.uuid, scene, diff ]).catch(e => e);
    connection.release();
    
    if (result.code !== undefined) {
        let error = [500, "DB ERROR"];
        
        if (result.code === "ER_DUP_ENTRY") {
            error = [200, "이미 등록되었습니다."];
        }
        return res.status(error[0]).send(error[1]);;
    }

    res.send('ok!');
});