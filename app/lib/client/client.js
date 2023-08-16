import connection from "../../api/db";

export default async function getClients() {
  // const clients = await db("clients").select("clients.*");
  const clients = await connection.query("SELECT * FROM clients");

  // .join('users', 'posts.user_id', 'users.id')

  res.json(clients);
}
