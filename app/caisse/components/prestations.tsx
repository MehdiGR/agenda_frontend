"use client";
import React, { useState } from "react";
import { CiFolderOn, CiCircleChevLeft } from "react-icons/ci";
import Prestation from "./prestation";

export default function Prestations({
  prestations,
  addPrestation,
  vendeur,
}: any) {
  const [showSubfolders, setShowSubfolders] = useState(false);
  const toggleSubfolders = () => {
    setShowSubfolders(!showSubfolders);
  };
  return (
    <div className="bg-gray-200 border border-r-2  flex gap-2 p-6 h-screen">
      {!showSubfolders ? (
        <>
          <div
            className="flex flex-col items-center gap-2 w-fit h-fit  rounded-md text-md font-bold uppercase p-16 cursor-pointer hover:bg-slate-800 hover:text-white transition "
            onClick={toggleSubfolders}
          >
            <CiFolderOn fontSize={24} />
            <span>Prestations</span>
          </div>
          <div className=" flex flex-col items-center gap-2 w-fit h-fit  rounded-md text-md font-bold uppercase p-16 cursor-pointer hover:bg-slate-800 hover:text-white transition  ">
            <CiFolderOn fontSize={24} />
            <span>Produits</span>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="cursor-pointer " onClick={toggleSubfolders}>
              <CiCircleChevLeft fontSize={24} />
            </div>
            <div className="bg-slate-800 w-fit h-fit p-2 text-white rounded-md">
              Prestations
            </div>
          </div>
          <div className="flex gap-2 w-fit h-fit rounded-md text-md font-bold uppercase p-6 cursor-pointer  ">
            {/* Render Subfolders here */}

            {prestations.map((prestation: any, index: number) => (
              <div key={index}>
                <Prestation
                  prestation={prestation}
                  addPrestation={addPrestation}
                  vendeur={vendeur}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
