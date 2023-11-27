"use client";
import React, { useState } from "react";
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
import {
  selectDefaultStyle,
  selectHourStyles,
} from "@/app/styles/select_style";
export default function CaisseForm({ clients }) {
  const [clientIsRef, setIsRef] = useState(true);
  const [selectedClientType, setSelectedClientType] = useState("client_ref");

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

  return (
    <div className="">
      <form
        className="space-y-4 h-full"
        onSubmit={handleSubmit(handleCaisseForm)}
      >
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
          </div>
          <p className="text-red-500">{errors.client?.label?.message}</p>
        </div>

        <table className="border border-gray-400 w-full">
          <thead className=" bg-slate-800 text-white  ">
            <tr>
              <th className="border-r-2 px-4 py-2  ">Designation</th>
              <th className="border-r-2 px-4 py-2  ">Vendeur</th>
              <th className="border-r-2 px-4 py-2  ">Qte</th>
              <th className="border-r-2 px-4 py-2  ">-%</th>
              <th className="border-r-2 px-4 py-2  ">Total</th>
              <th className="border-r-2 px-4 py-2  "></th>
            </tr>
          </thead>
          <tbody>
            <tr className="">
              <td className="pl-3 ">Maquillage soir</td>
              <td className=" w-20 p-2">
                <Select
                  styles={{
                    ...selectDefaultStyle,
                    container: (provided) => ({
                      ...provided,
                      borderTopRightRadius: "0px !important",
                      borderBottomRightRadius: "0px !important",
                      width: "300px",
                    }),
                  }}
                />
              </td>
              <td className=" p-2">
                <input
                  className="w-20 p-2 border border-gray-400 rounded-md"
                  type="number"
                />
              </td>
              <td className=" p-2">
                <input
                  className="w-20 p-2 border border-gray-400 rounded-md"
                  type="text"
                />
              </td>
              <td className=" p-2">
                <input
                  className="w-20 p-2 border border-gray-400 rounded-md"
                  type="text"
                  pattern="[0-9.]*"
                  onInput={(event) => {
                    const input = event.target as HTMLInputElement;
                    input.value = input.value
                      .replace(/,/g, ".")
                      .replace(/[^0-9.]/g, "");
                  }}
                />
              </td>
            </tr>
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
            onInput={(event) => {
              const input = event.target as HTMLInputElement;
              input.value = input.value
                .replace(/,/g, ".")
                .replace(/[^0-9.]/g, "");
            }}
          />
        </div>
        <div>
          <div className="flex gap-4">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Carte bancaire
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              chèque
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              espace
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              chèque cadeau
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
