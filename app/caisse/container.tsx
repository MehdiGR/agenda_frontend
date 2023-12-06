"use client";
import { useState } from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";

export default function Container({
  clients,
  collaborateurs,
  ticket,
  agendas,
  prestations,
}) {
  console.log("ticket", ticket);
  const [ticketState, setTicketState] = useState(ticket);
  const addPrestation = (newTicket: any) => {
    setTicketState([...ticketState, newTicket]);
  };
  // remove row from ticket state given by params
  const removePrestation = (index: any) => {
    setTicketState(ticketState.filter((_: any, i: any) => i !== index));
  };
  //calculate totalTTC using reduce
  const totalTTC = ticketState.reduce(
    (total: any, ticket: any) => total + ticket.total_ttc,
    0
  );

  //   update agenda property
  const updateAgendaInTable = (index: any, selectedOption: any) => {
    setTicketState(() => [
      ...ticketState.slice(0, index),
      {
        ...ticketState[index],
        prest_agenda: selectedOption?.label,
        prest_idAgenda: selectedOption?.value,
      },
      ...ticketState.slice(index + 1),
    ]);
  };
  const [collabOptions, setCollabOptions] = useState(
    collaborateurs.map((vendeur: any) => {
      return { value: vendeur.id, label: vendeur.nom };
    })
  );
  const [selectedResponsable, setSelectedResponsable] = useState({
    label: collabOptions[0].label,
    value: collabOptions[0].value,
  });
  return (
    <>
      <CaisseForm
        clients={clients}
        collabOptions={collabOptions}
        ticket={ticketState}
        agendas={agendas}
        removePrestation={removePrestation}
        totalTTC={totalTTC}
        updateAgendaInTable={updateAgendaInTable}
        selectedResponsable={selectedResponsable}
        setSelectedResponsable={setSelectedResponsable}
      />
      <Prestations
        prestations={prestations}
        addPrestation={addPrestation}
        vendeur={selectedResponsable}
      />
    </>
  );
}
