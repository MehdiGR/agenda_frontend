import connection from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const agendas = await new Promise((resolve, reject) =>
      connection.query(
        `SELECT * FROM agenda`,
        (error: Error | null, results: any) =>
          error ? reject(error) : resolve(results)
      )
    );

    return new NextResponse(JSON.stringify(agendas));
  } catch (error) {
    console.error("Could not execute query:", error);
    return new NextResponse(
      JSON.stringify({ error: "Could not execute query" }),
      { status: 500 }
    );
  }
}
