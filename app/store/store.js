// store.js
import { create } from "zustand";

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
  updateAllEvents: (events) =>
    set((state) => ({
      events: state.events.map((event) => {
        const updatedEvent = events.find(
          (updatedEvent) => updatedEvent.prestationId === event.prestation.id
        );
        if (updatedEvent) {
          return {
            ...event,
            start: updatedEvent.start,
            end: updatedEvent.end,
          };
        }
        return event;
      }),
    })),

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
