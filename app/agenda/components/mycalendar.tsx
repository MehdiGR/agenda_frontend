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

export default function MyCalendar({ handleDateClick }) {
  const resources = [
    { id: "a", title: "Room A", building: "Building 1" },
    { id: "b", title: "Room B", building: "Building 2" },
    { id: "c", title: "Room C", building: "Building 1" },
  ];

  const events = [
    {
      title: "Event 1",
      start: "2023-07-31",
      resourceId: "a", // Assigning the event to resource with ID 'a'
    },
    {
      title: "Event 2",
      start: "2023-08-01",
      resourceId: "b", // Assigning the event to resource with ID 'b'
    },
  ];

  return (
    <div className="w-full">
      {" "}
      <FullCalendar
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
        dateClick={handleDateClick}
      />
    </div>
  );
}
