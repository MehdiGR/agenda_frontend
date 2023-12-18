import { get_tickets } from "@/app/lib/ticket/ticketActions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TicketsEnAttente() {
  const [ticketLines, setTicketLines] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const result = await get_tickets({
        where: ` WHERE idtypedoc = 21  AND mise_en_attente=1`,
      });
      console.log(result), "get ticktes";
      const parseData = JSON.parse(result as string);
      setTicketLines(parseData);
    }
    fetchData();
  }, []);
  const router = useRouter();
  const handleRowClick = (row: any) => {
    router.push(`/caisse/ticket/${row.iddocument}`);
  };
  return (
    <div className="absolute top-full left-0 bg-white p-4 w-[500px] z-10 rounded-lg transition cursor-pointer-opacity duration-300 leading-[30px] text-slate-900 hover:text-slate-900 shadow-md">
      <h3 className="text-xl font-bold">Tickets en attente paiement</h3>
      <table className="w-full overflow-auto border">
        <thead>
          <tr>
            <th>Date Creation</th>
            <th>Client</th>
            <th>Reste à payer</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {ticketLines?.map((ticketLine: any, index: number) => (
            <tr
              key={index}
              className="p-4 hover:bg-slate-900 hover:text-white transition"
              onClick={() => handleRowClick(ticketLine)}
            >
              <td>{ticketLine?.date_creation.substring(0, 10)}</td>
              <td>{ticketLine?.client}</td>
              <td>{Number(ticketLine?.restePayer.toFixed(2))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
