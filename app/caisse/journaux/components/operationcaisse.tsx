"use client";
import React, { useEffect, useState } from "react";
import { FaDownload, FaUpload } from "react-icons/fa";
import { BiSolidBank } from "react-icons/bi";
import ModalOperationCaisse from "./Modals/modaloperationcaisse";
import { RiProhibitedLine } from "react-icons/ri";
import {
  get_operation_caisse,
  removeMouvement,
} from "@/app/lib/ticket/ticketActions";

export default function OperationCaisse({ data, valueDate }: any) {
  const [isOprModalOpen, setModalOprIsOpen] = useState(false);
  const [operationType, setOperationType] = useState({ title: "", value: "" });
  const [operationsCaisse, setOperationsCaisse] = useState([]);
  useEffect(() => {
    // setOperationsCaisse(
    //   // data.filter((operationCaisse: any) => {
    //   //   const date_creation = new Date(operationCaisse?.date_creation);

    //   //   return (
    //   //     date_creation.toISOString().slice(0, 10) ===
    //   //     valueDate.toISOString().slice(0, 10)
    //   //   );
    //   // })
    // );
    get_operation_caisse({
      where: ` WHERE id_caisse = 1 "`,
    })
      .then((data) => {
        setOperationsCaisse(JSON.parse(data as string)[0]);
      })
      .catch((error) => {
        setOperationsCaisse({});
        console.log("Error fetching data:", error);
      });
  }, [valueDate]);

  const openOprModal = (type: any) => {
    setOperationType({ title: type.title, value: type.value });
    setModalOprIsOpen(true);
  };

  const closeCreateTKModal = () => {
    setModalOprIsOpen(false);
    setOperationType({ title: "", value: "" }); // Reset the operation type when the modal is closed
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() => openOprModal({ title: "Retrait", value: "retrait" })}
        >
          <FaUpload />
          Retrait de la caisse
        </button>
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() => openOprModal({ title: "Dépôt", value: "depot" })}
        >
          <FaDownload />
          Dépôt en caisse
        </button>
        <button
          className="flex gap-2 items-center p-2 rounded-md bg-orange-400 text-white text-center text-sm"
          onClick={() =>
            openOprModal({
              title: "Remise en Banque",
              value: "remise_en_banque",
            })
          }
        >
          <BiSolidBank />
          Remise en banque
        </button>
      </div>
      <table className="w-full overflow-auto ">
        <thead className="bg-slate-800 text-white">
          <tr className="">
            <th className="p-4 rounded-tl-lg">N°</th>
            <th className="p-4 border">Date Creation</th>
            <th className="p-4 border">Type</th>
            <th className="p-4 border">Utilisateur</th>
            <th className="p-4 border">Commentaires</th>
            <th className="p-4 border">Montant</th>
            <th className="p-4 border">Status</th>
            <th className="p-4 rounded-tr-lg"></th>
            {/* <th>Responsable</th> */}
            {/* <th>Statut</th> */}
          </tr>
        </thead>
        <tbody className="text-center">
          {operationsCaisse.length > 0 &&
            operationsCaisse.map((operationCaisse: any, index: number) => (
              <tr
                key={index}
                className="p-16 even:bg-gray-200 odd:bg-gray-100 font-medium hover:bg-gray-300 transition "
              >
                <td className="p-4 text-slate-800">{index + 1}</td>
                <td className="p-4 text-slate-800">
                  {operationCaisse?.date_creation.slice(0, 10)}
                </td>
                <td className="p-4 text-slate-800">
                  {operationCaisse?.operationType}
                </td>
                <td className="p-4 text-slate-800">
                  {operationCaisse?.utilisateur}
                </td>
                <td className="p-4 text-slate-800">
                  {operationCaisse?.commentaire}
                </td>
                <td className="p-4 text-slate-800">
                  {Number(operationCaisse?.montant)}
                </td>
                <td className="p-4 text-white  ">
                  <span className="bg-green-400 text-center p-2">
                    {operationCaisse?.statut}
                  </span>
                </td>
                <td className="p-4 text-slate-800">
                  {" "}
                  <button onClick={() => removeMouvement(operationCaisse.id)}>
                    <RiProhibitedLine color="red" size={20} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ModalOperationCaisse
        closeModal={closeCreateTKModal}
        modalIsOpen={isOprModalOpen}
        operationType={operationType} // Pass the operation type to the modal
      />
    </div>
  );
}
