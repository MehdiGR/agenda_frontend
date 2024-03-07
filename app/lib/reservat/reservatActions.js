"use server";
import { exportStore } from "@/app/store/store";

import { revalidatePath } from "next/cache";

import connection from "@/app/lib/db";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export async function get_resavations(id = 0) {
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
                    lr.id AS line_id,
                    ag.nom AS prest_agenda,
                    clt.nom AS nomClient,
                    clt.id AS idClient,
                    res_dce.id_doc AS ticketId,
                    tva.id AS prest_tva_id,
                    MAX(dcl.id) AS ticketId_ligne -- Using MAX to ensure a single dcl.id per group
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
                LEFT JOIN CLIENT AS clt
                ON
                    clt.id = rsv.idClient
                LEFT JOIN reservat_docentete AS res_dce
                ON
                    res_dce.id_res = rsv.id
                LEFT JOIN docligne AS dcl
                ON
                    dcl.iddocument = res_dce.id_doc
                LEFT JOIN p_tauxtva AS tva
                ON
                    art.code_tauxtvaVente = tva.code OR art.code_tauxtvaAchat = tva.code
                GROUP BY
                    rsv.id,
                    -- Assuming rsv.id is a unique identifier for reservat
                    lr.id,
                    -- Assuming lr.id is a unique identifier for ligne_res
                    art.id,
                    -- Assuming art.id is a unique identifier for article
                    ag.id,
                    -- Assuming ag.id is a unique identifier for agenda
                    clt.id,
                    -- Assuming clt.id is a unique identifier for CLIENT
                    res_dce.id_doc -- Assuming res_dce.id_doc is a unique identifier for reservat_docentete
              
              ${where}
               ORDER BY
                    rsv.dateRes,
                    rsv.heurDB,
                    lr.heurDB; `;
    const values = [id];
    const reservat = await new Promise((resolve, reject) =>
      connection.query(sql, values, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(reservat);
  } catch (error) {
    console.error("Could not execute query:", error);
    return JSON.stringify({ error: "Could not execute query" });
  }
}
export async function saveReservation(data) {
  // revalidatePath("/agenda");
  // return;
  const time = `${data.hourDB.value}:${data.minutesDB.value}`;
  // console.log(data);
  // return;
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
      const duree_line = duration_hours * 60 + duration_minutes;

      const existingRecord = await checkExistingRecord(agenda_prest.line_id);
      if (existingRecord) {
        const removedRecord = agenda_prest?.removedRow;
        if (removedRecord) {
          // Delete existing record
          const deleteRecordSQL = "DELETE FROM ligne_res WHERE id=?";
          const deleteRecordValues = [agenda_prest.line_id];
          await executeQuery(deleteRecordSQL, deleteRecordValues);
          if (data.ticketId_line !== null) {
            removeTicketLigne(data.ticketId_line);
          }
          removeTicketLigne;
        } else {
          // Update existing record
          const updateRecordSQL =
            "UPDATE ligne_res SET duree=?, idPrest=? , idAgenda=? , heurDB=?  WHERE id=?";
          const updateRecordValues = [
            duree_line,
            agenda_prest.id_art,
            agenda_prest.agenda.value,
            agenda_prest.start_time,
            agenda_prest.line_id,
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
          duree_line,
          agenda_prest.agenda.value,
          agenda_prest.start_time,
        ];
        await executeQuery(insertRecordSQL, insertRecordValues);
        if (data.ticketId != null && data.submitType === "encaisser") {
          const ticketId = data.ticketId;
          const item = { ...agenda_prest, ticketId };
          addTicketLines(item);
        }
      }
    })
  );
  // if (data.submitType === "enregistrer") {
  //   revalidatePath("/agenda");
  // }
  if (data.submitType === "encaisser") {
    // check if data.idRes is not empty, indicate that it's an update click
    let insertedTicketId = "";

    if (!data.ticketId) {
      insertedTicketId = await createTicket({ ...data, idRes: insertedId_res });
    } else {
      insertedTicketId = data.ticketId;
    }

    // redirect("/caisse/" + insertedTicketId);
    revalidatePath("/agenda");
    return insertedTicketId;
  }
  revalidatePath("/agenda");
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

async function checkExistingRecord(line_id) {
  const sql = "SELECT * FROM ligne_res WHERE id=?";
  const values = [line_id];

  return new Promise((resolve, reject) => {
    connection.query(sql, values, function (err, result, fields) {
      if (err) reject(err);
      resolve(result.length > 0);
    });
  });
}

async function createTicket(data) {
  try {
    const ticketId = await addTicket(data);
    if (ticketId) {
      const prestations_lines = data.agenda_prestationArr.map((item) => ({
        ...item,
        ticketId, // Add ticketId to each item
      }));
      for (const item of prestations_lines) {
        await addTicketLines(item);
      }
      console.log("Document and line items inserted successfully.");
    } else {
      console.log("Failed to insert document.");
    }
    return ticketId;
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}

async function addTicket(data) {
  const selectMaxNumDocSQL =
    "SELECT Max(CAST(SUBSTRING(Num_doc ,4 ) as UNSIGNED)) as max FROM docentete WHERE idtypedoc=21";
  const maxNumDocResult = await executeQuery(selectMaxNumDocSQL);
  const rowChk = maxNumDocResult[0];
  const max = rowChk.max !== 0 ? "tk_" + (rowChk.max + 1) : "tk_0";

  const dateDoc = new Date().toISOString().split("T")[0];
  const idCaisse = 1;

  const addTicketSQL =
    "INSERT INTO docentete(Num_doc,idtypedoc,date_doc,tier_doc,is_prospect,mntttc,mntht,mnttva,id_caisse) VALUES (?,?,?,?,?,?,?,?,?)";
  const addTicketValues = [
    max,
    21,
    dateDoc,
    data.client.value,
    0,
    data.totalTTC,
    data.totalHT,
    data.totalTax,
    idCaisse,
  ];
  const { insertId: ticketId } = await executeQuery(
    addTicketSQL,
    addTicketValues
  );

  if (ticketId) {
    const insertReservatTicketSQL =
      "INSERT INTO reservat_docentete(id_res,id_doc) VALUES (?,?)";
    const insertReservatTicketValues = [data.idRes, ticketId];
    await executeQuery(insertReservatTicketSQL, insertReservatTicketValues);
  }

  return ticketId;
}

async function addTicketLines(item) {
  // const addTicketLignePromises = data.agenda_prestationArr.map(async (item) => {
  const addTicketLinesQL =
    "INSERT INTO docligne(iddocument,idproduit,Designation,qte,prix,idtauxtva,pUnet,total_ttc) VALUES (?,?,?,?,?,?,?,?)";

  const addTicketLigneValues = [
    item.ticketId,
    item.id_art,
    item.designation,
    item?.qte,
    item.prixVente,
    item.tva_id,
    item.prixVente,
    item.prixTTC,
  ];
  await executeQuery(addTicketLinesQL, addTicketLigneValues);
  // });

  // await Promise.all(addTicketLignePromises);
}
async function removeTicketLigne(ticketLigneId) {
  try {
    const deleteTicketLigneSQL = "DELETE FROM docligne WHERE id = ?";
    const deleteTicketLigneValues = [ticketLigneId];
    await executeQuery(deleteTicketLigneSQL, deleteTicketLigneValues);
    console.log("Document line removed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}
