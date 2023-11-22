import { create } from "zustand";

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

  // Adjust for overflow in minutes
  if (newMinutes >= 60) {
    newHour += Math.floor(newMinutes / 60);
    newMinutes %= 60;
  }

  // Adjust for 24-hour format
  newHour %= 24;

  const paddedHour = newHour.toString().padStart(2, "0");
  const paddedMinutes = newMinutes.toString().padStart(2, "0");

  return `${paddedHour}:${paddedMinutes}`;
};

export const useStore_new = create((set) => ({
  events: [],
  onEditingEvent: false,
  setOnEditingEvent: (value) => set(() => ({ onEditingEvent: value })),
  setActiveEventSection: (value) => set(() => ({ activeEventSection: value })),
  manageEvents: (action, payload) => {
    set((state) => {
      let events = [...state.events];

      switch (action) {
        case "add":
          events.push({ ...payload.newEvent, agenda_prestationArr: [] });
          break;
        case "add_all":
          events = payload.events;
          break;
        case "update":
          events = events.map((event, i) =>
            i === payload.index ? { ...event, ...payload.updatedEvent } : event
          );
          break;
        case "updateEvents":
          events = events.map((event) => {
            const updatedEvent = payload.updatedEvents.find(
              (uEvent) => uEvent.eventIndex === event.eventIndex
            );
            return updatedEvent ? { ...event, ...updatedEvent } : event;
          });
          break;
        case "remove":
          events = events.filter((_, i) => i !== payload.index);
          break;
        case "updateDates":
          events = events.map((event) => ({
            ...event,
            start: `${payload.newDate}T${event.start.split("T")[1]}`,
            end: `${payload.newDate}T${event.end.split("T")[1]}`,
          }));
          break;
        case "manageAgendaPres":
          events = events.map((event, i) => {
            if (i === payload.index) {
              let agenda_prestationArr = [...event.agenda_prestationArr];
              if (payload.action === "add") {
                agenda_prestationArr.push(payload.newAgenda);
              } else if (payload.action === "remove") {
                agenda_prestationArr = agenda_prestationArr.filter(
                  (_, idx) => idx !== payload.agendaIndex
                );
              } else if (payload.action == "add_all") {
                // console.log(payload.newAgenda);
                agenda_prestationArr = payload.Agendas;
              }
              return { ...event, agenda_prestationArr };
            }
            return event;
          });
          break;
        case "updateEventsTime":
          {
            const {
              index,
              duration,
              select_type,
              globalChange = false,
              idAgenda = null,
              dateDB = null,
              idRes = null,
            } = payload;

            const modEndTimes = [];
            let prevIndex;

            events = events.map((event) => {
              const i = event.eventIndex;
              const existIdRes = idRes ? event.idRes === idRes : true;

              if (
                event.resourceId === idAgenda &&
                dateDB === event.start.split("T")[0] &&
                (i === index || i > index)
              ) {
                const [startD, startT] = event.start.split("T");
                const [endD, endT] = event.end.split("T");

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
                } else if (i > index && existIdRes) {
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
                return newEvent;
              }
              return event;
            });

            // return { ...state, events: updatedEvents };
          }
          break;
        default:
          break;
      }

      return { events };
    });
  },
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
}));

export const exposeStore = () => ({
  getTotalDuration: () =>
    useStore
      .getState()
      .events.reduce((total, event) => total + event.totalDuration, 0),
});
