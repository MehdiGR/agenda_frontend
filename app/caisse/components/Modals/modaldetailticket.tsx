import Modal from "react-modal";

import { useStore } from "@/app/store/store";
// import { closeModal } from "@/app/js/agenda_fn";
import { LuPrinter } from "react-icons/lu";
import { PiDownloadBold } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { TiCancelOutline } from "react-icons/ti";
import { CiBoxList } from "react-icons/ci";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { Props } from "react-select";
import ReactToPrint from "react-to-print";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyDocument from "@/app/caisse/components/Document/mydocument";
import { CiCircleRemove } from "react-icons/ci";

import {
  get_ticket_lines,
  get_ticket_paiements,
} from "@/app/lib/ticket/ticketActions";

export default function ModalDetailTK({
  closeModal,
  modalIsOpen,
  ticketId,
  resteAPayer,
}: any) {
  const componentRef = useRef();
  const downloadAsPdf = async () => {};
  const [ticketLines, setTicketLines] = useState<any>([]);
  const [PaiementsDeCommande, setPaiementsDeCommande] = useState<any>([]);
  useEffect(() => {
    Promise.all([
      get_ticket_lines({
        where: ` WHERE idtypedoc = 21  AND dce.id = "${ticketId}"`,
      }),
      get_ticket_paiements({
        where: ` WHERE dce.id = "${ticketId}"`,
      }),
    ])
      .then(([ticketLinesData, PaiementsDeCommandeData]) => {
        setTicketLines(JSON.parse(ticketLinesData as string));
        setPaiementsDeCommande(JSON.parse(PaiementsDeCommandeData as string));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [ticketId]);

  return (
    <Modal
      isOpen={modalIsOpen}
      // onRequestClose={closeModal}
      contentLabel="Ticket Modal"
      ariaHideApp={false}
      className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white rounded-lg ">
        <div className="flex flex-col items-start p-4">
          <div className="flex items-center w-full">
            <div className="text-xl text-gray-500 font-medium  ">
              Detail Ticket
            </div>
            <div
              onClick={closeModal}
              className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
            >
              <CiCircleRemove size={30} color="red" />
            </div>
          </div>
          <div>
            {ticketLines.length && (
              <div className="p-4 w-full space-y-4 ">
                <br className="mb-10" />
                <div className="flex flex-wrap gap-4">
                  <div className="flex gap-4">
                    <ReactToPrint
                      trigger={() => (
                        <button className="flex items-center justify-center gap-2 h-12 leading-[48px] bg-slate-800 hover:bg-slate-500 min-w-[100px] text-white rounded-md px-3">
                          <LuPrinter /> Imprimer
                        </button>
                      )}
                      content={() => componentRef.current || null}
                    />

                    <PDFDownloadLink
                      document={<MyDocument />}
                      fileName="somename.pdf"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? (
                          "Loading document..."
                        ) : (
                          <button
                            className="flex items-center justify-center gap-2 h-12 leading-[48px] bg-slate-800 hover:bg-slate-500 min-w-[100px] text-white rounded-md px-3"
                            onClick={downloadAsPdf}
                          >
                            <PiDownloadBold />
                            Télécharger
                          </button>
                        )
                      }
                    </PDFDownloadLink>
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
                <div className="printedArea" ref={componentRef}>
                  <div className="">
                    <div className="flex justify-between my-10">
                      <div className="">
                        <span className="mr-1 font-bold">Ticket n° : </span>
                        <span>{ticketLines[0].ticketNum}</span>
                      </div>
                      <div>
                        <span className="mr-1 font-bold">Client : </span>
                        <span>{ticketLines[0].client}</span>
                      </div>
                    </div>
                    <div className="mb-5">
                      <span className="mr-5 font-bold text-lg">
                        Date du ticket :
                      </span>
                      <span className=" text-lg text-gray-700 font-medium">
                        {ticketLines[0].date_creation.slice(0, 10)}
                      </span>
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
                  </div>
                  <div>
                    <h4 className="flex items-center  gap-2 text-xl font-semibold text-gray-500 mb-2 print:hidden">
                      <CiBoxList />
                      Contenu de la commande
                    </h4>
                    <table className="w-full border border-gray-400">
                      <thead className=" bg-slate-800 text-white  ">
                        <tr>
                          <th className="border-r-2 py-1 text-sm">
                            Designation
                          </th>
                          <th className="border-r-2 py-1 text-sm w-[20%]">
                            Vendeur
                          </th>
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
                          ticketLines.map((item: any, index: number) => {
                            return (
                              <tr key={index}>
                                <td className="text-center py-4 border ">
                                  {item.Designation}
                                </td>
                                <td className="text-center py-4 border ">
                                  {item.vendeur}
                                </td>
                                <td className="text-center py-4 border ">
                                  {item.qte}
                                </td>
                                <td className="text-center py-4 border ">
                                  {item?.remise || 0}
                                </td>
                                <td className="text-center py-4 border ">
                                  {item.total_ttc}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                    <table className="border float-right my-2">
                      <tbody className="">
                        <tr>
                          <td className="bg-slate-500  print:bg-white p-2 border">
                            Total HT :{" "}
                          </td>{" "}
                          <td className="p-2 border">
                            {ticketLines[0].mntttc / (1 + 0.2)}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-slate-500 print:bg-white p-2 border">
                            TVA (20%) :{" "}
                          </td>
                          <td className="p-2 border">
                            {Number(
                              (
                                ticketLines[0].mntttc -
                                ticketLines[0].mntttc / (1 + 0.2)
                              ).toFixed(2)
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-slate-500 print:bg-white p-2 border">
                            Total TTC :{" "}
                          </td>

                          <td className="p-2 border">
                            {ticketLines[0].mntttc}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table className="border w-full">
                      <thead>
                        <tr>
                          <th className="border-r-2 py-1 text-sm">Date</th>
                          <th className="border-r-2 py-1 text-sm w-2/3">
                            Mode
                          </th>
                          <th className="border-r-2 py-1 text-sm ">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="border">
                        {PaiementsDeCommande.length > 0 ? (
                          PaiementsDeCommande.map(
                            (item: any, index: number) => {
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
                            }
                          )
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
                </div>

                <div className="flex justify-end gap-4 mt-4 w-full ">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={closeModal}
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
