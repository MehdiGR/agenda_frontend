import connection from '../db';
import { NextResponse } from 'next/server'

export async function GET() {
 try {
    const prestations = await new Promise((resolve, reject) => 
      connection.query(`SELECT  art.id as id_art, art.*, img_art.* 
                          FROM article as art  
                          LEFT JOIN images_article as img_art ON img_art.id_article=art.id  
                          WHERE idTypeArticle = 3 GROUP by art.id;`,
       (error, results) => 
        error ? reject(error) : resolve(results)
      )
    );
  
    return new NextResponse(JSON.stringify(prestations));
  } catch (error) {
    console.error('Could not execute query:', error);
    return new NextResponse({ error: 'Could not execute query' }, { status: 500 });
  }
  
}