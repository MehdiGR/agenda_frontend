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
  const [events, setEvents] = useState([{}]);
  const [eventAgenda, setEventAgenda] = useState({});
  const [addedEventId, setAddedEventId] = useState(null);
  // const [highlightedEventId, setHighlightedEventId] = useState(null);

  const handleAddClick = (arg: any) => {
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
    // arg.dayEl.style.backgroundColor = "red";
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
        eventAgenda={eventAgenda}
      />
      <MyCalendar
        handleAddClick={handleAddClick}
        active={activeEventSection}
        events={events}
        agendas={agendas}
        periods={periods}
      />
    </div>
  );
}
