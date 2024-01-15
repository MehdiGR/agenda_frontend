"use client";
import { get_encaissements } from "@/app/lib/ticket/ticketActions";
import TableEncaissement from "./table";
import { useEffect, useState } from "react";

export default function Encaissements({ data }: any) {
  const [tickets, setTickets] = useState(data);
  useEffect(() => {
    setTickets(data);
  }, [data]);
  // useEffect(() => {
  //   setTickets(
  //     data.filter((tickets: any) => {
  //       const ticketDate = new Date(tickets?.date_creation);

  //       return (
  //         ticketDate.toISOString().slice(0, 10) ===
  //         valueDate.toISOString().slice(0, 10)
  //       );
  //     })
  //   );
  // }, [data, valueDate]);
  // useEffect(() => {
  //   get_encaissements({
  //     where: `WHERE idtypedoc = 21 AND DATE(dce.date_doc)="${valueDate
  //       .toISOString()
  //       .slice(0, 10)}"`,
  //   })
  //     .then((data) => {
  //       setTickets(JSON.parse(data as string));
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching data:", error);
  //     });
  // }, [valueDate]);
  return (
    <div className="space-y-4">
      <div className="p-2">
        <TableEncaissement tickets={tickets} />
      </div>
    </div>
  );
}
