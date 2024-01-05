"use client";
import { useEffect, useState } from "react";
import CaisseForm from "./components/caisseform";
import Prestations from "./components/prestations";
import Navbar from "./components/navbar";
import { Props } from "react-select";

export default function Container({
  clients,
  collaborateurs,
  ticketLines,
  ticketPaiements,
  agendas,
  prestations,
}: any) {
  const [ticketLinesState, setTicketLinesState] = useState(ticketLines);
  const [PaiementsDeCommande, setPaiementsDeCommande] = useState<
    Array<{
      date_paiement: string;
      mode_paiement: string;
      mode_paiement_id: number;
      montant: string;
      date_remise?: string;
    }>
  >([]);
  useEffect(() => {
    setPaiementsDeCommande(ticketPaiements);
  }, [ticketPaiements]);
  useEffect(() => {
    setTicketLinesState(ticketLines);
  }, [ticketLines]);
  const addPaiementItem = (mode_paiement: any) => {
    const today = new Date();

    // Calculate the sum of montant of all existing items
    const sumOfMontants = PaiementsDeCommande.reduce(
      (sum, item) => sum + parseFloat(item.montant),
      0
    );

    // Calculate the montant for the new item
    let newItemMontant = totalTTC - sumOfMontants;

    // Ensure that the newItemMontant is not negative
    newItemMontant = Math.max(newItemMontant, 0);

    // Add the new item to the PaiementsDeCommande array
    setPaiementsDeCommande((prevItems) => [
      ...prevItems,
      {
        date_paiement: today.toISOString().slice(0, 10),
        mode_paiement: mode_paiement.title,
        mode_paiement_id: mode_paiement.id,
        montant: newItemMontant.toString(),
      },
    ]);
    // setResteAPayer(totalTTC - sumOfMontants - newItemMontant);
  };
  const removePaiementItem = (index: number) => {
    const updatedPaiementsDeCommande = [...PaiementsDeCommande];
    const montant = parseFloat(updatedPaiementsDeCommande[index].montant);

    updatedPaiementsDeCommande.splice(index, 1);
    setPaiementsDeCommande(updatedPaiementsDeCommande);
  };
  const updatePaiementItemMontant = (index: number, montant: number) => {
    setPaiementsDeCommande((prevPaiementsDeCommande: any) => {
      const updatedPaiementsDeCommande = prevPaiementsDeCommande.map(
        (item: any, i: number) => {
          if (i === index) {
            // montant > item.montant
            //   ? setResteAPayer((prev: any) => prev - montant)
            const res = totalTTC - montant;

            return {
              ...item,
              montant: montant,
            };
          }
          return item;
        }
      );

      return updatedPaiementsDeCommande;
    });
  };
  // **********************************************************
  // **********************************************************
  const addPrestation = (newTicketLines: any) => {
    console.log("newTicketLines", newTicketLines);
    setTicketLinesState([...ticketLinesState, newTicketLines]);
  };
  // remove row from ticket state given by params
  const removePrestation = (index: any) => {
    setTicketLinesState(
      ticketLinesState.filter((_: any, i: any) => i !== index)
    );
  };
  //calculate totalTTC using reduce
  // const totalTTC = ticketLinesState.reduce(
  //   (total: any, ticketLine: any) => total + ticketLine.total_ttc,
  //   0
  // );
  const { totalTTC, totalTax } = ticketLinesState.reduce(
    (totals: any, ticketLine: any) => {
      totals.totalTTC += ticketLine.total_ttc;
      // prix is price without taxes
      totals.totalTax += ticketLine.total_ttc - ticketLine.prix;
      return totals;
    },
    { totalTTC: 0, totalTax: 0 }
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
  const updateTicketLine = (index: number, updatedRow: any) => {
    setTicketLinesState(() => [
      ...ticketLinesState.slice(0, index),
      {
        ...updatedRow,
      },
      ...ticketLinesState.slice(index + 1),
    ]);
  };
  const [collabOptions, setCollabOptions] = useState(
    collaborateurs.map((vendeur: any) => {
      return { value: vendeur.id_collaborateur, label: vendeur.nom };
    })
  );
  const [selectedResponsable, setSelectedResponsable] = useState({
    label: collabOptions[0].label,
    value: collabOptions[0].value,
  });
  // const Tab2=
  // return;
  return (
    <>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-1 0">
        <CaisseForm
          clients={clients}
          collabOptions={collabOptions}
          ticketLines={ticketLinesState}
          agendas={agendas}
          removePrestation={removePrestation}
          updateTicketLine={updateTicketLine}
          totalTTC={totalTTC}
          totalTax={totalTax}
          updateAgendaInTable={updateAgendaInTable}
          selectedResponsable={selectedResponsable}
          setSelectedResponsable={setSelectedResponsable}
          PaiementsDeCommande={PaiementsDeCommande}
          addPaiementItem={addPaiementItem}
          removePaiementItem={removePaiementItem}
          updatePaiementItemMontant={updatePaiementItemMontant}
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
