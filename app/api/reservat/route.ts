import connection from "../db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reservat = await new Promise((resolve, reject) =>
      connection.query(
        `SELECT
              rsv.*,
              art.intitule AS prest_title,
              lr.idPrest AS prest_id,
              lr.duree AS prest_duree,
              lr.heurDB AS prest_heurDB
          FROM
              reservat AS rsv
          JOIN ligne_res AS lr
          ON
              lr.idRes = rsv.id
          JOIN article AS art
          ON
              art.id = lr.idPrest`,
        (error, results) => (error ? reject(error) : resolve(results))
      )
    );

    return new NextResponse(JSON.stringify(reservat));
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  const body = await req.json();

  // Your SQL query with parameters
  const sql =
    "INSERT INTO reservat(idClient,dateRes,heurDB,duree,note) VALUES (?,?,?,?,?)";
  const values = [
    body.client.value,
    body.dateRes,
    body?.time,
    body?.duree,
    body?.note,
  ];

  // Execute the query with parameters
  const insertedId_resPromise = new Promise((resolve, reject) => {
    connection.query(
      sql,
      values,
      function (err: any, result: any, fields: any) {
        if (err) reject(err);
        resolve(result.insertId);
      }
    );
  });

  const insertedId_res = await insertedId_resPromise;

  // const prestationsIds = body.prestationsIds.split(",").map(Number);

  body.agenda_prestationArr.map((agenda_prest: any) => {
    // Your SQL query with parameters
    const duration_hour = parseInt(agenda_prest.hourDB.split(":")[0]) * 60;

    const duration_minutes = parseInt(agenda_prest.hourDB.split(":")[1]);

    const duree = duration_hour + duration_minutes;
    const sql2 =
      "INSERT INTO ligne_res(idRes,idPrest,duree,idAgenda,heurDB) VALUES (?,?,?,?,?)";
    const values2 = [
      insertedId_res,
      agenda_prest.id_art,
      duree,
      agenda_prest.agenda.value,
      agenda_prest.hourDB,
    ];
    console.log(values2);
    connection.query(sql2, values2, () => 1);
  });

  // Release the connection back to the pool
  // connection.disconnect();

  return new NextResponse(
    JSON.stringify({
      message: "Data inserted successfully",
      reservatId: insertedId_res,
    })
  );
}
