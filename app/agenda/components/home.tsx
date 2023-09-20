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
}) {
  useEffect(() => {
    // console.log(props.clients);
    //   console.log(props);
  }, []);
  const [activeEventSection, setActiveEventSection] = useState(false);
  const handleDateClick = (arg: any) => {
    // console.log("Date clicked:", arg.date);
    setActiveEventSection(() => true);
  };
  return (
    <div className="flex sm:flex-wrap gap-10  h-full   ">
      <CreateEventSection
        active={activeEventSection}
        setActive={setActiveEventSection}
        clients={clients}
        villes={villes}
        collaborateurs={collaborateurs}
        prestations={prestations}
        agenda_prestation={agenda_prestation}
      />
      <MyCalendar
        handleDateClick={handleDateClick}
        active={activeEventSection}
      />
    </div>
  );
}
