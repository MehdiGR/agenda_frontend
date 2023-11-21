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
                  (_, idx) => idx !== payload.index
                );
              }
              return { ...event, agenda_prestationArr };
            }
            return event;
          });
          break;
        case "updateEventsTime":
          // Destructure payload properties
          const {
            index,
            duration,
            select_type,
            globalChange,
            idAgenda,
            dateDB,
            idRes,
          } = payload;

          // Map over events and update time for relevant events
          events = state.events.map((event) => {
            let i;
            let prevIndex;

            const modEndTimes = [];
            if (
              event.resourceId === idAgenda &&
              dateDB === event.start.split("T")[0] &&
              (event.eventIndex === index || event.eventIndex > index)
            ) {
              i = event.eventIndex;

              // Your existing logic for updateTime
              const newTime = updateTime({
                select_type,
                duration,
                hour,
                minutes,
                updateHour:
                  globalChange && select_type === "select_minutes"
                    ? false
                    : true,
                updateMinutes: true,
              });

              // Your existing logic for updating start and end times
              if (i === index) {
                const [startD, startT] = event.start.split("T");
                const [endD, endT] = event.end.split("T");

                let EndHour, EndMinutes;
                if (globalChange) {
                  EndHour = endT.split(":")[0];
                  EndMinutes = endT.split(":")[1];
                }

                if (select_type === "select_hour") {
                  hour = startT.split(":")[0];
                  minutes = endT.split(":")[1];
                } else if (select_type === "select_minutes") {
                  minutes = startT.split(":")[1];
                  hour = globalChange
                    ? startT.split(":")[0]
                    : endT.split(":")[0];
                }

                const newEvent = { ...event };

                if (globalChange === false)
                  newEvent.end = `${startD}T${newTime}`;
                else if (globalChange === true) {
                  const newEndTime = updateTime({
                    select_type,
                    duration,
                    hour: EndHour,
                    minutes: EndMinutes,
                    updateHour: select_type === "select_minutes" ? false : true,
                    updateMinutes: true,
                  });
                  newEvent.start = `${startD}T${newTime}`;
                  newEvent.end = `${startD}T${newEndTime}`;
                }

                prevIndex = i;
                modEndTimes[i] = newEvent.end;
              } else if (i > index) {
                const [curStartD, curStartT] = event.start.split("T");
                const [curEndD, curEndT] = event.end.split("T");
                const timeDiff = (parseInt(curEndT) - parseInt(curStartT)) / 60;

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

                const newEvent = { ...event };
                newEvent.start = modEndTimes[prevIndex];
                newEvent.end = `${curStartD}T${nextEndTime}`;
                modEndTimes[i] = newEvent.end;
                prevIndex = i;
              }

              return newEvent;
            }
            return event;
          });

          break;

        // ... (add cases for other actions as needed)
        default:
          break;
      }

      return { events };
    });
  },
  setIsOpen: (value) => set(() => ({ modalIsOpen: value })),
  // ... (keep the updateEventsTime function unchanged)
}));

export const exposeStore = () => ({
  getTotalDuration: () =>
    useStore
      .getState()
      .events.reduce((total, event) => total + event.totalDuration, 0),
});
