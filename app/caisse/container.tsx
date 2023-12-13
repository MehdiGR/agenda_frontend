"use client";
import { useState } from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
import Navbar from "./components/navbar";

export default function Container({
  clients,
  collaborateurs,
  tickets,
  agendas,
  prestations,
}) {
  const [ticketState, setTicketState] = useState(tickets);
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
  // const Tab2=

  return (
    <>
      <Navbar />
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1">
        <CaisseForm
          clients={clients}
          collabOptions={collabOptions}
          tickets={ticketState}
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
      </div>
    </>
  );
}
