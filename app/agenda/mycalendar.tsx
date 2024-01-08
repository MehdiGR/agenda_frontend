"use strict";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import frLocale from "@fullcalendar/core/locales/fr";
import { useEffect, useState } from "react";
import { useStore_new2 } from "@/app/store/store_new2";
import "@/app/styles/fullcalendar.css";
import { MdNavigateNext } from "react-icons/md";
import { MdNavigateBefore } from "react-icons/md";
import DateNavigation from "../components/datenavigation";

export default function MyCalendar({
  handleAddEvent,
  handleEventDrop,
  handleUpdateEvent,
  agendas,
}: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events } = useStore_new2();

  const handleNextDay = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1))
    );
  };

  const handlePreviousDay = () => {
    setSelectedDate(
      (prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1))
    );
  };

  const handleDateChange = (event: any) => {
    setSelectedDate(new Date(event.target.value));
  };

  const resources = agendas.map((agenda: any) => ({
    id: agenda.id,
    title: agenda.nom,
    building: agenda.nom,
  }));

  // useEffect(() => {
  //   console.log("events", events);
  // }, [events]);
  let calendarApi: any;

  useEffect(() => {
    // console.log("events", events);
    if (calendarApi) {
      calendarApi.gotoDate(selectedDate);
    }
  }, [events, selectedDate]);

  return (
    <div className="w-full text-center">
      <DateNavigation
        selectedDate={selectedDate}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
        handleDateChange={handleDateChange}
      />

      <div className={` w-full `} style={{ zIndex: 0 }}>
        <FullCalendar
          ref={(calendar) => {
            if (calendar) {
              calendarApi = calendar.getApi();
            }
          }}
          allDaySlot={false}
          locale={frLocale}
          slotMinTime="09:00:00"
          schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
          plugins={[resourceTimeGridPlugin, interactionPlugin]}
          initialView="resourceTimeGridFourDay"
          initialDate={selectedDate}
          events={events}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right:
              "resourceTimeGridDay,resourceTimeGridFourDay,resourceTimeGridWeek",
          }}
          resources={resources}
          views={{
            resourceTimeGridFourDay: {
              type: "resourceTimeGrid",
              duration: { days: 3 },
              buttonText: "3 Jours",
            },
            resourceTimeGridWeek: {
              type: "resourceTimeGrid",
              duration: { weeks: 1 },
              buttonText: "1 Semaine",
            },
          }}
          datesAboveResources={true}
          dateClick={handleAddEvent}
          eventDrop={handleEventDrop}
          editable={true} // Enable event editing
          eventResizableFromStart={true} // Enable resizing from the start point
          eventStartEditable={true} // Disable dragging from the start point
          eventOverlap={true}
          eventClick={handleUpdateEvent}
        />
      </div>
    </div>
  );
}
