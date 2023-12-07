"use server";
import { revalidatePath } from "next/cache";
import connection from "../db";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export async function get_tickets({ id = 0 }) {
  const where = id != 0 ? ` AND rsv_dc.id_res=${id} ` : "";
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
export async function get_ticket_lines({ id = 0 }) {
  const where = id != 0 ? ` AND rsv_dc.id_res=? ` : "";
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

export async function createTicket(data) {
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
      // console.log(item);
      // return;
      const insertDoclignePromises = data.agenda_prestationArr.map(
        async (item) => {
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
            item.title,
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
