// helper functions
import { parse } from "path";
import { useStore } from "../store/store";
import { useStore_new2 } from "../store/store_new2";
export const cancelCreationEvent = () => {
  console.log("item");
  useStore.getState().setActiveEventSection(false);
  useStore.getState().setOnEditingEvent(false);
  const events = useStore.getState().events;
  const setEvents = useStore.getState().setEvents;
  const updatedEvent = events.filter((event) => event.saved == true);
  setEvents(updatedEvent);
};

export const handleOptionChangeTypeClt = (
  changeEvent,
  setIsRef,
  setSelectedClientType
) => {
  let value = changeEvent.target.value;
  value == "client_ref" ? setIsRef(true) : setIsRef(false);
  setSelectedClientType(value);
};

export const handleOptionChangeClt = (selectedOption, setSelectedClient) => {
  setSelectedClient(selectedOption);
};

export const handleOptionChangeAg = (selectedOption, setSelectedAgenda) => {
  setSelectedAgenda(selectedOption);
};

export const openModal = () => {
  const setIsOpen = useStore.getState().setIsOpen;
  setIsOpen(true);
};

export const closeModal = () => {
  const setIsOpen = useStore.getState().setIsOpen;
  setIsOpen(false);
};
export const saveClient = async (formData) => {
  const response = await fetch("http://localhost:3000/api/client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (response.ok) {
    // Request was successful
    const data = await response.json();
    // Handle the response data
    const newClient = { value: data.clientId, label: formData.nom };
    // add the new client to select client element
    setClientOptions((prevOptions) => [...prevOptions, newClient]);
    // update selected client
    setSelectedClient(newClient);
    closeModal();
  } else {
    // Request failed
    console.error("POST request failed");
  }
};
export const addPrestation = (data) => {
  // const {
  //   addAgendaPres,
  //   addDurationHour,
  //   addDurationMinutes,
  //   addEvent,
  //   updateEvent,
  //   events,
  //   dateTime,
  //   totalDuration,
  //   addedEventId,
  //   eventAgenda,
  // } = useStore.getState();
  const { manageEvents, events, selectedEventsIndices, toggleEventSelected } =
    useStore_new2.getState();
  const current_event = events.find((event) => event.isTemp);
  // if exist a temp event
  const EventIndices = [...selectedEventsIndices];
  // console.log("selected events", [...selectedEventsIndices]);
  // return;
  if (current_event) {
    const [start_date, start_time] = current_event.start.split("T");

    const [star_hour, start_minutes] = start_time.split(":");
    const end_hour = (
      parseInt(Math.floor(data.duree / 60)) + parseInt(star_hour)
    )
      .toString()
      .padStart(2, "0");

    const end_minutes = (
      parseInt(Math.floor(data.duree % 60)) + parseInt(start_minutes)
    )
      .toString()
      .padStart(2, "0");
    const event_end = `${start_date}T${end_hour}:${end_minutes}`;
    const event_index = current_event.eventIndex;
    const updatedEvent = {
      title: data.intitule,
      prestationId: data.id,
      isTemp: false,
      resourceId: current_event.resourceId,
      end: event_end,
      editable: true,
      classNames: ["animated-event"],
      backgroundColor: "rgb(251, 233, 131)",
      borderColor: "rgb(251, 233, 131)",
      textColor: "#383838",
    };
    manageEvents([
      { action: "update", payload: { updatedEvent, index: event_index } },
      {
        action: "manageAgendaPres",
        payload: {
          action: "add",
          newAgenda: {
            ...data,
            eventIndex: current_event.eventIndex,
            // hourDB: `${hourDB}:${minutesDB}`,
            duration_hours: Math.floor(parseInt(data.duree) / 60),
            duration_minutes: parseInt(data.duree) % 60,
            agendaId: current_event.resourceId,
            agendaTitle: current_event.resourceTitle,
          },
        },
      },
    ]);
  }
  // if not exist a temp event
  else {
    const resourceId = events[EventIndices[EventIndices.length - 1]].resourceId;
    const resourceTitle = events[events.length - 1].resourceTitle;
    const eventIndex = events[events.length - 1].eventIndex + 1;

    const last_event_end = events[EventIndices[EventIndices.length - 1]].end;
    // console.log("last_event_end", last_event_end);
    const start = last_event_end;
    const [end_date, end_time] = last_event_end.split("T");

    let [end_hour, end_minutes] = end_time.split(":").map(Number); // Convert to numbers
    const duration_hours = Math.floor(data.duree / 60);
    const duration_minutes = data.duree % 60;

    end_minutes += duration_minutes;
    end_hour += duration_hours + Math.floor(end_minutes / 60); // Add extra hour if minutes exceed 59
    end_minutes %= 60;

    // Format the hours and minutes to ensure two digits
    const formatted_end_hour = String(end_hour).padStart(2, "0");
    const formatted_end_minutes = String(end_minutes).padStart(2, "0");

    const end = `${end_date}T${formatted_end_hour}:${formatted_end_minutes}`;
    console.log("end", end);
    // const start_date=
    const newEvent = {
      eventIndex,
      title: data.intitule,
      prestationId: data.id,
      resourceId,
      isTemp: false,
      editable: true,
      start,
      end,
      classNames: ["animated-event"],
      backgroundColor: "rgb(251, 233, 131)",
      borderColor: "rgb(251, 233, 131)",
      textColor: "#383838",
    };
    manageEvents([
      { action: "add", payload: { newEvent } },
      {
        action: "manageAgendaPres",
        payload: {
          action: "add",
          newAgenda: {
            ...data,
            eventIndex,
            // hourDB: `${hourDB}:${minutesDB}`,
            duration_hours: Math.floor(parseInt(data.duree) / 60),
            duration_minutes: parseInt(data.duree) % 60,
            agendaId: resourceId,
            agendaTitle: resourceTitle,
          },
        },
      },
    ]);

    toggleEventSelected(eventIndex);
  }

  // manageEvents([{ action: "update", payload: { updatedEvent, index } }]);
  return;
  // addDurationHour(hour);
  // const minutes = data.duree % 60;
  // addDurationMinutes(minutes);
  // let timeEnd = formatDuration(
  //   totalDuration +
  //     ((parseInt(dateTime.hourDB.value) + parseInt(hour)) * 60 +
  //       parseInt(dateTime.minutesDB.value) +
  //       parseInt(minutes))
  // );
  // timeEnd = timeEnd.replace("h", ":");
  // let hourDB = dateTime.hourDB.value;
  // let minutesDB = dateTime.minutesDB.value;
  // const existeTempEvent = events.find((event) => event.isTemp);
  // const timeStart = dateTime.dateDB + "T" + hourDB + ":" + minutesDB;

  // let time = {
  //   start: timeStart,
  //   end: dateTime.dateDB + "T" + timeEnd.toString(),
  // };

  // if (!existeTempEvent) {
  //   hourDB = parseInt(timeEnd.split(":")[0]) - Math.floor(data.duree / 60);
  //   minutesDB = parseInt(timeEnd.split(":")[1]) - Math.floor(data.duree % 60);
  //   time = {
  //     start:
  //       dateTime.dateDB +
  //       "T" +
  //       hourDB.toString().padStart(2, "0") +
  //       ":" +
  //       minutesDB.toString().padStart(2, "0"),
  //     end: dateTime.dateDB + "T" + timeEnd.toString(),
  //   };
  // }

  // // console.log("hourDB", hourDB);
  // // return;
  // let newEvent = {
  //   ...time,
  //   title: data.intitule,
  //   prestationId: data.id,
  //   isTemp: false,
  //   resourceId: addedEventId,
  //   editable: true,
  //   classNames: ["animated-event"],
  //   backgroundColor: "rgb(251, 233, 131)",
  //   borderColor: "rgb(251, 233, 131)",
  //   textColor: "#383838",
  // };
  // const indexTemp = events.findIndex((event) => event.isTemp);

  // let lastIndex = events.findLastIndex((event) => event);
  // if (indexTemp === -1) {
  //   lastIndex = lastIndex + 1;
  //   newEvent = { ...newEvent, eventIndex: lastIndex };
  //   console.log("add", newEvent);
  //   addEvent(newEvent);
  // } else {
  //   newEvent = { ...newEvent, eventIndex: lastIndex };
  //   console.log("update", newEvent);
  //   updateEvent(newEvent, indexTemp);
  // }

  // const agendaData = {
  //   ...data,
  //   eventIndex: lastIndex,
  //   hourDB: `${hourDB}:${minutesDB}`,
  //   duration_hours: Math.floor(parseInt(data.duree) / 60) * 60,
  //   duration_minutes: parseInt(data.duree) % 60,
  //   agenda: eventAgenda,
  // };

  // addAgendaPres(agendaData);
  // console.log("data", agendaData);
};

