import { create } from "zustand";
import { produce, enableMapSet } from "immer";
// Enable the MapSet plugin
enableMapSet();
const updateTime = ({
  select_type,
  duration,
  hour,
  minutes,
  updateHour = false,
  updateMinutes = false,
}) => {
  let newHour = updateHour
    ? parseInt(hour) + Math.floor(duration / 60)
    : parseInt(hour);
  let newMinutes = updateMinutes
    ? parseInt(minutes) + (duration % 60)
    : parseInt(minutes);

  newHour += Math.floor(newMinutes / 60);
  newMinutes %= 60;

  newHour %= 24;

  const paddedHour = newHour.toString().padStart(2, "0");
  const paddedMinutes = newMinutes.toString().padStart(2, "0");

  return `${paddedHour}:${paddedMinutes}`;
};

export const useStore_new2 = create((set) => ({
  events: [],
  onEditingEvent: false,
  activeEventSection: null,
  modalIsOpen: false,
  setOnEditingEvent: (value) => set(() => ({ onEditingEvent: value })),
  setActiveEventSection: (value) => set(() => ({ activeEventSection: value })),
  selectedEventsIndices: new Set(),
  manageEvents: (actions) => {
    set((state) => {
      return produce(state, (draft) => {
        draft.events = draft.events || [];
        draft.selectedEventsIndices = draft.selectedEventsIndices || new Set();

        actions.forEach(({ action, payload }) => {
          switch (action) {
            case "add":
              draft.events.push({
                ...payload.newEvent,
                agenda_prestationArr: [],
              });
              break;
            case "add_all":
              draft.events = payload.events;
              break;
            case "update":
              draft.events = draft.events.map((event, i) =>
                i === payload.index
                  ? { ...event, ...payload.updatedEvent }
                  : event
              );
              break;
            case "updateEvents":
              draft.events = draft.events.map((event) => {
                const updatedEvent = payload.updatedEvents.find(
                  (uEvent) => uEvent.eventIndex === event.eventIndex
                );
                return updatedEvent ? { ...event, ...updatedEvent } : event;
              });
              break;
            case "remove":
              draft.events = draft.events.filter((_, i) => i !== payload.index);
              break;
            case "updateDates":
              draft.events = draft.events.map((event) => {
                if (draft.selectedEventsIndices.has(event.eventIndex)) {
                  return {
                    ...event,
                    start: `${payload.newDate}T${event.start.split("T")[1]}`,
                    end: `${payload.newDate}T${event.end?.split("T")[1]}`,
                  };
                }
                return event;
              });
              break;
            case "manageAgendaPres":
              draft.events = draft.events.map((event, i) => {
                if (
                  draft.selectedEventsIndices.has(event.eventIndex) &&
                  i === payload.index
                ) {
                  let agenda_prestationArr = [...event.agenda_prestationArr];
                  if (payload.action === "add") {
                    agenda_prestationArr.push(payload.newAgenda);
                  } else if (payload.action === "remove") {
                    agenda_prestationArr = agenda_prestationArr.filter(
                      (_, idx) => idx !== payload.agendaIndex
                    );
                  } else if (payload.action === "add_all") {
                    agenda_prestationArr = payload.agendas;
                  }
                  return { ...event, agenda_prestationArr };
                }
                return event;
              });
              break;
            case "updateEventsTime": {
              const {
                index,
                duration,
                select_type,
                globalChange = false,
                idAgenda = null,
                dateDB = null,
                idRes = null,
              } = payload;
              // console.log(payload, "payload");
              const modEndTimes = [];
              let prevIndex;

              draft.events = draft.events.map((event) => {
                const i = event.eventIndex;
                const existIdRes = idRes ? event.idRes === idRes : true;

                console.log(existIdRes);
                if (existIdRes && (i === index || i > index)) {
                  console.log(payload, "payload");
                  const [startD, startT] = event.start.split("T");
                  const [endD, endT] = event.end?.split("T") || [null, null];

                  let hour, minutes, EndHour, EndMinutes;
                  let newEvent = { ...event };

                  if (i === index) {
                    EndHour = globalChange ? endT.split(":")[0] : "";
                    EndMinutes = globalChange ? endT.split(":")[1] : "";
                    hour =
                      select_type === "select_hour"
                        ? startT.split(":")[0]
                        : endT.split(":")[0];
                    minutes =
                      select_type === "select_minutes"
                        ? startT.split(":")[1]
                        : endT.split(":")[1];

                    const newTime = updateTime({
                      select_type,
                      duration,
                      hour,
                      minutes,
                      updateHour: !(
                        globalChange && select_type === "select_minutes"
                      ),
                      updateMinutes: true,
                    });

                    if (!globalChange) {
                      newEvent.end = `${startD}T${newTime}`;
                    } else {
                      const newEndTime = updateTime({
                        select_type,
                        duration,
                        hour: EndHour,
                        minutes: EndMinutes,
                        updateHour: select_type !== "select_minutes",
                        updateMinutes: true,
                      });
                      newEvent.start = `${startD}T${newTime}`;
                      newEvent.end = `${endD}T${newEndTime}`;
                    }
                    prevIndex = i;
                    modEndTimes[i] = newEvent.end;
                  } else if (i > index) {
                    const [curStartD] = event.start.split("T");
                    const timeDiff =
                      (parseInt(endT.split(":")[0]) -
                        parseInt(startT.split(":")[0])) *
                        60 +
                      (parseInt(endT.split(":")[1]) -
                        parseInt(startT.split(":")[1]));

                    const [nextEndH, nextEndM] = modEndTimes[prevIndex]
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

                    newEvent.start = modEndTimes[prevIndex];
                    newEvent.end = `${curStartD}T${nextEndTime}`;
                    modEndTimes[i] = newEvent.end;
                    prevIndex = i;
                  }
                  console.log(newEvent, "newEvent");
                  return newEvent;
                }
                return event;
              });
              break;
            }
            default:
              break;
          }
        });
      });
    });
  },
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  toggleEventSelected: (eventIndices) => {
    set((state) => {
      return produce(state, (draft) => {
        if (Array.isArray(eventIndices)) {
          eventIndices.forEach((index) => {
            if (draft.selectedEventsIndices.has(index)) {
              draft.selectedEventsIndices.delete(index);
            } else {
              draft.selectedEventsIndices.add(index);
            }
          });
        } else {
          // if (draft.selectedEventsIndices.has(eventIndices)) {
          //   draft.selectedEventsIndices.delete(eventIndices);
          // } else {
          // console.log(draft.selectedEventsIndices);
          draft.selectedEventsIndices.add(eventIndices);
          // console.log(selectedEventsIndices);
          // }
        }
      });
    });
  },
}));

export const exportStore = () => {
  let lastSelectedEventIds = null;
  let lastTotalDuration = null;

  return {
    getTotalDurationOfSelectedEvents: () => {
      const state = useStore.getState();
      const { events, selectedEventIds } = state;

      // Check if the selected event IDs have changed
      if (lastSelectedEventIds !== selectedEventIds) {
        let totalMinutes = 0;

        selectedEventIds.forEach((eventId) => {
          const event = events.find((e) => e.id === eventId);
          if (event) {
            event.agenda_prestationArr.forEach((agenda) => {
              const hours = parseInt(agenda.hourDB, 10);
              const minutes = parseInt(agenda.minutesDB, 10);
              totalMinutes += hours * 60 + minutes;
            });
          }
        });

        // Convert total minutes to hours and minutes
        const totalHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        // Format the finish time as HH:mm
        lastTotalDuration = `${totalHours
          .toString()
          .padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}`;
        lastSelectedEventIds = selectedEventIds;
      }

      return lastTotalDuration;
    },
  };
};
