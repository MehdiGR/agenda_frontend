"use server";
import { exportStore } from "@/app/store/store_new2";

import { revalidatePath } from "next/cache";

import connection from "./db";
// import { NextResponse } from "next/server";

export async function get_resavations() {
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
              lr.id AS ligne_id,
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
              JOIN client as clt on clt.id=rsv.idClient order by rsv.dateRes,rsv.heurDB,lr.heurDB;`,
        (error, results) => (error ? reject(error) : resolve(results))
      )
    );

    // return new NextResponse(JSON.stringify(reservat));
  } catch (error) {
    console.error("Could not execute query:", error);
    // return new NextResponse(
    //   { error: "Could not execute query" },
    //   { status: 500 }
    // );
  }
}
export async function saveReservation(data) {
  const time = `${data.hourDB.value}:${data.minutesDB.value}`;
  // console.log(data);
  // // console.log(time);

  // return;
  let insertedId_res = data.idRes;
  if (insertedId_res === "" || insertedId_res === null) {
    // Your SQL query with parameters
    const reservationSQL =
      "INSERT INTO reservat(idClient,dateRes,heurDB,duree,note) VALUES (?,?,?,?,?)";
    const reservationValues = [
      data.client.value,
      data.dateRes,
      time,
      data.duree,
      data?.note,
    ];
    // Execute the reservation query with parameters
    insertedId_res = await executeQuery(reservationSQL, reservationValues);
    console.log("inserted id is ", insertedId_res);
  } else {
    console.log("update existing", insertedId_res);
    // Update existing reservation
    const updateReservationSQL =
      "UPDATE reservat SET idClient=?, dateRes=?, heurDB=?, duree=?, note=? WHERE id=?";
    const updateReservationValues = [
      data.client.value,
      data.dateRes,
      data?.time,
      data?.duree,
      data?.note,
      insertedId_res,
    ];

    await executeQuery(updateReservationSQL, updateReservationValues);
  }
  // Update or insert agenda_prestationArr
  await Promise.all(
    data.agenda_prestationArr.map(async (agenda_prest, index) => {
      console.log("agenda_prest", agenda_prest);

      const duration_hours = parseInt(agenda_prest.duration_hours.value);
      const duration_minutes = parseInt(agenda_prest.duration_minutes.value);
      const duree_ligne = duration_hours * 60 + duration_minutes;

      const existingRecord = await checkExistingRecord(agenda_prest.ligne_id);

      if (existingRecord) {
        // Update existing record
        const updateRecordSQL =
          "UPDATE ligne_res SET duree=?, idPrest=? , idAgenda=? , heurDB=?  WHERE id=?";
        const updateRecordValues = [
          duree_ligne,
          agenda_prest.id_art,
          agenda_prest.agenda.value,
          agenda_prest.start_time,
          agenda_prest.ligne_id,
        ];

        await executeQuery(updateRecordSQL, updateRecordValues);
      } else {
        // Insert new record
        const insertRecordSQL =
          "INSERT INTO ligne_res(idRes,idPrest,duree,idAgenda,heurDB) VALUES (?,?,?,?,?)";
        const insertRecordValues = [
          insertedId_res,
          agenda_prest.id_art,
          duree_ligne,
          agenda_prest.agenda.value,
          agenda_prest.start_time,
        ];

        await executeQuery(insertRecordSQL, insertRecordValues);
      }
    })
  );
  revalidatePath("/");
}

async function executeQuery(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result, fields) {
      if (err) reject(err);
      resolve(result.insertId || values[values.length - 1]); // Return either the insertId or the idRes for updates
    });
  });
}

async function checkExistingRecord(ligne_id) {
  const sql = "SELECT * FROM ligne_res WHERE id=?";
  const values = [ligne_id];

  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result, fields) {
      if (err) reject(err);
      resolve(result.length > 0);
    });
  });
}
