import { revalidatePath } from "next/cache";
import connection from "../db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const reservat = await new Promise((resolve, reject) =>
      connection.query(
        `SELECT
              rsv.*,
              art.intitule AS prest_title,
              art.prixTTC AS prest_prix,
              lr.idPrest AS prest_id,
              lr.duree AS prest_duree,
              lr.heurDB AS prest_heurDB,
              lr.idAgenda AS prest_idAgenda,
              ag.nom AS prest_agenda,
              clt.nom as client
          FROM
              reservat AS rsv
          JOIN ligne_res AS lr
          ON
              lr.idRes = rsv.id
          JOIN article AS art
          ON
              art.id = lr.idPrest
               JOIN agenda AS ag
          ON
              ag.id = lr.idAgenda
              JOIN client as clt on clt.id=rsv.idClient;`,
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
// export async function POST(req: Request) {
//   const body = await req.json();

//   // Your SQL query with parameters
//   const sql =
//     "INSERT INTO reservat(idClient,dateRes,heurDB,duree,note) VALUES (?,?,?,?,?)";
//   const values = [
//     body.client.value,
//     body.dateRes,
//     body?.time,
//     body?.duree,
//     body?.note,
//   ];

//   // Execute the query with parameters
//   const insertedId_resPromise = new Promise((resolve, reject) => {
//     connection.query(
//       sql,
//       values,
//       function (err: any, result: any, fields: any) {
//         if (err) reject(err);
//         resolve(result.insertId);
//       }
//     );
//   });

//   const insertedId_res = await insertedId_resPromise;

//   // const prestationsIds = body.prestationsIds.split(",").map(Number);

//   body.agenda_prestationArr.map((agenda_prest: any) => {
//     // Your SQL query with parameters
//     const duration_hours = parseInt(agenda_prest.duration_hours);

//     const duration_minutes = parseInt(agenda_prest.duration_minutes);

//     const duree = duration_hours + duration_minutes;
//     const sql2 =
//       "INSERT INTO ligne_res(idRes,idPrest,duree,idAgenda,heurDB) VALUES (?,?,?,?,?)";
//     const values2 = [
//       insertedId_res,
//       agenda_prest.id_art,
//       duree,
//       agenda_prest.agenda.value,
//       agenda_prest.hourDB,
//     ];
//     console.log(values2);
//     connection.query(sql2, values2, () => 1);
//   });

//   // Release the connection back to the pool
//   // connection.disconnect();

//   return new NextResponse(
//     JSON.stringify({
//       message: "Data inserted successfully",
//       reservatId: insertedId_res,
//     })
//   );
// }
// export async function PUT(req: Request) {
//   const body = await req.json();
//   const sql =
//     "UPDATE `reservat` SET `idClient`=?,`dateRes`=?,`heurDB`=?,`duree`=?,`note`=?  WHERE id=?";
//   const values = [
//     body.client.value,
//     body.dateRes,
//     body.heurDB,
//     body.duree,
//     body.note,
//     body.id,
//   ];
//   // const values = [body, body.id];
//   try {
//     await connection.query(sql, values);
//     body.agenda_prestationArr.map((agenda_prest: any) => {
//       // Your SQL query with parameters
//       const duration_hours = parseInt(agenda_prest.duration_hours);

//       const duration_minutes = parseInt(agenda_prest.duration_minutes);

//       const duree = duration_hours + duration_minutes;
//       //  transforme query insert to update
//       const sql2 =
//         "UPDATE ligne_res SET duree=?,idRes =? and idPrest =?,idAgenda =?,heurDB =? WHERE id=?";

//       const values2 = [
//         duree,
//         body.id,
//         agenda_prest.id_art,
//         agenda_prest.agenda.value,
//         agenda_prest.hourDB,
//         agenda_prest.id,
//       ];
//       console.log(values2);
//       connection.query(sql2, values2, () => 1);
//     });
//   } catch (error) {
//     console.error("Could not execute query:", error);
//     return new NextResponse(
//       { error: "Could not execute query" },
//       { status: 500 }
//     );
//   }
//   return new NextResponse(
//     JSON.stringify({ message: "Data updated successfully" })
//   );
// }
export const revalidate = true;
export async function POST(req: Request) {
  const body = await req.json();

  let insertedId_res = body.idRes;

  if (insertedId_res === "" || insertedId_res === null) {
    // Your SQL query with parameters
    const reservationSQL =
      "INSERT INTO reservat(idClient,dateRes,heurDB,duree,note) VALUES (?,?,?,?,?)";
    const reservationValues = [
      body.client.value,
      body.dateRes,
      body?.time,
      body?.duree,
      body?.note,
    ];

    // Execute the reservation query with parameters
    insertedId_res = await executeQuery(reservationSQL, reservationValues);
  } else {
    // Update existing reservation
    const updateReservationSQL =
      "UPDATE reservat SET idClient=?, dateRes=?, heurDB=?, duree=?, note=? WHERE id=?";
    const updateReservationValues = [
      body.client.value,
      body.dateRes,
      body?.time,
      body?.duree,
      body?.note,
      insertedId_res,
    ];

    await executeQuery(updateReservationSQL, updateReservationValues);
  }

  // Update or insert agenda_prestationArr
  await Promise.all(
    body.agenda_prestationArr.map(async (agenda_prest: any) => {
      // console.log("agenda_prest", agenda_prest);
      const duration_hours = parseInt(agenda_prest.duration_hours);
      const duration_minutes = parseInt(agenda_prest.duration_minutes);
      const duree = duration_hours + duration_minutes;

      // Check if a record with the given criteria already exists
      const existingRecord = await checkExistingRecord(
        insertedId_res,
        agenda_prest.id_art,
        duree,
        agenda_prest.agenda.value,
        agenda_prest.hourDB
      );

      if (existingRecord) {
        // Update existing record
        const updateRecordSQL =
          "UPDATE ligne_res SET duree=?, idPrest=? , idAgenda=? , heurDB=?  WHERE idRes=?";
        const updateRecordValues = [
          duree,
          insertedId_res,
          agenda_prest.id_art,
          agenda_prest.agenda.value,
          agenda_prest.hourDB,
        ];

        await executeQuery(updateRecordSQL, updateRecordValues);
      } else {
        // Insert new record
        const insertRecordSQL =
          "INSERT INTO ligne_res(idRes,idPrest,duree,idAgenda,heurDB) VALUES (?,?,?,?,?)";
        const insertRecordValues = [
          insertedId_res,
          agenda_prest.id_art,
          duree,
          agenda_prest.agenda.value,
          agenda_prest.hourDB,
        ];

        await executeQuery(insertRecordSQL, insertRecordValues);
      }
    })
  );
  revalidatePath("/agenda");
  return new NextResponse(
    JSON.stringify({
      message: "Data inserted/updated successfully",
      reservatId: insertedId_res,
    })
  );
}

async function executeQuery(sql: string, values: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      values,
      function (err: any, result: any, fields: any) {
        if (err) reject(err);
        resolve(result.insertId || values[values.length - 1]); // Return either the insertId or the idRes for updates
      }
    );
  });
}

async function checkExistingRecord(
  idRes: number,
  idPrest: number,
  duree: number,
  idAgenda: number,
  heurDB: string
): Promise<boolean> {
  const sql =
    "SELECT * FROM ligne_res WHERE idRes=? AND idPrest=? AND duree=? AND idAgenda=? AND heurDB=?";
  const values = [idRes, idPrest, duree, idAgenda, heurDB];

  return new Promise((resolve, reject) => {
    connection.query(
      sql,
      values,
      function (err: any, result: any, fields: any) {
        if (err) reject(err);
        resolve(result.length > 0);
      }
    );
  });
}
