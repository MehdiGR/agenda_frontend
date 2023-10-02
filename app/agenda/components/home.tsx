// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";

export default function Home({
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
  agendas,
  periods,
}) {
  const [activeEventSection, setActiveEventSection] = useState(false);
  const [events, setEvents] = useState<any>([]);
  const [eventAgenda, setEventAgenda] = useState({});
  const [agendaInfo, setAgendaInfo] = useState<any>({
    dateRes: "",
    hourDB: "",
    minuteDB: "",
  });
  const [addedEventId, setAddedEventId] = useState(null);
  // const [highlightedEventId, setHighlightedEventId] = useState(null);

  const handleAddEvent = (arg: any) => {
    // update active state for showing  the create event section
    setActiveEventSection(() => true);
    const newEvent = {
      // title: arg.resource.title,
      start: arg.dateStr,
      resourceId: arg.resource.id,
      editable: true,
      classNames: ["added-event"],
      backgroundColor: "blue",
      borderColor: "darkblue",
    };
    setEventAgenda({
      label: arg.resource.title,
      value: parseInt(newEvent.resourceId),
    });
    const updatedEvents = [...events, newEvent];

    // Update the events array with the new event
    setEvents(updatedEvents);
    setAddedEventId(newEvent.resourceId);
    const [datePart, timePart] = newEvent.start.split("T");
    const [hour, minutes] = timePart.split(":");
    setAgendaInfo({ dateRes: datePart, hourDB: hour, minuteDB: minutes });
    // arg.dayEl.style.backgroundColor = "red";
  };
  const handleUpdateEvent = () => {
    const newEvents = [...events]; // Clone the existing events array
    // const updatedEventIndex = 0; // Index of the event to update
    const updatedEventIndex = newEvents.findIndex(
      (item) => item.resourceId == addedEventId
    );
    newEvents[updatedEventIndex] = {
      ...newEvents[updatedEventIndex],
      start:
        agendaInfo?.dateRes +
        "T" +
        parseInt(agendaInfo.hourDB + 1) +
        ":" +
        agendaInfo.minutesDB, // New start date and time
      end:
        agendaInfo?.dateRes +
        "T" +
        parseInt(agendaInfo.hourDB + 1) +
        ":" +
        agendaInfo.minutesDB, // New end date and time
      // end: "2023-10-03T16:00:00", // New end date and time
    };
    setEvents(newEvents); // Update the state with the new event data
  };
  useEffect(() => {
    if (agendaInfo != "") handleUpdateEvent();
    console.log(addedEventId);
  }, [agendaInfo]);
  useEffect(() => {
    // console.log(events);
  }, [events]);

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
        eventAgenda={eventAgenda}
        setAgendaInfo={setAgendaInfo}
        agendaInfo={agendaInfo}
      />
      <MyCalendar
        handleAddEvent={handleAddEvent}
        active={activeEventSection}
        events={events}
        agendas={agendas}
        periods={periods}
        agendaInfo={agendaInfo}
      />
    </div>
  );
}
