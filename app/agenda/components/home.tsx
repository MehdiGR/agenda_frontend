// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { Props, ScriptProps } from "next/script";

export default function Home({
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
  agendas,
}) {
  useEffect(() => {
    // console.log(props.clients);
    //   console.log(props);
  }, []);
  const [activeEventSection, setActiveEventSection] = useState(false);
  const [events, setEvents] = useState([{}]);
  const [eventAgenda, setEventAgenda] = useState({});
  const [addedEventId, setAddedEventId] = useState(null);
  // const [highlightedEventId, setHighlightedEventId] = useState(null);

  const handleDateClick = (arg: any) => {
    const resourceId = arg.resource.title;
    // update active state for showing  the create event section
    setActiveEventSection(() => true);
    const newEvent = {
      title: arg.resource.title,
      start: arg.dateStr,
      resourceId: arg.resource.id,
    };
    setEventAgenda({
      label: newEvent.title,
      value: parseInt(newEvent.resourceId),
    });
    const updatedEvents = [...events, newEvent];

    // Update the events array with the new event
    setEvents(updatedEvents);
    setAddedEventId(newEvent.resourceId);
    // arg.dayEl.style.backgroundColor = "red";
  };
  const handleEventResize = (arg: any) => {
    // Update the event's end time based on the resized value
    const updatedEvent = {
      ...arg.event,
      end: arg.end,
    };

    // Update the event in your data source or state
    // For example, if you have an events array in your state:
    const updatedEvents = events.map((event: any) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );
    setEvents(updatedEvents);
  };
  const handleEventRender = (info: any) => {
    // console.log("s" + addedEventId);
    // console.log(info.event._def.resourceIds[0]);
    // Check if the event ID matches the addedEventId state

    if (info.event._def.resourceIds[0] === addedEventId) {
      // Apply a custom CSS class to the event element
      // info.el.classList.add("added-event");
      // info.backgroundColor = "red";
      // console.log(info.borderColor);
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
        eventAgenda={eventAgenda}
      />
      <MyCalendar
        handleDateClick={handleDateClick}
        handleEventResize={handleEventResize}
        active={activeEventSection}
        events={events}
        agendas={agendas}
        addedEventId={addedEventId}
        handleEventRender={handleEventRender}
      />
    </div>
  );
}
