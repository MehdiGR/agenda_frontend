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
      const newEvent = {
        // title: arg.resource.title,
        start: arg.dateStr,
        resourceId: arg.resource.id,
        editable: true,
        backgroundColor: "#6FA5C0",
        borderColor: "#6FA5C0",
        textColor: "#FFFFFF",
        border: "none",
        isTemp: true,
      };
      setEventAgenda({
        label: arg.resource.title,
        value: parseInt(newEvent.resourceId),
      });
      // Update the events array with the new event
      // setEvents([...events, newEvent]);
      const existTemp = events.findIndex((event: any) => event.isTemp == true);
      if (existTemp == -1) {
        addEvent(newEvent);
      } else {
        const index = existTemp;
        updateEvent(newEvent, index);
      }
      setAddedEventId(newEvent.resourceId);
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
    setActiveEventSection(() => true);
    const data = reservations
      .filter((res: any) => res.id == info.event.id)
      .map((res: any) => ({
        id_res: res.id,
        id_pres: res.prest_id,
        intitule: res.prest_title,
        dateDB: res.dateRes, // Uncomment this line if needed
        prixTTC: res.prest_prix,
        hourDB: res.prest_heurDB.value, // Uncomment this line if needed
        duree: res.prest_duree,
        agenda: { label: res.prest_agenda, value: res.prest_idAgenda },
        client: { label: res.idClient, value: res.client },
        id_agenda: res.prest_idAgenda,
      }));
    console.log(data);
    addAllAgendaPres(data);
    const dateTimeString = info.event.start;
    let date = new Date(dateTimeString);
    const formatted_date = date.toISOString();
    const dateDB = formatted_date.split("T")[0];
    const hourDB = formatted_date.split("T")[1].split(":")[0];
    const minutesDB = formatted_date.split("T")[1].split(":")[1];
    // setDateTime({date.toISOString().split("T")[0]);
    setDateTime({
      dateDB,
      hourDB: { label: hourDB, value: hourDB },
      minutesDB: { label: minutesDB, value: minutesDB },
    });
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
