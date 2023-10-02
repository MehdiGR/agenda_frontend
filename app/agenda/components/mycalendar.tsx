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
import { useState } from "react";

export default function MyCalendar({
  handleAddEvent,
  active,
  events,
  agendas,
  periods,
  agendaInfo,
}) {
  // const resources = [
  //   { id: "a", title: "Room A", building: "Building 1" },
  //   { id: "b", title: "Room B", building: "Building 2" },
  //   { id: "c", title: "Room C", building: "Building 1" },
  // ];
  const resources = agendas.map((agenda: any) => ({
    id: agenda.id,
    title: agenda.nom,
    building: agenda.nom,
  }));
  return (
    <div className="w-full" style={{ zIndex: 0 }}>
      <FullCalendar
        // height="100%"
        locale={frLocale}
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
        // eventClick={handleAddEvent}
        // Add the eventResize callback
        editable={true} // Enable event editing
        eventResizableFromStart={true} // Enable resizing from the start point
        eventStartEditable={true} // Disable dragging from the start point
        eventOverlap={true}
        eventClick={handleAddEvent}
        // eventContent={handleEventRender}
        // eventClassNames={"added-event"}
      />
    </div>
  );
}
