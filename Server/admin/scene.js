const sql = require("../lib/sql");
const scenes = require("../scene.json");

app.get("/admin/scene", async function(req, res) {
    const result = {};
    scenes.forEach(v => result[v] = { count: 0, avg: 0 });

    const connection = await sql.getConnection();
    
    const waitHandler = connection.query("SELECT count(*) AS total FROM users");
    const waitHandler2 = connection.query("SELECT scene, count(*) as count, AVG(time) as `avg` FROM scenes GROUP BY scene");

    const [[[ { total } ]], [rows]] = await Promise.all([waitHandler, waitHandler2]);

    rows.forEach(v => result[v.scene] = { count: v.count, avg: v.avg });

    res.send({
        list: result,
        total
    });
});