import React, { useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import ModalOperationCaisse from "./modaloperationcaisse";

export default function OperationCaisse({ data }: any) {
  const [isOprModalOpen, setModalOprIsOpen] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [tickets, setTickets] = useState(data);

  const openOprModal = (type: string) => {
    setOperationType(type);
    setModalOprIsOpen(true);
  };

  const closeCreateTKModal = () => {
    setModalOprIsOpen(false);
    setOperationType(""); // Reset the operation type when the modal is closed
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() => openOprModal("Retrait")}
        >
          <FaUpload />
          Retrait de la caisse
        </button>
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() => openOprModal("Depot")}
        >
          <FaDownload />
          Dépot en caisse
        </button>
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() => openOprModal("Remise")}
        >
          <BiSolidBank />
          Remise en banque
        </button>
      </div>
      <table className="w-full overflow-auto border">
        <thead className="bg-slate-800 text-white">
          <tr className="">
            <th className="p-4 border">N°</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Type</th>
            <th className="p-4 border">Utilisateur</th>
            <th className="p-4 border">Commentaires</th>
            <th className="p-4 border">Status</th>
            <th className="p-4 border"></th>
            {/* <th>Responsable</th> */}
            {/* <th>Statut</th> */}
          </tr>
        </thead>
        {/* <tbody className="text-center">
          {tickets.map((ticketLine: any, index: number) => (
            <tr
              key={index}
              className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
            >
              <td className="p-4 text-slate-800">{ticketLine?.Num_ticket}</td>
              <td className="p-4 text-slate-800">
                {ticketLine?.dateetheur.slice(0, 10)}
              </td>
              <td className="p-4 text-slate-800">{ticketLine?.type}</td>
              <td className="p-4 text-slate-800">{ticketLine?.utilisateur}</td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.commentaire)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.montant)}
              </td>
              <td className="p-4 text-slate-800">
                {Number(ticketLine?.montant)}
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
      <ModalOperationCaisse
        closeModal={closeCreateTKModal}
        modalIsOpen={isOprModalOpen}
        operationType={operationType} // Pass the operation type to the modal
      />
    </div>
  );
}
