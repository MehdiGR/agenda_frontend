import connection from '../db';
import { NextResponse } from 'next/server'

export async function GET() {
 try {
    const periods = await new Promise((resolve, reject) => 
      connection.query(`SELECT
                            p.*,
                            a.nom AS agenda_nom,
                            prs.intitule as prestation
                        FROM
                            periode AS p
                        JOIN agenda AS a
                        ON
                            a.id = p.idAgenda
                        JOIN agenda_prestation AS ag_p
                        ON
                            ag_p.idAgenda = a.id
                        JOIN article AS prs
                        ON
                            prs.id = ag_p.idProduit;`,
       (error, results) => 
        error ? reject(error) : resolve(results)
      )
    );
  // console.log(periods)
    return new NextResponse(JSON.stringify(periods));
  } catch (error) {
    console.error('Could not execute query:', error);
    return new NextResponse({ error: 'Could not execute query' }, { status: 500 });
  }
  
}