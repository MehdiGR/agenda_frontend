"use client";
import { useState } from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
import Navbar from "./components/navbar";
import { Props } from "react-select";

export default function Container({
  clients,
  collaborateurs,
  ticketLines,
  agendas,
  prestations,
}: any) {
  const [ticketLinesState, setTicketLinesState] = useState(ticketLines);
  const addPrestation = (newTicketLines: any) => {
    setTicketLinesState([...ticketLinesState, newTicketLines]);
  };
  // remove row from ticket state given by params
  const removePrestation = (index: any) => {
    setTicketLinesState(
      ticketLinesState.filter((_: any, i: any) => i !== index)
    );
  };
  //calculate totalTTC using reduce
  const totalTTC = ticketLinesState.reduce(
    (total: any, ticket: any) => total + ticket.total_ttc,
    0
  );

  //   update agenda property
  const updateAgendaInTable = (index: any, selectedOption: any) => {
    setTicketLinesState(() => [
      ...ticketLinesState.slice(0, index),
      {
        ...ticketLinesState[index],
        prest_agenda: selectedOption?.label,
        prest_idAgenda: selectedOption?.value,
      },
      ...ticketLinesState.slice(index + 1),
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
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1 mt-10">
        <CaisseForm
          clients={clients}
          collabOptions={collabOptions}
          ticketLines={ticketLinesState}
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