export const removePrestation = (eventIndex, rowIndex) => {
  // console.log(eventIndex);
  // console.log(rowIndex);
  // return;
  const removeAgendaPres = useStore.getState().removeAgendaPres;
  const removeDurationHour = useStore.getState().removeDurationHour;
  const removeDurationMinutes = useStore.getState().removeDurationMinutes;
  const removeEvent = useStore.getState().removeEvent;
  removeAgendaPres(eventIndex);
  removeEvent(eventIndex);
  removeDurationHour(rowIndex);
  removeDurationMinutes(rowIndex);
};
export const calculateTotalPrices = () => {
  const agenda_prestationArr = useStore.getState().agenda_prestationArr;
  const setTotalPrice = useStore.getState().setTotalPrice;
  let total = 0;
  agenda_prestationArr.forEach((item) => {
    total += item.prixTTC;
  });
  setTotalPrice(total);
};
export const calculateTotalDuration = () => {
  // let total = 0;
  // const setTotalDuration = useStore_new1.getState().setTotalDuration;
  // const duration_hours = useStore.getState().duration_hours;
  // const duration_minutes = useStore.getState().duration_minutes;
  // const totalHours = duration_hours.reduce((a, b) => a + b, 0);
  // const totalMinutes = duration_minutes.reduce((a, b) => a + b, 0);
  // const totalHoursInMinutes = totalHours * 60;
  // total = totalHoursInMinutes + totalMinutes;
  // setTotalDuration(total);
};
export const formatDuration = (totalMinutes) => {
  const hour = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${hour.toString().padStart(2, "0")}h${minutes
    .toString()
    .padStart(2, "0")}`;
};
export const saveReservat = async (formData) => {
  // const totalDuration = useStore.getState().totalDuration;
  // const agenda_prestationArr = useStore.getState().agenda_prestationArr;
  // const { hourDB, minutesDB, ...rest } = formData;
  // const time = `${hourDB.value}:${minutesDB.value}`;
  // const updatedFormData = {
  //   ...rest,
  //   time,
  //   // duree: totalDuration,
  // };
  console.log("formData", formData);
  return;
  const response = await fetch("http://localhost:3000/api/reservat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFormData),
  });

  if (response.ok) {
    return response.json();
    // // extract all eventIndex from agenda_prestationArr
    // const eventIndexArr = agenda_prestationArr.map((item) => item.eventIndex);
    // const events = useStore.getState().events;

    // const fixUpdatedEvents = useStore.getState().fixUpdatedEvents;
    // const addAllAgendaPres = useStore.getState().addAllAgendaPres;

    // // search on events array for eventIndexArr
    // const updatedEvents = events
    //   .filter((event) => eventIndexArr.includes(event.eventIndex))
    //   .map((event) => ({
    //     ...event,
    //     textColor: "black",
    //     backgroundColor: "rgb(251, 233, 131)",
    //     borderColor: "rgb(251, 233, 131)",
    //     classNames: [""],
    //   }));
    // fixUpdatedEvents(updatedEvents);
    // addAllAgendaPres([]);
    console.log("response", response);
  } else {
    // Request failed
    console.error("POST request failed");
  }
};

export const processReservations = (reservations) => {
  // console.log(reservations);
  const setEvents = useStore.getState().setEvents;

  const events = [];
  reservations.map((res, index) => {
    const startDate = res.dateRes.split("T")[0];
    const startTime = res.prest_heurDB;

    const startHour = startTime.split(":")[0];
    const startMinutes = parseInt(startTime.split(":")[1]);

    const durationHours = Math.floor(res.prest_duree / 60);
    const durationMinutes = parseInt(res.prest_duree) % 60;

    const endHour =
      (parseInt(durationHours) + parseInt(startHour))
        .toString()
        .padStart(2, "0") +
      ":" +
      (parseInt(durationMinutes) + startMinutes).toString().padStart(2, "0");

    const endDate = res.dateRes.split("T")[0];
    const endTime = endHour;
    events.push({
      eventIndex: index,
      idRes: res.id,
      ligne_id: res.ligne_id,
      id_art: res.prest_id,
      prixTTC: res.prest_prix,
      title: res.prest_title,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      resourceId: res.prest_idAgenda,
      saved: true,
      textColor: "black",
      backgroundColor: "rgb(251, 233, 131)",
      borderColor: "rgb(251, 233, 131)",
      // classNames: ["added-event", "animated-event"],
      duree: res.prest_duree,
      hourDB: res.heurDB.split(":")[0],
      minutesDB: res.heurDB.split(":")[1],
      isTemp: false,
      agenda: { label: res.agenda, value: res.prest_idAgenda },

      client: { label: res.client, value: res.idClient },
      // editable: false,
    });
  });

  setEvents(events);
};
// create function that update agenda_prestation hourDB and duration_hour or duration_minutes by index with params (index,property,value)
// transform agenda  to rdv and send it to prest_heurDB
