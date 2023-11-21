"use client";
import React, { useEffect, useRef, useState, useTransition } from "react";
import ModalClient from "./modalclient";
import Select, { InputProps } from "react-select";
// import { OptionsType, OptionTypeBase } from "react-select";
import PrestationSlider from "./prestationsSlider";
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
  openModal,
  removePrestation,
  formatDuration,
  handleOptionChangeAg,
  handleOptionChangeClt,
  handleOptionChangeTypeClt,
  saveReservat,
  cancelCreationEvent,
  calculateTotalDuration,
  calculateTotalPrices,
} from "@/app/js/agenda_fn";
import { useStore } from "@/app/store/store";
import { saveReservation } from "@/app/lib/reservatActions";

export default function CreateEventSection({
  clients,
  villes,
  collaborateurs,
  prestations,
  agendas,
}) {
  const {
    duration_hours,
    updateDurationHour,
    duration_minutes,
    updateDurationMinutes,
    agenda_prestationArr,
    eventAgenda,
    events,
    dateTime,
    setDateTime,
    totalPrice,
    totalDuration,
    updateEventsTime,
    updateEventDates,
    activeEventSection,
  } = useStore();

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
  // const [selectedAgenda, setSelectedAgenda] = useState();

  // Default style select
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
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "agenda_prestationArr",
  });

  useEffect(() => {
    // setSelectedAgenda(eventAgenda);
    calculateTotalDuration();
    calculateTotalPrices();
  }, [agenda_prestationArr, duration_hours, duration_minutes]);
  useEffect(() => {
    setValue("dateRes", dateTime.dateDB);
  }, [dateTime.dateDB]);
  useEffect(() => {
    setValue("hourDB", dateTime.hourDB);
  }, [dateTime.hourDB]);
  useEffect(() => {
    setValue("minutesDB", dateTime.minutesDB);
  }, [dateTime.minutesDB]);
  useEffect(() => {
    setValue("agenda_prestationArr", agenda_prestationArr);
    const clientData = agenda_prestationArr[0]?.client;
    const idRes = agenda_prestationArr[0]?.res_id;
    if (clientData) {
      setValue("client", {
        label: clientData.label,
        value: clientData.value,
      });
    } else {
      // setValue("client", { label: "Sélectionnez un client", value: "" });
    }
    if (idRes) {
      setValue("idRes", idRes);
    } else {
      setValue("idRes", "");
    }
  }, [agenda_prestationArr]);
  useEffect(() => {
    if (events && events.length > 0) {
      if (events.length > 0) {
        // console.log("events", events);
        const eventTemp = events.find((event: any) => event.isTemp == true);
        // console.log("eventTemp", eventTemp);
        if (eventTemp) {
          // console.log("eventTemp", eventTemp);
          const dateDB = eventTemp.start.split("T")[0];
          const hourDB = {
            value: (eventTemp.start.split("T")[1].split(":")[0] || "")
              .toString()
              .padStart(2, "0"),
            label: (eventTemp.start.split("T")[1].split(":")[0] || "")
              .toString()
              .padStart(2, "0"),
          };
          const minutesDB = {
            value: (eventTemp.start.split("T")[1].split(":")[1] || "")
              .toString()
              .padStart(2, "0"),
            label: (eventTemp.start.split("T")[1].split(":")[1] || "")
              .toString()
              .padStart(2, "0"),
          };
          setDateTime({ dateDB, hourDB, minutesDB });
        }
      }
    }
  }, [events]);
  const [isPending, startTransition] = useTransition();

  const handleSaveReservat: any = async (data) => {
    startTransition(() => {
      saveReservation(data);
    });
  };

  return (
    <div
      className={`relative   h-fit w-full ${
        !activeEventSection ? "hidden" : ""
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
            onChange={(event) =>
              handleOptionChangeTypeClt(event, setIsRef, setSelectedClientType)
            }
          />
          <label htmlFor="client_ref">client référencer</label>
          <input
            type="radio"
            name="client_type"
            id="client_psg"
            value="client_psg"
            checked={selectedClientType === "client_psg"}
            onChange={(event) =>
              handleOptionChangeTypeClt(event, setIsRef, setSelectedClientType)
            }
          />
          <label htmlFor="client_psg">client de passage</label>
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
                  placeholder="Sélectionnez un Clients"
                  // defaultValue={{
                  //   label: agenda_prestationArr[0]?.client.label || "0",
                  //   value: agenda_prestationArr[0]?.client.value || "0",
                  // }}

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
              onChange={(e) => {
                setDateTime({
                  ...dateTime,
                  dateDB: e.target.value,
                });
                updateEventDates(e.target.value);
                // setValue("dateRes", dateTime.dateDB);
              }}
              value={dateTime.dateDB}

              // value={"2023-03-11"}
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
                    value={dateTime.hourDB}
                    styles={{ ...selectHourStyles }}
                    onChange={(selectedOption) => {
                      setDateTime({
                        ...dateTime,
                        hourDB: {
                          label: selectedOption?.value
                            .toString()
                            .padStart(2, "0") as string,
                          value: selectedOption?.value
                            .toString()
                            .padStart(2, "0") as string,
                        },
                      });
                      const new_hours = parseInt(selectedOption!.value); //example:2 * 60 = 120(new duration) = 2h
                      const duration_hours =
                        (new_hours - parseInt(dateTime.hourDB.value)) * 60;

                      duration_hours &&
                        updateEventsTime({
                          index: 0,
                          duration: duration_hours,
                          select_type: "select_hour",
                          globalChange: true,
                        });
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
                    value={dateTime.minutesDB}
                    styles={{ ...selectHourStyles }}
                    onChange={(selectedOption) => {
                      setDateTime({
                        ...dateTime,
                        minutesDB: {
                          label: selectedOption?.value
                            .toString()
                            .padStart(2, "0") as string,
                          value: selectedOption?.value
                            .toString()
                            .padStart(2, "0") as string,
                        },
                      });
                      const new_minutes = parseInt(selectedOption!.value); //example:2 * 60 = 120(new duration) = 2h
                      const duration_minutes =
                        new_minutes - parseInt(dateTime.minutesDB.value);

                      // duration_minutes always > 0

                      duration_minutes &&
                        updateEventsTime({
                          index: 0,
                          duration: duration_minutes,
                          select_type: "select_minutes",
                          globalChange: true,
                        });
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div>
            <label className="font-semibold">Fin:</label>
            <div className="flex items-center mt-2 ">
              <p className="hour_fn">
                {totalDuration != 0
                  ? formatDuration(
                      totalDuration +
                        (parseInt(dateTime.hourDB.value) * 60 +
                          parseInt(dateTime.minutesDB.value))
                    )
                  : ""}
              </p>
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
                // agenda_prestationArr.map((ag_pr: any, index: any) => {
                //   let hours = Math.floor(ag_pr.duree / 60);
                //   let minutes = ag_pr.duree % 60;
                fields.map((item, index) => {
                  // console.log(item);
                  return (
                    <tr key={index}>
                      <input
                        type="hidden"
                        name={`agenda_prestationArr[${index}].ligne_id`}
                        value={agenda_prestationArr[index]?.ligne_id || ""}
                      />
                      <td className="text-center py-4">{item.intitule}</td>
                      <td className="py-4">
                        <Controller
                          name={`agenda_prestationArr[${index}].agenda`}
                          control={control}
                          render={({ field }) => {
                            useEffect(() => {
                              // Set the initial value when the component mounts
                              const initialValue = agendaOptions.find(
                                (option) => option.value === item.agenda.value
                              );
                              setValue(
                                `agenda_prestationArr[${index}].agenda`,
                                initialValue
                              );
                            }, [item.agenda]); // Use item.agenda as a dependency

                            return (
                              <Select
                                {...field}
                                name={`agenda_prestationArr[${index}].agenda`}
                                instanceId={`select_Agenda_${index}`}
                                placeholder="Sélectionnez un Agendas"
                                options={agendaOptions}
                                value={field.value} // Use field.value
                                styles={{
                                  ...selectDefaultStyle,
                                  container: (provided) => ({
                                    ...provided,
                                    width: "300px",
                                  }),
                                }}
                                onChange={(selectedOption) => {
                                  setValue(
                                    `agenda_prestationArr[${index}].agenda`,
                                    selectedOption
                                  );
                                }}
                              />
                            );
                          }}
                        />
                      </td>
                      <td className="text-center py-4 flex justify-center ">
                        <Controller
                          name={
                            `agenda_prestationArr[${index}].duration_hoursDB` as any
                          }
                          control={control}
                          render={({ field }) => {
                            useEffect(() => {
                              // Set the initial value when the component mounts
                              const initialHour = Math.floor(item.duree / 60)
                                .toString()
                                .padStart(2, "0");
                              setValue(
                                `agenda_prestationArr[${index}].duration_hoursDB` as any,
                                {
                                  label: initialHour,
                                  value: initialHour,
                                }
                              );
                              console.log("duree", item.duration_hours);
                            }, [item.duration_hours]); // Use item.duree as a dependency

                            return (
                              <Select
                                {...field}
                                instanceId="select_hour_tb"
                                placeholder=""
                                options={Array.from({ length: 24 }, (_, i) => ({
                                  value: i.toString().padStart(2, "0"),
                                  label: i.toString().padStart(2, "0"),
                                }))}
                                value={field.value} // Use field.value
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
                                  updateDurationHour(newDurationHours, index);

                                  setValue(
                                    `agenda_prestationArr[${index}].duration_hoursDB` as any,
                                    selectedOption
                                  );

                                  setValue(
                                    `agenda_prestationArr[${index}].duration_hours` as any,
                                    newDurationHours * 60
                                  );
                                  updateEventsTime({
                                    index: item.eventIndex,
                                    duration: newDurationHours * 60,
                                    select_type: "select_hour",
                                    idAgenda:
                                      agenda_prestationArr[index].agenda.value,
                                    dateDB: dateTime.dateDB,
                                    idRes: item.res_id || "",
                                  });
                                }}
                              />
                            );
                          }}
                        />

                        <span className="font-medium m-2">h</span>
                        <Controller
                          name={`agenda_prestationArr[${index}].duration_minutesDB`}
                          control={control}
                          render={({ field }) => {
                            useEffect(() => {
                              // Set the initial value when the component mounts
                              const initialMinutes = (item.duree % 60)
                                .toString()
                                .padStart(2, "0");
                              setValue(
                                `agenda_prestationArr[${index}].duration_minutesDB` as any,
                                {
                                  label: initialMinutes,
                                  value: initialMinutes,
                                }
                              );
                            }, [item.duree]); // Use item.duree as a dependency

                            return (
                              <Select
                                {...field}
                                options={Array.from({ length: 60 }, (_, i) => ({
                                  value: i.toString().padStart(2, "0"),
                                  label: i.toString().padStart(2, "0"),
                                }))}
                                value={field.value} // Use field.value
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
                                  updateDurationMinutes(
                                    newDurationMinutes,
                                    index
                                  );

                                  // setValue(
                                  //   `agenda_prestationArr[${index}].minutesDB` as any,
                                  //   selectedOption
                                  // );

                                  setValue(
                                    `agenda_prestationArr[${index}].duration_minutes` as any,
                                    newDurationMinutes
                                  );

                                  updateEventsTime({
                                    index: item.eventIndex,
                                    duration: newDurationMinutes,
                                    select_type: "select_minutes",

                                    idAgenda:
                                      agenda_prestationArr[index].agenda.value,
                                    dateDB: dateTime.dateDB,
                                  });
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
                          onClick={() =>
                            removePrestation(item.eventIndex, index)
                          }
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
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2} className="border-r-2 bg-slate-800"></th>
                <th className="border-r-2 bg-slate-800 text-white">
                  {formatDuration(totalDuration) || "00h00"}
                </th>
                <th className="border-r-2 bg-slate-800 text-white">
                  {totalPrice.toFixed(2)} DH
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
            onClick={cancelCreationEvent}
            type="button"
          >
            <img src="https://circumicons.com/icon/no_waiting_sign?size=24&fill=ffffff" />
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
