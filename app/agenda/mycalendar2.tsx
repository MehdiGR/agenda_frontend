import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState } from "react";
import { useStore_new2 } from "@/app/store/store_new2";
import DateNavigation from "../components/datenavigation";

const localizer = momentLocalizer(moment);

export default function MyCalendar2({
  handleAddEvent,
  handleEventDrop,
  handleUpdateEvent,
  agendas,
}: any) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events } = useStore_new2();

  const handleNextDay = () => {
    setSelectedDate(moment(selectedDate).add(1, "days").toDate());
  };

  const handlePreviousDay = () => {
    setSelectedDate(moment(selectedDate).subtract(1, "days").toDate());
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const onEventResize = ({ event, start, end }) => {
    // Your custom logic for handling the event duration change
    console.log("Event has been resized:", event);
    // Call your handler function to update the event in your application state or backend
    handleEventResize({ ...event, start, end });
  };

  const onEventDrop = ({ event, start, end }) => {
    // Your custom logic for handling the event drop (move)
    console.log("Event has been dropped:", event);
    handleEventDrop({ ...event, start, end });
  };

  return (
    <div className="w-full text-center">
      <DateNavigation
        selectedDate={selectedDate}
        handlePreviousDay={handlePreviousDay}
        handleNextDay={handleNextDay}
        handleDateChange={handleDateChange}
      />

      <div className="w-full" style={{ zIndex: 0 }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultDate={selectedDate}
          onNavigate={handleDateChange}
          resizable
          onEventResize={onEventResize}
          onEventDrop={onEventDrop}
          selectable
          onSelectSlot={handleAddEvent}
          onSelectEvent={handleUpdateEvent}
          views={["day", "week", "agenda"]}
          step={60}
          timeslots={1}
          defaultView="day"
        />
      </div>
    </div>
  );
}
