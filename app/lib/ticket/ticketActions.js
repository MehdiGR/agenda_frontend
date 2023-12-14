"use server";
import { revalidatePath } from "next/cache";
import connection from "../db";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export async function get_tickets({ id = "" }) {
  const where = id != "" ? ` AND rsv_dc.id_res=${id} ` : "";
  try {
    const sql = `
    SELECT
        dce.id,
        nom,
        Num_doc
    FROM
        docentete AS dce
    JOIN reservat_docentete rsv_dc ON
        rsv_dc.id_doc = dce.id
    JOIN reservat rsv ON
        rsv.id = rsv_dc.id_res
    JOIN CLIENT clt ON
        clt.id = dce.tier_doc
    WHERE
        idtypedoc = 21 ${where} `;
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
export async function get_ticket_lines({ id = "" }) {
  const where = id != "" ? ` AND rsv_dc.id_res=? ` : "";
  try {
    const sql = `
    SELECT DISTINCT
      Num_doc as Num_ticket,
      dcl.*,
      clt.nom AS client,
      clt.id AS idClient,
      ag.id,
      clb.nom AS vendeur,
      clb.id_collaborateur AS vendeurId,
      rsv_dc.id_res
    FROM
        docentete AS dce
    JOIN reservat_docentete rsv_dc ON
        rsv_dc.id_doc = dce.id
    JOIN docligne AS dcl
    ON
        dcl.iddocument = dce.id
    JOIN CLIENT clt ON
        clt.id = dce.tier_doc
    JOIN reservat AS rsv
    ON
        rsv.id = rsv_dc.id_res
    JOIN ligne_res ON ligne_res.idRes = rsv.id
    JOIN agenda AS ag
    ON
        ag.id = ligne_res.idAgenda
    JOIN collaborateur AS clb
    ON
        clb.id_collaborateur = ag.idCollab
    WHERE
        idtypedoc = 21  ${where} `;
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
    const id_ticket = await insertTicket(data);
    if (id_ticket) {
      await insertTicketLignes({ ...data, id_ticket });
      console.log("Document and line items inserted successfully.");
    } else {
      console.log("Failed to insert document.");
    }
    return id_ticket;
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}

async function insertTicket(data) {
  const selectMaxNumDocSQL =
    "SELECT Max(CAST(SUBSTRING(Num_doc ,4 ) as UNSIGNED)) as max FROM docentete WHERE idtypedoc=21";
  const maxNumDocResult = await executeQuery(selectMaxNumDocSQL);
  const rowChk = maxNumDocResult[0];
  const max = rowChk.max !== 0 ? "tk_" + (rowChk.max + 1) : "tk_0";

  const dateDoc = new Date().toISOString().split("T")[0];
  const idCaisse = 1;

  const insertTicketSQL =
    "INSERT INTO docentete(Num_doc,idtypedoc,date_doc,tier_doc,is_prospect,mntttc,id_caisse) VALUES (?,?,?,?,?,?,?)";
  const insertTicketValues = [
    max,
    21,
    dateDoc,
    data.client.value,
    0,
    data.totalPrice,
    idCaisse,
  ];
  const { insertId: id_ticket } = await executeQuery(
    insertTicketSQL,
    insertTicketValues
  );

  if (id_ticket) {
    const insertReservatTicketSQL =
      "INSERT INTO reservat_docentete(id_res,id_doc) VALUES (?,?)";
    const insertReservatTicketValues = [data.idRes, id_ticket];
    await executeQuery(insertReservatTicketSQL, insertReservatTicketValues);
  }

  return id_ticket;
}

async function insertTicketLignes(data) {
  const insertTicketLignePromises = data.prestations.map(async (item) => {
    const insertTicketLigneSQL =
      "INSERT INTO docligne(iddocument,idproduit,Designation,qte,prix,idtauxtva,pUnet,total_ttc) VALUES (?,?,?,?,?,?,?,?)";

    const insertTicketLigneValues = [
      data.id_ticket,
      item.id_art,
      item.designation,
      item?.qte,
      item.prixVente,
      1,
      item.prixVente,
      item.prixTTC,
    ];
    await executeQuery(insertTicketLigneSQL, insertTicketLigneValues);
  });

  await Promise.all(insertTicketLignePromises);
}
async function removeTicketLigne(ticketLigneId) {
  try {
    const deleteTicketLigneSQL = "DELETE FROM docligne WHERE id = ?";
    const deleteTicketLigneValues = [docligneId];
    await executeQuery(deleteTicketLigneSQL, deleteTicketLigneValues);
    console.log("Document line removed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}

export async function updateTicket({ properties, values, id }) {
  if (properties.length !== values.length) {
    throw new Error("Number of properties and values does not match");
  }

  const setClauses = properties
    .map((property, index) => `${property} = ?`)
    .join(", ");
  const updateTicketSQL = `UPDATE docentete SET ${setClauses} WHERE id = ?`;
  const updateTicketValues = [...values, id];

  await executeQuery(updateTicketSQL, updateTicketValues);
}
export async function removeTicket(id) {
  try {
    const deleteReservatTicketSQL =
      "DELETE FROM reservat_docentete WHERE id_doc = ?";
    const deleteReservatTicketValues = [id];
    await executeQuery(deleteReservatTicketSQL, deleteReservatTicketValues);

    const deleteTicketLigneSQL = "DELETE FROM docligne WHERE iddocument = ?";
    const deleteTicketLigneValues = [id];
    await executeQuery(deleteTicketLigneSQL, deleteTicketLigneValues);

    const deleteTicketSQL = "DELETE FROM docentete WHERE id = ?";
    const deleteTicketValues = [id];
    await executeQuery(deleteTicketSQL, deleteTicketValues);

    console.log("Document removed successfully.");
    revalidatePath("/caisse");
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}

export async function CaissePayement(PayementData, createTicketData) {
  // console.log("PayementData", PayementData);
  // console.log("createTicketData", createTicketData);
  // return;
  const {
    PaiementsDeCommande,
    resteAPayer,
    montantRendu,
    Num_ticket_rt,
    id_tier,
  } = PayementData;
  let id_ticket = PayementData.id_ticket;
  // check if id_ticket is not defined if yes then create new ticket and the return insertedTicket affected to id_ticket
  if (!id_ticket) {
    const insertedTicket = await createTicket(createTicketData);
    id_ticket = insertedTicket;
  }
  // console.log(data);
  // return;
  for (const paiement of PaiementsDeCommande) {
    const { montant, date_paiement, mode_paiement_id, date_remise } = paiement;
    const flag = 1;
    const query1 = `
      INSERT INTO paiement_tier
      (montant, date_reg, id_method, ref, id_tier, flag, dateremise)
      VALUES
      (?, ?, ?, ?, ?, ?, ?)
    `;
    const { insertId: id_paiement_caisse } = await executeQuery(query1, [
      montant,
      date_paiement,
      mode_paiement_id,
      "",
      id_tier,
      flag,
      date_remise,
    ]);

    const query2 = `
      INSERT INTO paiement_caisse
      (id_paiement, id_doc, montant, montant_rendu, Num_ticket_rt)
      VALUES
      (?, ?, ?, ?, ?)
    `;
    await executeQuery(query2, [
      id_paiement_caisse,
      id_ticket,
      montant,
      montantRendu,
      Num_ticket_rt,
    ]);
  }

  const query3 = `
    UPDATE docentete
    SET total_payer = total_payer + ?
    WHERE id = ?
  `;
  await executeQuery(query3, [montant, id_ticket]);

  if (resteAPayer === 0) {
    const query4 = `
      UPDATE docentete
      SET valide = 1, mise_en_attente = 0
      WHERE id = ?
    `;
    await executeQuery(query4, [id_ticket]);
  }
}
