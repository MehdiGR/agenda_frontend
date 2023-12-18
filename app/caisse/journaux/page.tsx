import { get_ticket_lines } from "@/app/lib/ticket/ticketActions";

export default async function TicketsEnAttente() {
  const result = await get_ticket_lines({
    where: ` WHERE idtypedoc = 21  AND mise_en_attente=0 AND DATE(date_doc) = CURDATE()`,
  });
  const tickets = JSON.parse(result as string);

  return (
    <div className=" space-y-4">
      <h3 className="text-xl text-gray-700  ">Tickets Aujourd’hui</h3>
      <table className="w-full overflow-auto border">
        <thead className="bg-slate-800 text-white">
          <tr className="">
            <th className="p-1 border">N° Ticket</th>
            <th className="p-1 border">Date Creation</th>
            <th className="p-1 border">Client</th>
            <th className="p-1 border">Total HT</th>
            <th className="p-1 border">Total TVA</th>
            <th className="p-1 border">Total TTC</th>
            {/* <th>Responsable</th> */}
            {/* <th>Statut</th> */}
          </tr>
        </thead>
        <tbody className="text-center">
          {tickets?.map((ticketLine: any, index: number) => (
            <tr key={index} className="p-16 ">
              <td>{ticketLine?.Num_ticket}</td>
              <td>{ticketLine?.date_creation.substring(0, 10)}</td>
              <td>{ticketLine?.client}</td>
              <td>{Number(ticketLine?.mntht)}</td>
              <td>{Number(ticketLine?.mnttva)}</td>
              <td>{Number(ticketLine?.mntttc)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
