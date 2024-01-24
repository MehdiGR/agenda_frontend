"use client";
import { get_synths_paiements } from "@/app/lib/ticket/ticketActions";
import React, { useEffect, useState } from "react";

export default function Synths({ data }: any) {
  console.log(data, "data");
  const [synth, setSynth] = useState<any>(data); // Initialize with an empty object
  useEffect(() => {
    setSynth(data);
  }, [data]);
  // useEffect(() => {
  //   const foundSynth = data.find((item: any) => {
  //     const synthDate = new Date(item?.synths_date);
  //     return (
  //       synthDate.toISOString().slice(0, 10) ===
  //       valueDate.toISOString().slice(0, 10)
  //     );
  //   });
  //   console.log(foundSynth);
  //   setSynth(foundSynth || {}); // Update the state with the found object or an empty object if not found
  // }, [data, valueDate]); // Dependencies array for the useEffect hook
  // useEffect(() => {
  //   // async function fetchData() {
  //   Promise.all([
  //     get_synths_paiements({
  //       having: ` HAVING DATE(synths_date)="${valueDate
  //         .toISOString()
  //         .slice(0, 10)}"`,
  //     })
  //       .then((data) => {
  //         setSynth(JSON.parse(data as string)[0]);
  //       })
  //       .catch((error) => {
  //         setSynth({});
  //         console.log("Error fetching data:", error);
  //       }),
  //   ]);
  // }, [valueDate]);

  return (
    <div className="space-y-4 border border-gray-300 p-4">
      <div className="p-2"></div>
      <div className="flex flex-wrap gap-8 ">
        <table className="flex-1">
          <tr>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">
                Montant en caisse à l&apos;ouverture :{" "}
              </p>
              <p className="font-bold text-gray-600">
                0<span className="currency"> DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Espèces encaissées : </p>
              <p className="font-bold text-gray-600">
                {synth?.total_espace_encaisse || 0}
                <span className="currency"> DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Opérations de caisse : </p>
              <p className="font-bold text-gray-600">
                {synth?.total_operation_caisse || 0}
                <span className="currency"> DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Montant en caisse : </p>
              <p className="font-bold text-gray-600">
                {synth?.montant_en_caisse || 0}{" "}
                <span className="currency"> DH</span>
              </p>
            </td>
          </tr>
        </table>
        <table className="flex-1">
          <tr>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">Chiffre affaires HT : </p>
              <p className="font-bold text-gray-600">
                {synth?.chiffre_affaires_ht || 0}
                <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">TVA : </p>
              <p className="font-bold text-gray-600">
                {synth?.total_tva || 0} <span className="currency"> DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Chiffre affaires TTC : </p>
              <p className="font-bold text-gray-600">
                {synth?.chiffre_affaires_ttc || 0}{" "}
                <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Nombre de tickets : </p>
              <p className="font-bold text-gray-600">
                {synth?.nbr_tickets || 0} <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Panier moyen TTC : </p>
              <p className="font-bold text-gray-600">
                {synth?.panier_moyen_ttc || 0}{" "}
                <span className="currency">DH</span>
              </p>
            </td>
          </tr>
        </table>
        <table className="flex-1">
          <tr>
            {synth.paiements?.map((paiement: any, index: number) => (
              <td
                key={index}
                className="border border-gray-300 flex justify-between p-4"
              >
                <p className="text-gray-600">{paiement?.mode_paiement} : </p>
                <p className="font-bold text-gray-600">
                  {paiement?.montant} <span className="currency">DH</span>
                </p>
              </td>
            ))}
            {/* <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">Carte bancaire : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td> */}
          </tr>
        </table>
      </div>
    </div>
  );
}
