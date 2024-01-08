"use client";
import React, { useEffect, useState } from "react";

export default function Synths({ data, valueDate }: any) {
  const [synth, setSynth] = useState<any>({}); // Initialize with an empty object
  console.log(synth, "synth");

  useEffect(() => {
    const foundSynth = data.find((item: any) => {
      const synthDate = new Date(item?.synths_date);
      return (
        synthDate.toISOString().slice(0, 10) ===
        valueDate.toISOString().slice(0, 10)
      );
    });

    setSynth(foundSynth || {}); // Update the state with the found object or an empty object if not found
  }, [data, valueDate]); // Dependencies array for the useEffect hook

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
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Espèces encaissées : </p>
              <p className="font-bold text-gray-600">
                {synth?.total_espace_encaisse}
                <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Opérations de caisse : </p>
              <p className="font-bold text-gray-600">
                {synth?.total_operation_caisse}
                <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Montant en caisse : </p>
              <p className="font-bold text-gray-600">
                {synth?.montant_en_caisse} <span className="currency">DH</span>
              </p>
            </td>
          </tr>
        </table>
        <table className="flex-1">
          <tr>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">Chiffre affaires HT : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">TVA : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Chiffre affaires TTC : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Nombre de tickets : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Panier moyen TTC : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
          </tr>
        </table>
        <table className="flex-1">
          <tr>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">Carte bancaire : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Chèque : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">Espèces : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="font-bold text-gray-600">Total : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">
                Dont paiement de ticket antérieur :{" "}
              </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600">En attente de paiement : </p>
              <p className="font-bold text-gray-600">
                0.00 <span className="currency">DH</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}
