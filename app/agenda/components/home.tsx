// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { useStore } from "@/app/store/store";

export default function Home({
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
  agendas,
  periods,
}) {
  const { addEvent, updateEvent, events } = useStore();
  const [activeEventSection, setActiveEventSection] = useState(false);
  const [tempEvent, setTempEvent] = useState<any>({});
  const [eventAgenda, setEventAgenda] = useState({});
  const [eventInfo, setEventInfo] = useState<any>({
    dateRes: "",
    hourDB: "",
    minuteDB: "",
  });
  const [addedEventId, setAddedEventId] = useState(null);

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
      isTemp: true,
    };
    setEventAgenda({
      label: arg.resource.title,
      value: parseInt(newEvent.resourceId),
    });
    // Update the events array with the new event
    // setEvents([...events, newEvent]);
    const existTemp = events.find((event: any) => event.isTemp == true);
    if (!existTemp) {
      addEvent(newEvent);
    } else {
      updateEvent(newEvent);
    }
    setAddedEventId(newEvent.resourceId);

    // console.log("dds")
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
        active={activeEventSection}
        agendas={agendas}
        periods={periods}
        eventInfo={eventInfo}
      />
    </div>
  );
}
