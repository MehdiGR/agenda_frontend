"use server";
import { exportStore } from "@/app/store/store_new2";

import { revalidatePath } from "next/cache";

import connection from "../db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export async function get_resavations({ id = 0 }) {
  const where = id != 0 ? `WHERE rsv.id=? ` : "";
  try {
    const sql = `SELECT
              rsv.*,
              art.intitule AS prest_title,
              art.prixTTC AS prest_prix_ttc,
              art.prixAchat AS prest_prix_achat,
              art.prixVente AS prest_prix_vente,
              art.code_tauxtvaVente AS prest_code_tauxtvaVente,
              art.code_tauxtvaAchat AS prest_code_tauxtvaAchat,
              
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
              JOIN client as clt on clt.id=rsv.idClient ${where} order by rsv.dateRes,rsv.heurDB,lr.heurDB `;
    const values = [id];
    const reservat = await new Promise((resolve, reject) =>
      connection.query(sql, values, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(reservat);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
export async function saveReservation(data) {
  const time = `${data.hourDB.value}:${data.minutesDB.value}`;
  // console.log(data);
  // // console.log(time);
  // redirect("/caisse");
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
    // insertedId_res = await executeQuery(reservationSQL, reservationValues);
    ({ insertId: insertedId_res } = await executeQuery(
      reservationSQL,
      reservationValues
    ));
  } else {
    // console.log("update existing", insertedId_res);
    // Update existing reservation
    const updateReservationSQL =
      "UPDATE reservat SET idClient=?, dateRes=?, heurDB=?, duree=?, note=? WHERE id=?";
    const updateReservationValues = [
      data.client.value,
      data.dateRes,
      time,
      data?.duree,
      data?.note,
      insertedId_res,
    ];

    await executeQuery(updateReservationSQL, updateReservationValues);
  }
  // Update or insert agenda_prestationArr
  await Promise.all(
    data.agenda_prestationArr.map(async (agenda_prest, index) => {
      const duration_hours = parseInt(agenda_prest.duration_hours.value);
      const duration_minutes = parseInt(agenda_prest.duration_minutes.value);
      const duree_ligne = duration_hours * 60 + duration_minutes;

      const existingRecord = await checkExistingRecord(agenda_prest.ligne_id);

      if (existingRecord) {
        const removedRecord = agenda_prest?.removedRow;
        if (removedRecord) {
          // Delete existing record
          const deleteRecordSQL = "DELETE FROM ligne_res WHERE id=?";
          const deleteRecordValues = [agenda_prest.ligne_id];
          await executeQuery(deleteRecordSQL, deleteRecordValues);
          if (data.agenda_prestationArr.length === 1) {
            const deleteRes = `DELETE FROM reservat  WHERE id=?`;
            console.log("deleteRes", deleteRes);
            const deleteResValues = [insertedId_res];
            await executeQuery(deleteRes, deleteResValues);
          }
          // const updateDuration = `UPDATE reservat SET duree=duree-${duree_ligne} WHERE id=?`;
          // const updateDurationValues = [insertedId_res];
          // await executeQuery(updateDuration, updateDurationValues);
        } else {
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
        }
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
  if (data.submitType === "enregistrer") {
    revalidatePath("/agenda");
  } else {
    const idRes = insertedId_res;
    createTicket({ ...data, idRes });
    // redirect("/caisse?res=" + insertedId_res);
    return insertedId_res;
  }
  // revalidatePath("/");
}

// async function executeQuery(sql, values) {
//   return new Promise((resolve, reject) => {
//     connection.query(sql, values, function (err, result, fields) {
//       if (err) reject(err);
//       resolve(result.insertId || values[values.length - 1]); // Return either the insertId or the idRes for updates
//     });
//   });
// }
async function executeQuery(sql, values) {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
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

async function createTicket(data) {
  try {
    const selectMaxNumDocSQL =
      "SELECT Max(CAST(SUBSTRING(Num_doc ,4 ) as UNSIGNED)) as max FROM docentete WHERE idtypedoc=21";
    const maxNumDocResult = await executeQuery(selectMaxNumDocSQL);
    const rowChk = maxNumDocResult[0];
    const max = rowChk.max !== 0 ? "tk_" + (rowChk.max + 1) : "tk_0";

    const dateDoc = new Date().toISOString().split("T")[0];
    const idCaisse = 1;

    const insertDocenteteSQL =
      "INSERT INTO docentete(Num_doc,idtypedoc,date_doc,tier_doc,is_prospect,mntttc,id_caisse) VALUES (?,?,?,?,?,?,?)";
    const insertDocenteteValues = [
      max,
      21,
      dateDoc,
      data.client.value,
      0,
      data.totalPrice,
      idCaisse,
    ];
    const { insertId: iddocument } = await executeQuery(
      insertDocenteteSQL,
      insertDocenteteValues
    );

    if (iddocument) {
      const insertReservatDocSQL =
        "INSERT INTO reservat_docentete(id_res,id_doc) VALUES (?,?)";
      const insertReservatDocValues = [data.idRes, iddocument];
      await executeQuery(insertReservatDocSQL, insertReservatDocValues);
      // console.log(item);
      // return;
      const insertDoclignePromises = data.agenda_prestationArr.map(
        async (item) => {
          console.log(item);
          const insertDocligneSQL =
            "INSERT INTO docligne(iddocument,idproduit,Designation,qte,prix,idtauxtva,pUnet,total_ttc) VALUES (?,?,?,?,?,?,?,?)";

          // const getTauxTvaSQL = "SELECT id FROM p_tauxtva WHERE code=?";
          // const getTauxTvaValues = [item.code_tauxtvaVente];

          // const getTauxTvaResult = await new Promise((resolve, reject) =>
          //   connection.query(
          //     getTauxTvaSQL,
          //     getTauxTvaValues,
          //     (error, results) => (error ? reject(error) : resolve(results))
          //   )
          // );
          // const tauxtva = getTauxTvaResult[0].id;

          const insertDocligneValues = [
            iddocument,
            item.id_art,
            item.designation,
            item?.qte,
            item.prixVente,
            1,
            item.prixVente,
            item.prixTTC,
          ];
          await executeQuery(insertDocligneSQL, insertDocligneValues);
        }
      );

      await Promise.all(insertDoclignePromises);

      console.log("Document and line items inserted successfully.");
    } else {
      console.log("Failed to insert document.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}
