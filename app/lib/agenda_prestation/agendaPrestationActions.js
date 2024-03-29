import connection from "@/app/lib/db";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const agenda_prestation = await new Promise((resolve, reject) =>
//       connection.query(
//         `SELECT
//                             ag.nom AS agenda_intitule,
//                             art.intitule AS prestation_intitule,
//                             art.duree,
//                             art.prixTTC AS prix
//                         FROM
//                             agenda_prestation AS ag_pr
//                         JOIN agenda AS ag
//                         JOIN article AS art
//                         ON
//                             art.id = ag_pr.id;`,
//         (error, results) =>
//           error ? reject(error) : resolve(results)
//       )
//     );

//     return new NextResponse(JSON.stringify(agenda_prestation));
//   } catch (error) {
//     console.error("Could not execute query:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Could not execute query" }),
//       { status: 500 }
//     );
//   }
// }
export async function fetchAgendaPrestation() {
  const sql = `SELECT
                  ag.nom AS agenda_intitule,
                  art.intitule AS prestation_intitule,
                  art.duree,
                  art.prixTTC AS prix
               FROM
                  agenda_prestation AS ag_pr
               JOIN agenda AS ag
               JOIN article AS art
               ON
                  art.id = ag_pr.id;`;
  try {
    const agenda_prestation = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(agenda_prestation);
  } catch (error) {
    console.error("Could not execute query:", error);
    return JSON.stringify({ error: "Could not execute query" });
  }
}
