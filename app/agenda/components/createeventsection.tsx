"use client";
import React, { useEffect, useState } from "react";
import ModalClient from "./modalclient";
import Select from "react-select";
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
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clientIsRef, setIsRef] = useState(true);
  const [selectedClientType, setSelectedClientType] = useState("client_ref");
  const [clientOptions, setClientOptions] = useState(
    clients.map((client: any) => {
      return { value: client.id, label: client.nom };
    })
  );
  const [agendaOptions, setagendaOptions] = useState(
    agendas.map((agenda: any) => {
      return { value: agenda.id, label: agenda.nom };
    })
  );
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [agenda_prestationArr, setAgendaPrestationArr] = useState<any[]>([]);
  const [date, setDate] = useState();
  const [hour, setHour] = useState();
  const [minutes, setMinutes] = useState();
  const [formData, setFormData] = useState({
    client: "",
    date: "",
    time: "",
    agenda_prestation: {},
  });

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

  const addPrestation = (data: any) => {
    setAgendaPrestationArr((previousState) => {
      return [...previousState, { date, hour, minutes, ...data }];
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: yupResolver(schema) });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    console.log(agenda_prestationArr.length);
    console.log(agenda_prestationArr);
  }, [agenda_prestationArr]);

  return (
    <div className={`relative   h-fit w-full ${!active ? "hidden" : ""}`}>
      <form onSubmit={handleSubmit(saveClient)} className=" space-y-4 h-full">
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
        <div className="flex gap-[1px] ">
          <Select
            id="select_client"
            placeholder="Sélectionnez un Clients"
            options={clientOptions}
            value={selectedClient}
            {...(clientIsRef == true
              ? { disabled: false }
              : { disabled: true })}
            styles={{
              ...selectDefaultStyle,
              container: (provided) => ({
                ...provided,
                borderTopRightRadius: "0px !important",
                borderBottomRightRadius: "0px !important",
              }),
            }}
            onChange={handleOptionChangeClt}
          />

          <button
            type="button"
            className="bg-slate-500 p-[8px]  rounded-tr-md  rounded-br-md text-white  right-[-30px] top-0"
            onClick={openModal}
          >
            +
          </button>
        </div>
        <div className="flex gap-28 ">
          <div className="">
            <input
              type="date"
              className="flex-grow border border-gray-300 rounded-md px-4 h-full"
            />
          </div>
          <div className="flex gap-0">
            <Select
              id="select_hour"
              placeholder=""
              options={Array.from({ length: 24 }, (_, i) => ({
                value: i.toString().padStart(2, "0"),
                label: i.toString().padStart(2, "0"),
              }))}
              styles={{ ...selectHourStyles, width: "fit-content" }}
            />

            <span className="font-medium m-2">h</span>
            <Select
              id="select_minute"
              placeholder=""
              options={Array.from({ length: 60 }, (_, i) => ({
                value: i.toString().padStart(2, "0"),
                label: i.toString().padStart(2, "0"),
              }))}
              styles={{ ...selectHourStyles }}
            />
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
                          id="select_Agenda"
                          placeholder="Sélectionnez un Agendas"
                          options={agendaOptions}
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
                          id="select_hour"
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
                          id="select_minute"
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
            onClick={cancelCreationEvent}
            type="button"
          >
            Enregistrer
          </button>
          <button
            className="py-1 px-4 bg-[#199821] text-white rounded-md "
            onClick={cancelCreationEvent}
            type="button"
          >
            Encaisser
          </button>
        </div>
      </form>
    </div>
  );
}
