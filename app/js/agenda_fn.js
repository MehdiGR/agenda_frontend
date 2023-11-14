// helper functions
import { date } from "yup";
import { useStore } from "../store/store";

export const cancelCreationEvent = (setActive) => {
  useStore.getState().setActiveEventSection(false);
  useStore.getState().setActiveEventSection(false);
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
  const {
    addAgendaPres,
    addDurationHour,
    addDurationMinutes,
    addEvent,
    updateEvent,
    events,
    dateTime,
    totalDuration,
    addedEventId,
    eventAgenda,
  } = useStore.getState();
  const hour = Math.floor(data.duree / 60);
  addDurationHour(hour);
  const minutes = data.duree % 60;
  addDurationMinutes(minutes);

  let timeEnd = formatDuration(
    totalDuration +
      ((parseInt(dateTime.hourDB.value) + parseInt(hour)) * 60 +
        parseInt(dateTime.minutesDB.value) +
        parseInt(minutes))
  );
  timeEnd = timeEnd.replace("h", ":");
  let hourDB = dateTime.hourDB.value;
  let minutesDB = dateTime.minutesDB.value;
  const existSaved = events.find((event) => !event.isTemp);
  const timeStart = dateTime.dateDB + "T" + hourDB + ":" + minutesDB;

  let time = {
    start: timeStart,
    end: dateTime.dateDB + "T" + timeEnd.toString(),
  };

  if (existSaved) {
    hourDB = parseInt(timeEnd.split(":")[0]) - Math.floor(data.duree / 60);
    minutesDB = parseInt(timeEnd.split(":")[1]) - Math.floor(data.duree % 60);
    time = {
      start:
        dateTime.dateDB +
        "T" +
        hourDB.toString().padStart(2, "0") +
        ":" +
        minutesDB.toString().padStart(2, "0"),
      end: dateTime.dateDB + "T" + timeEnd.toString(),
    };
  }

  const newEvent = {
    ...time,
    title: data.intitule,
    prestationId: data.id,
    isTemp: false,
    resourceId: addedEventId,
    editable: true,
    classNames: ["animated-event"],
    backgroundColor: "rgb(251, 233, 131)",
    borderColor: "rgb(251, 233, 131)",
    textColor: "#383838",
  };

  const indexExistTemp = events.findIndex((event) => event.isTemp);
  if (indexExistTemp === -1) {
    addEvent(newEvent);
  } else {
    updateEvent(newEvent, indexExistTemp);
  }
  const agendaData = {
    ...data,
    hourDB: hourDB + ":" + minutesDB,
    duration_hours: Math.floor(parseInt(data.duree) / 60) * 60,
    duration_minutes: parseInt(data.duree) % 60,
    agenda: eventAgenda,
  };
  addAgendaPres(agendaData);
  console.log("data", agendaData);
};

export const removePrestation = (index) => {
  const removeAgendaPres = useStore.getState().removeAgendaPres;
  const removeDurationHour = useStore.getState().removeDurationHour;
  const removeDurationMinutes = useStore.getState().removeDurationMinutes;
  const removeEvent = useStore.getState().removeEvent;
  removeAgendaPres(index);
  removeEvent(index);
  removeDurationHour(index);
  removeDurationMinutes(index);
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
  let total = 0;
  const setTotalDuration = useStore.getState().setTotalDuration;
  const duration_hours = useStore.getState().duration_hours;
  const duration_minutes = useStore.getState().duration_minutes;
  const totalHours = duration_hours.reduce((a, b) => a + b, 0);
  const totalMinutes = duration_minutes.reduce((a, b) => a + b, 0);
  const totalHoursInMinutes = totalHours * 60;
  total = totalHoursInMinutes + totalMinutes;
  setTotalDuration(total);
};
export const formatDuration = (totalMinutes) => {
  const hour = Math.floor(totalMinutes / 60);
  const minutes = Math.floor(totalMinutes % 60);
  return `${hour.toString().padStart(2, "0")}h${minutes
    .toString()
    .padStart(2, "0")}`;
};
export const saveReservat = async (formData) => {
  const totalDuration = useStore.getState().totalDuration;
  const { hourDB, minutesDB, ...rest } = formData;
  const time = `${hourDB.value}:${minutesDB.value}`;
  const updatedFormData = {
    ...rest,
    time,
    duree: totalDuration,
  };
  // console.log(updatedFormData);
  // return;
  const response = await fetch("http://localhost:3000/api/reservat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFormData),
    next: { revalidate: 1 },
  });

  if (response.ok) {
    // const newEvent = {
    //   id: res.id,
    //   resourceId: res.prest_idAgenda,
    //   title: res.prest_title,
    //   saved: true,
    //   start: `${startDate}T${startTime}`,
    //   end: `${endDate}T${endTime}`,
    //   textColor: "black",
    //   backgroundColor: "rgb(251, 233, 131)",
    //   borderColor: "rgb(251, 233, 131)",
    //   // classNames: ["added-event", "animated-event"],
    //   duree: res.duree,
    //   hourDB: res.heurDB,
    //   isTemp: false,
    // };
    // addSavedEvent(newEvent);
  } else {
    // Request failed
    console.error("POST request failed");
  }
};

export const processReservations = (reservations) => {
  const addSavedEvents = useStore.getState().addSavedEvents;

  const events = [];
  reservations.map((res) => {
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
      // id: res.prest_id,
      idRes: res.id,
      title: res.prest_title,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      resourceId: res.prest_idAgenda,
      saved: true,
      textColor: "black",
      backgroundColor: "rgb(251, 233, 131)",
      borderColor: "rgb(251, 233, 131)",
      // classNames: ["added-event", "animated-event"],
      duree: res.duree,
      hourDB: res.heurDB,
      isTemp: false,
    });
  });

  addSavedEvents(events);
};
// create function that update agenda_prestation hourDB and duration_hour or duration_minutes by index with params (index,property,value)
// transform agenda  to rdv and send it to prest_heurDB
