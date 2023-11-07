// store.js
import { create } from "zustand";
const updateTime = ({
  type,
  duration,
  hour,
  minutes,
  updateHour = false,
  updateMinutes = false,
}) => {
  if (type === "select_hour") {
    console.log(
      "duration",
      duration,
      "hour",
      hour,
      "minutes",
      minutes,
      "hour",
      hour
    );
    const newHour = (
      parseInt(hour) + (updateHour ? Math.floor(duration / 60) : hour)
    )
      .toString()
      .padStart(2, "0");

    const newMinutes = (
      parseInt(minutes) + (updateMinutes ? Math.floor(duration % 60) : minutes)
    )
      .toString()
      .padStart(2, "0");

    return `${newHour}:${newMinutes}`;
  } else if (type === "select_minutes") {
    const newHour = (
      parseInt(hour) + (updateHour ? Math.floor(duration / 60) : hour)
    )
      .toString()
      .padStart(2, "0");

    const newMinutes = (
      parseInt(minutes) + (updateMinutes ? Math.floor(duration % 60) : minutes)
    )
      .toString()
      .padStart(2, "0");

    return `${newHour}:${newMinutes}`;
  }
  return null;
};

export const useStore = create((set) => ({
  activeEventSection: false,
  events: [],
  savedEvents: [],
  eventAgenda: {},
  eventInfo: {
    dateRes: "",
    hourDB: "",
    minuteDB: "",
  },
  addedEventId: null,
  modalIsOpen: false,
  agenda_prestationArr: [],
  duration_hours: [],
  duration_minutes: [],
  totalPrice: 0,
  totalDuration: 0,
  dateTime: {
    dateDB: "",
    hourDB: { label: "", value: "" },
    minutesDB: { label: "", value: "" },
  },
  addedEventId: "",
  setActiveEventSection: (value) => set(() => ({ activeEventSection: value })),
  addEvent: (newEvent) =>
    set((state) => ({ events: [...state.events, newEvent] })),
  // create function to add array of events
  addSavedEvents: (eventsArr) =>
    set(() => {
      console.log(eventsArr);
      return { savedEvents: eventsArr };
    }),

  // update function add condition if index is an array
  updateEvent: (updatedEvent, index = null) =>
    set((state) => {
      if (index != null) {
        return {
          events: state.events.map((event, i) =>
            i === index ? updatedEvent : event
          ),
        };
      } else {
        return {
          events: state.events.map((event) => ({
            ...event,
            start: updatedEvent.start,
            end: updatedEvent.end,
          })),
        };
      }
    }),

  updateEventsTime: (index, duration, type) =>
    set((state) => {
      const modifiedEndTimes = []; // Initialize an array to store modified end times

      const updatedEvents = state.events.map((event, i) => {
        const [startDate, startTime] = event.start.split("T");
        const [hour, minutes] = startTime.split(":");
        const newTime = updateTime({
          type,
          duration,
          hour,
          minutes,
          updateHour: true,
          updateMinutes: true,
        });
        if (newTime) {
          let newEvent = { ...event };
          if (i === index) {
            newEvent.end = `${startDate}T${newTime}`;
            modifiedEndTimes[i] = newEvent.end; // Store the modified end time for this index
          } else if (i > index) {
            // const [previousStartDate, previousStartTime] =
            //   state.events[i - 1].start.split("T");
            // const [previousHour, previousMinutes] =
            //   previousStartTime.split(":");
            // const previousTime = updateTime(
            //   type,
            //   duration,
            //   previousHour,
            //   previousMinutes
            // );

            const [currentStartDate, currentStartTime] =
              state.events[i].start.split("T");
            const [currentStartHour, currentStartMinutes] =
              currentStartTime.split(":");
            const [currentEndDate, currentEndTime] =
              state.events[i].end.split("T");
            const [currentEndHour, currentEndMinutes] =
              currentEndTime.split(":");

            // Calculate the time difference between current start and end times in minutes
            const timeDifference =
              (currentEndHour - currentStartHour) * 60 +
              (currentEndMinutes - currentStartMinutes);

            const [nextEndHour, nextEndMinutes] = modifiedEndTimes[i - 1]
              .split("T")[1]
              .split(":");
            // Calculate the next end time by adding timeDifference to previousTime
            console.log(nextEndHour);
            const nextEndTime = updateTime({
              type,
              duration: timeDifference,
              hour: nextEndHour,
              minutes: nextEndMinutes,
              updateHour: true,
              updateMinutes: true,
            });
            console.log("timeDifference " + i, timeDifference);

            // newEvent.start = `${previousStartDate}T${previousTime}`;
            newEvent.start = modifiedEndTimes[i - 1];
            newEvent.end = `${startDate}T${nextEndTime}`;
            modifiedEndTimes[i] = newEvent.end;
          }

          return newEvent;
        }
        return event;
      });
      return { ...state, events: updatedEvents };
    }),

  removeEvent: (index) =>
    set((state) => ({
      events: state.events.filter((_, i) => i !== index),
    })),
  setEventAgenda: (value) => set(() => ({ eventAgenda: value })),
  setEventInfo: (value) => set(() => ({ eventInfo: value })),
  setAddedEventId: (value) => set(() => ({ addedEventId: value })),
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  setAgendaPrestationArr: (agenda_prestation) =>
    set((state) => ({
      agenda_prestationArr: [...state.agenda_prestationArr, agenda_prestation],
    })),
  addAgendaPres: (newAgenda) =>
    set((state) => ({
      agenda_prestationArr: [...state.agenda_prestationArr, newAgenda],
    })),
  removeAgendaPres: (index) =>
    set((state) => ({
      agenda_prestationArr: state.agenda_prestationArr.filter(
        (_, i) => i !== index
      ),
    })),
  addDurationHour: (value) =>
    set((state) => ({ duration_hours: [...state.duration_hours, value] })),
  updateDurationHour: (value, index) =>
    set((state) => ({
      duration_hours: state.duration_hours.map((hour, i) =>
        i === index ? value : hour
      ),
    })),
  removeDurationHour: (index) =>
    set((state) => ({
      duration_hours: state.duration_hours.filter((_, i) => i !== index),
    })),
  addDurationMinutes: (value) =>
    set((state) => ({ duration_minutes: [...state.duration_minutes, value] })),
  updateDurationMinutes: (value, index) =>
    set((state) => ({
      duration_minutes: state.duration_minutes.map((minutes, i) =>
        i === index ? value : minutes
      ),
    })),
  removeDurationMinutes: (index) =>
    set((state) => ({
      duration_minutes: state.duration_minutes.filter((_, i) => i !== index),
    })),
  setDateTime: (value) => set(() => ({ dateTime: value })),

  setTotalDuration: (value) => set(() => ({ totalDuration: value })),
  setTotalPrice: (value) => set(() => ({ totalPrice: value })),
  setClientOptions: (value) => set(() => ({ clientOptions: value })),
}));
