import connection from "@/app/lib/db";

// export default async function getClients() {
//   // const clients = await db("clients").select("clients.*");
//   const clients = await connection.query("SELECT * FROM clients");

//   // .join('users', 'posts.user_id', 'users.id')

//   res.json(clients);
// }

export async function fetchClients() {
  const sql = "SELECT * FROM client";
  try {
    const clients = await new Promise((resolve, reject) =>
      connection.query(sql, (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );

    return JSON.stringify(clients);
  } catch (error) {
    console.error("Could not execute query:", error);
    return JSON.stringify({ error: "Could not execute query" });
  }
}

export async function addClient(data) {
  // Your SQL query with parameters
  const sql =
    "INSERT INTO client(codeclient,nom,adresse,adresse2,ville,tele,fax,email,ICE,i_f,map_x,map_y,idCollab,geolocalisation) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const values = [
    data.code,
    data.nom,
    data?.adresse,
    data?.adresse2,
    data.ville.value,
    data?.tel,
    data?.fax,
    data?.email,
    data?.ice,
    data?.i_f,
    data?.map_x,
    data?.map_y,
    data.collaborateur.value,
    data?.geolocalisation,
  ];

  // Execute the query with parameters
  const insertedIdPromise = new Promise((resolve, reject) => {
    connection.query(sql, values, function (error, result, fields) {
      if (error) reject(err);
      resolve(result.insertId);
    });
  });

  const insertedId = await insertedIdPromise;

  console.log(insertedId);

  // Release the connection back to the pool
  // connection.disconnect();

  return JSON.stringify({
    message: "Data inserted successfully",
    clientId: insertedId,
  });
}
