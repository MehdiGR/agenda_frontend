// pages/calendar.js
"use client";
import { useEffect, useRef, useState } from "react";
import MyCalendar from "./mycalendar";
import CreateEventSection from "./createeventsection";
import { useStore } from "@/app/store/store";
import { useStore_new2 } from "@/app/store/store_new2";
import { processReservations } from "@/app/js/agenda_fn";
import UpdateEventSection from "./updateeventsection";
export default function Home({
  clients,
  villes,
  collaborateurs,
  prestations,
  agenda_prestation,
  agendas,
  periods,
  reservations,
}: any) {
  // const {
  //   addEvent,
  //   updateEvent,
  //   events,
  //   setAddedEventId,
  //   setDateTime,
  //   setEventAgenda,
  //   addAllAgendaPres,
  //   addDurationHour,
  //   addDurationMinutes,
  //   resetDurationHour,
  //   resetDurationMinutes,
  //   onEditingEvent,
  //   setOnEditingEvent,
  //   // setActiveCreateSection,
  // } = useStore();
  const {
    manageEvents,
    activeCreateSection,
    activeUpdateSection,
    setActiveCreateSection,
    setActiveUpdateSection,
    toggleEventSelected,
    events,
    onEditingEvent,
    setOnEditingEvent,
    setIdRes,
    selectedEventsIndices,
  } = useStore_new2();
  // const [activeCreateSection, setActiveCreateSection] = useState(false);

  useEffect(() => {
    processReservations(reservations);
    setActiveCreateSection(false);
    setOnEditingEvent(false);
  }, [reservations]);

  const handleAddEvent = (arg: any) => {
    if (arg.hasOwnProperty("resource") && onEditingEvent == false) {
      // update active state for showing  the create event section
      // setActiveCreateSection(() => true);
      const lastIndex = events.findLastIndex((event: any) => event);
      let newEvent = {
        start: arg.dateStr,
        resourceId: arg.resource.id,
        resourceTitle: arg.resource.title,
        editable: true,
        backgroundColor: "#6FA5C0",
        borderColor: "#6FA5C0",
        textColor: "#FFFFFF",
        border: "none",
        isTemp: true,
        eventIndex: "",
      };
      // setEventAgenda({
      //   label: arg.resource.title,
      //   value: parseInt(newEvent.resourceId),
      // });
      // Update the events array with the new event
      // setEvents([...events, newEvent]);
      const existTemp = events.findIndex((event: any) => event.isTemp == true);
      // //  && event.saved == false
      console.log("existTemp", existTemp);
      if (existTemp == -1) {
        newEvent = { ...newEvent, eventIndex: lastIndex + 1 };
        // addEvent(newEvent);
        manageEvents([{ action: "add", payload: { newEvent } }]);
        toggleEventSelected(lastIndex + 1);
      } else {
        const index = existTemp;
        const updatedEvent = { ...newEvent, eventIndex: lastIndex };
        // updateEvent(newEvent, index);
        // toggleEventSelected(lastIndex);
        manageEvents([{ action: "update", payload: { updatedEvent, index } }]);
      }

      // setAddedEventId(newEvent.resourceId);

      // resetDurationHour();
      // resetDurationMinutes();
      // addAllAgendaPres([]);
      // setActiveCreateSection(true);
      // setOnEditingEvent(true);
      setActiveCreateSection(true);
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
    // setDateTime(newDate);
  };
  const updatedIndices = useRef(false);
  const handleUpdateEvent = (info: any) => {
    if (info.event.extendedProps.idRes && !onEditingEvent) {
      const idRes = info.event.extendedProps.idRes;
      const Indices = events
        .filter((res: any) => res.idRes == idRes)
        .map((res: any) => res.eventIndex);
      toggleEventSelected(Indices);
      setActiveUpdateSection(true);
      updatedIndices.current = true;
      setOnEditingEvent(true);

      return;
    }
  };
  // useEffect(() => {
  //   if (updatedIndices.current) {
  //     console.log("first");
  //     setActiveUpdateSection(true);
  //     console.log("ss");
  //   }
  //   return () => {
  //     updatedIndices.current = false;
  //   };
  // }, [selectedEventsIndices]);
  return (
    <div className="grid grid-flow-col auto-cols gap-10  h-full   ">
      {activeCreateSection && (
        <CreateEventSection
          clients={clients}
          villes={villes}
          collaborateurs={collaborateurs}
          prestations={prestations}
          agendas={agendas}
        />
      )}
      {/* selectedEventsIndices.size > 0 && */}
      {activeUpdateSection && (
        <UpdateEventSection
          clients={clients}
          villes={villes}
          collaborateurs={collaborateurs}
          prestations={prestations}
          agendas={agendas}
        />
      )}
      <MyCalendar
        handleAddEvent={handleAddEvent}
        handleEventDrop={handleEventDrop}
        handleUpdateEvent={handleUpdateEvent}
        agendas={agendas}
      />
    </div>
  );
}
