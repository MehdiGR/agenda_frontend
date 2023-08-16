// pages/calendar.js
"use client";
import { useEffect, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { Props, ScriptProps } from "next/script";

export default function Home(props: ScriptProps) {
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
    <div className="flex gap-3 p-3 my-2">
      <CreateEventSection
        active={activeEventSection}
        setActive={setActiveEventSection}
      />
      <MyCalendar handleDateClick={handleDateClick} />
    </div>
  );
}
