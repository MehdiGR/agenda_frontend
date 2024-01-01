import Modal from "react-modal";
import { useRef } from "react";

export default function ModalOperationCaisse({
  closeModal,
  modalIsOpen,
  operationType,
}: any) {
  return (
    <Modal
      isOpen={modalIsOpen}
      contentLabel="Ticket Modal"
      ariaHideApp={false}
      style={{
        content: {
          maxWidth: 800,
          margin: "auto",
          height: "50vh",
        },
      }}
    >
      <div className=" mt-10 modalContent ">
        <button
          onClick={closeModal}
          className="absolute left-0 top-0  p-2 rounded-sm text-red-500 font-bold"
        >
          X
        </button>
      </div>
      <div>
        <h3 className="text-xl text-gray-500 font-semibold ">
          {operationType}
        </h3>
        <form className="space-y-4  ">
          <div className="flex gap-4 items-center">
            <label
              htmlFor=""
              className="w-20  p-2 text-sm text-gray-400 font-semibold"
            >
              Montant
            </label>
            <input
              className="text-sm w-48 p-1 border border-gray-400 rounded-md"
              type="text"
              placeholder="Montant"
            />
          </div>
          <div className="flex flex-col w-[272px]">
            <label htmlFor="" className="text-sm text-gray-400 font-semibold">
              Description
            </label>
            <textarea
              className=" p-2 border border-gray-400 rounded-md"
              name=""
              id=""
              //   rows={10}
            ></textarea>
          </div>

          <div className="flex justify-end absolute bottom-1 gap-4">
            <button className=" bg-orange-500 hover:bg-orange-700 p-2 text-white font-bold py-2 px-4 rounded">
              <span className="font-bold text-lg mr-2">+</span>Ajouter
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={closeModal}
            >
              Fermer
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
