const sql = require("../lib/sql");
const dateUtil = require("../lib/date");

app.post("/game/register", async function(req, res) {
    const { uuid, model, platform } = req.body;
    if (typeof uuid !== "string" || typeof model !== "string" || typeof platform !== "string") {
        res.sendStatus(400);
        return;
    }

    const result = await sql.query("INSERT INTO users(UUID, model, platform) VALUES(?, ?, ?)", [ uuid, model, platform ]).catch(e => e);
    if (result.code !== undefined) {
        let error = [500, "unknown"];
        
        switch (result.code) {
            case "WARN_DATA_TRUNCATED":
                error = [400, "플랫폼이 잘못 되었습니다."];
                break;
            case "ER_DUP_ENTRY":
                error = [403, "이미 등록되어 있습니다."];
                break;
            default:
                break;
        }

        res.status(error[0]).send(error[1]);
        return;
    }

    res.send("hello, domiServer!");
});

app.post("/game/ping", async function(req, res) {
    const connection = await sql.getConnection();
    const now = dateUtil.getYYMMDD(new Date());
    
    const [rows] = await connection.query("SELECT count(*) AS count FROM connects WHERE UUID = ? AND time >= ?", [ req.uuid, now ]);
    if (rows[0].count > 0) {
        connection.release();

        res.send({ result: false, reason: "이미 Pong!" });
        return;
    }
    
    const result = await connection.query("INSERT INTO connects VALUES(?, NOW())", [ req.uuid ]).catch(e => e);
    connection.release();

    if (result.code !== undefined) {
        let error = [500, "DB ERROR"];
        
        if (result.code === "ER_NO_REFERENCED_ROW_2") {
            error = [400, "등록되지 않은 ID 입니다."]
        }
        res.status(error[0]).send({ result: false, reason: error[1] });
        return;
    }

    res.send({ result: true });
});