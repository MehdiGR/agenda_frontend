"use client";
import { useState } from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";

export default function Container({
  clients,
  reservation,
  agendas,
  prestations,
}) {
  const [reservationState, setReservationState] = useState(reservation);
  const addPrestation = (newReservation: any) => {
    setReservationState([...reservationState, newReservation]);
  };
  // remove row from reservation state given by params
  const removePrestation = (index: any) => {
    setReservationState(
      reservationState.filter((_: any, i: any) => i !== index)
    );
  };
  //calculate totalTTC using reduce
  const totalTTC = reservationState.reduce(
    (total: any, reservation: any) => total + reservation.prest_prix_ttc,
    0
  );

  //   update agenda property
  const updateAgendaInTable = (index: any, selectedOption: any) => {
    setReservationState(() => [
      ...reservationState.slice(0, index),
      {
        ...reservationState[index],
        prest_agenda: selectedOption?.label,
        prest_idAgenda: selectedOption?.value,
      },
      ...reservationState.slice(index + 1),
    ]);
  };

  return (
    <>
      <CaisseForm
        clients={clients}
        reservation={reservationState}
        agendas={agendas}
        removePrestation={removePrestation}
        totalTTC={totalTTC}
        updateAgendaInTable={updateAgendaInTable}
      />
      <Prestations prestations={prestations} addPrestation={addPrestation} />
    </>
  );
}
