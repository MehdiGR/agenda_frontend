"use client";
import React, { useEffect, useState } from "react";
import ModalClient from "./modalclient";
import Select from "react-select";
// import { OptionsType, OptionTypeBase } from "react-select";
import PrestationSlider from "./prestationsSlider";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import removeIcon from "../../../public/square_remove.svg";
import Image from "next/image";

export default function CreateEventSection({
  active,
  setActive,
  clients,
  villes,
  collaborateurs,
  prestations,
  agendas,
  eventAgenda,
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clientIsRef, setIsRef] = useState(true);
  const [selectedClientType, setSelectedClientType] = useState("client_ref");
  const [clientOptions, setClientOptions] = useState(
    clients.map((client: any) => {
      return { value: client.id, label: client.nom };
    })
  );
  const [agendaOptions, setAgendaOptions] = useState(
    agendas.map((agenda: any) => {
      return { value: agenda.id, label: agenda.nom };
    })
  );
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState();
  const [agenda_prestationArr, setAgendaPrestationArr] = useState<any[]>([]);
  // const [date, setDate] = useState("");
  // const [hour, setHour] = useState();
  // const [minutes, setMinutes] = useState();
  // const [formData, setFormData] = useState({
  //   client: "",
  //   date: "",
  //   time: "",
  //   agenda_prestation: {},
  // });

  // Cancel creation event
  const cancelCreationEvent = () => {
    setActive(false);
  };

  // handle radio button (client) change
  const handleOptionChangeTypeClt = (changeEvent: any) => {
    let value = changeEvent.target.value;
    value == "client_ref" ? setIsRef(true) : setIsRef(false);
    setSelectedClientType(value);
  };

  const handleOptionChangeClt = (selectedOption: any) => {
    setSelectedClient(selectedOption);
  };

  const handleOptionChangeAg = (selectedOption: any) => {
    setSelectedAgenda(selectedOption);
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const saveClient = async (formData: any) => {
    const response = await fetch("http://localhost:3000/api/client", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // Request was successful
      const data = await response.json();
      // Handle the response data
      const newClient = { value: data.clientId, label: formData.nom };
      // add the new client to select client element
      setClientOptions((prevOptions: any) => [...prevOptions, newClient]);
      // update selected client
      setSelectedClient(newClient);
      closeModal();
    } else {
      // Request failed
      console.error("POST request failed");
    }
  };
  const saveReservat = async (formData: any) => {
    const { heurDB, minuteDB, ...rest } = formData;
    const time = `${heurDB.value}:${minuteDB.value}`;
    const updatedFormData = { ...rest, time };
    // console.log(updatedFormData);
    // return;
    const response = await fetch("http://localhost:3000/api/reservat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFormData),
    });

    if (response.ok) {
    } else {
      // Request failed
      console.error("POST request failed");
    }
  };

  const addPrestation = (data: any) => {
    setAgendaPrestationArr((previousState) => {
      return [...previousState, { ...data }];
    });
  };

  const removePrestation = (index: any) => {
    setAgendaPrestationArr((previousState) => {
      return previousState.filter((_, i) => i !== index);
    });
  };

  const selectDefaultStyle = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      fontSize: "16px",
      width: "100%",
    }),
  };

  const selectHourStyles = {
    control: (provided: any) => ({
      ...provided,
      fontSize: "16px",
      width: "60px",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#383838",
      width: "10px",
      marginRight: "5px",
      transform: "scale(1.3)",
      padding: "0",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    menu: (provided: any) => ({
      ...provided,
      width: "200px",
    }),
  };

  const schema = yup.object().shape({
    client: yup
      .object()
      .shape({
        label: yup.string().required("Sélectionnez un client"),
        value: yup.string().required(),
      })
      .required(),
    dateRes: yup.string(),
    heurDB: yup.object().shape({
      label: yup.string(),
      value: yup.string(),
    }),
    minuteDB: yup.object().shape({
      label: yup.string(),
      value: yup.string(),
    }),
    note: yup.string(),
    // prestaionsIds: yup.array().of(yup.number()),
    prestationsIds: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(schema) });

  // const handleInputChange = (e: any) => {
  //   setFormData({ ...formData, [e.target.name]: e.target.value });
  // };

  useEffect(() => {
    setSelectedAgenda(eventAgenda);
    // register form inputs
    console.log(agenda_prestationArr);
  }, [agenda_prestationArr, selectedAgenda]);

  return (
    <div className={`relative   h-fit w-full ${!active ? "hidden" : ""}`}>
      <form onSubmit={handleSubmit(saveReservat)} className=" space-y-4 h-full">
        <div className="flex gap-3">
          <input
            type="radio"
            name="client_type"
            id="client_ref"
            value="client_ref"
            checked={selectedClientType === "client_ref"}
            onChange={handleOptionChangeTypeClt}
          />
          <label htmlFor="client_ref">client référencer</label>
          <input
            type="radio"
            name="client_type"
            id="client_psg"
            value="client_psg"
            checked={selectedClientType === "client_psg"}
            onChange={handleOptionChangeTypeClt}
          />
          <label htmlFor="client_psg">client de passage</label>
        </div>
        <div>
          <ModalClient
            modalIsOpen={modalIsOpen}
            openModal={openModal}
            closeModal={closeModal}
            villes={villes}
            collaborateurs={collaborateurs}
            saveClient={saveClient}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Client:</label>
          <div className="flex gap-[1px] relative ">
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="select_client"
                  placeholder="Sélectionnez un Clients"
                  options={clientOptions}
                  // value={selectedClient}
                  {...(clientIsRef == true
                    ? { disabled: false }
                    : { disabled: true })}
                  styles={{
                    ...selectDefaultStyle,
                    container: (provided) => ({
                      ...provided,
                      borderTopRightRadius: "0px !important",
                      borderBottomRightRadius: "0px !important",
                      width: "100%",
                    }),
                  }}
                  // onChange={handleOptionChangeClt}
                />
              )}
            />
            <button
              type="button"
              className="bg-slate-500 p-[8px]  rounded-tr-md  rounded-br-md text-white  right-[-30px] top-0"
              onClick={openModal}
            >
              +
            </button>
          </div>
          <p className="text-red-500">{errors.client?.label?.message}</p>
        </div>

        <div className="flex gap-28 ">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Date:</label>
            <input
              type="date"
              className="flex-grow border border-gray-300 rounded-md px-4 h-full"
              // onChange={(e) => setDate(e.target.value)}
              {...register("dateRes")}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Début:</label>
            <div className="flex gap-0 ">
              <Controller
                name="heurDB"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="select_hour"
                    placeholder=""
                    options={Array.from({ length: 24 }, (_, i) => ({
                      value: i.toString().padStart(2, "0"),
                      label: i.toString().padStart(2, "0"),
                    }))} // Convert to readonly array
                    styles={{ ...selectHourStyles }}
                  />
                )}
              />
              {errors.heurDB?.message}
              <span className="font-medium m-2">h</span>
              <Controller
                name="minuteDB"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="select_hour"
                    placeholder=""
                    options={Array.from({ length: 60 }, (_, i) => ({
                      value: i.toString().padStart(2, "0"),
                      label: i.toString().padStart(2, "0"),
                    }))}
                    styles={{ ...selectHourStyles }}
                  />
                )}
              />
            </div>
          </div>{" "}
          <div>
            <label className="font-semibold">Fin:</label>
            <div className="flex items-center mt-2 ">
              {" "}
              <p>09 h 20</p>
            </div>
          </div>
        </div>

        <div className="">
          <table className="w-full border border-b">
            <thead className="border  px-2  bg-slate-800 text-white">
              <tr className="">
                <th className="border-r-2 py-1 px-3  text-left ">Prestation</th>
                <th className="border-r-2 py-1 px-3  ">Agenda</th>
                <th className="border-r-2 py-1 px-3 ">Durée</th>
                <th className="border-r-2 py-1 px-3 ">Prix</th>
                <th className="py-1 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {agenda_prestationArr.length == 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Aucune prestation
                  </td>
                </tr>
              ) : (
                agenda_prestationArr.map((ag_pr: any, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center py-4">{ag_pr.intitule}</td>
                      <td className="py-4">
                        <Select
                          className="m-auto"
                          instanceId="select_Agenda"
                          placeholder="Sélectionnez un Agendas"
                          options={agendaOptions}
                          value={selectedAgenda}
                          styles={{
                            ...selectDefaultStyle,
                            container: (provided) => ({
                              ...provided,
                              width: "300px",
                            }),
                          }}
                          onChange={handleOptionChangeAg}
                        />
                      </td>
                      <td className="text-center py-4 flex justify-center ">
                        <Select
                          name="duree_hour"
                          instanceId="select_hour_tb"
                          placeholder=""
                          options={Array.from({ length: 24 }, (_, i) => ({
                            value: i.toString().padStart(2, "0"),
                            label: i.toString().padStart(2, "0"),
                          }))}
                          styles={{
                            ...selectHourStyles,
                            container: (provided) => ({
                              ...provided,
                              width: "fit-content",
                            }),
                          }}
                        />
                        <span className="font-medium m-2">h</span>
                        <Select
                          name="duree_minutes"
                          instanceId="select_minutes_tb"
                          placeholder=""
                          options={Array.from({ length: 60 }, (_, i) => ({
                            value: i.toString().padStart(2, "0"),
                            label: i.toString().padStart(2, "0"),
                          }))}
                          styles={{
                            ...selectHourStyles,
                            container: (provided) => ({
                              ...provided,
                              width: "fit-content",
                            }),
                          }}
                        />
                      </td>
                      <td className="text-center py-4">{ag_pr.prixTTC}</td>
                      <td className="text-center py-4 cursor-pointer ">
                        <Image
                          className="text-red-600 m-auto"
                          priority
                          alt="supprimer"
                          src={removeIcon}
                          onClick={() => removePrestation(index)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2} className="border-r-2 bg-slate-800"></th>
                <th className="border-r-2 bg-slate-800 text-white">00h00</th>
                <th className="border-r-2 bg-slate-800 text-white">0 DH</th>
                <th className="border-r-2 bg-slate-800"></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <PrestationSlider
          prestations={prestations}
          addPrestation={addPrestation}
        />
        <div>
          <label className="font-semibold">Notes:</label>
          <textarea
            id=""
            rows={4}
            className="border border-gray-300 rounded-md w-full mb-16"
            {...register("note")}
          ></textarea>
        </div>
        <input
          type="hidden"
          {...register("prestationsIds")}
          value={agenda_prestationArr.map((p: any) => p.id_art).join(",")}
        />
        <div className="absolute bottom-3 w-full flex gap-2 justify-center">
          <button
            className="py-1 px-4 bg-gray-800 text-white rounded-md "
            onClick={cancelCreationEvent}
            type="button"
          >
            Annuler
          </button>
          <button
            className="py-1 px-4 bg-[#fc8f3e] text-white rounded-md "
            type="submit"
          >
            Enregistrer
          </button>
          <button
            className="py-1 px-4 bg-[#199821] text-white rounded-md "
            type="button"
          >
            Encaisser
          </button>
        </div>
      </form>
    </div>
  );
}
