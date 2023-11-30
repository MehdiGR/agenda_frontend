// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { useStore } from "@/app/store/store";
import { useStore_new2 } from "@/app/store/store_new2";
import { processReservations } from "@/app/js/agenda_fn";
import UpdateEventSection from "./updateeventsection";
export default function Home({
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
  agendas,
  periods,
  reservations,
}) {
  // const {
  //   addEvent,
  //   updateEvent,
  //   events,
  //   setAddedEventId,
  //   setDateTime,
  //   setEventAgenda,
  //   addAllAgendaPres,
  //   addDurationHour,
  //   addDurationMinutes,
  //   resetDurationHour,
  //   resetDurationMinutes,
  //   onEditingEvent,
  //   setOnEditingEvent,
  //   // setActiveCreateSection,
  // } = useStore();
  const {
    manageEvents,
    activeCreateSection,
    activeUpdateSection,
    setActiveCreateSection,
    setActiveUpdateSection,
    toggleEventSelected,
    events,
    onEditingEvent,
    setOnEditingEvent,
    setIdRes,
  } = useStore_new2();
  // const [activeCreateSection, setActiveCreateSection] = useState(false);

  useEffect(() => {
    processReservations(reservations);
    setActiveCreateSection(false);
    setOnEditingEvent(false);
  }, [reservations]);

  const handleAddEvent = (arg: any) => {
    if (arg.hasOwnProperty("resource") && onEditingEvent == false) {
      // update active state for showing  the create event section
      // setActiveCreateSection(() => true);
      const lastIndex = events.findLastIndex((event: any) => event);
      let newEvent = {
        start: arg.dateStr,
        resourceId: arg.resource.id,
        resourceTitle: arg.resource.title,
        editable: true,
        backgroundColor: "#6FA5C0",
        borderColor: "#6FA5C0",
        textColor: "#FFFFFF",
        border: "none",
        isTemp: true,
        eventIndex: "",
      };
      // setEventAgenda({
      //   label: arg.resource.title,
      //   value: parseInt(newEvent.resourceId),
      // });
      // Update the events array with the new event
      // setEvents([...events, newEvent]);
      const existTemp = events.findIndex((event: any) => event.isTemp == true);
      // //  && event.saved == false
      if (existTemp == -1) {
        newEvent = { ...newEvent, eventIndex: lastIndex + 1 };
        // addEvent(newEvent);
        manageEvents([{ action: "add", payload: { newEvent } }]);
        toggleEventSelected(lastIndex + 1);
      } else {
        const index = existTemp;
        const updatedEvent = { ...newEvent, eventIndex: lastIndex };
        // updateEvent(newEvent, index);
        // toggleEventSelected(lastIndex);
        manageEvents([{ action: "update", payload: { updatedEvent, index } }]);
      }

      // setAddedEventId(newEvent.resourceId);

      // resetDurationHour();
      // resetDurationMinutes();
      // addAllAgendaPres([]);
      // setActiveCreateSection(true);
      setOnEditingEvent(true);
      setActiveCreateSection(true);
    }
  };
  const handleEventDrop = (arg: any) => {
    const dateTimeString = arg.event.start;
    let date = new Date(dateTimeString);

    // const dateObj = new Date(arg.event.start);
    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");
    let formattedDate = date.toISOString().split("T")[0];
    const newDate = {
      dateDB: formattedDate,
      hourDB: { label: hours, value: hours },
      minutesDB: { label: minutes, value: minutes },
    };
    // setDateTime(newDate);
  };
  const handleUpdateEvent = (info: any) => {
    // return;
    if (info.event.extendedProps.idRes && onEditingEvent == false) {
      console.log(info.event.extendedProps);

      setOnEditingEvent(true);
      // setIdRes(info.event.extendedProps.idRes);
      const idRes = info.event.extendedProps.idRes;
      const Indices = events
        .filter((res: any) => res.idRes == idRes)
        .map((res: any) => res.eventIndex);
      toggleEventSelected(Indices);
      setActiveUpdateSection(() => true);
      return;
      // let hours: number = 0,
      //   minutes: number = 0;
      // resetDurationHour();
      // resetDurationMinutes();
      // addAllAgendaPres([]);
      // const eventIndex = parseInt(info.event.extendedProps.eventIndex);
      // let agendaPresIndices: any = [];
      // const data = events
      //   .filter((res: any) => res.idRes == info.event.extendedProps.idRes)
      //   .map((res: any, index: number) => {
      //     // console.log(res);
      //     let rowIndex = index == 0 ? eventIndex : eventIndex + 1;
      //     agendaPresIndices.push(res.eventIndex);
      //     return {
      //       eventIndex: res.eventIndex,
      //       res_id: res.idRes,
      //       id_art: res.id_art,
      //       ligne_id: res.ligne_id,
      //       intitule: res.title,
      //       dateDB: res.start.split("T")[0],
      //       prixTTC: res.prixTTC,
      //       hourDB: `${res.hourDB}:${res.minutesDB}`,
      //       duree: res.duree,
      //       duration_hours: Math.floor(res.duree / 60) * 60,
      //       duration_minutes: Math.floor(res.duree % 60),
      //       agenda: { label: res.agenda.label, value: res.agenda.value },
      //       client: { label: res.client.label, value: res.client.value },
      //     };
      //   });
      // console.log(data);
      return;
      // addAllAgendaPres(data);
      // manageEvents("manageAgendaPres", { Agendas: data, action: "add_all" });
      const dateTimeString = info.event.start;
      let date = new Date(dateTimeString);
      const formatted_date = date.toISOString();
      toggleEventSelected(agendaPresIndices);
      manageEvents([
        {
          action: "manageAgendaPres",
          payload: {
            agendas: data,
            action: "add_all",
          },
        },
        {
          action: "updateDates",
          payload: {
            newDate: formatted_date,
          },
        },
      ]);

      // const dateDB = formatted_date.split("T")[0];
      // const hourDB = formatted_date.split("T")[1].split(":")[0];
      // const minutesDB = formatted_date.split("T")[1].split(":")[1];
      // const hourDB = info.event.extendedProps.hourDB;
      // const minutesDB = info.event.extendedProps.minutesDB;
      // console.log(info.event.extendedProps);
      // setDateTime({date.toISOString().split("T")[0]);
      // setDateTime({
      //   dateDB,
      //   hourDB: { label: hourDB, value: hourDB },
      //   minutesDB: { label: minutesDB, value: minutesDB },
      // });
      // console.log(info.event.extendedProps.hourDB);
      // hours = parseInt(info.event.extendedProps.duree) / 60;
      // minutes = parseInt(info.event.extendedProps.duree) % 60;
      // addDurationHour(Math.floor(hours));
      // addDurationMinutes(Math.floor(minutes));
      setOnEditingEvent(true);
    }
  };
  return (
    <div className="flex  gap-10  h-full   ">
      {activeCreateSection && (
        <CreateEventSection
          clients={clients}
          villes={villes}
          collaborateurs={collaborateurs}
          prestations={prestations}
          agendas={agendas}
        />
      )}
      {activeUpdateSection && (
        <UpdateEventSection
          clients={clients}
          villes={villes}
          collaborateurs={collaborateurs}
          prestations={prestations}
          agendas={agendas}
        />
      )}
      <MyCalendar
        handleAddEvent={handleAddEvent}
        handleEventDrop={handleEventDrop}
        handleUpdateEvent={handleUpdateEvent}
        agendas={agendas}
      />
    </div>
  );
}
