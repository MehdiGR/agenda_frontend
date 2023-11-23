 case "updateEventsTime": {
              const {
                index, // Assuming this is the eventIndex parameter you mentioned
                duration,
                select_type,
                globalChange = false,
                idAgenda = null,
                dateDB = null,
                idRes = null,
              } = payload;

              const modEndTimes = new Map();
              let prevIndex;

              draft.events.forEach((event, i) => {
                const isSelected = draft.selectedEventsIndices.has(
                  event.eventIndex
                );
                const existIdRes = idRes ? event.idRes === idRes : true;
                const isAffectedEvent = event.eventIndex >= index;

                if (isSelected && existIdRes && isAffectedEvent) {
                  const [startD, startT] = event.start.split("T");
                  const [endD, endT] = event.end?.split("T") || [null, null];

                  let hour, minutes, EndHour, EndMinutes;
                  let newEvent = { ...event };

                  if (
                    event.eventIndex === index ||
                    modEndTimes.has(prevIndex)
                  ) {
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
                    prevIndex = event.eventIndex;
                    modEndTimes.set(event.eventIndex, newEvent.end);
                  } else if (modEndTimes.has(prevIndex)) {
                    const [curStartD] = event.start.split("T");
                    const timeDiff =
                      (parseInt(endT.split(":")[0]) -
                        parseInt(startT.split(":")[0])) *
                        60 +
                      (parseInt(endT.split(":")[1]) -
                        parseInt(startT.split(":")[1]));

                    const [nextEndH, nextEndM] = modEndTimes
                      .get(prevIndex)
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

                    newEvent.start = modEndTimes.get(prevIndex);
                    newEvent.end = `${curStartD}T${nextEndTime}`;
                    modEndTimes.set(event.eventIndex, newEvent.end);
                    prevIndex = event.eventIndex;
                  }

                  // Update the event in the draft
                  const eventIndex = draft.events.findIndex(
                    (e) => e.eventIndex === event.eventIndex
                  );
                  if (eventIndex !== -1) {
                    draft.events[eventIndex] = newEvent;
                  }
                }
              });
              break;
            }