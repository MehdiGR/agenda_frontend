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
  const handleDateClick = (info: any) => {
    // console.log("Date clicked:", arg.date);
    setActiveEventSection(() => true);
    info.dayEl.style.backgroundColor = "red";
    info.unselect();
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
        handleDateClick={handleDateClick}
        active={activeEventSection}
      />
    </div>
  );
}
