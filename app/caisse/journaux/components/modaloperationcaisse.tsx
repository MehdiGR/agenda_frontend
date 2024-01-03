import Modal from "react-modal";
import { CiCircleRemove } from "react-icons/ci";

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
      className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white rounded-lg w-1/2">
        <div className="flex flex-col items-start p-4">
          <div className="flex items-center w-full">
            <div className="text-gray-900 font-medium text-lg">
              {operationType}
            </div>
            <div
              onClick={closeModal}
              className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
            >
              <CiCircleRemove size="" />
            </div>
          </div>
          <hr className="w-full"></hr>
          <div className="mt-2 w-full">
            <form className="space-y-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="amount"
                  className="text-sm text-gray-500 font-semibold"
                >
                  Montant
                </label>
                <input
                  id="amount"
                  className="text-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  type="text"
                  placeholder="Montant"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="description"
                  className="text-sm text-gray-500 font-semibold"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Description"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-4 w-full ">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Ajouter
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
        </div>
      </div>
    </Modal>
  );
}
