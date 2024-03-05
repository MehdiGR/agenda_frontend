"use server";
import { revalidatePath } from "next/cache";
import connection from "@/app/lib/db";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

// import { NextResponse } from "next/server";

export async function get_encaissements({ where = "", params = [] }) {
  try {
    const sql = `
      SELECT
        dce.id AS ticketId,
        clt.nom AS client,
        Num_doc AS Num_ticket,
        DATE(dce.date_doc) AS date_creation,
        pm.montant,
        mtp.intitule as mode_paiement,
        clb.nom AS vendeur 
      FROM
          docentete AS dce
      JOIN client clt ON clt.id = dce.tier_doc
      JOIN collaborateur clb ON clt.idCollab = clb.id_collaborateur
      JOIN paiement_caisse AS pm ON pm.id_doc = dce.id
      JOIN paiement_tier AS pmt ON pmt.id = pm.id_paiement
      LEFT JOIN methode_paiement AS mtp ON mtp.id = pmt.id_method
      ${where}`;

    const encaissements = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(JSON.stringify(results))
      )
    );

    return encaissements;
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_tickets({ where = "", params = [] }) {
  try {
    const sql = `
      SELECT
        dce.id as ticketId,
        ROUND(dce.mntht,2) as total_ht,
        ROUND(dce.mnttva,2) as total_tva,
        ROUND(dce.mntttc,2) as total_ttc,
        clt.nom as client,
        Num_doc as Num_ticket,
        CASE WHEN dce.id in (SELECT id_doc FROM paiement_caisse)THEN "Encaissé" ELSE "" END as statut,
        GREATEST(ROUND(dce.mntttc - (
          SELECT COALESCE(SUM(pm.montant), 0)
          FROM paiement_caisse as pm
          WHERE dce.id = pm.id_doc
      ),2),0) as restePayer,
        Date(dce.date_doc) AS date_creation
      FROM
        docentete AS dce
      JOIN client clt ON
        clt.id = dce.tier_doc
      ${where}`;
    console.log(params);
    const tickets = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(tickets);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
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
                    tva.valeur AS tva_valeur,
                   
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
                JOIN p_tauxtva AS tva
                ON
                    tva.id = dcl.idtauxtva
                

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
      JSON.stringify({ error: "Could not execute query" }),
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
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_operation_caisse({ where = "", params = [] }) {
  try {
    const sql = `SELECT
                  id,
                  DATE(date_et_heur) AS date_creation,
                  id_utilisateur AS utilisateur,
                  commentaire,
                  ROUND(montant,2) AS montant,
                  'Enregistrer' AS statut,
                  CASE WHEN retrait = 1 THEN 'Retrait' WHEN depot = 1 THEN 'Depot' WHEN encaissement = 1 THEN 'Encaissement' END AS operationType
                  FROM
                  mouvementcaisse
                  ${where}`;

    const operation_caisse = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(JSON.stringify(results))
      )
    );

    return operation_caisse;
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_paiements_jr({ having = "", params = [] }) {
  try {
    const sql = `
      SELECT
        DATE(pmt.date_reg) AS synths_date,
        mtp.intitule AS mode_paiement,
        ROUND(SUM(pmt.montant), 2) AS montant
      FROM
        paiement_tier AS pmt
      JOIN methode_paiement AS mtp ON pmt.id_method = mtp.id
      GROUP BY
        mtp.id, mode_paiement, DATE(pmt.date_reg)
      ${having}`;

    const paiements = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(JSON.stringify(results))
      )
    );

    return paiements;
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_montant_en_caisse_jr({
  having = "",
  params = [],
}) {
  try {
    const sql = `
      SELECT
        COALESCE(total_espece_encaisse, 0) AS total_espece_encaisse,
        COALESCE(total_operation_caisse, 0) AS total_operation_caisse,
        SUM(COALESCE(total_espece_encaisse, 0) + COALESCE(total_operation_caisse, 0)) AS montant_en_caisse,
        DATE(synths_date) AS synths_date
      FROM (
        SELECT
          ROUND(SUM(pm.montant), 2) AS total_espece_encaisse,
          NULL AS total_operation_caisse,
          dce.date_doc AS synths_date
        FROM docentete AS dce
        JOIN paiement_caisse AS pm ON pm.id_doc = dce.id
        JOIN paiement_tier AS pmt ON pmt.id = pm.id_paiement
        LEFT JOIN methode_paiement AS mtp ON mtp.id = pmt.id_method
        WHERE dce.idtypedoc = 21 AND mtp.id = 2
        GROUP BY dce.date_doc
        UNION ALL
        SELECT NULL AS total_espece_encaisse,
          ROUND(SUM(CASE WHEN retrait = 1 THEN -montant WHEN depot = 1 THEN montant ELSE 0 END), 2) AS total_operation_caisse,
          date_et_heur AS synths_date 
        FROM mouvementcaisse
        GROUP BY DATE(date_et_heur)
      ) AS subquery
      GROUP BY DATE(synths_date) ${having}`;

    const montant_en_caisse = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(JSON.stringify(results))
      )
    );

    return montant_en_caisse;
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_chiffre_affaires_jr({
  having = "",
  params = [],
}) {
  try {
    const sql = `
      SELECT
        date_doc AS synths_date,
        SUM(mntht) AS chiffre_affaires_ht,
        ROUND(SUM(mnttva), 2) AS total_tva,
        ROUND(SUM(mntttc), 2) AS chiffre_affaires_ttc,
        COUNT(Num_doc) AS nbr_tickets,
        ROUND(SUM(mntttc) / COUNT(Num_doc), 2) AS panier_moyen_ttc
      FROM
        docentete
      GROUP BY
        date_doc
      ${having}`;

    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(JSON.stringify(results))
      )
    );

    return synths;
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_chiffre_affaires({
  date = "",
  viewType = "",
}) {
  try {
    let sql = "";
    let queryParams = [];

    if (viewType == "monthly") {
      sql = `
      WITH RECURSIVE DateSequence AS (
        SELECT 
            ? AS date_sequence, -- Replace with the start date
            LAST_DAY(?) AS last_day -- Replace with the start date or another date to determine the last day of the month
        UNION ALL
        SELECT 
            DATE_ADD(date_sequence, INTERVAL 1 DAY) AS date_sequence,
            LAST_DAY(date_sequence) AS last_day
        FROM 
            DateSequence
        WHERE 
            DATE_ADD(date_sequence, INTERVAL 1 DAY) <= LAST_DAY(date_sequence)
    )
    SELECT 
        DATE_FORMAT(ds.date_sequence, '%Y-%m-%d') AS day,
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 THEN dcl.prix ELSE 0 END), 2), 0) AS total_prestations,
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 THEN dcl.prix ELSE 0 END), 2), 0) AS total_products,
        COALESCE(ROUND(SUM(DISTINCT dce.mntht), 2), 0) AS total_ht,

        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v0,
        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v20,
        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v21,
        COALESCE(ROUND(SUM(DISTINCT dce.mntttc), 2), 0) AS total_ttc,
        CASE 
            WHEN MAX(dce.cloture) = 1 THEN "cloture" 
            ELSE "ouvert" 
        END AS statut
    FROM 
        DateSequence ds
    LEFT JOIN docentete dce ON DATE(dce.date_doc) = ds.date_sequence
    LEFT JOIN docligne dcl ON dcl.iddocument = dce.id
    LEFT JOIN article art ON art.id = dcl.idproduit
    WHERE 
        ds.date_sequence <= CURDATE()
    GROUP BY 
        day
    ORDER BY 
        day;
    `;
      queryParams = [date, date];
    } else if (viewType == "yearly") {
      sql = `SELECT 
         m.month_name as month_name,    
         COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 THEN dcl.prix ELSE 0 END), 2), 0) AS total_prestations,
         COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 THEN dcl.prix ELSE 0 END), 2), 0) AS total_products,
         ROUND(SUM(dcl.prix),2) AS total_ht,
         COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v0,
         COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v20,
         COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v21,
         COALESCE(ROUND(SUM(dcl.total_ttc),2),0) AS total_ttc,

         CASE 
            WHEN MAX(dce.cloture) = 1 THEN "cloture" 
            ELSE "ouvert" 
        END AS statut
    FROM 
        docentete as dce
        LEFT JOIN docligne as dcl ON dcl.iddocument = dce.id 
        LEFT JOIN article AS art ON art.id = dcl.idproduit
        RIGHT JOIN 
        (SELECT 1 AS month_number, 'Janvier' AS month_name UNION ALL
         SELECT 2, 'Février' UNION ALL
         SELECT 3, 'Mars' UNION ALL
         SELECT 4, 'Avril' UNION ALL
         SELECT 5, 'Mai' UNION ALL
         SELECT 6, 'Juin' UNION ALL
         SELECT 7, 'Juillet' UNION ALL
         SELECT 8, 'Août' UNION ALL
         SELECT 9, 'Septembre' UNION ALL
         SELECT 10, 'Octobre' UNION ALL
         SELECT 11, 'Novembre' UNION ALL
         SELECT 12, 'Décembre') m 
         on MONTH(date_doc)=m.month_number and YEAR(dce.date_doc) = ?
    GROUP BY 
       m.month_number,
        m.month_name
    ORDER BY 
        m.month_number;`;
      queryParams = [date];
    }

    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, queryParams, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}

export async function get_total_sales_by_article_type({
  where = "",
  params = [],
}) {
  try {
    const sql = `SELECT
              'prestations' AS type,
            COALESCE(ROUND(SUM(dcl.prix), 2), 0) AS total_ht,
              COALESCE(ROUND(SUM(dcl.total_ttc - dcl.prix), 2), 0) AS total_tva,
              COALESCE(ROUND(SUM(dcl.total_ttc), 2), 0) AS total_ttc
          FROM
              docentete dce
          JOIN docligne dcl ON dcl.iddocument = dce.id
          JOIN article art ON art.id = dcl.idproduit
          ${where} AND art.idTypeArticle = 3
          UNION ALL
          SELECT
              'produits' AS type,
              COALESCE(ROUND(SUM(dcl.prix), 2), 0) AS total_ht,
              COALESCE(ROUND(SUM(dcl.total_ttc - dcl.prix), 2), 0) AS total_tva,
              COALESCE(ROUND(SUM(dcl.total_ttc), 2), 0) AS total_ttc
          FROM
              docentete dce
          JOIN docligne dcl ON dcl.iddocument = dce.id
          JOIN article art ON art.id = dcl.idproduit
          ${where} AND  art.idTypeArticle = 2; `;
    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, params, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_detail_tva({ date = "", viewType = "" }) {
  try {
    let sql = "";
    let queryParams = [];

    if (viewType == "monthly") {
      sql = `
      WITH RECURSIVE DateSequence AS (
        SELECT 
           ? AS date_sequence, -- Replace with the start date
            LAST_DAY(?) AS last_day -- Replace with the start date or another date to determine the last day of the month
        UNION ALL
        SELECT 
            DATE_ADD(date_sequence, INTERVAL 1 DAY) AS date_sequence,
            LAST_DAY(date_sequence) AS last_day
        FROM 
            DateSequence
        WHERE 
            DATE_ADD(date_sequence, INTERVAL 1 DAY) <= LAST_DAY(date_sequence)
    )
    SELECT 
        DATE_FORMAT(ds.date_sequence, '%Y-%m-%d') AS day,
    
        -- prestations tva
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_prestations_tva_0, 
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_prestations_tva_20,
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_prestations_tva_21,
        
        -- produits tva
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_0,
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_20,
        COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_21,

        COALESCE(ROUND(SUM(DISTINCT dce.mntht), 2), 0) AS total_ht,

        -- global tva 
        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v0,
        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v20,
        COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v21,
        
        COALESCE(ROUND(SUM(DISTINCT dce.mntttc), 2), 0) AS total_ttc,

        CASE 
            WHEN MAX(dce.cloture) = 1 THEN "cloture" 
            ELSE "ouvert" 
        END AS statut
    FROM 
        DateSequence ds
    LEFT JOIN docentete dce ON DATE(dce.date_doc) = ds.date_sequence
    LEFT JOIN docligne dcl ON dcl.iddocument = dce.id
    LEFT JOIN article art ON art.id = dcl.idproduit
    WHERE 
        ds.date_sequence <= CURDATE()
    GROUP BY 
        day
    ORDER BY 
        day;
    `;
      queryParams = [date, date];
    } else if (viewType == "yearly") {
      sql = `SELECT 
              m.month_name as month_name, 
              -- prestations
              COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 THEN dcl.prix ELSE 0 END), 2), 0) AS total_prestations,
              
              -- prestations tva
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v0" THEN (dcl.total_ttc-dcl.prix)  ELSE 0 END), 2), 0) AS total_prestations_tva_0,
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_prestations_tva_20,
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 3 AND art.code_tauxtvaVente="v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_prestations_tva_21,
              
              -- produits
              COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 THEN dcl.prix ELSE 0 END), 2), 0) AS total_products,
              
              -- produits tva
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_0,
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_20,
            COALESCE(ROUND(SUM(CASE WHEN art.idTypeArticle = 2 AND art.code_tauxtvaVente="v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_produits_tva_21,
            
              ROUND(SUM(dcl.prix),2) AS total_ht,
              -- global tva 
              COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v0" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v0,
              COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v20" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v20,
              COALESCE(ROUND(SUM(CASE WHEN art.code_tauxtvaVente = "v21" THEN (dcl.total_ttc-dcl.prix) ELSE 0 END), 2), 0) AS total_tva_v21,
              COALESCE(ROUND(SUM(dcl.total_ttc),2),0) AS total_ttc,

              CASE 
                WHEN MAX(dce.cloture) = 1 THEN "cloture" 
                ELSE "ouvert" 
            END AS statut
        FROM 
            docentete as dce
            LEFT JOIN docligne as dcl ON dcl.iddocument = dce.id 
            LEFT JOIN article AS art ON art.id = dcl.idproduit
            RIGHT JOIN 
            (SELECT 1 AS month_number, 'Janvier' AS month_name UNION ALL
              SELECT 2, 'Février' UNION ALL
              SELECT 3, 'Mars' UNION ALL
              SELECT 4, 'Avril' UNION ALL
              SELECT 5, 'Mai' UNION ALL
              SELECT 6, 'Juin' UNION ALL
              SELECT 7, 'Juillet' UNION ALL
              SELECT 8, 'Août' UNION ALL
              SELECT 9, 'Septembre' UNION ALL
              SELECT 10, 'Octobre' UNION ALL
              SELECT 11, 'Novembre' UNION ALL
              SELECT 12, 'Décembre') m 
              on MONTH(date_doc)=m.month_number and YEAR(dce.date_doc) = ?
        GROUP BY 
            m.month_number,
            m.month_name
        ORDER BY 
            m.month_number;`;
      queryParams = [date];
    }

    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, queryParams, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
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
export async function get_synths_reglement({ date = "", viewType = "" }) {
  try {
    let sql = "";
    let queryParams = [];

    if (viewType == "monthly") {
      sql = `
            WITH RECURSIVE
          DateSequence AS(
          SELECT
              ? AS date_sequence,
              -- Replace with the start date
              LAST_DAY(?) AS last_day -- Replace with the start date or another date to determine the last day of the month
          UNION ALL
          SELECT
              DATE_ADD(date_sequence, INTERVAL 1 DAY) AS date_sequence,
              LAST_DAY(date_sequence) AS last_day
          FROM
              DateSequence
          WHERE
              DATE_ADD(date_sequence, INTERVAL 1 DAY) <= LAST_DAY(date_sequence)
          )
          SELECT
              DATE_FORMAT(ds.date_sequence, '%Y-%m-%d') AS day,
              ROUND(SUM(CASE WHEN id_method = 1 THEN montant ELSE 0 END),2) AS total_carte_bancaire,
              ROUND(SUM(CASE WHEN id_method = 2 THEN montant ELSE 0 END),2) AS total_espece,
              ROUND(SUM(CASE WHEN id_method = 3 THEN montant ELSE 0 END),2) AS total_cheque,
              ROUND(
                SUM(CASE WHEN pt.id_method = 1 THEN pt.montant ELSE 0 END) +
                SUM(CASE WHEN pt.id_method = 2 THEN pt.montant ELSE 0 END) +
                SUM(CASE WHEN pt.id_method = 3 THEN pt.montant ELSE 0 END) 
                ,
                2
            ) AS line_total
          FROM
              DateSequence ds
          LEFT JOIN paiement_tier AS pt
          ON
              ds.date_sequence = DATE(pt.date_reg)
          WHERE
              ds.date_sequence <= CURDATE()
          GROUP BY
              DAY
          ORDER BY
              DAY;
    `;
      queryParams = [date, date];
    } else if (viewType == "yearly") {
      sql = `SELECT 
                m.month_name as month_name,    
                ROUND(SUM(CASE WHEN id_method = 1 THEN montant ELSE 0 END),2) AS total_carte_bancaire,
                ROUND(SUM(CASE WHEN id_method = 2 THEN montant ELSE 0 END),2) AS total_espece,
                ROUND(SUM(CASE WHEN id_method = 3 THEN montant ELSE 0 END),2) AS total_cheque,
                ROUND(
                  SUM(CASE WHEN pt.id_method = 1 THEN pt.montant ELSE 0 END) +
                  SUM(CASE WHEN pt.id_method = 2 THEN pt.montant ELSE 0 END) +
                  SUM(CASE WHEN pt.id_method = 3 THEN pt.montant ELSE 0 END) 
                  ,
                  2
              ) AS line_total
              FROM
                (SELECT 1 AS month_number, 'Janvier' AS month_name UNION ALL
                SELECT 2, 'Février' UNION ALL
                SELECT 3, 'Mars' UNION ALL
                SELECT 4, 'Avril' UNION ALL
                SELECT 5, 'Mai' UNION ALL
                SELECT 6, 'Juin' UNION ALL
                SELECT 7, 'Juillet' UNION ALL
                SELECT 8, 'Août' UNION ALL
                SELECT 9, 'Septembre' UNION ALL
                SELECT 10, 'Octobre' UNION ALL
                SELECT 11, 'Novembre' UNION ALL
                SELECT 12, 'Décembre') m 
              LEFT JOIN paiement_tier AS pt
                ON MONTH(pt.date_reg) = m.month_number AND YEAR(pt.date_reg) = ?
            
              GROUP BY 
                m.month_number,
                m.month_name
              ORDER BY 
                m.month_number`;
      queryParams = [date];
    }

    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, queryParams, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
export async function get_synths_fonds_caisse({ date = "", viewType = "" }) {
  try {
    let sql = "";
    let queryParams = [];

    if (viewType == "monthly") {
      sql = `
      WITH RECURSIVE
          DateSequence AS(
          SELECT
              ? AS date_sequence,
              -- Replace with the start date
              LAST_DAY(?) AS last_day -- Replace with the start date or another date to determine the last day of the month
          UNION ALL
      SELECT
          DATE_ADD(date_sequence, INTERVAL 1 DAY) AS date_sequence,
          LAST_DAY(date_sequence) AS last_day
      FROM
          DateSequence
      WHERE
          DATE_ADD(date_sequence, INTERVAL 1 DAY) <= LAST_DAY(date_sequence)
      )
      SELECT
          DATE_FORMAT(ds.date_sequence, '%Y-%m-%d') AS day,
          ROUND(SUM(CASE WHEN retrait = 1 THEN mc.montant ELSE 0 END), 2) AS total_retrait,
          ROUND(SUM(CASE WHEN depot = 1 THEN mc.montant ELSE 0 END), 2) AS total_depot,
          ROUND(SUM(CASE WHEN remise_en_banque = 1 THEN mc.montant ELSE 0 END), 2) AS total_remise_en_bq,
          ROUND(SUM(DISTINCT CASE WHEN t2.id_method = 2 THEN t2.montant ELSE 0 END), 2) AS total_espece,
          ROUND(
            SUM(CASE WHEN mc.retrait = 1 THEN mc.montant ELSE 0 END) +
            SUM(CASE WHEN mc.depot = 1 THEN mc.montant ELSE 0 END) +
            SUM(CASE WHEN mc.remise_en_banque = 1 THEN mc.montant ELSE 0 END) +
            SUM(DISTINCT CASE WHEN t2.id_method = 2 THEN t2.montant ELSE 0 END),
            2
        ) AS line_total
      FROM
          DateSequence ds
      LEFT JOIN mouvementcaisse AS mc
          ON DATE(mc.date_et_heur) = ds.date_sequence

      LEFT JOIN paiement_tier AS t2
      ON
        ds.date_sequence = DATE(t2.date_reg)
      WHERE
          ds.date_sequence <= CURDATE()
      GROUP BY
          DAY
      ORDER BY
          DAY;
    `;
      queryParams = [date, date];
    } else if (viewType == "yearly") {
      sql = `SELECT 
              m.month_name as month_name,    
              ROUND(SUM(CASE WHEN mc.retrait = 1 THEN mc.montant ELSE 0 END), 2) AS total_retrait,
              ROUND(SUM(CASE WHEN mc.depot = 1 THEN mc.montant ELSE 0 END), 2) AS total_depot,
              ROUND(SUM(CASE WHEN mc.remise_en_banque = 1 THEN mc.montant ELSE 0 END), 2) AS total_remise_en_bq,
              COALESCE(pt.total_espece, 0) AS total_espece,
              ROUND(
                SUM(CASE WHEN mc.retrait = 1 THEN mc.montant ELSE 0 END) +
                SUM(CASE WHEN mc.depot = 1 THEN mc.montant ELSE 0 END) +
                SUM(CASE WHEN mc.remise_en_banque = 1 THEN mc.montant ELSE 0 END) +
                COALESCE(pt.total_espece, 0),
                2
            ) AS line_total
            FROM
              (SELECT 1 AS month_number, 'Janvier' AS month_name UNION ALL
              SELECT 2, 'Février' UNION ALL
              SELECT 3, 'Mars' UNION ALL
              SELECT 4, 'Avril' UNION ALL
              SELECT 5, 'Mai' UNION ALL
              SELECT 6, 'Juin' UNION ALL
              SELECT 7, 'Juillet' UNION ALL
              SELECT 8, 'Août' UNION ALL
              SELECT 9, 'Septembre' UNION ALL
              SELECT 10, 'Octobre' UNION ALL
              SELECT 11, 'Novembre' UNION ALL
              SELECT 12, 'Décembre') m 
            LEFT JOIN mouvementcaisse AS mc
              ON MONTH(mc.date_et_heur) = m.month_number AND YEAR(mc.date_et_heur) = ?
            LEFT JOIN (
              SELECT 
                MONTH(date_reg) AS month_number,
                ROUND(SUM(CASE WHEN id_method = 2 THEN montant ELSE 0 END),2) AS total_espece
              FROM 
                paiement_tier
              WHERE 
                YEAR(date_reg) = ?
              GROUP BY 
                MONTH(date_reg)
            ) pt ON m.month_number = pt.month_number
            GROUP BY 
              m.month_number,
              m.month_name
            ORDER BY 
              m.month_number;`;
      queryParams = [date];
    }

    const synths = await new Promise((resolve, reject) =>
      connection.query(sql, queryParams, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(synths);
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
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

// pages/api/send-email.js
