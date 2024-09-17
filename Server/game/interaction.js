const sql = require("../lib/sql");
const dateUtil = require("../lib/date");
const admin = require("../admin/interaction.js");

const caching_id_list = {};
for (const [k, v] of Object.entries(admin.ID_LIST)) {
    caching_id_list[k] = new Set();
    v.forEach(v => caching_id_list[k].add(v));
}

app.post("/game/interaction/register", async function(req, res) {
    const UUID = req.uuid;
    const { data } = req.body;
    /*
        {
            "type": "button",
            "id": "testBtn",
            "count": 50
        }
    */

    if (typeof(data) !== "object") {
        return res.sendStatus(400);
    }

    const db = await sql.getConnection();
    await db.beginTransaction();

    const waits = [];
    const nowYYMMDD = dateUtil.getYYMMDD(new Date());
    
    for (const value of data) {
        if (caching_id_list[value.type] === undefined || typeof(value.id) !== "string" || typeof(value.count) !== "number") {
            continue; // 잘못된 데이터
        }

        const handler = async function() {
            const [ [{ count }] ] = await db.query(`SELECT COUNT(*) AS count FROM interactions WHERE UUID = ? AND id = ? AND \`type\` = ? AND DATE(created) = ?`, [ UUID, value.id, value.type.toUpperCase(), nowYYMMDD ]);
            
            if (count > 0) {
                await db.execute(`UPDATE interactions SET count = count + ? WHERE UUID = ? AND id = ? AND \`type\` = ? AND DATE(created) = ?`, [ value.count, UUID, value.id, value.type.toUpperCase(), nowYYMMDD ]);
            } else {
                await db.execute(`INSERT INTO interactions VALUES(?, ?, ?, ?, now())`, [ UUID, value.id, value.type.toUpperCase(), value.count ]);
            }
        }
        waits.push(handler());
    }

    await Promise.all(waits);
    
    db.commit();
    db.release();

    res.send("ok!");
});