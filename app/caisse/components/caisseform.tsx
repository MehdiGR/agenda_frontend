"use client";
import React, { useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { handleOptionChangeTypeClt } from "@/app/js/agenda_fn";
import { useStore_new2 } from "../../store/store_new2";

import {
  selectDefaultStyle,
  selectHourStyles,
} from "@/app/styles/select_style";
import Calculator from "./calculator";
export default function CaisseForm({
  clients,
  collabOptions,
  ticket,
  agendas,
  removePrestation,
  totalTTC,
  updateAgendaInTable,
  selectedResponsable,
  setSelectedResponsable,
}) {
  const [clientIsRef, setIsRef] = useState(true);
  const [selectedClient, setSelectedClient] = useState({
    label: ticket[0]?.client,
    value: ticket[0]?.idClient,
  });
  //

  const [selectedClientType, setSelectedClientType] = useState("client_ref");

  const inputRefs = {
    input1: useRef(),
    input2: useRef(),
    input3: useRef(),
  };
  const [clientOptions, setClientOptions] = useState(
    clients.map((client: any) => {
      return { value: client.id, label: client.nom };
    })
  );

  const handleOptionChangeTypeClt = (changeEvent: any) => {
    let value = changeEvent.target.value;
    value == "client_ref" ? setIsRef(true) : setIsRef(false);
    setSelectedClientType(value);
  };
  // handle click button in the calculator
  const handleClickCalculator = (buttonValue) => {
    const focusedInputRef = inputRefs[document.activeElement.id];
    console.log(focusedInputRef);
    return;
    if (focusedInputRef.current) {
      focusedInputRef.current.value += buttonValue;
    }
  };
  const schema = yup.object().shape({
    client: yup
      .object()
      .shape({
        label: yup.string().required("Sélectionnez un client"),
        value: yup.string().required(),
      })
      .required(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {},
  });
  const handleCaisseForm = () => {
    console.log("submitted");
  };

  const handleOptionChangeClt = (selected: any) => {
    setSelectedClient(selected);
  };
  // add new row to reservation state given by params

  return (
    <div>
      <form
        className="space-y-4 h-full"
        onSubmit={handleSubmit(handleCaisseForm)}
      >
        {/*  ticket id*/}
        <input name="ticketId" type="hidden" value={ticket[0]?.id} />
        <div className="flex gap-32 ">
          <div className="flex gap-3">
            <input
              type="radio"
              name="client_type"
              id="client_ref"
              value="client_ref"
              checked={selectedClientType === "client_ref"}
              onChange={(event) => handleOptionChangeTypeClt(event)}
            />
            <label htmlFor="client_ref">client référencer</label>
            <input
              type="radio"
              name="client_type"
              id="client_psg"
              value="client_psg"
              checked={selectedClientType === "client_psg"}
              onChange={(event) => handleOptionChangeTypeClt(event)}
            />
            <label htmlFor="client_psg">client de passage</label>
          </div>
          <div className=" font-semibold flex gap-3 text-gray-500">
            <p>Ticket:</p>
            <p className="font-bold text-gray-500">{ticket[0]?.Num_ticket}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Client:</label>
          <div className="flex gap-[1px] relative  ">
            <Controller
              name="client"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  instanceId="select_client"
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
                      width: "100%",
                    }),
                  }}
                  onChange={handleOptionChangeClt}
                />
              )}
            />
          </div>
          <p className="text-red-500">{errors.client?.label?.message}</p>
        </div>
        <table className="w-full border border-gray-400">
          <thead className=" bg-slate-800 text-white  ">
            <tr>
              <th className="border-r-2 py-1 text-sm">Designation</th>
              <th className="border-r-2 py-1 text-sm w-[20%]">Vendeur</th>
              <th className="border-r-2 py-1 text-sm">Qte</th>
              <th className="border-r-2 py-1 text-sm">-%</th>
              <th className="border-r-2 py-1 text-sm">Total</th>
              <th className="border-r-2 py-1 text-sm"></th>
            </tr>
          </thead>
          <tbody>
            {ticket.length == 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Aucune prestation
                </td>
              </tr>
            ) : (
              // agenda_prestationArr.map((ag_pr: any, index: any) => {
              //   let hours = Math.floor(ag_pr.duree / 60);
              //   let minutes = ag_pr.duree % 60;
              ticket.map((item: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className="text-center py-4">{item.Designation}</td>
                    <td className="text-center py-4">
                      <Controller
                        name={`agenda_prestationArr[${index}].vendeur` as any}
                        control={control}
                        render={({ field }) => {
                          return (
                            <Select
                              {...field}
                              instanceId={`select_Agenda_${index}`}
                              placeholder="Sélectionnez un Vendeur"
                              options={collabOptions}
                              value={{
                                label: item.vendeur,
                                value: item.vendeurId,
                              }} // Use field.value
                              styles={{
                                ...selectDefaultStyle,
                                container: (provided) => ({
                                  ...provided,
                                  width: "100%",
                                }),
                              }}
                              onChange={(selectedOption) => {
                                updateAgendaInTable(index, selectedOption);
                              }}
                            />
                          );
                        }}
                      />
                    </td>
                    <td className="text-center py-4">
                      <input
                        className="w-20 p-1 border border-gray-400 rounded-md"
                        type="number"
                        value={1}
                      />
                    </td>
                    <td className="text-center py-4">
                      {" "}
                      <input
                        className="w-20 p-1 border border-gray-400 rounded-md"
                        type="text"
                        pattern="[0-9.]*"
                        onInput={(event) => {
                          const input = event.target as HTMLInputElement;
                          input.value = input.value
                            .replace(/,/g, ".")
                            .replace(/[^0-9.]/g, "");
                        }}
                        value={0}
                      />
                    </td>
                    <td className="text-center py-4">
                      {" "}
                      <input
                        className="w-20 p-1 border border-gray-400 rounded-md"
                        type="text"
                        pattern="[0-9.]*"
                        onInput={(event) => {
                          const input = event.target as HTMLInputElement;
                          input.value = input.value
                            .replace(/,/g, ".")
                            .replace(/[^0-9.]/g, "");
                        }}
                        value={item.total_ttc}
                      />
                    </td>
                    <td className="text-center py-4">
                      <button
                        className="text-red-700 font-bold "
                        onClick={() => removePrestation(index)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className=" flex justify-end ml-auto gap-6 w-full ">
          <label htmlFor="" className="flex items-center">
            Remise générale :
          </label>
          <input
            type="text"
            className="border border-gray-400 rounded-md p-2"
            pattern="[0-9.]*"
            onInput={(event) => {
              const input = event.target as HTMLInputElement;
              input.value = input.value
                .replace(/,/g, ".")
                .replace(/[^0-9.]/g, "");
            }}
          />
        </div>
        <div className=" flex justify-end ml-auto gap-6 w-full ">
          <label htmlFor="" className="flex items-center">
            Total TTC (dont TVA : €) :
          </label>
          <input
            type="text"
            className="border border-gray-400 rounded-md p-2"
            pattern="[0-9.]*"
            id="input3"
            // name="input3"
            onInput={(event) => {
              const input = event.target as HTMLInputElement;
              input.value = input.value
                .replace(/,/g, ".")
                .replace(/[^0-9.]/g, "");
            }}
            onFocus={() => inputRefs[`input3`].current.focus()}
            ref={inputRefs[`input3`]}
            value={totalTTC}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            Carte bancaire
          </button>
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            chèque
          </button>
          <button
            type="button"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
          >
            espace
          </button>
          <button
            type="button"
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded"
          >
            chèque cadeau / Avoir
          </button>
        </div>
        <div>
          {/* create table with 4 columns and 3 rows */}
          <table className="border w-full">
            <thead>
              <tr>
                <th className="border-r-2 py-1 text-sm">Date</th>
                <th className="border-r-2 py-1 text-sm">Mode</th>
                <th className="border-r-2 py-1 text-sm w-2/3">Montant</th>
              </tr>
            </thead>
            <tbody>
              {1 == 0 ? (
                <tr>
                  <td className="border bg-orange-300 text-center py-2 px-4">
                    €
                  </td>
                  <td className="border bg-orange-300 text-center py-2 px-4">
                    €
                  </td>
                  <td className="border bg-orange-300 text-center py-2 px-4">
                    €
                  </td>
                </tr>
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
        <div className="flex flex-col gap-2">
          <div>
            <label className="text-red-500 font-bold">
              Reste à payer : <span>50 €</span>
            </label>
          </div>
          <div className=" flex gap-2">
            <label className=" flex items-center font-bold">
              Responsable :
            </label>
            <Controller
              name="collborateur"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={collabOptions}
                  value={selectedResponsable}
                  styles={{
                    ...selectDefaultStyle,
                    container: (provided) => ({
                      ...provided,
                      borderTopLeftRadius: "0px !important",
                      borderBottomLeftRadius: "0px !important",
                      width: "300px",
                    }),
                  }}
                  onChange={(value) => {
                    setSelectedResponsable(value);
                    field.onChange(value);
                  }}
                  styles={{
                    ...selectDefaultStyle,
                    container: (provided) => ({
                      ...provided,
                      borderTopRightRadius: "0px !important",
                      borderBottomRightRadius: "0px !important",
                      width: "300px",
                    }),
                  }}
                  onChange={(value) => {
                    setSelectedResponsable(value);
                    field.onChange(value);
                  }}
                />
              )}
            />
          </div>
        </div>
        <div>
          <label htmlFor="note">Notes à l'attention du client :</label>
          <textarea
            name="note"
            id="note"
            cols={10}
            rows={3}
            className="border border-gray-400 rounded-md p-2 w-full"
          ></textarea>
        </div>
        <div className="pb-4">
          <Calculator handleClickCalculator={handleClickCalculator} />
        </div>
      </form>
    </div>
  );
}
