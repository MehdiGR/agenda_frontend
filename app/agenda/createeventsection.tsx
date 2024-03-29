"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import ModalClient from "./components/Modals/modalclient";
import Select, { InputProps } from "react-select";
// import { OptionsType, OptionTypeBase } from "react-select";
import PrestationSlider from "./components/prestationsSlider";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import removeIcon from "@/public/square_remove.svg";
import Image from "next/image";
import {
  selectDefaultStyle,
  selectHourStyles,
} from "@/app/styles/select_style";

import {
  openModal,
  formatDuration,
  cancelCreationEvent,
} from "@/app/js/agenda_fn";
import { saveReservation } from "@/app/lib/reservat/reservatActions";
import { exportStore, useStore } from "@/app/store/store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CiNoWaitingSign } from "react-icons/ci";

export default function CreateEventSection({
  clients,
  villes,
  collaborateurs,
  prestations,
  agendas,
}: any) {
  const {
    activeCreateSection,
    setActiveCreateSection,
    events,
    manageEvents,
    selectedEventsIndices,
    toggleEventSelected,
    setOnEditingEvent,
  } = useStore();
  // Copy the selectedEventsIndices array
  const EventsIndices = [...selectedEventsIndices];

  // Get the first selected event or null if there are no selected events
  const selectedEventFirst =
    EventsIndices.length > 0 ? events[EventsIndices[0]] : null;

  // Get the last selected event or null if there are no selected events
  const selectedEventLast =
    EventsIndices.length > 0
      ? events[EventsIndices[EventsIndices.length - 1]]
      : null;

  // Filter the events array to only include events with indices present in EventsIndices
  // Then, flatten the agenda_prestationArr arrays of the selected events into a single array
  const selectedEventAgendaPrestationArr = events
    .filter((event: any) => EventsIndices.includes(event.eventIndex))
    .flatMap((event: any) => event.agenda_prestationArr);

  //return agenda_prestationArr from selectedEventAgendaPrestationArr
  const selectedEventDate: string = selectedEventFirst?.start.split("T")[0];

  const [selectedHourDB, selectedMinutesDB] =
    selectedEventFirst?.start.split("T")[1]?.split(":") || [];

  const [clientIsRef, setIsRefClient] = useState(true);
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
  const handleOptionChangeTypeClt = (changeEvent: any) => {
    let value = changeEvent.target.value;
    value == "client_ref" ? setIsRefClient(true) : setIsRefClient(false);
    setSelectedClientType(value);
  };
  // const [selectedClient, setSelectedClient] = useState(null);
  // const [selectedAgenda, setSelectedAgenda] = useState();

  const schema = yup.object().shape({
    // client: yup
    //   .object()
    //   .shape({
    //     label: yup.string().required("Sélectionnez un client"),
    //     value: yup.string().required(),
    //   })
    //   .required(),
    client: yup
      .object()
      .shape({
        label: !clientIsRef
          ? yup.string().nullable()
          : yup.string().required("Sélectionnez un client"),
        value: !clientIsRef ? yup.string().nullable() : yup.string().required(),
      })
      .required(),
    dateRes: yup.string().required(),
    hourDB: yup.object().shape({
      label: yup.string(),
      value: yup.string(),
    }),
    minutesDB: yup.object().shape({
      label: yup.string(),
      value: yup.string(),
    }),
    note: yup.string(),
    agenda_prestationArr: yup.array(),
    idRes: yup.string().default(""),
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
      minutesDB: {
        label: selectedMinutesDB?.toString().padStart(2, "0"),
        value: selectedMinutesDB?.toString().padStart(2, "0"),
      },
      hourDB: {
        label: selectedHourDB?.toString().padStart(2, "0"),
        value: selectedHourDB?.toString().padStart(2, "0"),
      },
      dateRes: selectedEventDate,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agenda_prestationArr",
  });

  if (EventsIndices.length == -1) {
    setActiveCreateSection(false);
  }

  const [isPending, startTransition] = useTransition();
  const { TotalDuration, calculateTotals } = exportStore();
  const totalDuration = TotalDuration();
  const { totalTTC, totalHT, totalTax } = calculateTotals();
  const submitTypeRef = useRef("");

  const router = useRouter();

  const handleSaveReservat: any = async (data: any) => {
    // if (submitTypeRef.current === "encaisser") {
    //   console.log("Encaisser button was clicked");
    // }
    // return;
    // saveReservat(data);
    // startTransition(async () => {
    // console.log("data", data);
    // return;
    const insertedIdTicket = await saveReservation({
      ...data,
      duree: totalDuration,
      totalTTC,
      totalHT,
      totalTax,
      submitType: submitTypeRef.current,
    });

    if (submitTypeRef.current === "encaisser" && insertedIdTicket) {
      router.push(`/caisse/ticket/${insertedIdTicket}`);
    }
    toggleEventSelected(null);
    // setOnEditingEvent(true);

    // });
  };

  useEffect(() => {
    // Only update the form values if they are different from the current values
    const currentValues = getValues("agenda_prestationArr");
    const updatedAgendaPrestationArr = selectedEventAgendaPrestationArr.map(
      (item: any) => ({
        line_id: "4",
        start_time: item.start_time,
        designation: item.intitule,
        id_art: item.id_art,
        qte: 1,
        tva_id: item.tva_id,
        prixVente: item.prixVente,
        prixTTC: item.prixTTC,
        ticketId: item.ticketId,
        ticketId_line: item.ticketId_line,
        agenda: {
          label: item.agendaTitle,
          value: item.agendaId,
        },
        duration_hours: {
          label: item.duration_hours.toString().padStart(2, "0"),
          value: item.duration_hours.toString().padStart(2, "0"),
        },
        duration_minutes: {
          label: item.duration_minutes.toString().padStart(2, "0"),
          value: item.duration_minutes.toString().padStart(2, "0"),
        },
        // Add other fields as needed
      })
    );

    // Check if the updated values are different from the current values
    if (
      JSON.stringify(currentValues) !==
      JSON.stringify(updatedAgendaPrestationArr)
    ) {
      setValue("agenda_prestationArr", updatedAgendaPrestationArr, {
        shouldDirty: true,
      });
    }
  }, [selectedEventAgendaPrestationArr, setValue, getValues]);
  useEffect(() => {
    if (!clientIsRef) {
      setValue("client", { label: null, value: null });
    }
  }, [clientIsRef, setValue]);

  return (
    <div
      className={`relative bg-white rounded-md p-6 shadow-md  h-fit w-full ${
        !activeCreateSection ? "hidden" : ""
      }`}
    >
      <form
        onSubmit={handleSubmit(handleSaveReservat)}
        className=" space-y-4 h-full"
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
        <div>
          <ModalClient villes={villes} collaborateurs={collaborateurs} />
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
                  placeholder="Sélectionnez un Client"
                  options={clientOptions}
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
                  value={!clientIsRef ? null : field.value}
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
        <input
          type="hidden"
          {...register("idRes")}
          // defaultValue={agenda_prestationArr[0]?.res_id}
          // value={agenda_prestationArr[0]?.res_id}
        />
        <div className="flex gap-28 ">
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Date:</label>
            <input
              type="date"
              className="flex-grow border border-gray-300 rounded-md px-4 h-full"
              {...register("dateRes")}
              value={selectedEventDate}
              // value={agenda_prestationArr[0]?.dateDB}
              onChange={(e) => {
                // setValue("dateRes", e.target.value);
                manageEvents([
                  {
                    action: "updateDates",
                    payload: { newDate: e.target.value },
                  },
                ]);
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Début:</label>
            <div className="flex gap-0 ">
              <Controller
                name="hourDB"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="select_hour"
                    placeholder=""
                    options={Array.from({ length: 15 }, (_, i) => ({
                      value: (i + 9).toString().padStart(2, "0"),
                      label: (i + 9).toString().padStart(2, "0"),
                    }))} // Convert to readonly array
                    // value={dateTime.hourDB}
                    value={{
                      label: selectedHourDB?.toString().padStart(2, "0"),
                      value: selectedHourDB?.toString().padStart(2, "0"),
                    }}
                    styles={{ ...selectHourStyles }}
                    onChange={(selectedOption) => {
                      // setValue("hourDB", {
                      //   label: selectedOption!.value
                      //     ?.toString()
                      //     .padStart(2, "0"),
                      //   value: selectedOption!.value
                      //     ?.toString()
                      //     .padStart(2, "0"),
                      // });
                      const new_hours = parseInt(selectedOption!.value); //example:2 * 60 = 120(new duration) = 2h
                      const duration =
                        (new_hours - parseInt(selectedHourDB)) * 60;
                      manageEvents([
                        {
                          action: "updateEventsTime",
                          payload: {
                            index: selectedEventFirst?.eventIndex,
                            duration,
                            select_type: "select_hour",
                            globalChange: true,
                          },
                        },
                      ]);
                    }}
                  />
                )}
              />
              {errors.hourDB?.message}
              <span className="font-medium m-2">h</span>
              {/* {"sss " + dateTime.minutesDB.label} */}
              <Controller
                name="minutesDB"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    instanceId="select_minutes"
                    placeholder=""
                    options={Array.from({ length: 60 }, (_, i) => ({
                      value: i.toString().padStart(2, "0"),
                      label: i.toString().padStart(2, "0"),
                    }))}
                    value={{
                      label: selectedMinutesDB?.toString().padStart(2, "0"),
                      value: selectedMinutesDB?.toString().padStart(2, "0"),
                    }}
                    styles={{ ...selectHourStyles }}
                    onChange={(selectedOption) => {
                      setValue("minutesDB", {
                        label: selectedOption!.value
                          ?.toString()
                          .padStart(2, "0"),
                        value: selectedOption!.value
                          ?.toString()
                          .padStart(2, "0"),
                      });
                      const new_minutes = parseInt(selectedOption!.value); //example:2 * 60 = 120(new duration) = 2h
                      const duration =
                        new_minutes - parseInt(selectedMinutesDB);
                      manageEvents([
                        {
                          action: "updateEventsTime",
                          payload: {
                            index: selectedEventFirst?.eventIndex,
                            duration,
                            select_type: "select_minutes",
                            globalChange: true,
                          },
                        },
                      ]);
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label className="font-semibold">Fin:</label>
            <div className="flex items-center mt-2 ">
              <p className="hour_fn">{selectedEventLast?.end?.split("T")[1]}</p>
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
              {selectedEventAgendaPrestationArr.length == 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Aucune prestation
                  </td>
                </tr>
              ) : (
                // agenda_prestationArr.map((ag_pr: any, index: any) => {
                //   let hours = Math.floor(ag_pr.duree / 60);
                //   let minutes = ag_pr.duree % 60;
                selectedEventAgendaPrestationArr.map(
                  (item: any, index: number) => {
                    return (
                      <tr key={index}>
                        <Controller
                          // name={`agenda_prestationArr[${index}].line_id`}
                          name={`agenda_prestationArr[${index}].line_id` as any}
                          control={control}
                          defaultValue={item?.line_id || ""}
                          render={({ field }) => {
                            return <input type="hidden" {...field} />;
                          }}
                        />
                        <Controller
                          // name={`agenda_prestationArr[${index}].start_time`}
                          name={
                            `agenda_prestationArr[${index}].start_time` as any
                          }
                          control={control}
                          defaultValue={item.start_time}
                          render={({ field }) => {
                            return <input type="hidden" {...field} />;
                          }}
                        />
                        <Controller
                          // name={`agenda_prestationArr[${index}].id_art`}
                          name={`agenda_prestationArr[${index}].id_art` as any}
                          control={control}
                          defaultValue={item.id_art}
                          render={({ field }) => {
                            return <input type="hidden" {...field} />;
                          }}
                        />
                        <td className="text-center py-4">{item.intitule}</td>
                        <td className="py-4">
                          <Controller
                            // name={`agenda_prestationArr[${index}].agenda`}
                            name={
                              `agenda_prestationArr[${index}].agenda` as any
                            }
                            control={control}
                            render={({ field }) => {
                              return (
                                <Select
                                  {...field}
                                  name={`agenda_prestationArr[${index}].agenda`}
                                  instanceId={`select_Agenda_${index}`}
                                  placeholder="Sélectionnez un Agendas"
                                  options={agendaOptions}
                                  value={{
                                    label: item.agendaTitle,
                                    value: item.agendaId,
                                  }} // Use field.value
                                  styles={{
                                    ...selectDefaultStyle,
                                    container: (provided) => ({
                                      ...provided,
                                      width: "300px",
                                    }),
                                  }}
                                  onChange={(selectedOption) => {
                                    // setValue(
                                    //   `agenda_prestationArr[${index}].agenda`,
                                    //   selectedOption
                                    // );
                                    manageEvents([
                                      {
                                        action: "manageAgendaPres",
                                        payload: {
                                          action: "updateAgenda",
                                          index: item.eventIndex,
                                          agendaIndex: 0,
                                          updatedAgenda: {
                                            agendaId: selectedOption?.value,
                                            agendaTitle: selectedOption?.label,
                                          },
                                        },
                                      },
                                    ]);
                                  }}
                                />
                              );
                            }}
                          />
                        </td>
                        <td className="text-center py-4 flex justify-center ">
                          <Controller
                            name={
                              `agenda_prestationArr[${index}].duration_hours` as any
                            }
                            control={control}
                            render={({ field }) => {
                              return (
                                <Select
                                  {...field}
                                  instanceId="select_hour_tb"
                                  placeholder=""
                                  options={Array.from(
                                    { length: 24 },
                                    (_, i) => ({
                                      value: i.toString().padStart(2, "0"),
                                      label: i.toString().padStart(2, "0"),
                                    })
                                  )}
                                  value={{
                                    label: item.duration_hours
                                      .toString()
                                      .padStart(2, "0"),
                                    value: item.duration_hours
                                      .toString()
                                      .padStart(2, "0"),
                                  }} // Use field.value
                                  styles={{
                                    ...selectHourStyles,
                                    container: (provided) => ({
                                      ...provided,
                                      width: "fit-content",
                                    }),
                                  }}
                                  onChange={(selectedOption) => {
                                    const newDurationHours = parseInt(
                                      selectedOption!.value
                                    );
                                    // updateDurationHour(newDurationHours, index);
                                    // setValue(
                                    //   `agenda_prestationArr[${index}].duration_hoursDB` as any,
                                    //   selectedOption
                                    // );
                                    // setValue(
                                    //   `agenda_prestationArr[${index}].duration_hours` as any,
                                    //   newDurationHours * 60
                                    // );

                                    // updateEventsTime({
                                    //   index: item.eventIndex,
                                    //   duration: newDurationHours * 60,
                                    //   select_type: "select_hour",
                                    //   idRes: item.res_id || "",
                                    // });
                                    const duration = newDurationHours * 60;
                                    manageEvents([
                                      {
                                        action: "updateEventsTime",
                                        payload: {
                                          index: item.eventIndex,
                                          duration,
                                          select_type: "select_hour",
                                          idRes: item.res_id || "",
                                        },
                                      },
                                      {
                                        action: "manageAgendaPres",
                                        payload: {
                                          action: "updateDurationHours",
                                          index: item.eventIndex,
                                          agendaIndex: 0,
                                          duration_hours: newDurationHours,
                                        },
                                      },
                                    ]);
                                  }}
                                />
                              );
                            }}
                          />
                          <span className="font-medium m-2">h</span>
                          <Controller
                            // name={`agenda_prestationArr[${index}].duration_minutes`}
                            name={
                              `agenda_prestationArr[${index}].duration_minutes` as any
                            }
                            control={control}
                            render={({ field }) => {
                              return (
                                <Select
                                  {...field}
                                  options={Array.from(
                                    { length: 60 },
                                    (_, i) => ({
                                      value: i.toString().padStart(2, "0"),
                                      label: i.toString().padStart(2, "0"),
                                    })
                                  )}
                                  value={{
                                    label: item.duration_minutes
                                      .toString()
                                      .padStart(2, "0"),
                                    value: item.duration_minutes
                                      .toString()
                                      .padStart(2, "0"),
                                  }}
                                  styles={{
                                    ...selectHourStyles,
                                    container: (provided) => ({
                                      ...provided,
                                      width: "fit-content",
                                    }),
                                  }}
                                  onChange={(selectedOption) => {
                                    const newDurationMinutes = parseInt(
                                      selectedOption!.value
                                    );
                                    // updateDurationMinutes(
                                    //   newDurationMinutes,
                                    //   index
                                    // );
                                    // // setValue(
                                    // //   `agenda_prestationArr[${index}].minutesDB` as any,
                                    // //   selectedOption
                                    // // );
                                    // setValue(
                                    //   `agenda_prestationArr[${index}].duration_minutes` as any,
                                    //   newDurationMinutes
                                    // );
                                    // updateEventsTime({
                                    //   index: item.eventIndex,
                                    //   duration: newDurationMinutes,
                                    //   select_type: "select_minutes",
                                    //   idAgenda:
                                    //     agenda_prestationArr[index].agenda
                                    //       .value,
                                    //   dateDB: dateTime.dateDB,
                                    // });
                                    const duration = newDurationMinutes;
                                    manageEvents([
                                      {
                                        action: "updateEventsTime",
                                        payload: {
                                          index: item.eventIndex,
                                          duration,
                                          select_type: "select_minutes",
                                          idRes: item.res_id || "",
                                        },
                                      },
                                      {
                                        action: "manageAgendaPres",
                                        payload: {
                                          action: "updateDurationMinutes",
                                          index: item.eventIndex,
                                          agendaIndex: 0,
                                          duration_minutes: newDurationMinutes,
                                        },
                                      },
                                    ]);
                                  }}
                                />
                              );
                            }}
                          />
                        </td>
                        <td className="text-center py-4">{item.prixTTC}</td>
                        <td className="text-center py-4 cursor-pointer ">
                          <Image
                            className="text-red-600 m-auto"
                            priority
                            alt="supprimer"
                            src={removeIcon}
                            onClick={() => {
                              // remove from Form values (function remove is in useFieldArray)
                              remove(item.index);
                              manageEvents([
                                {
                                  action: "remove",
                                  payload: {
                                    index: item.eventIndex,
                                  },
                                },
                              ]);
                              toggleEventSelected(item.eventIndex);
                              if (EventsIndices.length == 1) {
                                setActiveCreateSection(false);
                                setOnEditingEvent(false);
                              }
                            }}
                          />
                          {/* {agenda_prestationArr[index].res_id} */}
                          <input
                            name="eventIndex"
                            type="hidden"
                            value={item.eventIndex}
                          />
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2} className="border-r-2 bg-slate-800"></th>
                <th className="border-r-2 bg-slate-800 text-white">
                  {formatDuration(totalDuration) || "00h00"}
                </th>
                <th className="border-r-2 bg-slate-800 text-white">
                  {totalTTC.toFixed(2)} DH
                </th>
                <th className="border-r-2 bg-slate-800"></th>
              </tr>
            </tfoot>
          </table>
        </div>
        <PrestationSlider prestations={prestations} />
        <div>
          <label className="font-semibold">Notes:</label>
          <textarea
            id=""
            rows={4}
            className="border border-gray-300 rounded-md w-full mb-16"
            {...register("note")}
          ></textarea>
        </div>

        <div className="absolute bottom-3 w-full flex gap-2 justify-center">
          <button
            className=" flex gap-2 py-1 px-4 bg-gray-800 text-white rounded-md "
            onClick={() => cancelCreationEvent({ activeSection: "create" })}
            type="button"
          >
            <CiNoWaitingSign size={24} />
            Annuler
          </button>

          <button
            className="py-1 px-4 bg-[#fc8f3e] text-white rounded-md "
            type="submit"
            onClick={() => (submitTypeRef.current = "enregistrer")}
          >
            Enregistrer
          </button>
          {/* <Link href="/caisse"> */}
          <button
            className="py-1 px-4 bg-[#199821] text-white rounded-md "
            type="submit"
            onClick={() => (submitTypeRef.current = "encaisser")}
          >
            Encaisser <span className="text-lg font-extrabold">+</span>
          </button>
          {/* </Link> */}
        </div>
      </form>
    </div>
  );
}
