import connection from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clients = await new Promise((resolve, reject) =>
      connection.query(
        "SELECT * FROM client",
        (error: Error | null, results: any) =>
          error ? reject(error) : resolve(results)
      )
    );

    return new NextResponse(JSON.stringify(clients));
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const body = await req.json();

  // Your SQL query with parameters
  const sql =
    "INSERT INTO client(codeclient,nom,adresse,adresse2,ville,tele,fax,email,ICE,i_f,map_x,map_y,idCollab,geolocalisation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    body.code,
    body.nom,
    body?.adresse,
    body?.adresse2,
    body.ville.value,
    body?.tel,
    body?.fax,
    body?.email,
    body?.ice,
    body?.i_f,
    body?.map_x,
    body?.map_y,
    body.collaborateur.value,
    body?.geolocalisation,
  ];

  // Execute the query with parameters
  const insertedIdPromise = new Promise((resolve, reject) => {
    connection.query(
      sql,
      values,
      function (err: any, result: any, fields: any) {
        if (err) reject(err);
        resolve(result.insertId);
      }
    );
  });

  const insertedId = await insertedIdPromise;

  console.log(insertedId);

  // Release the connection back to the pool
  // connection.disconnect();

  return new NextResponse(
    JSON.stringify({
      message: "Data inserted successfully",
      clientId: insertedId,
    })
  );
}
