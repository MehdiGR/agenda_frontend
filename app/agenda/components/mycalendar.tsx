"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import resource from "@fullcalendar/resource";
import resourceDayGridPlugin from "@fullcalendar/resource-daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import { useStore } from "@/app/store/store";

export default function MyCalendar({
  handleAddEvent,
  handleEventDrop,
  handleUpdateEvent,
  agendas,
}) {
  // const resources = [
  //   { id: "a", title: "Room A", building: "Building 1" },
  //   { id: "b", title: "Room B", building: "Building 2" },
  //   { id: "c", title: "Room C", building: "Building 1" },
  // ];
  const { events, savedEvents } = useStore();

  const resources = agendas.map((agenda: any) => ({
    id: agenda.id,
    title: agenda.nom,
    building: agenda.nom,
  }));
  useEffect(() => {
    console.log("events", events);
  }, [events]);
  return (
    <div className="w-full" style={{ zIndex: 0 }}>
      <FullCalendar
        // height="100%"
        allDaySlot={false}
        // initialView="timeGridWeek"
        // businessHours={{
        //   daysOfWeek: [1, 2, 3, 4, 5], // Specify which days to apply business hours
        //   startTime: "08:00", // Begin hour (e.g., 8:00 AM)
        //   endTime: "17:00", // End hour (e.g., 5:00 PM)
        // }}
        locale={frLocale}
        slotMinTime="09:00:00"
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        plugins={[resourceTimeGridPlugin, interactionPlugin]}
        initialView="resourceTimeGridFourDay"
        events={events}
        headerToolbar={{
          left: "prev,next",
          center: "title",
          right: "resourceTimeGridDay,resourceTimeGridFourDay",
        }}
        resources={resources}
        views={{
          resourceTimeGridFourDay: {
            type: "resourceTimeGrid",
            duration: { days: 3 },
            buttonText: "3 Jours",
          },
        }}
        datesAboveResources={true}
        dateClick={handleAddEvent}
        eventDrop={handleEventDrop}
        // eventClick={handleAddEvent}
        // Add the eventResize callback
        editable={true} // Enable event editing
        eventResizableFromStart={true} // Enable resizing from the start point
        eventStartEditable={true} // Disable dragging from the start point
        eventOverlap={true}
        eventClick={handleUpdateEvent}
        // eventContent={handleEventRender}
        // eventClassNames={"added-event"}
      />
    </div>
  );
}
