"use client";
import React, { useEffect, useState } from "react";

export default function Synths({ data }: any) {
  console.log(data, "data");
  const [synth, setSynth] = useState<any>(data); // Initialize with an empty object
  useEffect(() => {
    setSynth(data);
  }, [data]);

  let totalMontant = 0;
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
                {synth?.total_espece_encaisse || 0}
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
            {synth.paiements?.map((paiement: any, index: number) => {
              totalMontant = totalMontant + paiement?.montant;
              return (
                <td
                  key={index}
                  className="border border-gray-300 flex justify-between p-4"
                >
                  <p className="text-gray-600">
                    {paiement?.mode_paiement.charAt(0).toUpperCase() +
                      paiement?.mode_paiement.slice(1)}
                    :{" "}
                  </p>

                  <p className="font-bold text-gray-600">
                    {paiement?.montant} <span className="currency">DH</span>
                  </p>
                </td>
              );
            })}

            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600 font-bold">Total : </p>
              <p className="font-bold text-gray-600">
                {totalMontant} <span className="currency">DH</span>
              </p>
            </td>

            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600 ">
                Dont paiement de ticket antérieur :
              </p>
              <p className="font-bold text-gray-600">
                <span className="currency">0 DH</span>
              </p>
            </td>
            <td className="border border-gray-300 flex justify-between p-4">
              <p className="text-gray-600 ">En attente de paiement :</p>
              <p className="font-bold text-gray-600">
                {Number(
                  (synth?.chiffre_affaires_ttc - totalMontant || 0).toFixed(2)
                )}
                <span className="currency"> DH</span>
              </p>
            </td>
          </tr>
        </table>
      </div>
    </div>
  );
}
