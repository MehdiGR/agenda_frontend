import Modal from "react-modal";

import { useStore } from "@/app/store/store";
// import { closeModal } from "@/app/js/agenda_fn";
import { LuPrinter } from "react-icons/lu";
import { PiDownloadBold } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { TiCancelOutline } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";

export default function ModalCreateTK({
  openModal,
  closeModal,
  modalIsOpen,
  ticketLines,
  PaiementsDeCommande,
  resteAPayer,
  client,
  ticketNum,
  totalTTC,
}) {
  return (
    <div className="mt-10 bg-red-500 ">
      <Modal
        isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        contentLabel="Ticket Modal"
        ariaHideApp={false}
        style={{
          overlay: {
            // position: "fixed",
            // top: 0,
            // left: 0,
            // right: 0,
            // bottom: 0,
            // backgroundColor: "rgba(255, 255, 255, 0.75)",
            // overflow: "auto",
          },
          content: {
            maxWidth: 800,
            margin: "auto",
          },
        }}
      >
        <button
          onClick={closeModal}
          className="absolute left-0 top-0  p-2 rounded-sm text-red-500 font-bold"
        >
          X
        </button>
        <br />
        <br />
        <div className="p-4 w-full space-y-4 relative">
          <h4 className="text-xl font-semibold text-gray-500 ">
            Detail Ticket
          </h4>
          <br className="mb-10" />
          <div className="flex flex-wrap gap-4">
            <div className="flex gap-4">
              <button className="flex items-center justify-center gap-2 h-12 leading-[48px] bg-slate-800 hover:bg-slate-500 min-w-[100px] text-white rounded-md px-3">
                <LuPrinter /> Imprimer
              </button>
              <button className="flex items-center justify-center gap-2 h-12 leading-[48px] bg-slate-800 hover:bg-slate-500 min-w-[100px] text-white rounded-md px-3">
                <PiDownloadBold />
                Télécharger
              </button>
              <button className=" flex items-center justify-center gap-2 h-12 leading-[48px] bg-slate-800 hover:bg-slate-500 min-w-[100px] text-white rounded-md px-3">
                <AiOutlineMail />
                Envoyer
              </button>
            </div>
            <div className="md:ml-auto">
              <button className=" flex items-center justify-center gap-2 h-12 leading-[48px] bg-orange-500 hover:bg-orange-300 min-w-[200px]  text-white rounded-md">
                <TiCancelOutline fontSize={24} />
                Annuler le ticket
              </button>
            </div>
          </div>
          <div className="">
            <div className="flex justify-between my-10">
              <div className="">
                <span className="mr-1 font-bold">Ticket n° : </span>
                {/* value */}
                <span>{ticketNum}</span>
              </div>
              <div>
                <span className="mr-1 font-bold">Client : </span>
                {/* value */}
                <span>{client}</span>
              </div>
            </div>
            <div>
              <span className="mr-1 font-bold">Date du ticket :</span>
              <span className="">Date du ticket</span>
            </div>
          </div>
          <div className="text-center w-full">
            <div className=" font-bold text-red-700">
              {resteAPayer > 0 && (
                <p className="mb-1">
                  RESTER A PAYE : <span>{resteAPayer}</span>
                </p>
              )}
            </div>
            {/* <button className="flex items-center justify-center gap-2 h-12 leading-[48px] bg-orange-500 hover:bg-orange-300 min-w-[200px]  text-white rounded-md ">
              <IoMdAdd />
              Ajouter un paiement
            </button> */}
          </div>
          <div>
            <h4 className="flex items-center  gap-2 text-xl font-semibold text-gray-500 mb-2">
              <CiBoxList />
              Contenu de la commande
            </h4>
            <table className="w-full border border-gray-400">
              <thead className=" bg-slate-800 text-white  ">
                <tr>
                  <th className="border-r-2 py-1 text-sm">Designation</th>
                  <th className="border-r-2 py-1 text-sm w-[20%]">Vendeur</th>
                  <th className="border-r-2 py-1 text-sm">Qte</th>
                  <th className="border-r-2 py-1 text-sm">-%</th>
                  <th className="border-r-2 py-1 text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {ticketLines.length == 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      Aucune prestation
                    </td>
                  </tr>
                ) : (
                  // agenda_prestationArr.map((ag_pr: any, index: any) => {
                  //   let hours = Math.floor(ag_pr.duree / 60);
                  //   let minutes = ag_pr.duree % 60;
                  ticketLines.map((item: any, index: number) => {
                    return (
                      <tr key={index}>
                        <td className="text-center py-4">{item.Designation}</td>
                        <td className="text-center py-4">{item.vendeur}</td>
                        <td className="text-center py-4">{item.qte}</td>
                        <td className="text-center py-4">
                          {item?.remise || 0}
                        </td>
                        <td className="text-center py-4">{item.total_ttc}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            <table className="border float-right">
              <tbody className="">
                <tr>
                  <td className="bg-slate-500 p-2 border">Total HT : </td>{" "}
                  <td className="p-2 border">{totalTTC / (1 + 0.2)}</td>
                </tr>
                <tr>
                  <td className="bg-slate-500 p-2 border">TVA (20%) : </td>
                  <td className="p-2 border">
                    {Number((totalTTC - totalTTC / (1 + 0.2)).toFixed(2))}
                  </td>
                </tr>
                <tr>
                  <td className="bg-slate-500 p-2 border">Total TTC : </td>

                  <td className="p-2 border">{totalTTC}</td>
                </tr>
              </tbody>
            </table>
            <table className="border w-full">
              <thead>
                <tr>
                  <th className="border-r-2 py-1 text-sm">Date</th>
                  <th className="border-r-2 py-1 text-sm w-2/3">Mode</th>
                  <th className="border-r-2 py-1 text-sm ">Montant</th>
                </tr>
              </thead>
              <tbody className="border">
                {PaiementsDeCommande.length > 0 ? (
                  PaiementsDeCommande.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border-r-2 py-1 text-sm  p-3">
                          {item.date_paiement.slice(0, 10)}
                        </td>
                        <td className="border-r-2 py-1 text-sm  p-3">
                          {item.mode_paiement}
                        </td>
                        <td className="border-r-2 py-1 text-sm  p-2 ">
                          {item.montant}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr className="border">
                    {" "}
                    <td colSpan={5} className="text-center py-4">
                      Aucun paiement
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="absolute bottom-0 right-10">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Fermer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
