import Modal from "react-modal";
import { CiCircleRemove } from "react-icons/ci";
import { addMouvementCaisse } from "@/app/lib/ticket/ticketActions";

export default function ModalOperationCaisse({
  closeModal,
  modalIsOpen,
  operationType,
}: any) {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%", // Width will fit the content
      maxHeight: "90vh", // Max height is 90% of the viewport height
      overflow: "auto", // Enable scroll if the content is taller than the modal
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)", // Optional: Add a semi-transparent overlay background
    },
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    // formData.entries() => Retrieving an iterator for all key/value pairs in the FormData object
    // Each pair is represented as a two-element array: [fieldName, fieldValue]
    const data = Object.fromEntries(formData.entries());
    const res = await addMouvementCaisse(data);
    console.log(res);
    // Your existing code to handle form submission
    // ...
  };
  return (
    <Modal
      isOpen={modalIsOpen}
      contentLabel="Ticket Modal"
      ariaHideApp={false}
      style={customStyles}
      // className="flex items-center justify-center fixed left-0 bottom-0 w-full h-full bg-gray-800 bg-opacity-50"
    >
      <div className="bg-white rounded-lg w-full">
        <div className="flex items-center w-full mb-3">
          <div className="text-gray-900 font-medium text-lg">
            {operationType.title}
          </div>
          <div
            onClick={closeModal}
            className="ml-auto fill-current text-gray-700 w-6 h-6 cursor-pointer"
          >
            <CiCircleRemove size={30} color="red" />
          </div>
        </div>
        <hr />
        <div className="mt-2 w-full">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="operationTypeColumn"
              value={operationType.value}
            />
            <input type="hidden" name="id_utilisateur" value={1} />
            <input type="hidden" name="id_caisse" value={1} />
            <div className="flex flex-col gap-2">
              <label
                htmlFor="montant"
                className="text-sm text-gray-500 font-semibold"
              >
                Montant
              </label>
              <input
                id="montant"
                name="montant"
                className="text-sm w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                placeholder="Montant"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="Commentaire"
                className="text-sm text-gray-500 font-semibold"
              >
                Description
              </label>
              <textarea
                id="Commentaire"
                name="Commentaire"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Description"
              ></textarea>
            </div>
            <div className="flex justify-end gap-4 mt-4 w-full ">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ajouter
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={closeModal}
              >
                Fermer
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
