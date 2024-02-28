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
    const eventId = arg.event._def.extendedProps.eventIndex;
    console.log("eventId ", eventId);
    const eventStart = arg.event._instance.range.start.toISOString();
    const eventEnd = arg.event._instance.range.end.toISOString();

    // Find the index of the event being dropped
    const index = events.findIndex(
      (event: any) => event.eventIndex === eventId
    );
    // console.log("index", index);
    // return;
    if (index !== -1) {
      // Create an updated event with the new resource ID and title
      const updatedEvent = {
        ...events[index],
        resourceId: arg.event._def.resourceIds[0],
        resourceTitle: arg.event._def.title,
        start: eventStart.slice(0, 16),
        end: eventEnd.slice(0, 16),
        isTemp: false,
      };

      console.log("updatedEvent", updatedEvent);
      // return;
      // Update the event in the events array
      manageEvents([{ action: "update", payload: { updatedEvent, index } }]);

      // Set the active update section and editing flag
      // setActiveUpdateSection(true);
      setOnEditingEvent(true);
    } else {
      console.error("Event with the given ID not found in the events array.");
    }
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
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are  0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const offset = "-08:00"; // Adjust this as needed
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offset}`;
  };
  function handleEventResize(event: any) {
    console.log("Updated event:", event);

    const eventId = event.extendedProps.eventIndex;
    // Access the event's start and end times

    // If event.start and event.end are strings in a different format, parse them first
    const eventStart = formatDate(event.start);
    const eventEnd = formatDate(event.end);

    // Then convert to ISO 8601 format
    // const eventStart = eventStartDate.toISOString();
    // const eventEnd = eventEndDate.toISOString();

    // console.log("events ", events);

    // console.log(eventStart, "start date");
    // console.log(eventEnd, "end date");
    // console.log(eventStart.slice(0, 16));
    // console.log(eventEnd.slice(0, 16));
    // return;
    // Find the index of the event being dropped
    const index = events.findIndex(
      (event: any) => event.eventIndex === eventId
    );
    // console.log("index", index);
    // return;
    if (index !== -1) {
      // Create an updated event with the new resource ID and title
      const updatedEvent = {
        ...events[index],
        // resourceId: event.resourceIds[0],
        // resourceTitle: event.title,
        start: eventStart.slice(0, 16),
        end: eventEnd.slice(0, 16),
        isTemp: false,
      };

      console.log("updatedEvent", updatedEvent);
      // return;
      // Update the event in the events array
      manageEvents([{ action: "update", payload: { updatedEvent, index } }]);

      // Set the active update section and editing flag
      // setActiveUpdateSection(true);
      setOnEditingEvent(true);
    } else {
      console.error("Event with the given ID not found in the events array.");
    }
  }

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
        handleEventResize={handleEventResize}
        agendas={agendas}
      />
    </div>
  );
}
