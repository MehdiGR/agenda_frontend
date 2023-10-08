// store.js
import { create } from "zustand";

export const useStore = create((set) => ({
  activeEventSection: false,
  events: [],
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
  // setEvents: (value) => set(() => value),
  addEvent: (newEvent) =>
    set((state) => ({ events: [...state.events, newEvent] })),
  updateEvent: (updatedEvent) =>
    set((state) => ({
      events: state.events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      ),
    })),

  setEventAgenda: (value) => set(() => ({ eventAgenda: value })),
  setEventInfo: (value) => set(() => ({ eventInfo: value })),
  setAddedEventId: (value) => set(() => ({ addedEventId: value })),
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  setAgendaPrestationArr: (agenda_prestation) =>
    set((state) => ({
      agenda_prestationArr: [...state.agenda_prestationArr, agenda_prestation],
    })),
  setDurationHour: (value) =>
    set((state) => ({ duration_hours: [...state.duration_hours, value] })),
  setDurationMinutes: (value) =>
    set((state) => ({ duration_minutes: [...state.duration_hours, value] })),
  setDateTime: (value) => set(() => ({ dateTime: value })),
  setTotalDuration: (value) => set(() => ({ totalDuration: value })),
  setTotalPrice: (value) => set(() => ({ totalPrice: value })),
  setClientOptions: (value) => set(() => ({ clientOptions: value })),
}));
