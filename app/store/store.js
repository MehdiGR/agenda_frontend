// store.js
import { create } from "zustand";

export const useStore = create((set) => ({
  activeEventSection: false,
  tempEvent: {},
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
  duration_hour: [],
  duration_minutes: [],
  dateTime: {
    dateDB: "",
    hourDB: { label: "", value: "" },
    minutesDB: { label: "", value: "" },
  },
  setActiveEventSection: (value) => set(() => ({ activeEventSection: value })),
  setTempEvent: (value) => set(() => ({ tempEvent: value })),
  setSavedEvents: (value) => set(() => ({ savedEvents: value })),
  setEventAgenda: (value) => set(() => ({ eventAgenda: value })),
  setEventInfo: (value) => set(() => ({ eventInfo: value })),
  setAddedEventId: (value) => set(() => ({ addedEventId: value })),
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  setAgendaPrestationArr: (value) =>
    set(() => ({ agenda_prestationArr: value })),
  setDurationHour: (value) => set(() => ({ duration_hours: value })),
  setDurationMinutes: (value) => set(() => ({ duration_minutes: value })),
  setDateTime: (value) => set(() => ({ dateTime: value })),
  setTotalDuration: (value) => set(() => ({ totalDuration: value })),
  setTotalPrice: (value) => set(() => ({ totalPrice: value })),
  setClientOptions: (value) => set(() => ({ clientOptions: value })),
}));
