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
  const [eventInfo, setEventInfo] = useState<any>({
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
    // const updatedEvents = [...events, newEvent];
    const updatedEvents = [newEvent];

    // Update the events array with the new event
    setEvents(updatedEvents);
    setAddedEventId(newEvent.resourceId);
    const [datePart, timePart] = newEvent.start.split("T");
    const [hour, minutes] = timePart.split(":");
    setEventInfo({ dateRes: datePart, hourDB: hour, minuteDB: minutes });

    // arg.dayEl.style.backgroundColor = "red";
  };
  const handleUpdateEvent = () => {
    const updatedEvents = [...events]; // Clone the existing events array
    // const updatedEventIndex = 0; // Index of the event to update
    const updatedEventIndex = updatedEvents.findIndex(
      (item) => item.resourceId == addedEventId
    );
    updatedEvents[updatedEventIndex] = {
      ...updatedEvents[updatedEventIndex],
      start:
        eventInfo?.dateRes +
        "T" +
        parseInt(eventInfo.hourDB + 1) +
        ":" +
        eventInfo.minutesDB, // New start date and time
      end:
        eventInfo?.dateRes +
        "T" +
        parseInt(eventInfo.hourDB + 1) +
        ":" +
        eventInfo.minutesDB, // New end date and time
      // end: "2023-10-03T16:00:00", // New end date and time
    };
    setEvents(updatedEvents); // Update the state with the new event data
    const [datePart, timePart] =
      updatedEvents[updatedEventIndex].start.split("T");
    const [hour, minutes] = timePart.split(":");
  };
  // useEffect(() => {
  //   handleUpdateEvent();
  // }, [eventInfo]);

  // useEffect(() => {
  //   console.log(events);
  // }, [events]);

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
        setEventInfo={setEventInfo}
        eventInfo={eventInfo}
        events={events}
      />
      <MyCalendar
        handleAddEvent={handleAddEvent}
        active={activeEventSection}
        events={events}
        agendas={agendas}
        periods={periods}
        eventInfo={eventInfo}
      />
    </div>
  );
}
