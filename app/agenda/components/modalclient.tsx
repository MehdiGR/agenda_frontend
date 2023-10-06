import Modal from "react-modal";
import Select from "react-select";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useStore } from "@/app/store/store";
import { closeModal, saveClient } from "@/app/js/agenda_fn";
export default function ModalClient({ villes, collaborateurs }) {
  const { modalIsOpen } = useStore();
  // ville Options
  const villeOptions = villes.map((ville: any) => {
    return { value: ville.idville, label: ville.nom };
  });
  // collaborateur Options
  const collaborateurOptions = collaborateurs.map((collaborateur: any) => {
    return { value: collaborateur.id_collaborateur, label: collaborateur.nom };
  });
  const selectCustomStyles = {
    control: (provided) => ({
      ...provided,
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      minHeight: "42.17px",
    }),
  };

  // validation
  const schema = yup.object().shape({
    code: yup.string().required("Saisi le code"),
    nom: yup.string().required("Saisi le nom"),
    ville: yup
      .object()
      .shape({
        label: yup.string().required("Sélectionnez une ville"),
        value: yup.string().required(),
      })
      .required(),
    collaborateur: yup.object().shape({
      label: yup.string().required("Sélectionnez un collaborateur"),
      value: yup.string().required(),
    }),
  });

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(schema) });

  // add client
  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
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
          className="absolute left-0 top-0 bg-red-500 p-2 rounded-sm text-white"
        >
          X
        </button>
        <br />
        <br />
        <div id="responsive-modal_in">
          <h4 className="text-xl font-semibold text-gray-500">Client</h4>
          <hr />
          <form onSubmit={handleSubmit(saveClient)}>
            <div className="px-2 py-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mb-2">
                  <label
                    htmlFor="code"
                    className="block text-gray-500 text-md font-medium required"
                  >
                    Code :
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    {...register("code")}
                  />
                  <p className="text-red-500">{errors.code?.message}</p>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="nom"
                    className="block text-gray-500 text-md font-medium required"
                  >
                    Nom :
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    {...register("nom")}
                  />
                  <p className="text-red-500">{errors.nom?.message}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mb-2">
                  <label
                    htmlFor="adresse"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Adresse 1:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="adresse"
                    name="adresse"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="adresse2"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Adresse 2 :
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="2_adresse"
                    name="adresse2"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="ville"
                    className="block text-gray-500 text-md font-medium required"
                  >
                    Ville :
                  </label>

                  <Controller
                    name="ville"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Sélectionnez une ville"
                        className="m-1"
                        options={villeOptions}
                        styles={selectCustomStyles}
                      />
                    )}
                  />
                  <p className="text-red-500">{errors.ville?.label?.message}</p>
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="tele"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Tel :
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="tele"
                    name="tele"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mb-2">
                  <label
                    htmlFor="email"
                    className="block text-gray-500 text-md font-medium"
                  >
                    E-mail :
                  </label>
                  <input
                    type="email"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="email"
                    name="email"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="fax"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Fax :
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="fax"
                    name="fax"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mb-2">
                  <label
                    htmlFor="ice"
                    className="block text-gray-500 text-md font-medium"
                  >
                    ICE:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="ice"
                    name="ice"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="i_f"
                    className="block text-gray-500 text-md font-medium"
                  >
                    IF:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="i_f"
                    name="i_f"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 ">
                <div className="mb-2">
                  <label
                    htmlFor="collaborateur"
                    className="block text-gray-500 text-md font-medium required"
                  >
                    Collaborateur :
                  </label>
                  <Controller
                    name="collaborateur"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        placeholder="Sélectionnez un collaborateur"
                        className=" rounded-md m-1 w-full"
                        options={collaborateurOptions}
                        // ref={register({ required: true })}
                      />
                    )}
                  />
                  <p className="text-red-500">
                    {errors.collaborateur?.label?.message}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="mb-2">
                  <label
                    htmlFor="map_x"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Map X:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="map_x"
                    name="map_x"
                  />
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="map_y"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Map Y:
                  </label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    id="map_y"
                    name="map_y"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="col-md-12">
                  <label
                    htmlFor="geoloc"
                    className="block text-gray-500 text-md font-medium"
                  >
                    Géolocalisation:
                  </label>
                  <input
                    type="text"
                    id="geoloc"
                    className="border border-gray-300 rounded-md m-1 py-2 px-4 w-full"
                    name="geoloc"
                  />
                </div>
              </div>
              {/* <div className="mt-2">
              <label htmlFor="active">Active :</label>
              <label className="switch">
                <input
                  id="active"
                  type="checkbox"
                  checked={active}
                  onChange={() => setActive(!active)}
                />
                <span className="slider "></span>
              </label>
            </div> */}

              <div className="flex justify-end gap-2 ">
                <button
                  type="button"
                  className="py-2 px-4 rounded-md bg-gray-500 text-white"
                  data-dismiss="modal"
                  onClick={closeModal}
                >
                  Fermer
                </button>
                <button
                  id="btn_Enregistrer"
                  type="submit"
                  className="py-2 px-4 rounded-md bg-red-500 text-white "
                  // onClick={insertClient}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
