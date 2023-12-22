import { get_ticket_lines } from "@/app/lib/ticket/ticketActions";

export default async function TicketsEnAttente() {
  const result = await get_ticket_lines({
    where: ` WHERE idtypedoc = 21   AND DATE(date_doc) = CURDATE()`,
  });
  // AND mise_en_attente=0
  const tickets = JSON.parse(result as string);

  return (
    <div className=" space-y-4">
      <h3 className="text-2xl text-gray-700 font-bold  ">
        Tickets Aujourd’hui
      </h3>
      <table className="w-full overflow-auto border">
        <thead className="bg-slate-800 text-white">
          <tr className="">
            <th className="p-4 border">N° Ticket</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Client</th>
            <th className="p-4 border">Total HT</th>
            <th className="p-4 border">Total TVA</th>
            <th className="p-4 border">Total TTC</th>
            {/* <th>Responsable</th> */}
            {/* <th>Statut</th> */}
          </tr>
        </thead>
        <tbody className="text-center">
          {tickets?.map((ticketLine: any, index: number) => (
            <tr
              key={index}
              className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
            >
              {/* add even and odd classes to rows to style them appropriately */}
              <td className="p-4 text-slate-800">{ticketLine?.Num_ticket}</td>
              <td className="p-4 text-slate-800">
                {ticketLine?.date_creation.slice(0, 10)}
              </td>
              <td className="p-4 text-slate-800">{ticketLine?.client}</td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mntht)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mnttva)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.mntttc)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
