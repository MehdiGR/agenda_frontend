import connection from '../db';
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const clients = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM client', (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Convert the data to JSON format
    const clientsJson = JSON.stringify(clients);

    // Return the data using NextResponse
    return new NextResponse(clientsJson);
  } catch (error) {
    // If an error is thrown, the query could not be executed
    console.error('Could not execute query:', error);

    // Return an error response
    return new NextResponse({ error: 'Could not execute query' }, { status: 500 });
  }
}