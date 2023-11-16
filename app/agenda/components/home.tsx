// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { useStore } from "@/app/store/store";
import { processReservations } from "@/app/js/agenda_fn";
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
  const {
    addEvent,
    updateEvent,
    events,
    setAddedEventId,
    setDateTime,
    setEventAgenda,
    addAllAgendaPres,
    addDurationHour,
    addDurationMinutes,
    resetDurationHour,
    savedEvents,
    resetDurationMinutes,
  } = useStore();
  const [activeEventSection, setActiveEventSection] = useState(false);
  const [eventInfo, setEventInfo] = useState<any>({
    dateRes: "",
    hourDB: "",
    minuteDB: "",
  });
  useEffect(() => {
    processReservations(reservations);
  }, []);

  const handleAddEvent = (arg: any) => {
    if (arg.hasOwnProperty("resource")) {
      // update active state for showing  the create event section
      setActiveEventSection(() => true);
      const lastIndex = events.findLastIndex((event: any) => event);
      let newEvent = {
        start: arg.dateStr,
        resourceId: arg.resource.id,
        editable: true,
        backgroundColor: "#6FA5C0",
        borderColor: "#6FA5C0",
        textColor: "#FFFFFF",
        border: "none",
        isTemp: true,
        eventIndex: "",
      };
      setEventAgenda({
        label: arg.resource.title,
        value: parseInt(newEvent.resourceId),
      });
      // Update the events array with the new event
      // setEvents([...events, newEvent]);
      const existTemp = events.findIndex((event: any) => event.isTemp == true);
      // //  && event.saved == false
      if (existTemp == -1) {
        newEvent = { ...newEvent, eventIndex: lastIndex + 1 };
        addEvent(newEvent);
      } else {
        const index = existTemp;
        newEvent = { ...newEvent, eventIndex: lastIndex };
        updateEvent(newEvent, index);
      }
      setAddedEventId(newEvent.resourceId);

      resetDurationHour();
      resetDurationMinutes();
      addAllAgendaPres([]);
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
    setDateTime(newDate);
  };
  const handleUpdateEvent = (info: any) => {
    // console.log(info.event.extendedProps);
    // return;
    if (info.event.extendedProps.idRes) {
      setActiveEventSection(() => true);
      let hours: number = 0,
        minutes: number = 0;
      resetDurationHour();
      resetDurationMinutes();
      addAllAgendaPres([]);
      const eventIndex = parseInt(info.event.extendedProps.eventIndex);
      const data = events
        .filter((res: any) => res.idRes == info.event.extendedProps.idRes)
        .map((res: any, index: number) => {
          // console.log(res);
          let rowIndex = index == 0 ? eventIndex : eventIndex + 1;
          // return {
          //   eventIndex: res.eventIndex,
          //   res_id: res.id,
          //   id_art: res.prest_id,
          //   ligne_id: res.ligne_id,
          //   intitule: res.prest_title,
          //   dateDB: res.dateRes,
          //   prixTTC: res.prest_prix,
          //   hourDB: res.prest_heurDB,
          //   duree: res.prest_duree,
          //   duration_hours: Math.floor(res.prest_duree / 60) * 60,
          //   duration_minutes: Math.floor(res.prest_duree % 60),
          //   agenda: { label: res.prest_agenda, value: res.prest_idAgenda },
          //   client: { label: res.client, value: res.idClient },
          // };
          return {
            eventIndex: res.eventIndex,
            res_id: res.idRes,
            id_art: res.id_art,
            ligne_id: res.ligne_id,
            intitule: res.title,
            dateDB: res.start.split("T")[0],
            prixTTC: res.prest_prix,
            hourDB: res.hourDB,
            duree: res.duree,
            duration_hours: Math.floor(res.duree / 60) * 60,
            duration_minutes: Math.floor(res.duree % 60),
            agenda: { label: res.agenda.label, value: res.agenda.value },
            client: { label: res.client.label, value: res.client.value },
          };
        });
      console.log(data);
      addAllAgendaPres(data);
      const dateTimeString = info.event.start;
      let date = new Date(dateTimeString);
      const formatted_date = date.toISOString();
      const dateDB = formatted_date.split("T")[0];
      // const hourDB = formatted_date.split("T")[1].split(":")[0];
      // const minutesDB = formatted_date.split("T")[1].split(":")[1];
      const hourDB = info.event.extendedProps.hourDB.split(":")[0];
      const minutesDB = info.event.extendedProps.hourDB.split(":")[1];
      // setDateTime({date.toISOString().split("T")[0]);
      setDateTime({
        dateDB,
        hourDB: { label: hourDB, value: hourDB },
        minutesDB: { label: minutesDB, value: minutesDB },
      });
      // console.log(info.event.extendedProps.hourDB);
      hours = parseInt(info.event.extendedProps.duree) / 60;
      minutes = parseInt(info.event.extendedProps.duree) % 60;
      addDurationHour(Math.floor(hours));
      addDurationMinutes(Math.floor(minutes));
    }
  };
  return (
    <div className="flex  gap-10  h-full   ">
      <CreateEventSection
        active={activeEventSection}
        setActive={setActiveEventSection}
        clients={clients}
        villes={villes}
        collaborateurs={collaborateurs}
        prestations={prestations}
        agendas={agendas}
      />
      <MyCalendar
        handleAddEvent={handleAddEvent}
        handleEventDrop={handleEventDrop}
        handleUpdateEvent={handleUpdateEvent}
        active={activeEventSection}
        agendas={agendas}
        periods={periods}
        eventInfo={eventInfo}
      />
    </div>
  );
}
