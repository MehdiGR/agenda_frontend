// store.js
import { create } from "zustand";
const updateTime = ({
  select_type,
  duration,
  hour,
  minutes,
  updateHour = false,
  updateMinutes = false,
}) => {
  const newHour = updateHour
    ? parseInt(hour) + Math.floor(duration / 60)
    : parseInt(hour);
  const newMinutes = updateMinutes
    ? parseInt(minutes) + Math.floor(duration % 60)
    : parseInt(minutes);

  const paddedHour = newHour.toString().padStart(2, "0");
  const paddedMinutes = newMinutes.toString().padStart(2, "0");

  if (select_type === "select_hour") {
    return `${paddedHour}:${paddedMinutes}`;
  } else if (select_type === "select_minutes") {
    return `${paddedHour}:${paddedMinutes}`;
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

  setActiveEventSection: (value) => set(() => ({ activeEventSection: value })),
  addEvent: (newEvent) =>
    set((state) => ({ events: [...state.events, newEvent] })),
  // Function to add array of events
  addSavedEvents: (events) => set(() => ({ savedEvents: events })),

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
  // update time for all events by moving the start and end times of event with the duration
  updateEventsTime: ({ index, duration, select_type, globalChange = false }) =>
    set((state) => {
      const modEndTimes = [];
      const updatedEvents = state.events.map((event, i) => {
        const [startD, startT] = event.start.split("T");
        const [endD, endT] = event.end.split("T");

        let hour, minutes;
        let newEvent = { ...event };
        let EndHour;
        let EndMinutes;

        if (i === index) {
          EndHour = globalChange ? endT.split(":")[0] : "";
          EndMinutes = globalChange ? endT.split(":")[1] : "";
          if (select_type === "select_hour") {
            hour = startT.split(":")[0];
            minutes = endT.split(":")[1];
          } else if (select_type === "select_minutes") {
            minutes = startT.split(":")[1];
            hour = globalChange ? startT.split(":")[0] : endT.split(":")[0];
          }
          // console.log("minutes", minutes, "duration", dur, "hour", hour);
          const newTime = updateTime({
            select_type,
            duration,
            hour,
            minutes,
            updateHour:
              globalChange && select_type == "select_minutes" ? false : true,
            updateMinutes: true,
          });

          if (globalChange == false) newEvent.end = `${startD}T${newTime}`;
          // if globalChange is true, update the end time of the event
          else if (globalChange == true) {
            const newEndTime = updateTime({
              select_type,
              duration,
              hour: EndHour,
              minutes: EndMinutes,
              updateHour: select_type == "select_minutes" ? false : true,
              updateMinutes: true,
            });
            newEvent.start = `${startD}T${newTime}`;
            newEvent.end = `${startD}T${newEndTime}`;
          }
          modEndTimes[i] = newEvent.end;
        } else if (i > index) {
          const [curStartD, curStartT] = state.events[i].start.split("T");
          const [curStartH, curStartM] = curStartT.split(":");
          const [curEndD, curEndT] = state.events[i].end.split("T");
          const [curEndH, curEndM] = curEndT.split(":");
          const timeDiff = (curEndH - curStartH) * 60 + (curEndM - curStartM);
          const [nextEndH, nextEndM] = modEndTimes[i - 1]
            .split("T")[1]
            .split(":");
          const nextEndTime = updateTime({
            select_type,
            duration: timeDiff,
            hour: nextEndH,
            minutes: nextEndM,
            updateHour: true,
            updateMinutes: true,
          });
          newEvent.start = modEndTimes[i - 1];
          newEvent.end = `${curStartD}T${nextEndTime}`;
          modEndTimes[i] = newEvent.end;
        }
        return newEvent;
      });
      return { ...state, events: updatedEvents };
    }),

  //update stardate and enddate for all events
  dateEventDates: (newDate) =>
    set((state) => {
      const updateEvents = state.events.map((event) => {
        let upEvent = { ...event };
        const starTime = event.start.split("T")[1];
        const endTime = event.end.split("T")[1];
        upEvent.start = `${newDate}T${starTime}`;
        upEvent.end = `${newDate}T${endTime}`;

        return upEvent;
      });
      return { ...state, events: updateEvents };
    }),

  removeEvent: (index) =>
    set((state) => ({
      events: state.events.filter((_, i) => i !== index),
    })),
  setEventAgenda: (value) => set(() => ({ eventAgenda: value })),
  setEventInfo: (value) => set(() => ({ eventInfo: value })),
  setAddedEventId: (value) => set(() => ({ addedEventId: value })),
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  addAllAgendaPres: (agenda_prestation) =>
    set((state) => ({ agenda_prestationArr: [...agenda_prestation] })),
  // setAgendaPrestationArr: (agenda_prestation) =>
  //   set((state) => ({
  //     agenda_prestationArr: [...state.agenda_prestationArr, agenda_prestation],
  //   })),
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
