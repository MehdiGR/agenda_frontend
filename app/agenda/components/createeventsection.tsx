"use client";
import React, { useEffect, useRef, useState } from "react";
import ModalClient from "./modalclient";
import Select from "react-select";
// import { OptionsType, OptionTypeBase } from "react-select";
import PrestationSlider from "./prestationsSlider";
import { Controller, useFieldArray, useForm } from "react-hook-form";
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

export default function CreateEventSection({
  active,
  setActive,
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
    dateEventDates,
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
    console.log("duration_hours", duration_hours);
  }, [duration_hours]);
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
    const idRes = agenda_prestationArr[0]?.id_res;
    if (clientData) {
      setValue("client", {
        label: clientData.label,
        value: clientData.value,
      });
    }
    if (idRes) {
      setValue("idRes", idRes);
    }
  }, [agenda_prestationArr]);
  useEffect(() => {
    if (events && events.length > 0) {
      if (events.length == 1) {
        const dateDB = events[0].start.split("T")[0];
        const hourDB = {
          value: (events[0].start.split("T")[1].split(":")[0] || "")
            .toString()
            .padStart(2, "0"),
          label: (events[0].start.split("T")[1].split(":")[0] || "")
            .toString()
            .padStart(2, "0"),
        };
        const minutesDB = {
          value: (events[0].start.split("T")[1].split(":")[1] || "")
            .toString()
            .padStart(2, "0"),
          label: (events[0].start.split("T")[1].split(":")[1] || "")
            .toString()
            .padStart(2, "0"),
        };
        setDateTime({ dateDB, hourDB, minutesDB });
      }
    }
  }, [events]);

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
          // defaultValue={agenda_prestationArr[0]?.id_res}
          // value={agenda_prestationArr[0]?.id_res}
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
                dateEventDates(e.target.value);
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
                      console.log(duration_hours);

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
                      console.log("duration_minutes", duration_minutes);

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
                      <td className="text-center py-4">{item.intitule}</td>
                      <td className="py-4">
                        <Select
                          // defaultValue={item.agenda}
                          className="m-auto"
                          instanceId="select_Agenda"
                          placeholder="Sélectionnez un Agendas"
                          options={agendaOptions}
                          defaultValue={{
                            label: item.agenda?.label || eventAgenda.label,
                            value: item.agenda?.value || eventAgenda.value,
                          }}
                          styles={{
                            ...selectDefaultStyle,
                            container: (provided) => ({
                              ...provided,
                              width: "300px",
                            }),
                          }}
                          onChange={(selectedOption) => {
                            // handleOptionChangeAg(
                            //   selectedAgenda,
                            //   setSelectedAgenda
                            // )
                            setValue(
                              `agenda_prestationArr[${index}].agenda` as any,
                              selectedOption!.value
                            );
                          }}
                        />
                      </td>
                      <td className="text-center py-4 flex justify-center ">
                        <Controller
                          name={`agenda_prestationArr[${index}].hourDB`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              instanceId="select_hour_tb"
                              placeholder=""
                              options={Array.from({ length: 24 }, (_, i) => ({
                                value: i.toString().padStart(2, "0"),
                                label: i.toString().padStart(2, "0"),
                              }))}
                              defaultValue={{
                                value: Math.floor(item.duree / 60)
                                  .toString()
                                  .padStart(2, "0"),
                                label: Math.floor(item.duree / 60)
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
                                updateDurationHour(
                                  parseInt(selectedOption!.value),
                                  index
                                );

                                const new_duration_hours =
                                  parseInt(selectedOption!.value) * 60; //example:2 * 60 = 120(new duration) = 2h

                                setValue(
                                  `agenda_prestationArr[${index}].duration_hours` as any,
                                  new_duration_hours
                                );
                                //

                                updateEventsTime({
                                  index,
                                  duration: new_duration_hours,
                                  select_type: "select_hour",
                                });
                                // setValue(
                                //   `agenda_prestation[${index}].hourDB` as any,
                                //   item.hourDB
                                // );
                              }}
                            />
                          )}
                        />
                        <span className="font-medium m-2">h</span>
                        <Controller
                          name={`agenda_prestationArr[${index}].minutesDB`}
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              options={Array.from({ length: 60 }, (_, i) => ({
                                value: i.toString().padStart(2, "0"),
                                label: i.toString().padStart(2, "0"),
                              }))}
                              defaultValue={{
                                value: (item.duree % 60)
                                  .toString()
                                  .padStart(2, "0"),
                                label: (item.duree % 60)
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
                                updateDurationMinutes(
                                  parseInt(selectedOption!.value),
                                  index
                                );
                                const new_duration_minutes = parseInt(
                                  selectedOption!.value
                                );

                                setValue(
                                  `agenda_prestationArr[${index}].duration_minutes` as any,
                                  new_duration_minutes
                                );
                                //

                                updateEventsTime({
                                  index,
                                  duration: new_duration_minutes,
                                  select_type: "select_minutes",
                                });
                                // onChange(duration_minutes);
                              }}
                            />
                          )}
                        />
                      </td>
                      <td className="text-center py-4">{item.prixTTC}</td>
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
            className="py-1 px-4 bg-gray-800 text-white rounded-md "
            onClick={() => cancelCreationEvent(setActive)}
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
