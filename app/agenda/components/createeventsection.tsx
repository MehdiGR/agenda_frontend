"use client";
import React, { useState } from "react";
import ModalClient from "./modalclient";
import Select from "react-select";
import PrestationSlider from "./prestationsSlider";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

export default function CreateEventSection({
  active,
  setActive,
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
}) {
  const [modalIsOpen, setIsOpen] = useState(false);
  const [clientIsRef, setIsRef] = useState(true);
  const [selectedClientType, setSelectedClientType] = useState("client_ref");
  const [clientOptions, setClientOptions] = useState(
    clients.map((client: any) => {
      return { value: client.id, label: client.nom };
    })
  );
  const [selectedClient, setSelectedClient] = useState(null);
  const [agenda_prestationArr, setPrestationArr] = useState([]);
  const [formData, setFormData] = useState({
    client: "",
    date: "",
    time: "",
    prestation: "",
    agenda: "",
    duree: "",
    prix: "",
  });

  // Cancel creation event
  const cancelCreationEvent = () => {
    setActive(false);
  };
  // handle radio button (client) change
  const handleOptionChangeTypeClt = (changeEvent: any) => {
    let value = changeEvent.target.value;
    // value == "client_ref" ? setIsRef(true) : setIsRef(false);
    // console.log(clientIsRef);
    // setSelectedClientType(value);
  };
  const handleOptionChangeClt = (selectedOption: any) => {
    setSelectedClient(selectedOption);
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

    console.log(selectedClient);
  };

  const addPrestation = (data: any) => {
    // setPrestationArr((previousState)=>{...previousState,{data.id}})
    console.log("work");
  };
  // const clientOptions = clients.map((client) => {
  //   return { value: client.id, label: client.nom };
  // });
  const selectClientStyles = {
    control: (provided: any) => ({
      ...provided,
      border: "1px solid #D1D5DB",
      borderRadius: "0.375rem",
      // borderRadiusTopRight: "10px !important",
      borderTopRightRadius: "0px !important",
      borderBottomRightRadius: "0px !important",
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
      color: "#383838", // Change the color of the arrow here
      width: "10px",
      // background: "red",
      marginRight: "5px",
      transform: "scale(1.3)",
      padding: "0", // Remove the margin around the indicator container
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

  //
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
  //
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className={` w-full ${!active ? "hidden" : ""}`}>
      {/* <RadioButtont /> */}
      <form
        onSubmit={handleSubmit(saveClient)}
        className="relative space-y-4 h-full"
      >
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
            styles={{ ...selectClientStyles }}
            onChange={(e) => {
              handleOptionChangeClt;
              handleInputChange(e);
            }}
          />

          {clientIsRef}
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
              styles={{ ...selectHourStyles }}
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
        {/* table html  */}
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
                      <td className="text-center py-4">
                        {ag_pr.prestation_intitule}
                      </td>
                      <td className="text-center py-4">
                        {ag_pr.agenda_intitule}
                      </td>
                      <td className="text-center py-4">{ag_pr.duree}</td>
                      <td className="text-center py-4">{ag_pr.prix}</td>
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
        <div className="absolute bottom-0 w-full flex gap-2 justify-center">
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
