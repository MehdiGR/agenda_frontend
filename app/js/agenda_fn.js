// helper functions
import { date } from "yup";
import { useStore } from "../store/store";
export const cancelCreationEvent = (setActive) => {
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
  const addAgendaPres = useStore.getState().addAgendaPres;
  const addDurationHour = useStore.getState().addDurationHour;
  const addDurationMinutes = useStore.getState().addDurationMinutes;
  const addEvent = useStore.getState().addEvent;
  const updateEvent = useStore.getState().updateEvent;
  const events = useStore.getState().events;
  const dateTime = useStore.getState().dateTime;
  const totalDuration = useStore.getState().totalDuration;
  const addedEventId = useStore.getState().addedEventId;

  addAgendaPres(data);
  let hours = Math.floor(data.duree / 60);

  addDurationHour(hours);
  let minutes = data.duree % 60;
  addDurationMinutes(minutes);

  let timeEnd = formatDuration(
    totalDuration +
      ((parseInt(dateTime.hourDB.value) + parseInt(hours)) * 60 +
        parseInt(dateTime.minutesDB.value) +
        parseInt(minutes))
  );

  timeEnd = timeEnd.replace("h", ":");
  const existSaved = events.filter((event) => event.isTemp === false).pop();

  let time = {
    start:
      dateTime.dateDB +
      "T" +
      dateTime.hourDB.value +
      ":" +
      dateTime.minutesDB.value, // New start date and time
    end: dateTime.dateDB + "T" + timeEnd.toString(),
  };
  if (existSaved) {
    let hourDB = parseInt(timeEnd.split(":")[0]) - Math.floor(data.duree / 60);
    let minutesDB =
      parseInt(parseInt(timeEnd.split(":")[1])) - Math.floor(data.duree % 60);
    console.log(hourDB);
    console.log(minutesDB);
    // console.log(timeEnd);
    time = {
      start:
        dateTime.dateDB +
        "T" +
        hourDB.toString().padStart(2, "0") +
        ":" +
        minutesDB.toString().padStart(2, "0"), // New start date and time
      end: dateTime.dateDB + "T" + timeEnd.toString(),
    };
  }

  console.log(time);
  const newEvent = {
    ...time,
    title: data.intitule,
    prestationId: data.id,
    backgroundColor: "red",
    isTemp: false,
    resourceId: addedEventId,
    editable: true,
    classNames: ["added-event"],
  };
  const existTemp = events.findIndex((event) => event.isTemp == true);
  if (existTemp == -1) {
    addEvent(newEvent);
  } else {
    const index = existTemp;
    updateEvent(newEvent, index);
  }

  // setEvents((previousState) => {
  //   return [...previousState, updatedEvent];
  // });
};

export const removePrestation = (index) => {
  const removeAgendaPres = useStore.getState().removeAgendaPres;
  const updateDurationHour = useStore.getState().updateDurationHour;
  const updateDurationMinutes = useStore.getState().updateDurationMinutes;
  const removeEvent = useStore.getState().removeEvent;
  removeAgendaPres(index);
  removeEvent(index);
  updateDurationHour(index);
  updateDurationMinutes(index);
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
  const { hourDB, minuteDB, ...rest } = formData;
  const time = `${hourDB.value}:${minuteDB.value}`;
  const updatedFormData = { ...rest, time };

  const response = await fetch("http://localhost:3000/api/reservat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedFormData),
  });

  if (response.ok) {
  } else {
    // Request failed
    console.error("POST request failed");
  }
};
export const UpdateEventInfo = () => {
  const totalDuration = useStore.getState().totalDuration;
  const dateTime = useStore.getState().dateTime;
  const updateAllEvents = useStore.getState().updateAllEvents;
  const agenda_prestationArr = useStore.getState().agenda_prestationArr;

  const eventsToUpdate = agenda_prestationArr.map((prestation, index) => {
    // Calculate the prestation duration in minutes
    const prestationDurationInMinutes = prestation.duree * 60;

    // Calculate the start time for each event
    const startDateTime =
      index === 0 ? dateTime : eventsToUpdate[index - 1].end;

    // Calculate the new end time for each event
    const newEndDateTime = new Date(startDateTime);
    newEndDateTime.setMinutes(
      newEndDateTime.getMinutes() + prestationDurationInMinutes
    );

    return {
      prestationId: prestation.id,
      start: startDateTime,
      end: newEndDateTime.toISOString(),
    };
  });

  // console.log(eventsToUpdate);
  updateAllEvents(eventsToUpdate);
};
