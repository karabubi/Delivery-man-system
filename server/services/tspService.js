const db = require("../util/db-connect.js");

async function calculateTSP() {
  await db.connect();
  console.log("Hello");

  try {
    const tspQuery = `
      SELECT seq, node, cost, agg_cost
      FROM pgr_TSP(
        $$
        SELECT * FROM pgr_dijkstraCostMatrix(
          'SELECT id, source, target, cost, reverse_cost FROM de_2po_4pgr',
          (WITH nearestVertices AS (
            SELECT a.id
            FROM tsppoints,
            LATERAL (
              SELECT id, the_geom
              FROM osmtile_germany.de_2po_4pgr_vertices_pgr
              ORDER BY osmtile_germany.de_2po_4pgr_vertices_pgr.the_geom <-> osmtile_germany.tsppoints.geom
              LIMIT 1
            ) a
          )
          SELECT array_agg(id) FROM nearestVertices), directed := false
        )
        $$, start_id := 591341
      );
    `;
    console.log(tspQuery);
    const res = await db.query(tspQuery);
    return res.rows;
  } catch (err) {
    console.error("Error executing TSP query", err.stack);
    throw err;
  } finally {
    await client.end();
  }
}

module.exports = { calculateTSP };
