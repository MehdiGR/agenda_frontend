"use server";
import { revalidatePath } from "next/cache";
import connection from "../db";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// import { NextResponse } from "next/server";

export async function get_encaissements({ where = "" }) {
  try {
    const sql = `
    SELECT
      dce.id AS ticketId,
      clt.nom AS client,
      Num_doc AS Num_ticket,
      DATE(dce.date_doc) AS date_creation,
      (pm.montant),
      mtp.intitule as mode_paiement,
      clb.nom AS vendeur 
    FROM
        docentete AS dce
    JOIN client clt ON
        clt.id = dce.tier_doc
    JOIN collaborateur clb ON
        clt.idCollab = clb.id_collaborateur
    JOIN paiement_caisse AS pm
    ON
        pm.id_doc = dce.id
    JOIN paiement_tier AS pmt
    ON
        pmt.id = pm.id_paiement
    LEFT JOIN methode_paiement AS mtp
    ON
        mtp.id = pmt.id_method
   ${where} `;
    //  LEFT JOIN paiement_tier AS pmt
    //  ON
    //      pmt.id = pm.id_paiement
    //  LEFT JOIN methode_paiement AS mdp
    //  ON
    //      mdp.id = pmt.id_method
    const tickets = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(tickets);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
export async function get_tickets({ where = "" }) {
  try {
    const sql = `
            SELECT
                dce.id as ticketId,
                dce.mntht,
                dce.mnttva,
                dce.mntttc,
                clt.nom as client,
                Num_doc as Num_ticket,
                (dce.mntttc - (
                    SELECT COALESCE(SUM(pm.montant), 0)
                    FROM paiement_caisse as pm
                    WHERE dce.id = pm.id_doc
                )) as restePayer ,
                Date(dce.date_doc) AS date_creation
            FROM
                docentete AS dce
            JOIN client clt ON
                clt.id = dce.tier_doc
   ${where} `;
    //  LEFT JOIN paiement_tier AS pmt
    //  ON
    //      pmt.id = pm.id_paiement
    //  LEFT JOIN methode_paiement AS mdp
    //  ON
    //      mdp.id = pmt.id_method
    const tickets = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(tickets);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}

export async function get_ticket_lines({ where = "" }) {
  try {
    // COALESCE(dce.valide ,0) as valide,

    const sql = `
                SELECT
                    Num_doc AS Num_ticket,
                    dcl.*,
                    dcl.id AS line_id,
                    dce.mntttc,
                    dce.mnttva,
                    dce.mntht,
                    dce.date_doc as date_creation,
                    dce.valide,
                   
                    clt.nom AS client,
                    clt.id AS idClient,
                    clb.nom AS vendeur,
                    clb.id_collaborateur AS vendeurId,
                   (
                    SELECT 1
                    FROM paiement_caisse as pm
                    WHERE dce.id = pm.id_doc limit 1
                   ) as readonly
                FROM
                    docentete AS dce
                
                JOIN docligne AS dcl
                ON
                    dcl.iddocument = dce.id
                JOIN client clt ON
                    clt.id = dce.tier_doc
                JOIN collaborateur AS clb
                ON
                    clb.id_collaborateur = clt.idCollab
                

     ${where}  `;
    const reservat = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
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
export async function get_ticket_paiements({ where = "" }) {
  try {
    const sql = `
                SELECT
                    
                    Date(pmt.date_reg) as date_paiement,
                    mdp.intitule as mode_paiement,
                    mdp.id as mode_paiement_id,
                    pm.montant as montant,
                    1 as readonly
                FROM
                    docentete AS dce
                 JOIN paiement_caisse AS pm
                ON
                    pm.id_doc = dce.id
                 JOIN paiement_tier AS pmt
                ON
                    pmt.id = pm.id_paiement
                 JOIN methode_paiement AS mdp
                ON
                    mdp.id = pmt.id_method

     ${where} `;
    const ticket_paiements = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(ticket_paiements);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
export async function get_operation_caisse({ where = "" }) {
  try {
    // will be update 'id utilisateur' when implement authentication
    const sql = `SELECT
                      id,
                      DATE(date_et_heur) AS date_creation,
                      id_utilisateur AS utilisateur,
                      commentaire,
                      ROUND(montant,2) AS montant,
                      'Enregistrer' AS statut,
                      CASE WHEN retrait = 1 THEN 'Retrait' WHEN depot = 1 THEN 'Depot' WHEN encaissement = 1 THEN 'Encaissement'
                  END AS operationType
                  FROM
                      mouvementcaisse ${where} `;
    const operation_caisse = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(operation_caisse);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
export async function get_synths_paiements({ having = "" }) {
  const querytest = `SELECT
  DATE(synths_date) AS synths_date,
  COALESCE(SUM(total_espace_encaisse), 0) AS total_espace_encaisse,
  COALESCE(SUM(total_operation_caisse), 0) AS total_operation_caisse,
  SUM(
      COALESCE(total_espace_encaisse, 0) + COALESCE(total_operation_caisse, 0)
  ) AS montant_en_caisse,
  COALESCE(SUM(chiffre_affaires_ht), 0) AS chiffre_affaires_ht,
  COALESCE(SUM(total_tva), 0) AS total_tva,
  COALESCE(SUM(chiffre_affaires_ttc), 0) AS chiffre_affaires_ttc,
  COALESCE(SUM(nbr_tickets), 0) AS nbr_tickets,
  COALESCE(SUM(panier_moyen_ttc), 0) AS panier_moyen_ttc,
  mode_title,
  ROUND(SUM(total_paiement_by_mode), 2) AS total_paiement_by_mode
FROM
  (
  SELECT
      ROUND(SUM(pm.montant), 2) AS total_espace_encaisse,
      NULL AS total_operation_caisse,
      dce.date_doc AS synths_date,
      NULL AS chiffre_affaires_ht,
      NULL AS total_tva,
      NULL AS chiffre_affaires_ttc,
      NULL AS nbr_tickets,
      NULL AS panier_moyen_ttc,
      NULL AS mode_title,
      NULL AS total_paiement_by_mode
  FROM
      docentete AS dce
  JOIN paiement_caisse AS pm ON pm.id_doc = dce.id
  JOIN paiement_tier AS pmt ON pmt.id = pm.id_paiement
  JOIN methode_paiement AS mtp ON mtp.id = pmt.id_method
  WHERE
      dce.idtypedoc = 21 AND mtp.id = 2
  GROUP BY
      dce.date_doc
  UNION ALL
  SELECT
      NULL AS total_espace_encaisse,
      ROUND(SUM(CASE WHEN retrait = 1 THEN - montant WHEN depot = 1 THEN montant ELSE 0 END), 2) AS total_operation_caisse,
      date_et_heur AS synths_date,
      NULL AS chiffre_affaires_ht,
      NULL AS total_tva,
      NULL AS chiffre_affaires_ttc,
      NULL AS nbr_tickets,
      NULL AS panier_moyen_ttc,
      NULL AS mode_title,
      NULL AS total_paiement_by_mode
  FROM
      mouvementcaisse
  GROUP BY
      date_et_heur
  UNION ALL
  SELECT
      NULL AS total_espace_encaisse,
      NULL AS total_operation_caisse,
      date_doc AS synths_date,
      SUM(mntht) AS chiffre_affaires_ht,
      ROUND(SUM(mnttva), 2) AS total_tva,
      ROUND(SUM(mntttc), 2) AS chiffre_affaires_ttc,
      COUNT(Num_doc) AS nbr_tickets,
      ROUND(SUM(mntttc) / COUNT(Num_doc), 2) AS panier_moyen_ttc,
      NULL AS mode_title,
      NULL AS total_paiement_by_mode
  FROM
      docentete
  GROUP BY
      date_doc
  UNION ALL
  SELECT
      NULL AS total_espace_encaisse,
      NULL AS total_operation_caisse,
      DATE(pmt.date_reg) AS synths_date,
      NULL AS chiffre_affaires_ht,
      NULL AS total_tva,
      NULL AS chiffre_affaires_ttc,
      NULL AS nbr_tickets,
      NULL AS panier_moyen_ttc,
      mtp.intitule AS mode_title,
      ROUND(SUM(pmt.montant), 2) AS total_paiement_by_mode
  FROM
      paiement_tier AS pmt
  JOIN methode_paiement AS mtp ON pmt.id_method = mtp.id
  GROUP BY
      mtp.id, mode_title, DATE(pmt.date_reg)
  HAVING
      SUM(pmt.montant) <> 0
  ) AS subquery
GROUP BY
  DATE(synths_date), mode_title;`;
  try {
    const sql = `
                  SELECT
                  DATE(synths_date) AS synths_date,
                  COALESCE(SUM(total_espace_encaisse),
                  0) AS total_espace_encaisse,
                  COALESCE(SUM(total_operation_caisse),
                  0) AS total_operation_caisse,
                  SUM(
                      COALESCE(total_espace_encaisse, 0) + COALESCE(total_operation_caisse, 0)
                  ) AS montant_en_caisse,
                  COALESCE(SUM(chiffre_affaires_ht),
                  0) AS chiffre_affaires_ht,
                  COALESCE(SUM(total_tva),
                  0) AS total_tva,
                  COALESCE(SUM(chiffre_affaires_ttc),
                  0) AS chiffre_affaires_ttc,
                  COALESCE(SUM(nbr_tickets),
                  0) AS nbr_tickets,
                  COALESCE(SUM(panier_moyen_ttc),
                  0) AS panier_moyen_ttc
              FROM
                  (
                  SELECT
                      ROUND(SUM(pm.montant),
                      2) AS total_espace_encaisse,
                      NULL AS total_operation_caisse,
                      dce.date_doc AS synths_date,
                      NULL AS chiffre_affaires_ht,
                      NULL AS total_tva,
                      NULL AS chiffre_affaires_ttc,
                      NULL AS nbr_tickets,
                      NULL AS panier_moyen_ttc
                  FROM
                      docentete AS dce
                  JOIN paiement_caisse AS pm
                  ON
                      pm.id_doc = dce.id
                  JOIN paiement_tier AS pmt
                  ON
                      pmt.id = pm.id_paiement
                  LEFT JOIN methode_paiement AS mtp
                  ON
                      mtp.id = pmt.id_method
                  WHERE
                      dce.idtypedoc = 21 AND mtp.id = 2
                  GROUP BY
                      dce.date_doc
                  UNION ALL
              SELECT NULL AS
                  total_espace_encaisse,
                  ROUND(
                      SUM(
                          CASE WHEN retrait = 1 THEN - montant WHEN depot = 1 THEN montant ELSE 0
                      END
                  ),
                  2
              ) AS total_operation_caisse,
              date_et_heur AS synths_date,
              NULL AS chiffre_affaires_ht,
              NULL AS total_tva,
              NULL AS chiffre_affaires_ttc,
              NULL AS nbr_tickets,
              NULL AS panier_moyen_ttc
              FROM
                  mouvementcaisse
              GROUP BY
                  date_et_heur
              UNION ALL
              SELECT NULL AS
                  total_espace_encaisse,
                  NULL AS total_operation_caisse,
                  date_doc AS synths_date,
                  SUM(mntht) AS chiffre_affaires_ht,
                  ROUND(SUM(mnttva),
                  2) AS total_tva,
                  ROUND(SUM(mntttc),
                  2) AS chiffre_affaires_ttc,
                  COUNT(Num_doc) AS nbr_tickets,
                  ROUND(
                      SUM(mntttc) / COUNT(Num_doc),
                      2
                  ) AS panier_moyen_ttc
              FROM
                  docentete
              GROUP BY
                  date_doc
              ) AS subquery
                
              GROUP BY
                  DATE(synths_date) ${having} `;
    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
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
      await addTicketLines({ ...data, ticketId });
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
    data.totalPriceTTC,
    data.totalPriceHT,
    data.totalTax,
    idCaisse,
  ];
  const { insertId: ticketId } = await executeQuery(
    addTicketSQL,
    addTicketValues
  );

  // if (ticketId) {
  //   const insertReservatTicketSQL =
  //     "INSERT INTO reservat_docentete(id_res,id_doc) VALUES (?,?)";
  //   const insertReservatTicketValues = [data.idRes, ticketId];
  //   await executeQuery(insertReservatTicketSQL, insertReservatTicketValues);
  // }

  return ticketId;
}

async function addTicketLines(data) {
  const addTicketLinePromises = data.prestations.map(async (item) => {
    const addTicketLineSQL =
      "INSERT INTO docligne(iddocument,idproduit,Designation,qte,prix,idtauxtva,pUnet,total_ttc,idCollab) VALUES (?,?,?,?,?,?,?,?,?)";

    const addTicketLineValues = [
      data.ticketId,
      item.id_art,
      item.Designation,
      item?.qte,
      item.prix,
      item.tva_id,
      item.prix,
      item.total_ttc,
      item.idCollab,
    ];
    await executeQuery(addTicketLineSQL, addTicketLineValues);
  });

  await Promise.all(addTicketLinePromises);
}
async function removeTicketLine(ticketLineId) {
  try {
    const deleteTicketLineSQL = "DELETE FROM docligne WHERE id = ?";
    const deleteTicketLineValues = [ticketLineId];
    await executeQuery(deleteTicketLineSQL, deleteTicketLineValues);
    console.log("Document line removed successfully.");
  } catch (error) {
    console.error("An error occurred:", error);
    console.error("Stack trace:", error.stack);
  }
}
async function removeTicketLineByIDticket(ticketId) {
  try {
    const deleteTicketLineSQL = "DELETE FROM docligne WHERE iddocument = ?";
    const deleteTicketLineValues = [ticketId];
    await executeQuery(deleteTicketLineSQL, deleteTicketLineValues);
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
    // const deleteReservatTicketSQL =
    //   "DELETE FROM reservat_docentete WHERE id_doc = ?";
    // const deleteReservatTicketValues = [id];
    // await executeQuery(deleteReservatTicketSQL, deleteReservatTicketValues);

    const deleteTicketLineSQL = "DELETE FROM docligne WHERE iddocument = ?";
    const deleteTicketLineValues = [id];
    await executeQuery(deleteTicketLineSQL, deleteTicketLineValues);

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
async function updateTicketLine(ticketLine) {
  const updateTicketLineSQL = "UPDATE docligne SET qte = ? WHERE id = ?";
  const updateTicketLineValues = [ticketLine.qte, ticketLine.id];
  await executeQuery(updateTicketLineSQL, updateTicketLineValues);
}
async function handleTicketLines(ticketLines) {
  const updateTicketLinePromises = ticketLines.map(async (item) => {
    console.log(item, "item");
    const removedRecord = item?.removedRow;
    // check if item.line_id exist
    if (item.line_id && removedRecord) {
      removeTicketLine(item.id);
    } else if (item.line_id && !removedRecord) {
      updateTicketLine(item);
    }
    const updateTicketLineSQL =
      "UPDATE docligne SET qte = ? , Remise=?, total_ttc=? WHERE id = ?";
    const updateTicketLineValues = [
      item.qte,
      item.remise,
      item.total_ttc,
      item.id,
    ];
    await executeQuery(updateTicketLineSQL, updateTicketLineValues);
  });
  await Promise.all(updateTicketLinePromises);
}

export async function CaissePayement(PayementData, createTicketData) {
  // revalidatePath("/caisse");
  // return;
  //
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
  let ticketId = PayementData.ticketId;
  // check if ticketId is not defined if yes then create new ticket and the return insertedTicket affected to ticketId
  if (!ticketId) {
    const insertedTicket = await createTicket(createTicketData);
    ticketId = insertedTicket;
  } else {
    handleTicketLines(createTicketData.prestations);
  }
  // console.log(data);
  // return;
  for (const paiement of PaiementsDeCommande) {
    const { montant, date_paiement, mode_paiement_id } = paiement;
    const flag = 1;
    const query1 = `
      INSERT INTO paiement_tier
      (montant, date_reg, id_method, ref, id_tier, flag)
      VALUES
      (?, ?, ?, ?, ?, ?)
    `;
    const { insertId: id_paiement_caisse } = await executeQuery(query1, [
      montant,
      date_paiement,
      mode_paiement_id,
      "",
      id_tier,
      flag,
    ]);
    const query2 = `
      INSERT INTO paiement_caisse
      (id_paiement, id_doc, montant, montant_rendu, Num_ticket_rt)
      VALUES
      (?, ?, ?, ?, ?)
    `;
    await executeQuery(query2, [
      id_paiement_caisse,
      ticketId,
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
  const { total_ttc } = createTicketData;
  await executeQuery(query3, [total_ttc, ticketId]);

  if (resteAPayer === 0) {
    const query4 = `
      UPDATE docentete
      SET valide = 1, mise_en_attente = 0
      WHERE id = ?
    `;
    await executeQuery(query4, [ticketId]);
  }
  revalidatePath("/caisse/ticket/" + ticketId);
  return ticketId;
}

export async function addMouvementCaisse(data) {
  // const date_doc = new Date().toISOString().split("T")[0];
  // console.log(data);
  // return data;
  const sql = `
    INSERT INTO mouvementcaisse(
      id_utilisateur,
      id_caisse,
      montant,
     ${data.operationTypeColumn},
      commentaire
    )
    VALUES(?, ?, ?, ?, ?)
  `;
  const values = [
    data.id_utilisateur,
    data.id_caisse,
    data.montant,
    1,
    data.commentaire,
  ];
  await executeQuery(sql, values);
  revalidatePath("/caisse/journaux");
}
export async function removeMouvement(id) {
  // const date_doc = new Date().toISOString().split("T")[0];
  // console.log(id);
  // return id;
  const sql = `
    DELETE FROM mouvementcaisse WHERE id = ?
  `;
  const values = [id];
  await executeQuery(sql, values);
  revalidatePath("/caisse/journaux");
}
