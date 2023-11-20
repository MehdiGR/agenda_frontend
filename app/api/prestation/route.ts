import connection from "../db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const prestations = await new Promise((resolve, reject) =>
      connection.query(
        `SELECT
            art.id AS id_art,
            art.intitule,
            art.prixTTC,
            art.duree,
            img_art.img AS img
          FROM
              article AS art
          LEFT JOIN images_article AS img_art
          ON
              img_art.id_article = art.id
          WHERE
              idTypeArticle = 3
          GROUP BY
              art.id limit 3`,
        (error, results) => (error ? reject(error) : resolve(results))
      )
    );

    return new NextResponse(JSON.stringify(prestations));
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      { error: "Could not execute query" },
      { status: 500 }
    );
  }
}
