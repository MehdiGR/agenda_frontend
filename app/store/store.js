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
  console.log("minutes", minutes, "duration", duration, "hour", hour);

  if (type === "select_hour") {
    const newHour = (
      updateHour ? parseInt(hour) + Math.floor(parseInt(duration / 60)) : hour
    )
      .toString()
      .padStart(2, "0");
    console.log(newHour);

    const newMinutes = (
      updateMinutes ? parseInt(minutes) + Math.floor(duration % 60) : minutes
    )
      .toString()
      .padStart(2, "0");

    return `${newHour}:${newMinutes}`;
  } else if (type === "select_minutes") {
    const newMinutes = (
      updateMinutes ? parseInt(minutes) + Math.floor(duration % 60) : minutes
    )
      .toString()
      .padStart(2, "0");
    const newHour = (
      updateHour ? parseInt(hour) + Math.floor(duration / 60) : hour
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

  updateEventsTime: (index, dur, type, globalChange = false) =>
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
          hour = startT.split(":")[0];
          // const endT = event.end.split("T")[1];
          minutes = endT.split(":")[1];
          if (type === "select_hour") {
            hour = startT.split(":")[0];
            EndHour = globalChange ? endT.split(":")[0] : "";
            EndMinutes = globalChange ? endT.split(":")[1] : "";
          } else if (type === "select_minutes") {
            const endT = event.end.split("T")[1];
            minutes = startT.split(":")[1];
            hour = endT.split(":")[0];
            EndHour = globalChange ? endT.split(":")[0] : "";
            EndMinutes = globalChange ? endT.split(":")[1] : "";
          }
          const newTime = updateTime({
            type,
            duration: dur,
            hour,
            minutes,
            updateHour: true,
            updateMinutes: true,
          });

          modEndTimes[i] = newEvent.end;
          if (globalChange == false) newEvent.end = `${startD}T${newTime}`;
          // if globalChange is true, update the end time of the event
          else if (globalChange == true) {
            console.log("EndM", endT.split(":")[1]);
            console.log("globalChange", globalChange);
            const newEndTime = updateTime({
              type,
              duration: dur,
              hour: EndHour,
              minutes: EndMinutes,
              updateHour: true,
              updateMinutes: true,
            });
            newEvent.start = `${startD}T${newTime}`;
            newEvent.end = `${startD}T${newEndTime}`;
          }
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
            type,
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
  // update time for all events by moving the start and end times of event with the duration
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
