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
  activeCreateSection: null,
  modalIsOpen: false,
  setOnEditingEvent: (value) => set(() => ({ onEditingEvent: value })),
  setActiveCreateSection: (value) =>
    set(() => ({ activeCreateSection: value })),
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
              draft.events = draft.events.filter(
                (event) => event.eventIndex !== payload.index
              );
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
                  event.eventIndex === payload.index
                ) {
                  let agenda_prestationArr = [...event.agenda_prestationArr];
                  // let agenda_prestationArr = JSON.parse(
                  //   JSON.stringify(event.agenda_prestationArr)
                  // );
                  let otherProps = {};
                  switch (payload.action) {
                    case "add":
                      // console.log(agenda_prestationArr);
                      agenda_prestationArr.push(payload.newAgenda);
                      break;
                    case "add_all":
                      agenda_prestationArr = payload.agendas;
                      break;
                    case "updateAgenda":
                      const { agendaId, agendaTitle } = payload.updatedAgenda;
                      agenda_prestationArr[payload.agendaIndex].agendaId =
                        agendaId;
                      agenda_prestationArr[payload.agendaIndex].agendaTitle =
                        agendaTitle;
                      otherProps = { resourceId: agendaId };
                      break;
                    case "updateDurationHours":
                      agenda_prestationArr[payload.agendaIndex].duration_hours =
                        payload.duration_hours;
                      console.log(payload.duration_hours);
                      break;
                    case "updateDurationMinutes":
                      agenda_prestationArr[
                        payload.agendaIndex
                      ].duration_minutes = payload.duration_minutes;
                      break;
                    case "remove":
                      agenda_prestationArr = agenda_prestationArr.filter(
                        (_, idx) => idx !== payload.agendaIndex
                      );
                      break;
                  }
                  // console.log(agenda_prestationArr);
                  return {
                    ...event,
                    ...otherProps,
                    agenda_prestationArr,
                  };
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

              let prevIndex;
              const modEndTimes = [];

              draft.events = draft.events.map((event) => {
                const i = event.eventIndex;
                const isSelected = draft.selectedEventsIndices.has(i);
                let existIdRes = true;
                if (idRes) {
                  existIdRes = event.idRes === idRes;
                }
                if (
                  isSelected &&
                  existIdRes &&
                  // event.resourceId === idAgenda &&
                  // dateDB === event.start.split("T")[0] &&
                  (i === index || i > index)
                ) {
                  const [startD, startT] = event.start.split("T");
                  const [endD, endT] = event.end.split("T");

                  let hour, minutes;
                  let newEvent = { ...event };
                  let EndHour, EndMinutes;

                  if (i === index) {
                    EndHour = globalChange ? endT.split(":")[0] : "";
                    EndMinutes = globalChange ? endT.split(":")[1] : "";
                    if (select_type === "select_hour") {
                      hour = startT.split(":")[0];
                      minutes = endT.split(":")[1];
                    } else if (select_type === "select_minutes") {
                      minutes = startT.split(":")[1];
                      hour = globalChange
                        ? startT.split(":")[0]
                        : endT.split(":")[0];
                    }
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
                      newEvent.end = `${startD}T${newEndTime}`;
                    }
                    prevIndex = i;
                    modEndTimes[i] = newEvent.end;
                  } else if (i > index && existIdRes) {
                    const prevEventEnd = modEndTimes[prevIndex];
                    if (prevEventEnd) {
                      const [prevEndD, prevEndT] = prevEventEnd.split("T");
                      const [prevEndH, prevEndM] = prevEndT.split(":");
                      const timeDiff =
                        (parseInt(endT.split(":")[0]) -
                          parseInt(startT.split(":")[0])) *
                          60 +
                        (parseInt(endT.split(":")[1]) -
                          parseInt(startT.split(":")[1]));
                      const nextEndTime = updateTime({
                        select_type,
                        duration: timeDiff,
                        hour: prevEndH,
                        minutes: prevEndM,
                        updateHour: true,
                        updateMinutes: true,
                      });
                      newEvent.start = prevEventEnd;
                      newEvent.end = `${startD}T${nextEndTime}`;
                      modEndTimes[i] = newEvent.end;
                    }
                    prevIndex = i;
                  }
                  return newEvent;
                }
                return event;
              });
              break;
            }

            // ... (rest of the switch statement)

            default:
              break;
          }
        });
      });
    });
  },
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  // create getEvents
  getEvents: () => this.events,

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
          if (draft.selectedEventsIndices.has(eventIndices)) {
            draft.selectedEventsIndices.delete(eventIndices);
          } else {
            // console.log(draft.selectedEventsIndices);
            draft.selectedEventsIndices.add(eventIndices);
            // console.log(selectedEventsIndices);
          }
        }
      });
    });
  },
}));

export const exportStore = () => {
  const TotalDuration = () => {
    let totalDuration = 0;
    const events = useStore_new2.getState().events;
    const selectedEventsIndices =
      useStore_new2.getState().selectedEventsIndices;

    events.forEach((event, index) => {
      if (selectedEventsIndices.has(index)) {
        totalDuration += event.agenda_prestationArr.reduce(
          (sum, prestation) => sum + prestation.duration,
          0
        );
      }
    });

    return totalDuration;
  };

  return {
    useStore_new2,
    TotalDuration,
  };
};
