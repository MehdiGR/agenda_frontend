import connection from '../db';
import { NextResponse } from 'next/server'

export async function GET() {
 try {
    const reservat = await new Promise((resolve, reject) => 
      connection.query('SELECT * FROM reservat', (error, results) => 
        error ? reject(error) : resolve(results)
      )
    );
  
    return new NextResponse(JSON.stringify(reservat));
  } catch (error) {
    console.error('Could not execute query:', error);
    return new NextResponse({ error: 'Could not execute query' }, { status: 500 });
  }
  
}
export async function POST(req: Request) {
  const body = await req.json();

  // Your SQL query with parameters
  const sql =
    "INSERT INTO reservat(idClient,dateRes,heurDB,duree,note) VALUES (?,?,?,?,?)";
  const values = [
    body.client.value,
    body.dateRes,
    body?.time,
    body?.duree,
    body?.note,
  ];

  // Execute the query with parameters
  const insertedId_resPromise = new Promise((resolve, reject) => {
    connection.query(sql, values, function (err: any, result: any, fields: any) {
      if (err) reject(err);
      resolve(result.insertId);
    });
  });

 const insertedId_res = await insertedId_resPromise;
   
const prestationsIds=body.prestationsIds.split(",").map(Number)
prestationsIds.forEach((prestationId :any) => {
    // Your SQL query with parameters
  const sql2 =
    "INSERT INTO ligne_res(idRes,idPrest) VALUES (?,?)";
  const values2 = [
    insertedId_res,
    prestationId,
   
  ];
  console.log(values2)
    connection.query(sql2, values2,()=>1);
  const sql3 =
    "INSERT INTO periode(idRes,idPrest) VALUES (?,?)";
  const values3 = [
    insertedId_res,
    prestationId,
   
  ];
  console.log(values3)
    connection.query(sql2, values3,()=>1);
});
 
  // Release the connection back to the pool
  // connection.disconnect();

  return new NextResponse(
    JSON.stringify({ message: "Data inserted successfully", reservatId: insertedId_res })
  );
}

