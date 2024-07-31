const sql = require("../lib/sql");

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