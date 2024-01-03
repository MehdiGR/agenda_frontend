"use client";
import React, { useEffect, useState } from "react";
import ModalDetailTK from "../../components/Modals/modaldetailticket";
import { CiEdit } from "react-icons/ci";

export default function Tickets({ data, valueDate }: any) {
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState<number>();
  const [isDetailTKModalopen, setModalDetailTKIsOpen] = useState(false);
  const openDetailTKModal = (id: number) => {
    setTicketId(id);
    setModalDetailTKIsOpen(true);
  };
  // useEffect(() => {
  //   console.log(ticketId, "ticketId");
  //   setModalDetailTKIsOpen(true);
  // }, [ticketId]);
  const closeDetailTKModal = () => {
    setModalDetailTKIsOpen(false);
  };
  useEffect(() => {
    setTickets(
      data.filter((tickets: any) => {
        const ticketDate = new Date(tickets?.date_creation);

        return (
          ticketDate.toISOString().slice(0, 10) ===
          valueDate.toISOString().slice(0, 10)
        );
      })
    );
  }, [data, valueDate]);
  return (
    <div className="space-y-4">
      <div className="p-2"></div>
      <table className="w-full overflow-auto border">
        <thead className="bg-slate-800 text-white">
          <tr>
            <th className="p-4 border">N° Ticket</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Client</th>
            <th className="p-4 border">Total HT</th>
            <th className="p-4 border">Total TVA</th>
            <th className="p-4 border">Total TTC</th>
            <th className="p-4 border"></th>
          </tr>
        </thead>
        <tbody className="text-center">
          {tickets.map((ticket: any, index: number) => (
            <tr
              key={index}
              className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
            >
              <td className="p-4 text-slate-800">{ticket?.Num_ticket}</td>
              <td className="p-4 text-slate-800">
                {ticket?.date_creation.slice(0, 10)}
              </td>
              <td className="p-4 text-slate-800">{ticket?.client}</td>
              <td className="p-4 text-slate-800">{Number(ticket?.mntht)}</td>
              <td className="p-4 text-slate-800">{Number(ticket?.mnttva)}</td>
              <td className="p-4 text-slate-800">{Number(ticket?.mntttc)}</td>
              <td className="p-4 text-slate-800">
                <button onClick={() => openDetailTKModal(ticket.id_ticket)}>
                  <CiEdit size={25} color="blue" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ModalDetailTK
        closeModal={closeDetailTKModal}
        modalIsOpen={isDetailTKModalopen}
        ticketId={ticketId}
        resteAPayer={0}
      />
    </div>
  );
}