import connection from "@/app/lib/db";
import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const villes = await new Promise((resolve, reject) =>
//       connection.query(
//         "SELECT * FROM ville",
//         (error, results) =>
//           error ? reject(error) : resolve(results)
//       )
//     );

//     return new NextResponse(JSON.stringify(villes));
//   } catch (error) {
//     console.error("Could not execute query:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Could not execute query" }),
//       { status: 500 }
//     );
//   }
// }

export async function fetchVilles() {
  try {
    const villes = await new Promise((resolve, reject) =>
      connection.query("SELECT * FROM ville", (error, results) =>
        error ? reject(error) : resolve(results)
      )
    );
    return JSON.stringify(villes);
  } catch (error) {
    console.error("Could not execute query:", error);
    return JSON.stringify({ error: "Could not execute query" });
  }
}
