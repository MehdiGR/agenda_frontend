export const cancelCreationEvent = (setActive) => {
  setActive(false);
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
export const handleOptionChangeAg = (selectedOption, setSelectedAgenda) => {
  setSelectedAgenda(selectedOption);
};

export const openModal = (setIsOpen) => {
  setIsOpen(true);
};

export const closeModal = (setIsOpen) => {
  setIsOpen(false);
};

export const addPrestation = (data, setAgendaPrestationArr) => {
  setAgendaPrestationArr((previousState) => {
    console.log("data");
    return [...previousState, { ...data }];
  });
};

export const removePrestation = (index, setAgendaPrestationArr) => {
  setAgendaPrestationArr((previousState) => {
    return previousState.filter((_, i) => i !== index);
  });
};

export const calculateTotalPrices = (agenda_prestationArr, setTotalPrice) => {
  let total = 0;
  agenda_prestationArr.forEach((item) => {
    total += item.prixTTC;
  });
  setTotalPrice(total);
};
export const calculateTotalDuration = (
  hourDB,
  minutesDB,
  duration_hours,
  duration_minutes,
  setTotalDuration
) => {
  let total = 0;
  const totalHours = duration_hours.reduce((a, b) => a + b, 0);
  const totalMinutes = duration_minutes.reduce((a, b) => a + b, 0);

  // Convert hours to minutes
  const hourDBInMinutes = hourDB * 60;
  const totalHoursInMinutes = totalHours * 60;

  total = hourDBInMinutes + minutesDB + totalHoursInMinutes + totalMinutes;
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
  // console.log(updatedFormData);
  // return;
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
