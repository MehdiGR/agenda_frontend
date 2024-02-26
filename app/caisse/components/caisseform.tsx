"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { useStore_new2 } from "../../store/store_new2";
import { IoMdClose } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import { CiPause1 } from "react-icons/ci";

import {
  selectDefaultStyle,
  selectHourStyles,
} from "@/app/styles/select_style";
import Calculator from "./calculator";
import {
  CaissePayement,
  removeTicket,
  updateTicket,
} from "@/app/lib/ticket/ticketActions";
import ModalDetailTK from "./Modals/modaldetailticket";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
export default function CaisseForm({
  clients,
  collabOptions,
  ticketLines,
  agendas,
  removePrestation,
  totalTTC,
  totalTax,
  updateAgendaInTable,
  selectedResponsable,
  setSelectedResponsable,
  PaiementsDeCommande,
  addPaiementItem,
  removePaiementItem,
  updatePaiementItemMontant,
  updateTicketLine,
}: any) {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [clientIsRef, setIsRefClient] = useState(true);
  const [selectedClient, setSelectedClient] = useState({
    label: ticketLines[0]?.client,
    value: ticketLines[0]?.idClient,
  });
  // const [PaiementsDeCommande, setPaiementsDeCommande] = useState([]);

  const [resteAPayer, setResteAPayer] = useState<number>(0);
  useEffect(() => {
    // Calculate the sum of montant of all existing items
    const sumOfMontants = PaiementsDeCommande.reduce(
      (sum, item) => sum + parseFloat(item.montant || "0"),
      0
    );

    // Calculate the remaining amount to be paid
    const newResteAPayer = totalTTC - sumOfMontants;

    // Update the resteAPayer state
    setResteAPayer(newResteAPayer);
  }, [totalTTC, PaiementsDeCommande]);

  const [montantRendu, setMontantRendu] = useState<number>(0);
  const [paye, setPaye] = useState(false);

  const [selectedClientType, setSelectedClientType] = useState("client_ref");
  const [ticketId, setTicketId] = useState<any>(null);

  // modal states

  const pathname = usePathname();

  // const inputRefs: {
  //   [key: string]: any;
  // } = {
  //   input1: useRef<HTMLInputElement | null>(null),
  //   input2: useRef<HTMLInputElement | null>(null),
  //   input3: useRef<HTMLInputElement | null>(null),
  // };

  // const [inputValues, setInputValues] = useState({
  //   input: "", // Use a single variable to handle all inputs
  // });
  const [focusedInput, setFocusedInput] = useState<{
    index: number;
    inputType: string;
  } | null>(null);
  // const inputRefs = useRef([]);
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleInputFocus = (index: number, inputType: string) => {
    setFocusedInput({ index, inputType });
  };
  // handle calculator button click
  // const handleClickCalculator = (value: string) => {
  //   if (
  //     focusedInput &&
  //     inputRefs.current[`${focusedInput.inputType}${focusedInput.index}`]
  //   ) {
  //     const currentInput = inputRefs.current[
  //       `${focusedInput.inputType}${focusedInput.index}`
  //     ] as HTMLInputElement;
  //     currentInput.value = currentInput.value
  //       ? currentInput.value + value
  //       : value;
  //   }
  // };

  const handleClickCalculator = (value: string) => {
    if (
      focusedInput &&
      inputRefs.current[`${focusedInput.inputType}${focusedInput.index}`]
    ) {
      const currentInput = inputRefs.current[
        `${focusedInput.inputType}${focusedInput.index}`
      ] as HTMLInputElement;
      const previousValue = currentInput.value;
      currentInput.value = currentInput.value
        ? currentInput.value + value
        : value;

      // Create a new event object to simulate the change event
      const event = new Event("change", { bubbles: true });

      // Dispatch the event to trigger the onChange handler
      currentInput.dispatchEvent(event);

      // If you need to update the state or perform other actions after the change, you can do so here
      // For example, if you have a state update function for the input value, you can call it with the new value
      // setInputValue(currentInput.value);
    }
  };

  // handle calculator clear button
  const handleClearClick = (): void => {
    if (
      focusedInput !== null &&
      inputRefs.current[`${focusedInput.inputType}${focusedInput.index}`]
    ) {
      (
        inputRefs.current[
          `${focusedInput.inputType}${focusedInput.index}`
        ] as HTMLInputElement
      ).value = "";
    }
  };
  const [clientOptions, setClientOptions] = useState(
    clients.map((client: any) => {
      return { value: client.id, label: client.nom };
    })
  );

  const handleOptionChangeTypeClt = (changeEvent: any) => {
    let value = changeEvent.target.value;
    value == "client_ref" ? setIsRefClient(true) : setIsRefClient(false);
    setSelectedClientType(value);
  };

  const handleClickPause = async () => {
    updateTicket({
      properties: ["mise_en_attente"],
      values: [1],
      id: ticketLines[0]?.iddocument,
    });
    router.push(`/caisse`);
  };
  const handleClickRemove = () => {
    removeTicket(ticketLines[0]?.iddocument);
  };
  const schema = yup.object().shape({
    client: yup
      .object()
      .shape({
        label: !clientIsRef
          ? yup.string().nullable()
          : yup.string().required("Sélectionnez un client"),
        value: !clientIsRef ? yup.string().nullable() : yup.string().required(),
      })
      .required(),
    collaborateur: yup
      .object()
      .shape({
        label: yup.string().required("Sélectionnez un collaborateur"),
        value: yup.string().required(),
      })
      .required(),
    totalPriceTTC: yup.number(),
    totalPriceHT: yup.number(),
    totalTax: yup.number(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      client: {
        label: ticketLines[0]?.client,
        value: ticketLines[0]?.idClient,
      },
      collaborateur: {
        label: selectedResponsable.label,
        value: selectedResponsable.value,
      },
    },
  });

  const handleOptionChangeClt = (selected: any) => {
    setSelectedClient(selected);
    setValue("client", selected);
  };
  useEffect(() => {
    if (!clientIsRef) {
      setValue("client", { label: null, value: null });
    }
  }, [clientIsRef, setValue]);
  useEffect(() => {
    CalculateMontantRendu();
  }, [PaiementsDeCommande]);

  const CalculateMontantRendu = () => {
    const sumOfMontants = PaiementsDeCommande.reduce(
      (sum, item) => sum + parseFloat(item.montant),
      0
    );

    setMontantRendu(Math.max(sumOfMontants - totalTTC, 0));
  };
  const CalculateTikeLineTotal = ({ index, qte, prix, remise, tva }: any) => {
    const item = ticketLines[index];
    const discount = (prix * remise) / 100;
    const total = qte * (prix - discount) * tva;
    // const tax = qte * (prix - discount) * (tva - 1);

    const updatedRow = {
      ...item,
      qte,
      prix,
      remise,
      total_ttc: Number(total.toFixed(2)),
    };

    updateTicketLine(index, updatedRow);
  };

  // detect if a new row is added
  useEffect(() => {
    // Only update the form values if they are different from the current values
    const currentValues = getValues("prestations" as any);
    console.log(currentValues);
    const updatedPrestationArr = ticketLines.map((item: any) => ({
      line_id: item.line_id,
      Designation: item.Designation,
      id_art: item.idproduit,
      idCollab: item.vendeurId,
      qte: 1,
      prix: item.prix,
      total_ttc: item.total_ttc,
      qte_retour: item.qte_retour,
      remise: item.remise,
      tva_id: item.tva_id,
      ...(item.readonly !== undefined && { readonly: item.readonly }),
    }));

    // Check if the updated values are different from the current values
    if (
      JSON.stringify(currentValues) !== JSON.stringify(updatedPrestationArr)
    ) {
      setValue("prestations" as any, updatedPrestationArr, {
        shouldDirty: true,
      });
    }
    setValue("totalPriceTTC", Number(totalTTC.toFixed(2)));
    setValue("totalPriceHT", Number((totalTTC - totalTax).toFixed(2)));
    setValue("totalTax", Number(totalTax.toFixed(2)));
  }, [ticketLines, setValue, getValues]);
  const router = useRouter();
  const modal = searchParams.get("modal");

  // useEffect(() => {
  //   console.log(searchParams.get("modal"), "modal");
  //   if (searchParams.get("modal") === "true") {
  //     openDetailTKModal();
  //   }
  //   // return () => {
  //   //   console.log("unmounted");
  //   // };
  // }, [searchParams]);

  const openDetailTKModal = (modalState: any) => {
    modalState(true);
  };
  const closeDetailTKModal = (modalState: any) => {
    modalState(false);
    setTicketId(null);
    router.replace("/caisse", { shallow: true });
  };
  const handleCaisseForm = async (formData: any) => {
    // return;
    const createTicketData = { ...formData };
    const createTicketDataFiltered = { ...createTicketData };
    createTicketDataFiltered.prestations = createTicketData.prestations.filter(
      (item: any) => !item.hasOwnProperty("readonly")
    );
    const PaiementsDeCommandeFiltered = PaiementsDeCommande.filter(
      (item: any) => !item.hasOwnProperty("readonly")
    );
    const PayementData = {
      // ...data,
      ticketId: ticketLines[0]?.iddocument,
      PaiementsDeCommande: PaiementsDeCommandeFiltered,
      resteAPayer,
      montantRendu,
      Num_ticket_rt: "",
      id_tier: selectedClient.value,
    };
    // console.log("createTicketDataFiltered", createTicketDataFiltered);
    // return;

    //  const ticketId = parseInt(pathname.split("/")[3]);
    const ticketId = await CaissePayement(
      PayementData,
      createTicketDataFiltered
    );
    setTicketId(ticketId);
    // params.set("modal", "true");
    // const newQueryString = params.toString();
    // read the url parameters and check if there is ticket id and  modal equal true  and open the modal
    // router.replace(`/caisse/ticket/${ticketId}`, {
    //   shallow: true,
    // });
  };
  return (
    <div className="relative max-h-[100vh]  ">
      {/* <img src="/vercel.svg" alt="" /> */}
      <form className=" h-full  " onSubmit={handleSubmit(handleCaisseForm)}>
        <div className="space-y-4 overflow-y-auto max-h-full  p-1">
          <div className="flex flex-wrap gap-3 ">
            <div className="flex  gap-2 ">
              <input
                type="radio"
                name="client_type"
                id="client_ref"
                value="client_ref"
                checked={selectedClientType === "client_ref"}
                onChange={(event) => handleOptionChangeTypeClt(event)}
              />
              <label htmlFor="client_ref">Client référencer</label>
              <input
                type="radio"
                name="client_type"
                id="client_psg"
                value="client_psg"
                checked={selectedClientType === "client_psg"}
                onChange={(event) => handleOptionChangeTypeClt(event)}
              />
              <label htmlFor="client_psg">Client de passage</label>
            </div>
            <div className=" font-semibold flex gap-3  flex-1 xl:justify-end mr-10 ">
              {ticketLines[0]?.Num_ticket != null && (
                <div className="flex gap-3">
                  <label className="text-lg text-slate-800">Ticket:</label>
                  <p className=" text-gray-500 flex items-center">
                    {ticketLines[0]?.Num_ticket}
                  </p>
                </div>
              )}
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
                    value={!clientIsRef ? null : selectedClient}
                    isDisabled={!clientIsRef}
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
              {ticketLines.length == 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Aucune prestation
                  </td>
                </tr>
              ) : (
                ticketLines.map((item: any, index: number) => {
                  const inputId = `input${index}`;

                  return (
                    <tr key={index}>
                      <td className="text-center py-4">{item.Designation}</td>
                      <td className="text-center py-4">
                        <Controller
                          name={`prestations[${index}].vendeur` as any}
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
                          {...register(`prestations[${index}].qte` as any)}
                          className="w-20 p-1 border border-gray-400 rounded-md"
                          type="number"
                          defaultValue={item.qte || 1}
                          ref={(el) => (inputRefs.current[`qte${index}`] = el)}
                          onFocus={() => handleInputFocus(index, "qte")}
                          onChange={(e) =>
                            CalculateTikeLineTotal({
                              index,
                              qte: e.target.value,
                              prix: item.prix,
                              remise: item.remise,
                              tva: item.tva_valeur / 100 + 1,
                            })
                          }
                        />
                      </td>
                      <td className="text-center py-4">
                        <input
                          {...register(`prestations[${index}].remise` as any)}
                          className="w-20 p-1 border border-gray-400 rounded-md"
                          type="text"
                          pattern="[0-9.]*"
                          ref={(el) =>
                            (inputRefs.current[`remise${index}`] = el)
                          }
                          onFocus={() => handleInputFocus(index, "remise")}
                          onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            input.value = input.value
                              .replace(/,/g, ".")
                              .replace(/[^0-9.]/g, "");
                          }}
                          defaultValue={item.remise || 0}
                          onChange={(e) =>
                            CalculateTikeLineTotal({
                              index,
                              qte: item.qte,
                              prix: item.prix,
                              remise: e.target.value,
                              tva: item.tva_valeur / 100 + 1,
                            })
                          }
                        />
                      </td>
                      <td className="text-center py-4">
                        {" "}
                        <input
                          {...(register(
                            `prestations[${index}].total_ttc`
                          ) as any)}
                          className="w-20 p-1 border border-gray-400 rounded-md"
                          type="text"
                          pattern="[0-9.]*"
                          onInput={(event) => {
                            const input = event.target as HTMLInputElement;
                            input.value = input.value
                              .replace(/,/g, ".")
                              .replace(/[^0-9.]/g, "");
                          }}
                          defaultValue={item.total_ttc}
                        />
                      </td>
                      <td className="text-center py-4">
                        {!item.readonly && (
                          <button
                            className="text-red-700 font-bold "
                            onClick={() => {
                              setValue(
                                `prestations[${index}].removedRow` as any,
                                true
                              );
                              removePrestation(index);
                            }}
                          >
                            X
                          </button>
                        )}
                        {item?.readonly && (
                          <input
                            type="text"
                            {...register(
                              `prestations[${index}].readonly` as any
                            )}
                            value={item.readonly}
                          />
                        )}
                      </td>
                      <input
                        type="hidden"
                        {...register(`prestations[${index}].removedRow` as any)}
                      />
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
              Total TTC (dont TVA : {totalTax.toFixed(2)} DH ) :
            </label>
            <input
              type="text"
              className="border border-gray-400 rounded-md p-2"
              pattern="[0-9.]*"
              id="input3"
              name="totalPriceTTC"
              // {...register(`totalPriceTTC`)}
              // onInput={(event) => {
              //   const input = event.target as HTMLInputElement;
              //   input.value = input.value
              //     .replace(/,/g, ".")
              //     .replace(/[^0-9.]/g, "");
              // }}
              onChange={(e) => {
                setValue("totalPriceTTC", Number(totalTTC.toFixed(2)));
                setValue(
                  "totalPriceHT",
                  Number((totalTTC - totalTax).toFixed(2))
                );
                setValue("totalTax", Number(totalTax.toFixed(2)));
              }}
              value={totalTTC}
            />
            {<p className="text-red-500">{errors.totalPriceTTC?.message}</p>}
          </div>
          <div className="flex flex-wrap gap-4 ">
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() =>
                addPaiementItem({ title: "Carte Bancaire", id: 1 })
              }
            >
              Carte bancaire
            </button>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addPaiementItem({ title: "Chèque", id: 3 })}
            >
              chèque
            </button>
            <button
              type="button"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addPaiementItem({ title: "Espece", id: 2 })}
            >
              espece
            </button>
            <button
              type="button"
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded"
              onClick={() => addPaiementItem("cadeau")}
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
                  <th className="border-r-2 py-1 text-sm w-2/3">Mode</th>
                  <th className="border-r-2 py-1 text-sm ">Montant</th>
                  <th className="border-r-2 py-1 text-sm "></th>
                </tr>
              </thead>
              <tbody className="border">
                {PaiementsDeCommande.length > 0 ? (
                  PaiementsDeCommande.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="border-r-2 py-1 text-sm  p-3">
                          <input
                            type="date"
                            value={item.date_paiement.slice(0, 10)}
                            onChange={(e) => console.log(e)}
                          />
                        </td>
                        <td className="border-r-2 py-1 text-sm  p-3">
                          {item.mode_paiement}
                        </td>
                        <td className="border-r-2 py-1 text-sm  p-2 ">
                          <input
                            name="montant_p"
                            type="text"
                            value={item.montant}
                            className="border border-gray-400 rounded-md p-3 text-right"
                            onChange={(e) =>
                              updatePaiementItemMontant(index, e.target.value)
                            }
                            readOnly={item?.readonly == 1 ? true : false}
                          />
                        </td>
                        <td>
                          {!item?.readonly && (
                            <button
                              type="button"
                              className="text-red-500  font-bold py-2 px-4 rounded"
                              onClick={() => {
                                removePaiementItem(index);
                              }}
                            >
                              X
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
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
            <div className="flex flex-col gap-2">
              {resteAPayer > 0 && (
                <label className="text-red-500 font-bold">
                  Reste à payer : <span>{resteAPayer.toFixed(2)}</span>
                </label>
              )}
              {montantRendu > 0 && (
                <label className="text-red-500 font-bold">
                  Montant rendu : <span>{montantRendu.toFixed(2)}</span>
                </label>
              )}
            </div>
            <div className=" flex gap-2">
              <label className=" flex items-center font-bold">
                Responsable :
              </label>
              <Controller
                name="collaborateur"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="collaborateur"
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
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label htmlFor="note">Notes à l&apos;attention du client :</label>
            <textarea
              name="note"
              id="note"
              cols={10}
              rows={3}
              className="border border-gray-400 rounded-md p-2 w-full"
            ></textarea>
          </div>
          <div className="pb-4">
            <Calculator
              handleClickCalculator={handleClickCalculator}
              handleClearClick={handleClearClick}
            />
          </div>
        </div>
        {ticketLines.length > 0 && ticketLines[0]?.valide == null ? (
          <div className="flex justify-center absolute bottom-0  gap-1  bg-white p-1 w-full ">
            <button
              type="button"
              className="flex items-center justify-center gap-2  bg-slate-800 shadow-md border rounded-md font-semibold text-sm text-white min-h-[60px] min-w-[130px]  w-full "
              onClick={handleClickPause}
            >
              <CiPause1 fontSize={20} className="font-bold" />
              Mise en attente
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2  bg-red-500 shadow-md border  rounded-md font-semibold text-sm text-white min-h-[60px] min-w-[130px]  w-full"
              onClick={handleClickRemove}
            >
              <IoMdClose fontSize={20} className="font-bold" />
              Supprimer
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2  bg-orange-500 border rounded-md font-semibold text-sm text-white min-h-[60px] min-w-[130px] w-full "
            >
              <IoTicketOutline fontSize={20} className="font-bold" /> Payer
            </button>
          </div>
        ) : (
          ticketLines.length > 0 && (
            <div className="">
              <button
                type="button"
                className="flex items-center justify-center gap-2  bg-green-600 border rounded-md font-semibold text-sm text-white min-h-[60px] min-w-[130px]   w-[200px]"
                onClick={() =>
                  setTicketId(() => {
                    return ticketLines[0].iddocument;
                  })
                }
              >
                Detail
              </button>
            </div>
          )
        )}

        <ModalDetailTK
          ticketId={ticketId}
          openModal={openDetailTKModal}
          closeModal={closeDetailTKModal}
          resteAPayer={resteAPayer}
        />
        {/*  ticket id*/}
      </form>
    </div>
  );
}
